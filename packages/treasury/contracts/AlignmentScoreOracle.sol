// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AlignmentScoreOracle
 * @notice Stores Merkle roots of published Citizen Alignment Scores (CAS).
 *         A trusted publisher (the owner) posts roots per jurisdiction.
 *         Anyone can verify a politician's score via Merkle proof.
 *
 * How it works:
 *   1. Off-chain system computes CAS for all politicians in a jurisdiction
 *   2. Scores are packed into a Merkle tree and published as a Hypercert
 *   3. Owner posts the Merkle root + Hypercert CID on-chain
 *   4. Anyone can verify a specific politician's score with a proof
 *
 * Leaf encoding:
 *   keccak256(abi.encodePacked(
 *       jurisdictionCode,
 *       politicianExternalId,
 *       score,
 *       votesCompared,
 *       aggregationRunId,
 *       timestamp
 *   ))
 */
contract AlignmentScoreOracle is Ownable {
    // --- State ---

    /// @notice Jurisdiction code → Merkle root of the CAS tree
    mapping(bytes32 => bytes32) public scoreRoots;

    /// @notice Jurisdiction code → timestamp of last root update
    mapping(bytes32 => uint256) public lastUpdated;

    /// @notice Jurisdiction code → Hypercert CID linking to full evidence bundle
    mapping(bytes32 => string) public evidenceCids;

    // --- Events ---

    event ScoreRootUpdated(
        bytes32 indexed jurisdictionCode,
        bytes32 root,
        uint256 timestamp,
        string evidenceCid
    );

    constructor() Ownable(msg.sender) {}

    // --- Publisher functions ---

    /**
     * @notice Publish a new Merkle root for a jurisdiction's alignment scores.
     * @param jurisdictionCode Keccak256 hash of the jurisdiction identifier
     *        (e.g., keccak256("US-FEDERAL"), keccak256("US-CA"))
     * @param root Merkle root of the CAS tree
     * @param evidenceCid Storacha/IPFS CID linking to the Hypercert evidence bundle
     *        containing the full score dataset and methodology
     */
    function updateScoreRoot(
        bytes32 jurisdictionCode,
        bytes32 root,
        string calldata evidenceCid
    ) external onlyOwner {
        require(root != bytes32(0), "Oracle: zero root");
        require(bytes(evidenceCid).length > 0, "Oracle: empty evidence CID");

        scoreRoots[jurisdictionCode] = root;
        lastUpdated[jurisdictionCode] = block.timestamp;
        evidenceCids[jurisdictionCode] = evidenceCid;

        emit ScoreRootUpdated(jurisdictionCode, root, block.timestamp, evidenceCid);
    }

    // --- Verification functions ---

    /**
     * @notice Verify a politician's alignment score against the published Merkle root.
     *         The leaf should be constructed off-chain as:
     *         keccak256(abi.encodePacked(
     *             jurisdictionCode, politicianExternalId, score,
     *             votesCompared, aggregationRunId, timestamp
     *         ))
     * @param jurisdictionCode Keccak256 hash of the jurisdiction identifier
     * @param leaf The leaf hash to verify
     * @param proof Array of sibling hashes from leaf to root
     * @return True if the proof is valid against the stored root
     */
    function verifyScore(
        bytes32 jurisdictionCode,
        bytes32 leaf,
        bytes32[] calldata proof
    ) external view returns (bool) {
        bytes32 root = scoreRoots[jurisdictionCode];
        if (root == bytes32(0)) return false;

        return _verifyMerkle(leaf, proof, root);
    }

    // --- Internal ---

    /**
     * @notice Verify a Merkle proof using sorted pair hashing.
     *         Pairs are sorted before hashing to allow proof order independence,
     *         matching the OpenZeppelin MerkleTree.js standard.
     * @param leaf The leaf hash
     * @param proof The proof path (sibling hashes)
     * @param root The expected root
     * @return True if the computed root matches the expected root
     */
    function _verifyMerkle(
        bytes32 leaf,
        bytes32[] calldata proof,
        bytes32 root
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            // Sorted pair hashing: smaller hash first
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }

        return computedHash == root;
    }

    // --- View functions ---

    /**
     * @notice Check whether a jurisdiction has a published score root.
     * @param jurisdictionCode Keccak256 hash of the jurisdiction identifier
     * @return True if a non-zero root exists
     */
    function hasScoreRoot(bytes32 jurisdictionCode) external view returns (bool) {
        return scoreRoots[jurisdictionCode] != bytes32(0);
    }
}
