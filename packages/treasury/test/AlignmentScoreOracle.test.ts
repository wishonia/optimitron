import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("AlignmentScoreOracle", function () {
  async function deployFixture() {
    const [owner, nonOwner] = await ethers.getSigners();

    const Oracle = await ethers.getContractFactory("AlignmentScoreOracle");
    const oracle = await Oracle.deploy();

    const jurisdictionCode = ethers.keccak256(
      ethers.toUtf8Bytes("US-FEDERAL"),
    );

    return { oracle, owner, nonOwner, jurisdictionCode };
  }

  describe("Deployment", function () {
    it("deploys with no score roots", async function () {
      const { oracle, jurisdictionCode } = await loadFixture(deployFixture);
      expect(await oracle.hasScoreRoot(jurisdictionCode)).to.be.false;
    });

    it("sets deployer as owner", async function () {
      const { oracle, owner } = await loadFixture(deployFixture);
      expect(await oracle.owner()).to.equal(owner.address);
    });
  });

  describe("updateScoreRoot", function () {
    it("publishes a score root", async function () {
      const { oracle, jurisdictionCode } = await loadFixture(deployFixture);

      const root = ethers.keccak256(ethers.toUtf8Bytes("merkle-root-1"));
      const cid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";

      await expect(oracle.updateScoreRoot(jurisdictionCode, root, cid))
        .to.emit(oracle, "ScoreRootUpdated")
        .withArgs(jurisdictionCode, root, (t: bigint) => t > 0n, cid);

      expect(await oracle.scoreRoots(jurisdictionCode)).to.equal(root);
      expect(await oracle.evidenceCids(jurisdictionCode)).to.equal(cid);
      expect(await oracle.lastUpdated(jurisdictionCode)).to.be.greaterThan(0n);
      expect(await oracle.hasScoreRoot(jurisdictionCode)).to.be.true;
    });

    it("updates an existing root", async function () {
      const { oracle, jurisdictionCode } = await loadFixture(deployFixture);

      const root1 = ethers.keccak256(ethers.toUtf8Bytes("root-1"));
      const root2 = ethers.keccak256(ethers.toUtf8Bytes("root-2"));
      const cid1 = "cid-epoch-1";
      const cid2 = "cid-epoch-2";

      await oracle.updateScoreRoot(jurisdictionCode, root1, cid1);
      await oracle.updateScoreRoot(jurisdictionCode, root2, cid2);

      expect(await oracle.scoreRoots(jurisdictionCode)).to.equal(root2);
      expect(await oracle.evidenceCids(jurisdictionCode)).to.equal(cid2);
    });

    it("rejects zero root", async function () {
      const { oracle, jurisdictionCode } = await loadFixture(deployFixture);
      await expect(
        oracle.updateScoreRoot(jurisdictionCode, ethers.ZeroHash, "cid"),
      ).to.be.revertedWith("Oracle: zero root");
    });

    it("rejects empty evidence CID", async function () {
      const { oracle, jurisdictionCode } = await loadFixture(deployFixture);
      const root = ethers.keccak256(ethers.toUtf8Bytes("root"));
      await expect(
        oracle.updateScoreRoot(jurisdictionCode, root, ""),
      ).to.be.revertedWith("Oracle: empty evidence CID");
    });

    it("rejects non-owner", async function () {
      const { oracle, nonOwner, jurisdictionCode } =
        await loadFixture(deployFixture);
      const root = ethers.keccak256(ethers.toUtf8Bytes("root"));
      await expect(
        oracle.connect(nonOwner).updateScoreRoot(jurisdictionCode, root, "cid"),
      ).to.be.revertedWithCustomError(oracle, "OwnableUnauthorizedAccount");
    });
  });

  describe("verifyScore (Merkle proofs)", function () {
    it("returns false for jurisdiction with no root", async function () {
      const { oracle, jurisdictionCode } = await loadFixture(deployFixture);
      const leaf = ethers.keccak256(ethers.toUtf8Bytes("leaf"));
      expect(await oracle.verifyScore(jurisdictionCode, leaf, [])).to.be.false;
    });

    it("verifies a single-leaf tree (no proof needed)", async function () {
      const { oracle, jurisdictionCode } = await loadFixture(deployFixture);

      // Single leaf = root
      const leaf = ethers.keccak256(ethers.toUtf8Bytes("leaf-data"));
      await oracle.updateScoreRoot(jurisdictionCode, leaf, "cid");

      expect(await oracle.verifyScore(jurisdictionCode, leaf, [])).to.be.true;
    });

    it("verifies a two-leaf tree", async function () {
      const { oracle, jurisdictionCode } = await loadFixture(deployFixture);

      const leafA = ethers.keccak256(ethers.toUtf8Bytes("politician-A"));
      const leafB = ethers.keccak256(ethers.toUtf8Bytes("politician-B"));

      // Sorted pair hash: smaller first
      const [first, second] = leafA <= leafB ? [leafA, leafB] : [leafB, leafA];
      const root = ethers.keccak256(
        ethers.solidityPacked(["bytes32", "bytes32"], [first, second]),
      );

      await oracle.updateScoreRoot(jurisdictionCode, root, "cid");

      // leafA's proof is [leafB] (the sibling)
      expect(await oracle.verifyScore(jurisdictionCode, leafA, [leafB])).to.be
        .true;
      // leafB's proof is [leafA]
      expect(await oracle.verifyScore(jurisdictionCode, leafB, [leafA])).to.be
        .true;
    });

    it("rejects an invalid proof", async function () {
      const { oracle, jurisdictionCode } = await loadFixture(deployFixture);

      const leaf = ethers.keccak256(ethers.toUtf8Bytes("real-leaf"));
      const fakeProof = ethers.keccak256(ethers.toUtf8Bytes("fake-sibling"));

      // Set a root that doesn't match
      const root = ethers.keccak256(ethers.toUtf8Bytes("unrelated-root"));
      await oracle.updateScoreRoot(jurisdictionCode, root, "cid");

      expect(await oracle.verifyScore(jurisdictionCode, leaf, [fakeProof])).to
        .be.false;
    });

    it("verifies a four-leaf tree", async function () {
      const { oracle, jurisdictionCode } = await loadFixture(deployFixture);

      // Build a 4-leaf Merkle tree
      const leaves = [
        ethers.keccak256(ethers.toUtf8Bytes("pol-0")),
        ethers.keccak256(ethers.toUtf8Bytes("pol-1")),
        ethers.keccak256(ethers.toUtf8Bytes("pol-2")),
        ethers.keccak256(ethers.toUtf8Bytes("pol-3")),
      ].sort();

      function sortedHash(a: string, b: string): string {
        const [f, s] = a <= b ? [a, b] : [b, a];
        return ethers.keccak256(
          ethers.solidityPacked(["bytes32", "bytes32"], [f, s]),
        );
      }

      const h01 = sortedHash(leaves[0]!, leaves[1]!);
      const h23 = sortedHash(leaves[2]!, leaves[3]!);
      const root = sortedHash(h01, h23);

      await oracle.updateScoreRoot(jurisdictionCode, root, "cid");

      // Verify leaf[0]: proof = [leaf[1], h23]
      expect(
        await oracle.verifyScore(jurisdictionCode, leaves[0]!, [
          leaves[1]!,
          h23,
        ]),
      ).to.be.true;

      // Verify leaf[2]: proof = [leaf[3], h01]
      expect(
        await oracle.verifyScore(jurisdictionCode, leaves[2]!, [
          leaves[3]!,
          h01,
        ]),
      ).to.be.true;
    });
  });
});
