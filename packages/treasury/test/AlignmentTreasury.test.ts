import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("AlignmentTreasury", function () {
  const INITIAL_SUPPLY = ethers.parseEther("1000000");
  const TAX_RATE_BPS = 50n; // 0.5%
  const UBI_ALLOCATION_BPS = 5000n; // 50%

  async function deployFixture() {
    const [owner, polWallet1, polWallet2, citizen1, citizen2, citizen3] =
      await ethers.getSigners();

    // Deploy treasury first (with a placeholder token)
    const AlignmentTreasury = await ethers.getContractFactory("AlignmentTreasury");

    // Deploy token with owner as temporary treasury, then update
    const WishToken = await ethers.getContractFactory("WishToken");
    const wish = await WishToken.deploy(owner.address, INITIAL_SUPPLY, TAX_RATE_BPS);

    // Deploy real treasury
    const treasury = await AlignmentTreasury.deploy(
      await wish.getAddress(),
      UBI_ALLOCATION_BPS
    );

    // Set the real treasury on the token
    await wish.setTreasury(await treasury.getAddress());

    return { wish, treasury, owner, polWallet1, polWallet2, citizen1, citizen2, citizen3 };
  }

  function politicianId(name: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(name));
  }

  describe("Deployment", function () {
    it("sets wish token and UBI allocation", async function () {
      const { wish, treasury } = await loadFixture(deployFixture);
      expect(await treasury.wishToken()).to.equal(await wish.getAddress());
      expect(await treasury.ubiAllocationBps()).to.equal(UBI_ALLOCATION_BPS);
    });

    it("reverts on zero token address", async function () {
      const AlignmentTreasury = await ethers.getContractFactory("AlignmentTreasury");
      await expect(
        AlignmentTreasury.deploy(ethers.ZeroAddress, UBI_ALLOCATION_BPS)
      ).to.be.revertedWith("Treasury: zero token");
    });

    it("reverts on UBI allocation above maximum", async function () {
      const [, , , , , , extra] = await ethers.getSigners();
      const WishToken = await ethers.getContractFactory("WishToken");
      const wish = await WishToken.deploy(extra.address, INITIAL_SUPPLY, 0n);

      const AlignmentTreasury = await ethers.getContractFactory("AlignmentTreasury");
      await expect(
        AlignmentTreasury.deploy(await wish.getAddress(), 8001n)
      ).to.be.revertedWith("Treasury: UBI allocation too high");
    });
  });

  describe("Alignment Score Management", function () {
    it("updates politician alignment scores", async function () {
      const { treasury, polWallet1, polWallet2 } = await loadFixture(deployFixture);

      const id1 = politicianId("sen-sanders");
      const id2 = politicianId("sen-warren");

      await expect(
        treasury.updateAlignmentScores(
          [id1, id2],
          [polWallet1.address, polWallet2.address],
          [7830n, 7410n]
        )
      )
        .to.emit(treasury, "AlignmentScoreUpdated")
        .withArgs(id1, polWallet1.address, 7830n);

      const pol1 = await treasury.politicians(id1);
      expect(pol1.score).to.equal(7830n);
      expect(pol1.wallet).to.equal(polWallet1.address);
      expect(pol1.active).to.be.true;

      expect(await treasury.totalAlignmentScore()).to.equal(7830n + 7410n);
      expect(await treasury.politicianCount()).to.equal(2n);
    });

    it("updates existing politician score correctly", async function () {
      const { treasury, polWallet1 } = await loadFixture(deployFixture);

      const id1 = politicianId("sen-sanders");
      await treasury.updateAlignmentScores([id1], [polWallet1.address], [7830n]);
      expect(await treasury.totalAlignmentScore()).to.equal(7830n);

      // Update score
      await treasury.updateAlignmentScores([id1], [polWallet1.address], [8500n]);
      expect(await treasury.totalAlignmentScore()).to.equal(8500n);

      const pol1 = await treasury.politicians(id1);
      expect(pol1.score).to.equal(8500n);
    });

    it("deactivates a politician", async function () {
      const { treasury, polWallet1 } = await loadFixture(deployFixture);

      const id1 = politicianId("sen-sanders");
      await treasury.updateAlignmentScores([id1], [polWallet1.address], [7830n]);
      await treasury.deactivatePolitician(id1);

      const pol1 = await treasury.politicians(id1);
      expect(pol1.active).to.be.false;
      expect(pol1.score).to.equal(0n);
      expect(await treasury.totalAlignmentScore()).to.equal(0n);
    });

    it("reverts on array length mismatch", async function () {
      const { treasury, polWallet1 } = await loadFixture(deployFixture);
      const id1 = politicianId("sen-sanders");

      await expect(
        treasury.updateAlignmentScores([id1], [polWallet1.address], [])
      ).to.be.revertedWith("Treasury: array length mismatch");
    });

    it("reverts on score out of range", async function () {
      const { treasury, polWallet1 } = await loadFixture(deployFixture);
      const id1 = politicianId("sen-sanders");

      await expect(
        treasury.updateAlignmentScores([id1], [polWallet1.address], [10001n])
      ).to.be.revertedWith("Treasury: score out of range");
    });
  });

  describe("Alignment Distribution", function () {
    it("distributes proportionally to alignment scores", async function () {
      const { wish, treasury, owner, polWallet1, polWallet2 } =
        await loadFixture(deployFixture);

      const id1 = politicianId("sen-sanders");
      const id2 = politicianId("sen-warren");

      // Set scores: 75% and 25% of total
      await treasury.updateAlignmentScores(
        [id1, id2],
        [polWallet1.address, polWallet2.address],
        [7500n, 2500n]
      );

      // Fund the treasury
      const fundAmount = ethers.parseEther("10000");
      await wish.transfer(await treasury.getAddress(), fundAmount);

      // Distribute (50% for alignment, 50% for UBI)
      await treasury.distributeToAligned();

      const alignmentPool = fundAmount / 2n; // 50% UBI allocation
      const pol1Expected = (alignmentPool * 7500n) / 10000n;
      const pol2Expected = (alignmentPool * 2500n) / 10000n;

      expect(await wish.balanceOf(polWallet1.address)).to.equal(pol1Expected);
      expect(await wish.balanceOf(polWallet2.address)).to.equal(pol2Expected);
    });

    it("reverts when no alignment scores exist", async function () {
      const { treasury } = await loadFixture(deployFixture);
      await expect(treasury.distributeToAligned()).to.be.revertedWith(
        "Treasury: no scores"
      );
    });
  });

  describe("UBI Registration and Distribution", function () {
    it("registers citizens for UBI", async function () {
      const { treasury, citizen1 } = await loadFixture(deployFixture);

      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("worldid-citizen1"));
      await expect(treasury.registerForUBI(citizen1.address, nullifier))
        .to.emit(treasury, "CitizenRegistered")
        .withArgs(citizen1.address, nullifier);

      expect(await treasury.isRegisteredCitizen(citizen1.address)).to.be.true;
      expect(await treasury.citizenCount()).to.equal(1n);
    });

    it("prevents duplicate registration by nullifier", async function () {
      const { treasury, citizen1, citizen2 } = await loadFixture(deployFixture);

      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("worldid-citizen1"));
      await treasury.registerForUBI(citizen1.address, nullifier);

      await expect(
        treasury.registerForUBI(citizen2.address, nullifier)
      ).to.be.revertedWith("Treasury: already registered");
    });

    it("prevents duplicate registration by wallet", async function () {
      const { treasury, citizen1 } = await loadFixture(deployFixture);

      const nullifier1 = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));
      const nullifier2 = ethers.keccak256(ethers.toUtf8Bytes("worldid-2"));
      await treasury.registerForUBI(citizen1.address, nullifier1);

      await expect(
        treasury.registerForUBI(citizen1.address, nullifier2)
      ).to.be.revertedWith("Treasury: wallet already registered");
    });

    it("distributes UBI equally to registered citizens", async function () {
      const { wish, treasury, citizen1, citizen2 } =
        await loadFixture(deployFixture);

      // Register citizens
      const null1 = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));
      const null2 = ethers.keccak256(ethers.toUtf8Bytes("worldid-2"));
      await treasury.registerForUBI(citizen1.address, null1);
      await treasury.registerForUBI(citizen2.address, null2);

      // Fund the treasury
      const fundAmount = ethers.parseEther("10000");
      await wish.transfer(await treasury.getAddress(), fundAmount);

      // Distribute UBI
      await treasury.distributeUBI();

      const ubiPool = (fundAmount * UBI_ALLOCATION_BPS) / 10000n;
      const perCitizen = ubiPool / 2n;

      expect(await wish.balanceOf(citizen1.address)).to.equal(perCitizen);
      expect(await wish.balanceOf(citizen2.address)).to.equal(perCitizen);
    });

    it("reverts when no citizens registered", async function () {
      const { treasury } = await loadFixture(deployFixture);
      await expect(treasury.distributeUBI()).to.be.revertedWith(
        "Treasury: no citizens"
      );
    });
  });

  describe("Admin functions", function () {
    it("updates UBI allocation", async function () {
      const { treasury } = await loadFixture(deployFixture);
      await expect(treasury.setUBIAllocation(6000n))
        .to.emit(treasury, "UBIAllocationUpdated")
        .withArgs(UBI_ALLOCATION_BPS, 6000n);
    });

    it("reverts UBI allocation above max", async function () {
      const { treasury } = await loadFixture(deployFixture);
      await expect(treasury.setUBIAllocation(8001n)).to.be.revertedWith(
        "Treasury: UBI allocation too high"
      );
    });
  });

  describe("Integration: Tax → Treasury → Distribution", function () {
    it("full flow: transfer tax funds treasury, distribute to aligned + UBI", async function () {
      const { wish, treasury, owner, polWallet1, citizen1, citizen2 } =
        await loadFixture(deployFixture);

      // 1. Register politician
      const id1 = politicianId("sen-sanders");
      await treasury.updateAlignmentScores([id1], [polWallet1.address], [10000n]);

      // 2. Register citizens
      const null1 = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));
      const null2 = ethers.keccak256(ethers.toUtf8Bytes("worldid-2"));
      await treasury.registerForUBI(citizen1.address, null1);
      await treasury.registerForUBI(citizen2.address, null2);

      // 3. Fund treasury directly (simulates accumulated tax)
      const fundAmount = ethers.parseEther("20000");
      await wish.transfer(await treasury.getAddress(), fundAmount);

      const balance = await wish.balanceOf(await treasury.getAddress());
      expect(balance).to.equal(fundAmount);

      // 4. Distribute to aligned
      await treasury.distributeToAligned();

      // 5. Get new balance and distribute UBI
      const remainingBalance = await wish.balanceOf(await treasury.getAddress());
      // After alignment distribution, only UBI portion remains
      expect(remainingBalance).to.be.gt(0n);

      // 6. Fund again for UBI
      await wish.transfer(await treasury.getAddress(), ethers.parseEther("10000"));
      await treasury.distributeUBI();

      // Verify everyone got paid
      expect(await wish.balanceOf(polWallet1.address)).to.be.gt(0n);
      expect(await wish.balanceOf(citizen1.address)).to.be.gt(0n);
      expect(await wish.balanceOf(citizen2.address)).to.be.gt(0n);
    });
  });
});
