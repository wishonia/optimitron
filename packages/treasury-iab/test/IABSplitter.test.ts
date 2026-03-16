import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("IABSplitter", function () {
  async function deployFixture() {
    const [owner, publicGoodsPool, investorPool, politicalAllocator, nonOwner] =
      await ethers.getSigners();

    // Deploy mock stablecoin
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const usdc = await MockERC20.deploy("USD Coin", "USDC", 6);

    // Deploy splitter
    const Splitter = await ethers.getContractFactory("IABSplitter");
    const splitter = await Splitter.deploy(
      await usdc.getAddress(),
      publicGoodsPool.address,
      investorPool.address,
      politicalAllocator.address,
    );

    return {
      usdc,
      splitter,
      owner,
      publicGoodsPool,
      investorPool,
      politicalAllocator,
      nonOwner,
    };
  }

  describe("Deployment", function () {
    it("sets correct stablecoin", async function () {
      const { usdc, splitter } = await loadFixture(deployFixture);
      expect(await splitter.stablecoin()).to.equal(await usdc.getAddress());
    });

    it("sets correct recipients", async function () {
      const { splitter, publicGoodsPool, investorPool, politicalAllocator } =
        await loadFixture(deployFixture);
      expect(await splitter.publicGoodsPool()).to.equal(publicGoodsPool.address);
      expect(await splitter.investorPool()).to.equal(investorPool.address);
      expect(await splitter.politicalIncentiveAllocator()).to.equal(
        politicalAllocator.address,
      );
    });

    it("rejects zero stablecoin address", async function () {
      const [_, p, i, a] = await ethers.getSigners();
      const Splitter = await ethers.getContractFactory("IABSplitter");
      await expect(
        Splitter.deploy(ethers.ZeroAddress, p.address, i.address, a.address),
      ).to.be.revertedWith("Splitter: zero stablecoin");
    });

    it("rejects zero recipient addresses", async function () {
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      const usdc = await MockERC20.deploy("USDC", "USDC", 6);
      const [_, p, i] = await ethers.getSigners();
      const Splitter = await ethers.getContractFactory("IABSplitter");

      await expect(
        Splitter.deploy(
          await usdc.getAddress(),
          ethers.ZeroAddress,
          i.address,
          p.address,
        ),
      ).to.be.revertedWith("Splitter: zero public goods pool");
    });
  });

  describe("split", function () {
    it("splits funds 80/10/10", async function () {
      const { usdc, splitter, publicGoodsPool, investorPool, politicalAllocator } =
        await loadFixture(deployFixture);

      const amount = ethers.parseUnits("10000", 6); // 10,000 USDC
      await usdc.mint(await splitter.getAddress(), amount);

      const expectedPrize = (amount * 8000n) / 10000n;
      const expectedInvestor = (amount * 1000n) / 10000n;
      const expectedPolitical = (amount * 1000n) / 10000n;

      await expect(splitter.split())
        .to.emit(splitter, "FundsSplit")
        .withArgs(
          expectedPrize,
          expectedInvestor,
          expectedPolitical,
          (t: bigint) => t > 0n,
        );

      expect(await usdc.balanceOf(publicGoodsPool.address)).to.equal(expectedPrize);
      expect(await usdc.balanceOf(investorPool.address)).to.equal(
        expectedInvestor,
      );
      expect(await usdc.balanceOf(politicalAllocator.address)).to.equal(
        expectedPolitical,
      );
    });

    it("is permissionless (anyone can call)", async function () {
      const { usdc, splitter, nonOwner } = await loadFixture(deployFixture);

      await usdc.mint(await splitter.getAddress(), ethers.parseUnits("100", 6));
      await expect(splitter.connect(nonOwner).split()).to.not.be.reverted;
    });

    it("reverts when no funds", async function () {
      const { splitter } = await loadFixture(deployFixture);
      await expect(splitter.split()).to.be.revertedWith("Splitter: no funds");
    });

    it("handles multiple splits correctly", async function () {
      const { usdc, splitter, publicGoodsPool } = await loadFixture(deployFixture);

      const amount1 = ethers.parseUnits("1000", 6);
      const amount2 = ethers.parseUnits("2000", 6);

      await usdc.mint(await splitter.getAddress(), amount1);
      await splitter.split();

      await usdc.mint(await splitter.getAddress(), amount2);
      await splitter.split();

      const totalExpected =
        ((amount1 + amount2) * 8000n) / 10000n;
      expect(await usdc.balanceOf(publicGoodsPool.address)).to.equal(totalExpected);
    });
  });

  describe("previewSplit", function () {
    it("previews the split amounts", async function () {
      const { usdc, splitter } = await loadFixture(deployFixture);

      const amount = ethers.parseUnits("5000", 6);
      await usdc.mint(await splitter.getAddress(), amount);

      const [toPrize, toInvestors, toPolitical] =
        await splitter.previewSplit();

      expect(toPrize).to.equal((amount * 8000n) / 10000n);
      expect(toInvestors).to.equal((amount * 1000n) / 10000n);
      expect(toPolitical).to.equal((amount * 1000n) / 10000n);
    });
  });

  describe("setRecipients", function () {
    it("allows owner to update recipients", async function () {
      const { splitter } = await loadFixture(deployFixture);
      const [_, __, ___, ____, _____, newPrize, newInvestor, newPol] =
        await ethers.getSigners();

      await expect(
        splitter.setRecipients(
          newPrize.address,
          newInvestor.address,
          newPol.address,
        ),
      )
        .to.emit(splitter, "RecipientsUpdated")
        .withArgs(newPrize.address, newInvestor.address, newPol.address);

      expect(await splitter.publicGoodsPool()).to.equal(newPrize.address);
    });

    it("rejects non-owner", async function () {
      const { splitter, nonOwner, publicGoodsPool, investorPool, politicalAllocator } =
        await loadFixture(deployFixture);
      await expect(
        splitter
          .connect(nonOwner)
          .setRecipients(
            publicGoodsPool.address,
            investorPool.address,
            politicalAllocator.address,
          ),
      ).to.be.revertedWithCustomError(splitter, "OwnableUnauthorizedAccount");
    });
  });
});
