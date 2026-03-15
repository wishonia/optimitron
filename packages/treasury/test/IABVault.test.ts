import { expect } from "chai";
import { ethers } from "hardhat";
import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("IABVault", function () {
  // USDC uses 6 decimals
  const DECIMALS = 6;
  const parseUSDC = (amount: number) =>
    ethers.parseUnits(amount.toString(), DECIMALS);

  const HEALTH_THRESHOLD = 100n; // 1% improvement
  const INCOME_THRESHOLD = 50n; // 0.5% improvement
  const FIFTEEN_YEARS = 473_364_000n; // ~15 years in seconds

  async function deployFixture() {
    const [owner, depositor1, depositor2, depositor3] =
      await ethers.getSigners();

    // Deploy mock USDC (6 decimals)
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const usdc = await MockERC20.deploy("USD Coin", "USDC", DECIMALS);

    // Deploy mock aToken
    const MockAToken = await ethers.getContractFactory("MockAToken");
    const aToken = await MockAToken.deploy();

    // Deploy mock Aave pool
    const MockAavePool = await ethers.getContractFactory("MockAavePool");
    const aavePool = await MockAavePool.deploy(
      await usdc.getAddress(),
      await aToken.getAddress()
    );

    // Wire aToken to pool
    await aToken.setPool(await aavePool.getAddress());

    // Deploy IABVault
    const IABVault = await ethers.getContractFactory("IABVault");
    const vault = await IABVault.deploy(
      await usdc.getAddress(),
      await aToken.getAddress(),
      await aavePool.getAddress(),
      FIFTEEN_YEARS,
      HEALTH_THRESHOLD,
      INCOME_THRESHOLD
    );

    // Deploy a PrizePool that accepts USDC (for allocation test)
    const PrizePool = await ethers.getContractFactory("PrizePool");
    const prizePool = await PrizePool.deploy(
      await usdc.getAddress(),
      HEALTH_THRESHOLD,
      INCOME_THRESHOLD,
      parseUSDC(100)
    );

    // Fund depositors with USDC
    await usdc.mint(depositor1.address, parseUSDC(100_000));
    await usdc.mint(depositor2.address, parseUSDC(50_000));
    await usdc.mint(depositor3.address, parseUSDC(25_000));

    // Approve vault for all depositors
    const vaultAddr = await vault.getAddress();
    await usdc.connect(depositor1).approve(vaultAddr, ethers.MaxUint256);
    await usdc.connect(depositor2).approve(vaultAddr, ethers.MaxUint256);
    await usdc.connect(depositor3).approve(vaultAddr, ethers.MaxUint256);

    return {
      usdc,
      aToken,
      aavePool,
      vault,
      prizePool,
      owner,
      depositor1,
      depositor2,
      depositor3,
    };
  }

  describe("Deployment", function () {
    it("sets initial state correctly", async function () {
      const { vault, usdc, aToken, aavePool } =
        await loadFixture(deployFixture);

      expect(await vault.stablecoin()).to.equal(await usdc.getAddress());
      expect(await vault.aToken()).to.equal(await aToken.getAddress());
      expect(await vault.aavePool()).to.equal(await aavePool.getAddress());
      expect(await vault.maturityDuration()).to.equal(FIFTEEN_YEARS);
      expect(await vault.healthThreshold()).to.equal(HEALTH_THRESHOLD);
      expect(await vault.incomeThreshold()).to.equal(INCOME_THRESHOLD);
      expect(await vault.thresholdMet()).to.be.false;
      expect(await vault.fundsAllocated()).to.be.false;
      expect(await vault.totalSupply()).to.equal(0n);
    });

    it("has correct ERC20 metadata", async function () {
      const { vault } = await loadFixture(deployFixture);

      expect(await vault.name()).to.equal("Incentive Alignment Bond");
      expect(await vault.symbol()).to.equal("IAB");
      expect(await vault.decimals()).to.equal(6n);
    });

    it("reverts on zero addresses", async function () {
      const { usdc, aToken, aavePool } = await loadFixture(deployFixture);
      const IABVault = await ethers.getContractFactory("IABVault");

      await expect(
        IABVault.deploy(
          ethers.ZeroAddress,
          await aToken.getAddress(),
          await aavePool.getAddress(),
          FIFTEEN_YEARS,
          HEALTH_THRESHOLD,
          INCOME_THRESHOLD
        )
      ).to.be.revertedWith("IABVault: zero stablecoin");

      await expect(
        IABVault.deploy(
          await usdc.getAddress(),
          ethers.ZeroAddress,
          await aavePool.getAddress(),
          FIFTEEN_YEARS,
          HEALTH_THRESHOLD,
          INCOME_THRESHOLD
        )
      ).to.be.revertedWith("IABVault: zero aToken");
    });

    it("reverts on zero thresholds", async function () {
      const { usdc, aToken, aavePool } = await loadFixture(deployFixture);
      const IABVault = await ethers.getContractFactory("IABVault");

      await expect(
        IABVault.deploy(
          await usdc.getAddress(),
          await aToken.getAddress(),
          await aavePool.getAddress(),
          FIFTEEN_YEARS,
          0n,
          INCOME_THRESHOLD
        )
      ).to.be.revertedWith("IABVault: zero health threshold");
    });
  });

  describe("Deposits", function () {
    it("accepts USDC and mints IAB tokens", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      const tx = await vault.connect(depositor1).deposit(parseUSDC(1_000));
      await expect(tx).to.emit(vault, "Deposited");

      // First depositor gets ~1:1 shares (adjusted by virtual offset)
      const shares = await vault.balanceOf(depositor1.address);
      expect(shares).to.be.greaterThan(0n);
      expect(await vault.depositorCount()).to.equal(1n);
    });

    it("accumulates multiple deposits from same depositor", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(500));
      const sharesBefore = await vault.balanceOf(depositor1.address);

      await vault.connect(depositor1).deposit(parseUSDC(300));
      const sharesAfter = await vault.balanceOf(depositor1.address);

      expect(sharesAfter).to.be.greaterThan(sharesBefore);
      expect(await vault.depositorCount()).to.equal(1n); // still one
    });

    it("tracks multiple depositors", async function () {
      const { vault, depositor1, depositor2, depositor3 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(5_000));
      await vault.connect(depositor2).deposit(parseUSDC(3_000));
      await vault.connect(depositor3).deposit(parseUSDC(1_000));

      expect(await vault.depositorCount()).to.equal(3n);
      expect(await vault.balanceOf(depositor1.address)).to.be.greaterThan(0n);
      expect(await vault.balanceOf(depositor2.address)).to.be.greaterThan(0n);
      expect(await vault.balanceOf(depositor3.address)).to.be.greaterThan(0n);
    });

    it("supplies deposited USDC to Aave (receives aTokens)", async function () {
      const { vault, aToken, depositor1 } = await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));

      const vaultATokenBal = await aToken.balanceOf(await vault.getAddress());
      expect(vaultATokenBal).to.equal(parseUSDC(10_000));
    });

    it("rejects zero deposit", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);
      await expect(
        vault.connect(depositor1).deposit(0n)
      ).to.be.revertedWith("IABVault: zero deposit");
    });

    it("rejects deposit after threshold met", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      await vault.updateMetrics(HEALTH_THRESHOLD, INCOME_THRESHOLD);
      await expect(
        vault.connect(depositor1).deposit(parseUSDC(100))
      ).to.be.revertedWith("IABVault: threshold already met");
    });

    it("rejects deposit after maturity", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      await time.increase(Number(FIFTEEN_YEARS));
      await expect(
        vault.connect(depositor1).deposit(parseUSDC(100))
      ).to.be.revertedWith("IABVault: matured");
    });
  });

  describe("ERC20 Tradability", function () {
    it("IAB tokens are transferable", async function () {
      const { vault, depositor1, depositor2 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));
      const shares = await vault.balanceOf(depositor1.address);

      // Transfer half to depositor2
      const half = shares / 2n;
      await vault.connect(depositor1).transfer(depositor2.address, half);

      expect(await vault.balanceOf(depositor1.address)).to.equal(
        shares - half
      );
      expect(await vault.balanceOf(depositor2.address)).to.equal(half);
    });

    it("transferred IAB tokens carry proportional claim", async function () {
      const { vault, aavePool, depositor1, depositor2 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));

      // Simulate yield
      await aavePool.simulateYield(
        await vault.getAddress(),
        parseUSDC(2_000)
      );

      // Transfer half to depositor2
      const shares = await vault.balanceOf(depositor1.address);
      const half = shares / 2n;
      await vault.connect(depositor1).transfer(depositor2.address, half);

      // Both should have ~equal value (~6000 each)
      const val1 = await vault.getBalance(depositor1.address);
      const val2 = await vault.getBalance(depositor2.address);

      // Allow 1 USDC rounding tolerance
      expect(val1 + val2).to.be.closeTo(parseUSDC(12_000), parseUSDC(1));
      expect(val1).to.be.closeTo(val2, parseUSDC(1));
    });

    it("buyer on secondary market can claim refund", async function () {
      const { vault, usdc, aavePool, depositor1, depositor2 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));

      // Simulate yield
      await aavePool.simulateYield(
        await vault.getAddress(),
        parseUSDC(5_000)
      );

      // D1 transfers all IABs to D2 (simulating secondary market sale)
      const shares = await vault.balanceOf(depositor1.address);
      await vault.connect(depositor1).transfer(depositor2.address, shares);

      // Fast forward to maturity
      await time.increase(Number(FIFTEEN_YEARS));

      // D2 (the buyer) claims refund
      const balBefore = await usdc.balanceOf(depositor2.address);
      await vault.connect(depositor2).claimRefund();
      const balAfter = await usdc.balanceOf(depositor2.address);

      // D2 gets the full vault value (principal + yield)
      expect(balAfter - balBefore).to.be.closeTo(
        parseUSDC(15_000),
        parseUSDC(1)
      );

      // D1 has nothing to claim
      await expect(
        vault.connect(depositor1).claimRefund()
      ).to.be.revertedWith("IABVault: no shares");
    });
  });

  describe("Share pricing (anti-dilution)", function () {
    it("late depositors get fewer shares when yield has accrued", async function () {
      const { vault, aavePool, depositor1, depositor2 } =
        await loadFixture(deployFixture);

      // D1 deposits first
      await vault.connect(depositor1).deposit(parseUSDC(10_000));
      const shares1 = await vault.balanceOf(depositor1.address);

      // Yield accrues (50%)
      await aavePool.simulateYield(
        await vault.getAddress(),
        parseUSDC(5_000)
      );

      // D2 deposits same amount — should get fewer shares
      await vault.connect(depositor2).deposit(parseUSDC(10_000));
      const shares2 = await vault.balanceOf(depositor2.address);

      expect(shares2).to.be.lessThan(shares1);
    });

    it("early depositor is not diluted by late depositor", async function () {
      const { vault, aavePool, depositor1, depositor2 } =
        await loadFixture(deployFixture);

      // D1 deposits 10000
      await vault.connect(depositor1).deposit(parseUSDC(10_000));

      // 50% yield accrues — D1's position is now worth 15000
      await aavePool.simulateYield(
        await vault.getAddress(),
        parseUSDC(5_000)
      );

      const d1ValueBefore = await vault.getBalance(depositor1.address);
      expect(d1ValueBefore).to.be.closeTo(parseUSDC(15_000), parseUSDC(1));

      // D2 deposits 10000
      await vault.connect(depositor2).deposit(parseUSDC(10_000));

      // D1's value should still be ~15000 (not diluted)
      const d1ValueAfter = await vault.getBalance(depositor1.address);
      expect(d1ValueAfter).to.be.closeTo(parseUSDC(15_000), parseUSDC(1));

      // D2's value should be ~10000 (just deposited)
      const d2Value = await vault.getBalance(depositor2.address);
      expect(d2Value).to.be.closeTo(parseUSDC(10_000), parseUSDC(1));
    });

    it("sharePrice increases as yield accrues", async function () {
      const { vault, aavePool, depositor1 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));
      const priceBefore = await vault.sharePrice();

      await aavePool.simulateYield(
        await vault.getAddress(),
        parseUSDC(5_000)
      );
      const priceAfter = await vault.sharePrice();

      expect(priceAfter).to.be.greaterThan(priceBefore);
    });
  });

  describe("Yield & Balance", function () {
    it("getBalance reflects principal when no yield", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));
      const balance = await vault.getBalance(depositor1.address);
      // Close to 10000 (tiny rounding from virtual offset)
      expect(balance).to.be.closeTo(parseUSDC(10_000), parseUSDC(1));
    });

    it("getBalance reflects principal + yield after yield accrual", async function () {
      const { vault, aavePool, depositor1 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));

      // Simulate 10% yield
      await aavePool.simulateYield(
        await vault.getAddress(),
        parseUSDC(1_000)
      );

      const balance = await vault.getBalance(depositor1.address);
      expect(balance).to.be.closeTo(parseUSDC(11_000), parseUSDC(1));
    });

    it("totalPoolValue reflects aToken balance", async function () {
      const { vault, aavePool, depositor1, depositor2 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(5_000));
      await vault.connect(depositor2).deposit(parseUSDC(3_000));
      await aavePool.simulateYield(await vault.getAddress(), parseUSDC(800));

      expect(await vault.totalPoolValue()).to.equal(parseUSDC(8_800));
    });

    it("multiple depositors get proportional yields", async function () {
      const { vault, aavePool, depositor1, depositor2 } =
        await loadFixture(deployFixture);

      // Same-time deposits (no yield between them) for simple 60/40 test
      await vault.connect(depositor1).deposit(parseUSDC(6_000));
      await vault.connect(depositor2).deposit(parseUSDC(4_000));

      // 10% yield = 1000 USDC
      await aavePool.simulateYield(await vault.getAddress(), parseUSDC(1_000));

      // 60% of 11000 = 6600
      const val1 = await vault.getBalance(depositor1.address);
      expect(val1).to.be.closeTo(parseUSDC(6_600), parseUSDC(1));

      // 40% of 11000 = 4400
      const val2 = await vault.getBalance(depositor2.address);
      expect(val2).to.be.closeTo(parseUSDC(4_400), parseUSDC(1));
    });
  });

  describe("Claim Refund", function () {
    it("allows refund after maturity when thresholds not met", async function () {
      const { vault, usdc, aavePool, depositor1 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));

      // Simulate 50% yield over 15 years
      await aavePool.simulateYield(
        await vault.getAddress(),
        parseUSDC(5_000)
      );

      // Fast forward past maturity
      await time.increase(Number(FIFTEEN_YEARS));

      const balBefore = await usdc.balanceOf(depositor1.address);

      await expect(vault.connect(depositor1).claimRefund())
        .to.emit(vault, "RefundClaimed");

      const balAfter = await usdc.balanceOf(depositor1.address);
      expect(balAfter - balBefore).to.be.closeTo(
        parseUSDC(15_000),
        parseUSDC(1)
      );
    });

    it("burns IAB tokens on refund", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));
      expect(await vault.balanceOf(depositor1.address)).to.be.greaterThan(0n);

      await time.increase(Number(FIFTEEN_YEARS));
      await vault.connect(depositor1).claimRefund();

      expect(await vault.balanceOf(depositor1.address)).to.equal(0n);
    });

    it("multiple depositors claim proportional refunds sequentially", async function () {
      const { vault, usdc, aavePool, depositor1, depositor2 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(6_000));
      await vault.connect(depositor2).deposit(parseUSDC(4_000));

      // Yield of 2000
      await aavePool.simulateYield(await vault.getAddress(), parseUSDC(2_000));

      await time.increase(Number(FIFTEEN_YEARS));

      // D1 claims: ~60% of 12000 = 7200
      const bal1Before = await usdc.balanceOf(depositor1.address);
      await vault.connect(depositor1).claimRefund();
      const bal1After = await usdc.balanceOf(depositor1.address);
      expect(bal1After - bal1Before).to.be.closeTo(
        parseUSDC(7_200),
        parseUSDC(1)
      );

      // D2 claims: ~40% of 12000 = 4800
      const bal2Before = await usdc.balanceOf(depositor2.address);
      await vault.connect(depositor2).claimRefund();
      const bal2After = await usdc.balanceOf(depositor2.address);
      expect(bal2After - bal2Before).to.be.closeTo(
        parseUSDC(4_800),
        parseUSDC(1)
      );
    });

    it("rejects refund before maturity", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(1_000));

      await expect(
        vault.connect(depositor1).claimRefund()
      ).to.be.revertedWith("IABVault: not matured");
    });

    it("rejects refund when thresholds met", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(1_000));
      await vault.updateMetrics(HEALTH_THRESHOLD, INCOME_THRESHOLD);

      await time.increase(Number(FIFTEEN_YEARS));

      await expect(
        vault.connect(depositor1).claimRefund()
      ).to.be.revertedWith("IABVault: threshold met");
    });

    it("rejects refund with no shares", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      await time.increase(Number(FIFTEEN_YEARS));

      await expect(
        vault.connect(depositor1).claimRefund()
      ).to.be.revertedWith("IABVault: no shares");
    });

    it("rejects double refund", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(1_000));
      await time.increase(Number(FIFTEEN_YEARS));

      await vault.connect(depositor1).claimRefund();

      await expect(
        vault.connect(depositor1).claimRefund()
      ).to.be.revertedWith("IABVault: no shares");
    });
  });

  describe("Allocate to Prize", function () {
    it("allocates all funds to PrizePool when threshold met", async function () {
      const { vault, usdc, aavePool, prizePool, depositor1 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));

      // Yield
      await aavePool.simulateYield(
        await vault.getAddress(),
        parseUSDC(2_000)
      );

      // Set prize pool
      await vault.setPrizePool(await prizePool.getAddress());

      // Meet thresholds
      await vault.updateMetrics(HEALTH_THRESHOLD, INCOME_THRESHOLD);
      expect(await vault.thresholdMet()).to.be.true;

      // Allocate
      await expect(vault.allocateToPrize())
        .to.emit(vault, "AllocatedToPrize")
        .withArgs(parseUSDC(12_000));

      // PrizePool should have the USDC
      expect(await usdc.balanceOf(await prizePool.getAddress())).to.equal(
        parseUSDC(12_000)
      );

      expect(await vault.fundsAllocated()).to.be.true;
    });

    it("IAB tokens survive allocation (for voting power)", async function () {
      const { vault, prizePool, depositor1 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));
      const sharesBefore = await vault.balanceOf(depositor1.address);

      await vault.setPrizePool(await prizePool.getAddress());
      await vault.updateMetrics(HEALTH_THRESHOLD, INCOME_THRESHOLD);
      await vault.allocateToPrize();

      // IAB tokens still exist — used for Wishocratic allocation weight
      expect(await vault.balanceOf(depositor1.address)).to.equal(sharesBefore);
      expect(await vault.totalSupply()).to.equal(sharesBefore);
    });

    it("rejects allocation when threshold not met", async function () {
      const { vault, prizePool, depositor1 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(1_000));
      await vault.setPrizePool(await prizePool.getAddress());

      await expect(vault.allocateToPrize()).to.be.revertedWith(
        "IABVault: threshold not met"
      );
    });

    it("rejects double allocation", async function () {
      const { vault, prizePool, depositor1 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(1_000));
      await vault.setPrizePool(await prizePool.getAddress());
      await vault.updateMetrics(HEALTH_THRESHOLD, INCOME_THRESHOLD);
      await vault.allocateToPrize();

      await expect(vault.allocateToPrize()).to.be.revertedWith(
        "IABVault: already allocated"
      );
    });

    it("rejects allocation without prize pool set", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(1_000));
      await vault.updateMetrics(HEALTH_THRESHOLD, INCOME_THRESHOLD);

      await expect(vault.allocateToPrize()).to.be.revertedWith(
        "IABVault: no prize pool"
      );
    });
  });

  describe("Metrics & Oracle", function () {
    it("updates threshold to true when both metrics met", async function () {
      const { vault } = await loadFixture(deployFixture);

      await expect(vault.updateMetrics(HEALTH_THRESHOLD, INCOME_THRESHOLD))
        .to.emit(vault, "MetricsUpdated")
        .withArgs(HEALTH_THRESHOLD, INCOME_THRESHOLD, true);

      expect(await vault.thresholdMet()).to.be.true;
    });

    it("does not flip threshold when only one metric met", async function () {
      const { vault } = await loadFixture(deployFixture);

      await vault.updateMetrics(HEALTH_THRESHOLD, 0n);
      expect(await vault.thresholdMet()).to.be.false;

      await vault.updateMetrics(0n, INCOME_THRESHOLD);
      expect(await vault.thresholdMet()).to.be.false;
    });

    it("only owner can update metrics", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);

      await expect(
        vault.connect(depositor1).updateMetrics(100n, 50n)
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("threshold stays true once set (irreversible)", async function () {
      const { vault } = await loadFixture(deployFixture);

      await vault.updateMetrics(HEALTH_THRESHOLD, INCOME_THRESHOLD);
      expect(await vault.thresholdMet()).to.be.true;

      await vault.updateMetrics(0n, 0n);
      expect(await vault.thresholdMet()).to.be.true;
    });
  });

  describe("Admin", function () {
    it("sets prize pool address", async function () {
      const { vault, prizePool } = await loadFixture(deployFixture);

      await expect(vault.setPrizePool(await prizePool.getAddress()))
        .to.emit(vault, "PrizePoolSet")
        .withArgs(await prizePool.getAddress());

      expect(await vault.prizePool()).to.equal(await prizePool.getAddress());
    });

    it("rejects zero address for prize pool", async function () {
      const { vault } = await loadFixture(deployFixture);

      await expect(
        vault.setPrizePool(ethers.ZeroAddress)
      ).to.be.revertedWith("IABVault: zero prize pool");
    });

    it("only owner can set prize pool", async function () {
      const { vault, prizePool, depositor1 } =
        await loadFixture(deployFixture);

      await expect(
        vault
          .connect(depositor1)
          .setPrizePool(await prizePool.getAddress())
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });
  });

  describe("View functions", function () {
    it("maturityTimestamp is deploy + duration", async function () {
      const { vault } = await loadFixture(deployFixture);

      const deploy = await vault.deployTimestamp();
      const maturity = await vault.maturityTimestamp();
      expect(maturity).to.equal(deploy + FIFTEEN_YEARS);
    });

    it("getBalance returns 0 for non-depositor", async function () {
      const { vault, depositor1 } = await loadFixture(deployFixture);
      expect(await vault.getBalance(depositor1.address)).to.equal(0n);
    });

    it("convertToShares and convertToAssets are inverse operations", async function () {
      const { vault, aavePool, depositor1 } =
        await loadFixture(deployFixture);

      await vault.connect(depositor1).deposit(parseUSDC(10_000));
      await aavePool.simulateYield(await vault.getAddress(), parseUSDC(2_000));

      const assets = parseUSDC(5_000);
      const shares = await vault.convertToShares(assets);
      const assetsBack = await vault.convertToAssets(shares);

      // Should round-trip within 1 USDC
      expect(assetsBack).to.be.closeTo(assets, parseUSDC(1));
    });
  });

  describe("Full lifecycle — fail path", function () {
    it("deposit → yield → maturity → refund with IAB token burn", async function () {
      const { vault, usdc, aavePool, depositor1, depositor2 } =
        await loadFixture(deployFixture);

      // 1. Depositors buy IABs
      await vault.connect(depositor1).deposit(parseUSDC(8_000));
      await vault.connect(depositor2).deposit(parseUSDC(2_000));

      // Verify IAB tokens minted
      expect(await vault.totalSupply()).to.be.greaterThan(0n);

      // 2. Yield accrues (3x total)
      await aavePool.simulateYield(
        await vault.getAddress(),
        parseUSDC(20_000)
      );
      expect(await vault.totalPoolValue()).to.equal(parseUSDC(30_000));

      // 3. Thresholds NOT met
      await vault.updateMetrics(50n, 25n);
      expect(await vault.thresholdMet()).to.be.false;

      // 4. Maturity reached
      await time.increase(Number(FIFTEEN_YEARS));

      // 5. Depositors claim refunds (IAB tokens burned)
      const bal1Before = await usdc.balanceOf(depositor1.address);
      await vault.connect(depositor1).claimRefund();
      const bal1After = await usdc.balanceOf(depositor1.address);
      // 80% of 30000 = 24000
      expect(bal1After - bal1Before).to.be.closeTo(
        parseUSDC(24_000),
        parseUSDC(1)
      );

      const bal2Before = await usdc.balanceOf(depositor2.address);
      await vault.connect(depositor2).claimRefund();
      const bal2After = await usdc.balanceOf(depositor2.address);
      // 20% of 30000 = 6000
      expect(bal2After - bal2Before).to.be.closeTo(
        parseUSDC(6_000),
        parseUSDC(1)
      );

      // All IAB tokens burned
      expect(await vault.totalSupply()).to.equal(0n);
    });
  });

  describe("Full lifecycle — success path", function () {
    it("deposit → threshold met → allocate → IAB tokens remain for voting", async function () {
      const { vault, usdc, aavePool, prizePool, depositor1, depositor2 } =
        await loadFixture(deployFixture);

      // 1. Depositors buy IABs
      await vault.connect(depositor1).deposit(parseUSDC(7_000));
      await vault.connect(depositor2).deposit(parseUSDC(3_000));
      const d1Shares = await vault.balanceOf(depositor1.address);
      const d2Shares = await vault.balanceOf(depositor2.address);

      // 2. Yield accrues
      await aavePool.simulateYield(
        await vault.getAddress(),
        parseUSDC(5_000)
      );

      // 3. Set prize pool
      await vault.setPrizePool(await prizePool.getAddress());

      // 4. Thresholds met!
      await vault.updateMetrics(HEALTH_THRESHOLD, INCOME_THRESHOLD);
      expect(await vault.thresholdMet()).to.be.true;

      // 5. Allocate to prize pool
      await vault.allocateToPrize();

      // PrizePool receives all funds (15000 = 10000 principal + 5000 yield)
      const prizePoolBal = await usdc.balanceOf(await prizePool.getAddress());
      expect(prizePoolBal).to.equal(parseUSDC(15_000));

      // 6. IAB tokens survive — used for Wishocratic voting
      expect(await vault.balanceOf(depositor1.address)).to.equal(d1Shares);
      expect(await vault.balanceOf(depositor2.address)).to.equal(d2Shares);

      // 7. Depositors can NOT claim refunds
      await time.increase(Number(FIFTEEN_YEARS));
      await expect(
        vault.connect(depositor1).claimRefund()
      ).to.be.revertedWith("IABVault: threshold met");
    });
  });
});
