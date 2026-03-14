import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("WishToken", function () {
  const INITIAL_SUPPLY = ethers.parseEther("1000000"); // 1M WISH
  const TAX_RATE_BPS = 50n; // 0.5%

  async function deployFixture() {
    const [owner, treasury, alice, bob] = await ethers.getSigners();

    const WishToken = await ethers.getContractFactory("WishToken");
    const wish = await WishToken.deploy(treasury.address, INITIAL_SUPPLY, TAX_RATE_BPS);

    return { wish, owner, treasury, alice, bob };
  }

  describe("Deployment", function () {
    it("sets name and symbol", async function () {
      const { wish } = await loadFixture(deployFixture);
      expect(await wish.name()).to.equal("Wish");
      expect(await wish.symbol()).to.equal("WISH");
    });

    it("mints initial supply to owner", async function () {
      const { wish, owner } = await loadFixture(deployFixture);
      expect(await wish.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });

    it("sets treasury and tax rate", async function () {
      const { wish, treasury } = await loadFixture(deployFixture);
      expect(await wish.treasury()).to.equal(treasury.address);
      expect(await wish.taxRateBps()).to.equal(TAX_RATE_BPS);
    });

    it("owner and treasury are tax-exempt", async function () {
      const { wish, owner, treasury } = await loadFixture(deployFixture);
      expect(await wish.taxExempt(owner.address)).to.be.true;
      expect(await wish.taxExempt(treasury.address)).to.be.true;
    });

    it("reverts on zero treasury address", async function () {
      const WishToken = await ethers.getContractFactory("WishToken");
      await expect(
        WishToken.deploy(ethers.ZeroAddress, INITIAL_SUPPLY, TAX_RATE_BPS)
      ).to.be.revertedWith("WishToken: zero treasury");
    });

    it("reverts on tax rate above maximum", async function () {
      const [, treasury] = await ethers.getSigners();
      const WishToken = await ethers.getContractFactory("WishToken");
      await expect(
        WishToken.deploy(treasury.address, INITIAL_SUPPLY, 501n)
      ).to.be.revertedWith("WishToken: tax too high");
    });
  });

  describe("Transfer with tax", function () {
    it("deducts 0.5% tax on regular transfers", async function () {
      const { wish, owner, alice, treasury } = await loadFixture(deployFixture);

      const amount = ethers.parseEther("1000");
      // Owner is tax-exempt, so first fund alice
      await wish.transfer(alice.address, amount);

      // Alice → Bob should incur tax
      const { bob } = await loadFixture(deployFixture);
      const transferAmount = ethers.parseEther("100");
      const expectedTax = (transferAmount * TAX_RATE_BPS) / 10000n;
      const expectedNet = transferAmount - expectedTax;

      // Re-deploy to get fresh state
      const WishToken = await ethers.getContractFactory("WishToken");
      const [o, t, a, b] = await ethers.getSigners();
      const w = await WishToken.deploy(t.address, INITIAL_SUPPLY, TAX_RATE_BPS);

      // Fund alice (owner is exempt, so no tax on this transfer)
      await w.transfer(a.address, ethers.parseEther("1000"));

      const treasuryBefore = await w.balanceOf(t.address);

      // Alice transfers to Bob (both non-exempt)
      await w.connect(a).transfer(b.address, transferAmount);

      expect(await w.balanceOf(b.address)).to.equal(expectedNet);
      expect(await w.balanceOf(t.address)).to.equal(treasuryBefore + expectedTax);
    });

    it("no tax when sender is tax-exempt", async function () {
      const { wish, owner, alice } = await loadFixture(deployFixture);

      const amount = ethers.parseEther("100");
      // Owner is exempt
      await wish.transfer(alice.address, amount);
      expect(await wish.balanceOf(alice.address)).to.equal(amount);
    });

    it("no tax when tax rate is zero", async function () {
      const [owner, treasury, alice, bob] = await ethers.getSigners();
      const WishToken = await ethers.getContractFactory("WishToken");
      const wish = await WishToken.deploy(treasury.address, INITIAL_SUPPLY, 0n);

      await wish.transfer(alice.address, ethers.parseEther("1000"));
      const amount = ethers.parseEther("100");
      await wish.connect(alice).transfer(bob.address, amount);
      expect(await wish.balanceOf(bob.address)).to.equal(amount);
    });
  });

  describe("Admin functions", function () {
    it("owner can update tax rate", async function () {
      const { wish } = await loadFixture(deployFixture);
      await expect(wish.setTaxRate(100n))
        .to.emit(wish, "TaxRateUpdated")
        .withArgs(TAX_RATE_BPS, 100n);
      expect(await wish.taxRateBps()).to.equal(100n);
    });

    it("reverts if non-owner updates tax rate", async function () {
      const { wish, alice } = await loadFixture(deployFixture);
      await expect(wish.connect(alice).setTaxRate(100n)).to.be.reverted;
    });

    it("owner can update treasury address", async function () {
      const { wish, treasury, alice } = await loadFixture(deployFixture);
      await expect(wish.setTreasury(alice.address))
        .to.emit(wish, "TreasuryUpdated")
        .withArgs(treasury.address, alice.address);
      expect(await wish.treasury()).to.equal(alice.address);
      expect(await wish.taxExempt(alice.address)).to.be.true;
      expect(await wish.taxExempt(treasury.address)).to.be.false;
    });

    it("owner can set tax exemptions", async function () {
      const { wish, alice } = await loadFixture(deployFixture);
      await wish.setTaxExempt(alice.address, true);
      expect(await wish.taxExempt(alice.address)).to.be.true;
    });

    it("owner can mint new tokens", async function () {
      const { wish, alice } = await loadFixture(deployFixture);
      const mintAmount = ethers.parseEther("5000");
      await wish.mint(alice.address, mintAmount);
      expect(await wish.balanceOf(alice.address)).to.equal(mintAmount);
    });
  });
});
