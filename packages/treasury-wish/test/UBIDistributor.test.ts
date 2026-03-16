import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("UBIDistributor", function () {
  const INITIAL_SUPPLY = ethers.parseEther("1000000");
  const TAX_RATE_BPS = 50n; // 0.5%

  async function deployFixture() {
    const [owner, citizen1, citizen2, citizen3] =
      await ethers.getSigners();

    // Deploy token with owner as temporary treasury
    const WishToken = await ethers.getContractFactory("WishToken");
    const wish = await WishToken.deploy(owner.address, INITIAL_SUPPLY, TAX_RATE_BPS);

    // Deploy UBI distributor
    const UBIDistributor = await ethers.getContractFactory("UBIDistributor");
    const distributor = await UBIDistributor.deploy(await wish.getAddress());

    // Set the distributor as tax-exempt (not the WishToken treasury — that's WishocraticTreasury)
    await wish.setTaxExempt(await distributor.getAddress(), true);

    return { wish, distributor, owner, citizen1, citizen2, citizen3 };
  }

  describe("Deployment", function () {
    it("sets wish token", async function () {
      const { wish, distributor } = await loadFixture(deployFixture);
      expect(await distributor.wishToken()).to.equal(await wish.getAddress());
    });

    it("reverts on zero token address", async function () {
      const UBIDistributor = await ethers.getContractFactory("UBIDistributor");
      await expect(
        UBIDistributor.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("UBIDistributor: zero token");
    });
  });

  describe("Citizen Registration", function () {
    it("registers citizens for UBI", async function () {
      const { distributor, citizen1 } = await loadFixture(deployFixture);

      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("worldid-citizen1"));
      await expect(distributor.registerForUBI(citizen1.address, nullifier))
        .to.emit(distributor, "CitizenRegistered")
        .withArgs(citizen1.address, nullifier);

      expect(await distributor.isRegisteredCitizen(citizen1.address)).to.be.true;
      expect(await distributor.citizenCount()).to.equal(1n);
    });

    it("prevents duplicate registration by nullifier", async function () {
      const { distributor, citizen1, citizen2 } = await loadFixture(deployFixture);

      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("worldid-citizen1"));
      await distributor.registerForUBI(citizen1.address, nullifier);

      await expect(
        distributor.registerForUBI(citizen2.address, nullifier)
      ).to.be.revertedWith("UBIDistributor: already registered");
    });

    it("prevents duplicate registration by wallet", async function () {
      const { distributor, citizen1 } = await loadFixture(deployFixture);

      const nullifier1 = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));
      const nullifier2 = ethers.keccak256(ethers.toUtf8Bytes("worldid-2"));
      await distributor.registerForUBI(citizen1.address, nullifier1);

      await expect(
        distributor.registerForUBI(citizen1.address, nullifier2)
      ).to.be.revertedWith("UBIDistributor: wallet already registered");
    });

    it("only owner can register citizens", async function () {
      const { distributor, citizen1 } = await loadFixture(deployFixture);
      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));

      await expect(
        distributor.connect(citizen1).registerForUBI(citizen1.address, nullifier)
      ).to.be.revertedWithCustomError(distributor, "OwnableUnauthorizedAccount");
    });
  });

  describe("UBI Distribution", function () {
    it("distributes entire balance equally to registered citizens", async function () {
      const { wish, distributor, citizen1, citizen2 } =
        await loadFixture(deployFixture);

      // Register citizens
      const null1 = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));
      const null2 = ethers.keccak256(ethers.toUtf8Bytes("worldid-2"));
      await distributor.registerForUBI(citizen1.address, null1);
      await distributor.registerForUBI(citizen2.address, null2);

      // Fund the distributor
      const fundAmount = ethers.parseEther("10000");
      await wish.transfer(await distributor.getAddress(), fundAmount);

      // Distribute UBI (100% of balance)
      await distributor.distributeUBI();

      const perCitizen = fundAmount / 2n;

      expect(await wish.balanceOf(citizen1.address)).to.equal(perCitizen);
      expect(await wish.balanceOf(citizen2.address)).to.equal(perCitizen);
    });

    it("is permissionless — anyone can trigger", async function () {
      const { wish, distributor, citizen1, citizen2 } =
        await loadFixture(deployFixture);

      const null1 = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));
      const null2 = ethers.keccak256(ethers.toUtf8Bytes("worldid-2"));
      await distributor.registerForUBI(citizen1.address, null1);
      await distributor.registerForUBI(citizen2.address, null2);

      await wish.transfer(await distributor.getAddress(), ethers.parseEther("1000"));

      // citizen1 (not owner) triggers distribution
      await expect(distributor.connect(citizen1).distributeUBI())
        .to.emit(distributor, "UBIDistributed");
    });

    it("reverts when no citizens registered", async function () {
      const { distributor } = await loadFixture(deployFixture);
      await expect(distributor.distributeUBI()).to.be.revertedWith(
        "UBIDistributor: no citizens"
      );
    });

    it("reverts when distributor has no funds", async function () {
      const { distributor, citizen1 } = await loadFixture(deployFixture);
      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));
      await distributor.registerForUBI(citizen1.address, nullifier);

      await expect(distributor.distributeUBI()).to.be.revertedWith(
        "UBIDistributor: no funds"
      );
    });
  });

  describe("View functions", function () {
    it("reports pending balance", async function () {
      const { wish, distributor } = await loadFixture(deployFixture);

      expect(await distributor.pendingBalance()).to.equal(0n);

      const amount = ethers.parseEther("5000");
      await wish.transfer(await distributor.getAddress(), amount);

      expect(await distributor.pendingBalance()).to.equal(amount);
    });

    it("reports citizen count", async function () {
      const { distributor, citizen1, citizen2 } = await loadFixture(deployFixture);

      expect(await distributor.citizenCount()).to.equal(0n);

      await distributor.registerForUBI(
        citizen1.address,
        ethers.keccak256(ethers.toUtf8Bytes("n1"))
      );
      expect(await distributor.citizenCount()).to.equal(1n);

      await distributor.registerForUBI(
        citizen2.address,
        ethers.keccak256(ethers.toUtf8Bytes("n2"))
      );
      expect(await distributor.citizenCount()).to.equal(2n);
    });
  });

  describe("Integration: WishocraticTreasury → UBIDistributor → Citizens", function () {
    it("full flow: funds arrive, distribute to citizens", async function () {
      const { wish, distributor, owner, citizen1, citizen2 } =
        await loadFixture(deployFixture);

      // 1. Register citizens
      const null1 = ethers.keccak256(ethers.toUtf8Bytes("worldid-1"));
      const null2 = ethers.keccak256(ethers.toUtf8Bytes("worldid-2"));
      await distributor.registerForUBI(citizen1.address, null1);
      await distributor.registerForUBI(citizen2.address, null2);

      // 2. Fund distributor (simulates WishocraticTreasury sending UBI share)
      const fundAmount = ethers.parseEther("20000");
      await wish.transfer(await distributor.getAddress(), fundAmount);

      expect(await distributor.pendingBalance()).to.equal(fundAmount);

      // 3. Distribute — equal split to citizens
      await distributor.distributeUBI();

      const perCitizen = fundAmount / 2n;
      expect(await wish.balanceOf(citizen1.address)).to.equal(perCitizen);
      expect(await wish.balanceOf(citizen2.address)).to.equal(perCitizen);

      // Distributor should be near-zero (dust from integer division at most)
      expect(await distributor.pendingBalance()).to.be.lte(1n);
    });
  });
});
