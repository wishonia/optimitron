import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("MonetaryPolicyOracle", function () {
  const INITIAL_SUPPLY = ethers.parseEther("1000000"); // 1M WISH
  const TAX_RATE_BPS = 50n; // 0.5%
  const EXPANSION_RATE_BPS = 200n; // 2% per interval
  const MINT_INTERVAL = 30n * 24n * 60n * 60n; // 30 days

  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();

    // Deploy WishToken with owner as treasury initially
    const WishToken = await ethers.getContractFactory("WishToken");
    const wish = await WishToken.deploy(owner.address, INITIAL_SUPPLY, TAX_RATE_BPS);

    // Deploy AlignmentTreasury
    const Treasury = await ethers.getContractFactory("AlignmentTreasury");
    const treasury = await Treasury.deploy(await wish.getAddress(), 5000n); // 50% UBI

    // Deploy Oracle
    const Oracle = await ethers.getContractFactory("MonetaryPolicyOracle");
    const oracle = await Oracle.deploy(
      await wish.getAddress(),
      await treasury.getAddress(),
      EXPANSION_RATE_BPS,
      MINT_INTERVAL,
    );

    // Transfer mint authority: make oracle the owner of WishToken
    // (In production, use a proper access control pattern)
    await wish.transferOwnership(await oracle.getAddress());

    return { wish, treasury, oracle, owner, alice, bob };
  }

  describe("Deployment", function () {
    it("sets token, treasury, expansion rate, and interval", async function () {
      const { wish, treasury, oracle } = await loadFixture(deployFixture);
      expect(await oracle.token()).to.equal(await wish.getAddress());
      expect(await oracle.treasury()).to.equal(await treasury.getAddress());
      expect(await oracle.expansionRateBps()).to.equal(EXPANSION_RATE_BPS);
      expect(await oracle.mintIntervalSeconds()).to.equal(MINT_INTERVAL);
    });

    it("reverts on zero token address", async function () {
      const Oracle = await ethers.getContractFactory("MonetaryPolicyOracle");
      const [, , , , treasury] = await ethers.getSigners();
      await expect(
        Oracle.deploy(ethers.ZeroAddress, treasury.address, EXPANSION_RATE_BPS, MINT_INTERVAL)
      ).to.be.revertedWith("Oracle: zero token");
    });

    it("reverts on expansion rate above maximum", async function () {
      const { wish, treasury } = await loadFixture(deployFixture);
      const Oracle = await ethers.getContractFactory("MonetaryPolicyOracle");
      await expect(
        Oracle.deploy(await wish.getAddress(), await treasury.getAddress(), 1001n, MINT_INTERVAL)
      ).to.be.revertedWith("Oracle: rate too high");
    });

    it("reverts on interval less than 1 day", async function () {
      const { wish, treasury } = await loadFixture(deployFixture);
      const Oracle = await ethers.getContractFactory("MonetaryPolicyOracle");
      await expect(
        Oracle.deploy(await wish.getAddress(), await treasury.getAddress(), EXPANSION_RATE_BPS, 3600n)
      ).to.be.revertedWith("Oracle: interval too short");
    });
  });

  describe("Policy updates", function () {
    it("owner can update expansion rate", async function () {
      const { oracle } = await loadFixture(deployFixture);
      await expect(oracle.updatePolicy(300n))
        .to.emit(oracle, "PolicyUpdated")
        .withArgs(EXPANSION_RATE_BPS, 300n);
      expect(await oracle.expansionRateBps()).to.equal(300n);
    });

    it("reverts if non-owner updates policy", async function () {
      const { oracle, alice } = await loadFixture(deployFixture);
      await expect(oracle.connect(alice).updatePolicy(300n)).to.be.reverted;
    });

    it("allows setting expansion to zero (freeze minting)", async function () {
      const { oracle } = await loadFixture(deployFixture);
      await oracle.updatePolicy(0n);
      expect(await oracle.expansionRateBps()).to.equal(0n);
    });
  });

  describe("Minting", function () {
    it("mints 2% of supply to treasury after interval", async function () {
      const { wish, treasury, oracle } = await loadFixture(deployFixture);

      // Fast-forward 30 days
      await time.increase(Number(MINT_INTERVAL));

      const supplyBefore = await wish.totalSupply();
      const expectedMint = (supplyBefore * EXPANSION_RATE_BPS) / 10000n;

      await expect(oracle.executeMint())
        .to.emit(oracle, "MintExecuted")
        .withArgs(expectedMint, await treasury.getAddress(), await time.latest());

      // Treasury received the minted tokens
      expect(await wish.balanceOf(await treasury.getAddress())).to.equal(expectedMint);

      // Total supply increased
      expect(await wish.totalSupply()).to.equal(supplyBefore + expectedMint);
    });

    it("is permissionless — anyone can trigger", async function () {
      const { oracle, alice } = await loadFixture(deployFixture);
      await time.increase(Number(MINT_INTERVAL));
      await expect(oracle.connect(alice).executeMint()).to.not.be.reverted;
    });

    it("reverts if called too soon", async function () {
      const { oracle } = await loadFixture(deployFixture);
      await expect(oracle.executeMint()).to.be.revertedWith("Oracle: too soon");
    });

    it("reverts if expansion rate is zero", async function () {
      const { oracle } = await loadFixture(deployFixture);
      await oracle.updatePolicy(0n);
      await time.increase(Number(MINT_INTERVAL));
      await expect(oracle.executeMint()).to.be.revertedWith("Oracle: zero expansion");
    });

    it("reverts if paused", async function () {
      const { oracle } = await loadFixture(deployFixture);
      await oracle.togglePause();
      await time.increase(Number(MINT_INTERVAL));
      await expect(oracle.executeMint()).to.be.revertedWith("Oracle: paused");
    });

    it("allows consecutive mints after each interval", async function () {
      const { wish, treasury, oracle } = await loadFixture(deployFixture);

      // First mint
      await time.increase(Number(MINT_INTERVAL));
      await oracle.executeMint();
      const balanceAfterFirst = await wish.balanceOf(await treasury.getAddress());

      // Second mint
      await time.increase(Number(MINT_INTERVAL));
      await oracle.executeMint();
      const balanceAfterSecond = await wish.balanceOf(await treasury.getAddress());

      // Second mint should be larger (2% of a larger supply)
      expect(balanceAfterSecond - balanceAfterFirst).to.be.greaterThan(balanceAfterFirst);
    });
  });

  describe("View functions", function () {
    it("pendingMintAmount returns expected amount when interval passed", async function () {
      const { wish, oracle } = await loadFixture(deployFixture);
      await time.increase(Number(MINT_INTERVAL));

      const supply = await wish.totalSupply();
      const expected = (supply * EXPANSION_RATE_BPS) / 10000n;
      expect(await oracle.pendingMintAmount()).to.equal(expected);
    });

    it("pendingMintAmount returns 0 when interval not passed", async function () {
      const { oracle } = await loadFixture(deployFixture);
      expect(await oracle.pendingMintAmount()).to.equal(0n);
    });

    it("secondsUntilNextMint counts down correctly", async function () {
      const { oracle } = await loadFixture(deployFixture);
      const remaining = await oracle.secondsUntilNextMint();
      expect(remaining).to.be.greaterThan(0n);
      expect(remaining).to.be.lessThanOrEqual(MINT_INTERVAL);
    });

    it("secondsUntilNextMint returns 0 after interval passes", async function () {
      const { oracle } = await loadFixture(deployFixture);
      await time.increase(Number(MINT_INTERVAL));
      expect(await oracle.secondsUntilNextMint()).to.equal(0n);
    });
  });

  describe("Admin functions", function () {
    it("owner can update mint interval", async function () {
      const { oracle } = await loadFixture(deployFixture);
      const newInterval = 7n * 24n * 60n * 60n; // 7 days
      await expect(oracle.setMintInterval(newInterval))
        .to.emit(oracle, "MintIntervalUpdated")
        .withArgs(MINT_INTERVAL, newInterval);
    });

    it("owner can update treasury", async function () {
      const { oracle, alice } = await loadFixture(deployFixture);
      await expect(oracle.setTreasury(alice.address))
        .to.emit(oracle, "TreasuryUpdated");
      expect(await oracle.treasury()).to.equal(alice.address);
    });

    it("owner can toggle pause", async function () {
      const { oracle } = await loadFixture(deployFixture);
      await expect(oracle.togglePause())
        .to.emit(oracle, "PauseToggled")
        .withArgs(true);
      expect(await oracle.paused()).to.be.true;
    });
  });

  describe("Full anti-Cantillon flow", function () {
    it("oracle mints → treasury → equal UBI distribution", async function () {
      const { wish, treasury, oracle, owner, alice, bob } = await loadFixture(deployFixture);

      // Register citizens for UBI
      // Treasury owner is the deployer — we need to set it up
      // First, the oracle owns the WishToken. The treasury is owned by `owner`.
      const nullA = ethers.keccak256(ethers.toUtf8Bytes("alice-worldid"));
      const nullB = ethers.keccak256(ethers.toUtf8Bytes("bob-worldid"));
      await treasury.registerForUBI(alice.address, nullA);
      await treasury.registerForUBI(bob.address, nullB);

      // Trigger algorithmic mint after interval
      await time.increase(Number(MINT_INTERVAL));
      await oracle.executeMint();

      const treasuryBalance = await wish.balanceOf(await treasury.getAddress());
      expect(treasuryBalance).to.be.greaterThan(0n);

      // Distribute UBI — equal split
      await treasury.distributeUBI();

      // Both citizens got equal shares
      const aliceBalance = await wish.balanceOf(alice.address);
      const bobBalance = await wish.balanceOf(bob.address);
      expect(aliceBalance).to.equal(bobBalance);
      expect(aliceBalance).to.be.greaterThan(0n);
    });
  });
});
