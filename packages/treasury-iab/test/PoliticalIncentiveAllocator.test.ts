import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("PoliticalIncentiveAllocator", function () {
  const MIN_SCORE = 20n;

  async function deployFixture() {
    const [owner, campaign1, campaign2, campaign3, nonOwner] =
      await ethers.getSigners();

    // Deploy mock stablecoin
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const usdc = await MockERC20.deploy("USD Coin", "USDC", 6);

    // Deploy oracle
    const Oracle = await ethers.getContractFactory("AlignmentScoreOracle");
    const oracle = await Oracle.deploy();

    // Deploy allocator
    const Allocator = await ethers.getContractFactory(
      "PoliticalIncentiveAllocator",
    );
    const allocator = await Allocator.deploy(
      await usdc.getAddress(),
      await oracle.getAddress(),
      MIN_SCORE,
    );

    const jurisdictionCode = ethers.keccak256(
      ethers.toUtf8Bytes("US-FEDERAL"),
    );

    const polId1 = ethers.keccak256(ethers.toUtf8Bytes("bioguide-pol1"));
    const polId2 = ethers.keccak256(ethers.toUtf8Bytes("bioguide-pol2"));
    const polId3 = ethers.keccak256(ethers.toUtf8Bytes("bioguide-pol3"));

    return {
      usdc,
      oracle,
      allocator,
      owner,
      campaign1,
      campaign2,
      campaign3,
      nonOwner,
      jurisdictionCode,
      polId1,
      polId2,
      polId3,
    };
  }

  describe("Deployment", function () {
    it("sets correct config", async function () {
      const { usdc, oracle, allocator } = await loadFixture(deployFixture);
      expect(await allocator.stablecoin()).to.equal(await usdc.getAddress());
      expect(await allocator.oracle()).to.equal(await oracle.getAddress());
      expect(await allocator.minimumAlignmentScore()).to.equal(MIN_SCORE);
    });

    it("rejects zero stablecoin", async function () {
      const { oracle } = await loadFixture(deployFixture);
      const Allocator = await ethers.getContractFactory(
        "PoliticalIncentiveAllocator",
      );
      await expect(
        Allocator.deploy(ethers.ZeroAddress, await oracle.getAddress(), 20),
      ).to.be.revertedWith("Allocator: zero stablecoin");
    });

    it("rejects zero oracle", async function () {
      const { usdc } = await loadFixture(deployFixture);
      const Allocator = await ethers.getContractFactory(
        "PoliticalIncentiveAllocator",
      );
      await expect(
        Allocator.deploy(await usdc.getAddress(), ethers.ZeroAddress, 20),
      ).to.be.revertedWith("Allocator: zero oracle");
    });
  });

  describe("registerPolitician", function () {
    it("registers a politician", async function () {
      const { allocator, campaign1, jurisdictionCode, polId1 } =
        await loadFixture(deployFixture);

      await expect(
        allocator.registerPolitician(
          polId1,
          campaign1.address,
          jurisdictionCode,
        ),
      )
        .to.emit(allocator, "PoliticianRegistered")
        .withArgs(polId1, campaign1.address, jurisdictionCode);

      const pol = await allocator.politicians(polId1);
      expect(pol.campaignWallet).to.equal(campaign1.address);
      expect(pol.jurisdictionCode).to.equal(jurisdictionCode);
      expect(pol.active).to.be.true;
    });

    it("rejects duplicate registration", async function () {
      const { allocator, campaign1, jurisdictionCode, polId1 } =
        await loadFixture(deployFixture);

      await allocator.registerPolitician(
        polId1,
        campaign1.address,
        jurisdictionCode,
      );
      await expect(
        allocator.registerPolitician(
          polId1,
          campaign1.address,
          jurisdictionCode,
        ),
      ).to.be.revertedWith("Allocator: already registered");
    });

    it("rejects zero wallet", async function () {
      const { allocator, jurisdictionCode, polId1 } =
        await loadFixture(deployFixture);

      await expect(
        allocator.registerPolitician(
          polId1,
          ethers.ZeroAddress,
          jurisdictionCode,
        ),
      ).to.be.revertedWith("Allocator: zero wallet");
    });

    it("rejects non-owner", async function () {
      const { allocator, nonOwner, campaign1, jurisdictionCode, polId1 } =
        await loadFixture(deployFixture);

      await expect(
        allocator
          .connect(nonOwner)
          .registerPolitician(polId1, campaign1.address, jurisdictionCode),
      ).to.be.revertedWithCustomError(allocator, "OwnableUnauthorizedAccount");
    });
  });

  describe("deactivatePolitician", function () {
    it("deactivates a politician", async function () {
      const { allocator, campaign1, jurisdictionCode, polId1 } =
        await loadFixture(deployFixture);

      await allocator.registerPolitician(
        polId1,
        campaign1.address,
        jurisdictionCode,
      );
      await expect(allocator.deactivatePolitician(polId1))
        .to.emit(allocator, "PoliticianDeactivated")
        .withArgs(polId1);

      const pol = await allocator.politicians(polId1);
      expect(pol.active).to.be.false;
    });

    it("rejects deactivating non-active politician", async function () {
      const { allocator, polId1 } = await loadFixture(deployFixture);
      await expect(
        allocator.deactivatePolitician(polId1),
      ).to.be.revertedWith("Allocator: not active");
    });
  });

  describe("setMinimumAlignmentScore", function () {
    it("updates minimum score", async function () {
      const { allocator } = await loadFixture(deployFixture);
      await expect(allocator.setMinimumAlignmentScore(30))
        .to.emit(allocator, "MinimumScoreUpdated")
        .withArgs(30);
      expect(await allocator.minimumAlignmentScore()).to.equal(30n);
    });

    it("rejects score above 100", async function () {
      const { allocator } = await loadFixture(deployFixture);
      await expect(
        allocator.setMinimumAlignmentScore(101),
      ).to.be.revertedWith("Allocator: score exceeds 100");
    });
  });

  describe("setOracle", function () {
    it("updates oracle address", async function () {
      const { allocator, campaign1 } = await loadFixture(deployFixture);
      await expect(allocator.setOracle(campaign1.address))
        .to.emit(allocator, "OracleUpdated")
        .withArgs(campaign1.address);
    });

    it("rejects zero address", async function () {
      const { allocator } = await loadFixture(deployFixture);
      await expect(
        allocator.setOracle(ethers.ZeroAddress),
      ).to.be.revertedWith("Allocator: zero oracle");
    });
  });

  describe("view functions", function () {
    it("counts politicians", async function () {
      const { allocator, campaign1, campaign2, jurisdictionCode, polId1, polId2 } =
        await loadFixture(deployFixture);

      expect(await allocator.politicianCount()).to.equal(0n);

      await allocator.registerPolitician(
        polId1,
        campaign1.address,
        jurisdictionCode,
      );
      expect(await allocator.politicianCount()).to.equal(1n);

      await allocator.registerPolitician(
        polId2,
        campaign2.address,
        jurisdictionCode,
      );
      expect(await allocator.politicianCount()).to.equal(2n);
    });

    it("counts active politicians per jurisdiction", async function () {
      const { allocator, campaign1, campaign2, jurisdictionCode, polId1, polId2 } =
        await loadFixture(deployFixture);

      await allocator.registerPolitician(
        polId1,
        campaign1.address,
        jurisdictionCode,
      );
      await allocator.registerPolitician(
        polId2,
        campaign2.address,
        jurisdictionCode,
      );

      expect(
        await allocator.activePoliticianCount(jurisdictionCode),
      ).to.equal(2n);

      await allocator.deactivatePolitician(polId1);
      expect(
        await allocator.activePoliticianCount(jurisdictionCode),
      ).to.equal(1n);
    });

    it("reports pending balance", async function () {
      const { usdc, allocator } = await loadFixture(deployFixture);
      const amount = ethers.parseUnits("500", 6);
      await usdc.mint(await allocator.getAddress(), amount);
      expect(await allocator.pendingBalance()).to.equal(amount);
    });
  });

  describe("allocate", function () {
    it("reverts when no funds", async function () {
      const { allocator, jurisdictionCode } = await loadFixture(deployFixture);
      await expect(
        allocator.allocate(jurisdictionCode, [], [], []),
      ).to.be.revertedWith("Allocator: empty input");
    });
  });
});
