// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IAlignmentScoreOracle — Minimal interface for score verification
 * @notice Used by PoliticalIncentiveAllocator to verify politician alignment
 *         scores against published Merkle roots.
 */
interface IAlignmentScoreOracle {
    /**
     * @notice Get the current Merkle root for a jurisdiction's alignment scores.
     * @param jurisdictionCode Keccak256 hash of the jurisdiction identifier
     * @return The Merkle root of the published score tree
     */
    function scoreRoots(bytes32 jurisdictionCode) external view returns (bytes32);

    /**
     * @notice Get the timestamp of the last score update for a jurisdiction.
     * @param jurisdictionCode Keccak256 hash of the jurisdiction identifier
     * @return Unix timestamp of the last update
     */
    function lastUpdated(bytes32 jurisdictionCode) external view returns (uint256);

    /**
     * @notice Verify a politician's alignment score against the published Merkle root.
     * @param jurisdictionCode Keccak256 hash of the jurisdiction identifier
     * @param leaf The leaf hash (keccak256 of encoded score data)
     * @param proof The Merkle proof path from leaf to root
     * @return True if the proof is valid
     */
    function verifyScore(
        bytes32 jurisdictionCode,
        bytes32 leaf,
        bytes32[] calldata proof
    ) external view returns (bool);
}
