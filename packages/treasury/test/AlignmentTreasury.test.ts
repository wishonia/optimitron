import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("AlignmentTreasury (UBI-only)", function () {
  const INITIAL_SUPPLY = ethers.parseEther("1000000");
  const TAX_RATE_BPS = 50n; // 0.5%

  async function deployFixture() {
    const [owner, citizen1, citizen2, citizen3] =
      await ethers.getSigners();

    // Deploy token with owner as temporary treasury
    const WishToken = await ethers.getContractFactory("WishToken");
    const wish = await WishToken.deploy(owner.address, INITIAL_SUPPLY, TAX_RATE_BPS);

    // Deploy UBI treasury
    const AlignmentTreasury = await ethers.getContractFactory("AlignmentTreasury");
    const treasury = await AlignmentTreasury.deploy(await wish.getAddress());

    // Set the real treasury on the token
    await wish.setTreasury(await treasury.getAddress());

    return { wish, treasury, owner, citizen1, citizen2, citizen3 };
  }

  describe("Deployment", function () {
    it("sets wish token", async function () {
      const { wish, treasury } = await loadFixture(deployFixture);
      expect(await treasury.wishToken()).to.equal(await wish.getAddress());
    });

    it("reverts on zero token address", async function () {
      const AlignmentTreasury = await ethers.getContractFactory("AlignmentTreasury");
      await expect(
        AlignmentTreasury.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("Treasury: zero token");
    });
  });

  describe("UBI Registration", function () {
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

    it("only owner can register citizens", async function () {
      const { treasury, citizen1 } = await loadFixture(deployFixture);
      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));

      await expect(
        treasury.connect(citizen1).registerForUBI(citizen1.address, nullifier)
      ).to.be.revertedWithCustomError(treasury, "OwnableUnauthorizedAccount");
    });
  });

  describe("UBI Distribution", function () {
    it("distributes entire balance equally to registered citizens", async function () {
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

      // Distribute UBI (100% of balance)
      await treasury.distributeUBI();

      const perCitizen = fundAmount / 2n;

      expect(await wish.balanceOf(citizen1.address)).to.equal(perCitizen);
      expect(await wish.balanceOf(citizen2.address)).to.equal(perCitizen);
    });

    it("is permissionless — anyone can trigger", async function () {
      const { wish, treasury, citizen1, citizen2 } =
        await loadFixture(deployFixture);

      const null1 = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));
      const null2 = ethers.keccak256(ethers.toUtf8Bytes("worldid-2"));
      await treasury.registerForUBI(citizen1.address, null1);
      await treasury.registerForUBI(citizen2.address, null2);

      await wish.transfer(await treasury.getAddress(), ethers.parseEther("1000"));

      // citizen1 (not owner) triggers distribution
      await expect(treasury.connect(citizen1).distributeUBI())
        .to.emit(treasury, "UBIDistributed");
    });

    it("reverts when no citizens registered", async function () {
      const { treasury } = await loadFixture(deployFixture);
      await expect(treasury.distributeUBI()).to.be.revertedWith(
        "Treasury: no citizens"
      );
    });

    it("reverts when treasury has no funds", async function () {
      const { treasury, citizen1 } = await loadFixture(deployFixture);
      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));
      await treasury.registerForUBI(citizen1.address, nullifier);

      await expect(treasury.distributeUBI()).to.be.revertedWith(
        "Treasury: no funds"
      );
    });
  });

  describe("View functions", function () {
    it("reports treasury balance", async function () {
      const { wish, treasury } = await loadFixture(deployFixture);

      expect(await treasury.treasuryBalance()).to.equal(0n);

      const amount = ethers.parseEther("5000");
      await wish.transfer(await treasury.getAddress(), amount);

      expect(await treasury.treasuryBalance()).to.equal(amount);
    });

    it("reports citizen count", async function () {
      const { treasury, citizen1, citizen2 } = await loadFixture(deployFixture);

      expect(await treasury.citizenCount()).to.equal(0n);

      await treasury.registerForUBI(
        citizen1.address,
        ethers.keccak256(ethers.toUtf8Bytes("n1"))
      );
      expect(await treasury.citizenCount()).to.equal(1n);

      await treasury.registerForUBI(
        citizen2.address,
        ethers.keccak256(ethers.toUtf8Bytes("n2"))
      );
      expect(await treasury.citizenCount()).to.equal(2n);
    });
  });

  describe("Integration: Tax → Treasury → UBI", function () {
    it("full flow: transfer tax accumulates, distribute to citizens", async function () {
      const { wish, treasury, owner, citizen1, citizen2 } =
        await loadFixture(deployFixture);

      // 1. Register citizens
      const null1 = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));
      const null2 = ethers.keccak256(ethers.toUtf8Bytes("worldid-2"));
      await treasury.registerForUBI(citizen1.address, null1);
      await treasury.registerForUBI(citizen2.address, null2);

      // 2. Fund treasury (simulates accumulated tax)
      const fundAmount = ethers.parseEther("20000");
      await wish.transfer(await treasury.getAddress(), fundAmount);

      expect(await treasury.treasuryBalance()).to.equal(fundAmount);

      // 3. Distribute — 100% goes to citizens
      await treasury.distributeUBI();

      const perCitizen = fundAmount / 2n;
      expect(await wish.balanceOf(citizen1.address)).to.equal(perCitizen);
      expect(await wish.balanceOf(citizen2.address)).to.equal(perCitizen);

      // Treasury should be near-zero (dust from integer division at most)
      expect(await treasury.treasuryBalance()).to.be.lte(1n);
    });
  });
});
