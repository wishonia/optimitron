// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title AlignmentTreasury
 * @notice Receives $WISH from transaction tax and donations.
 *         Distributes to politicians based on alignment scores, and to citizens as UBI.
 *
 * Flow:
 *   1. receive() — accepts $WISH from transaction tax + direct donations
 *   2. updateAlignmentScores() — oracle updates alignment scores from Hypercerts
 *   3. distributeToAligned() — sends $WISH proportional to alignment scores
 *   4. registerForUBI() — citizen registers with proof of personhood hash
 *   5. distributeUBI() — distributes UBI pool equally to registered citizens
 */
contract AlignmentTreasury is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public wishToken;

    /// @notice Percentage of treasury allocated to UBI (in basis points, e.g. 5000 = 50%)
    uint256 public ubiAllocationBps;

    /// @notice Maximum UBI allocation: 80%
    uint256 public constant MAX_UBI_ALLOCATION_BPS = 8000;

    // --- Alignment tracking ---

    struct PoliticianScore {
        address wallet;
        uint256 score; // 0-10000 (basis points, so 7830 = 78.30%)
        bool active;
    }

    /// @notice Politician ID (bytes32 hash of string ID) → score data
    mapping(bytes32 => PoliticianScore) public politicians;

    /// @notice List of registered politician IDs for iteration
    bytes32[] public politicianIds;

    /// @notice Sum of all active politician scores (for proportional distribution)
    uint256 public totalAlignmentScore;

    // --- UBI tracking ---

    /// @notice World ID nullifier hash → citizen wallet (sybil resistance)
    mapping(bytes32 => address) public ubiCitizens;

    /// @notice Citizen wallet → registered flag
    mapping(address => bool) public isRegisteredCitizen;

    /// @notice All registered citizen addresses for iteration
    address[] public citizenList;

    // --- Events ---

    event AlignmentScoreUpdated(bytes32 indexed politicianId, address wallet, uint256 score);
    event PoliticianDeactivated(bytes32 indexed politicianId);
    event AlignmentDistributed(uint256 totalAmount, uint256 recipientCount);
    event CitizenRegistered(address indexed citizen, bytes32 nullifierHash);
    event UBIDistributed(uint256 totalAmount, uint256 recipientCount);
    event UBIAllocationUpdated(uint256 oldBps, uint256 newBps);

    constructor(address _wishToken, uint256 _ubiAllocationBps) Ownable(msg.sender) {
        require(_wishToken != address(0), "Treasury: zero token");
        require(_ubiAllocationBps <= MAX_UBI_ALLOCATION_BPS, "Treasury: UBI allocation too high");

        wishToken = IERC20(_wishToken);
        ubiAllocationBps = _ubiAllocationBps;
    }

    // --- Alignment Score Management ---

    /**
     * @notice Update alignment scores for politicians. Called by oracle/owner
     *         after Hypercert data is published to Storacha.
     * @param ids Array of politician ID hashes
     * @param wallets Array of politician wallet addresses
     * @param scores Array of alignment scores (0-10000 basis points)
     */
    function updateAlignmentScores(
        bytes32[] calldata ids,
        address[] calldata wallets,
        uint256[] calldata scores
    ) external onlyOwner {
        require(
            ids.length == wallets.length && ids.length == scores.length,
            "Treasury: array length mismatch"
        );

        for (uint256 i = 0; i < ids.length; i++) {
            require(scores[i] <= 10_000, "Treasury: score out of range");
            require(wallets[i] != address(0), "Treasury: zero wallet");

            PoliticianScore storage pol = politicians[ids[i]];

            // Track total score delta
            if (pol.active) {
                totalAlignmentScore -= pol.score;
            } else {
                politicianIds.push(ids[i]);
                pol.active = true;
            }

            pol.wallet = wallets[i];
            pol.score = scores[i];
            totalAlignmentScore += scores[i];

            emit AlignmentScoreUpdated(ids[i], wallets[i], scores[i]);
        }
    }

    /**
     * @notice Deactivate a politician (e.g., left office).
     */
    function deactivatePolitician(bytes32 politicianId) external onlyOwner {
        PoliticianScore storage pol = politicians[politicianId];
        require(pol.active, "Treasury: not active");

        totalAlignmentScore -= pol.score;
        pol.active = false;
        pol.score = 0;

        emit PoliticianDeactivated(politicianId);
    }

    /**
     * @notice Distribute $WISH to politicians proportional to their alignment scores.
     *         Uses the non-UBI portion of the treasury balance.
     */
    function distributeToAligned() external {
        require(totalAlignmentScore > 0, "Treasury: no scores");

        uint256 balance = wishToken.balanceOf(address(this));
        uint256 ubiReserve = (balance * ubiAllocationBps) / 10_000;
        uint256 alignmentPool = balance - ubiReserve;
        require(alignmentPool > 0, "Treasury: nothing to distribute");

        uint256 distributed = 0;
        uint256 recipientCount = 0;

        for (uint256 i = 0; i < politicianIds.length; i++) {
            PoliticianScore storage pol = politicians[politicianIds[i]];
            if (!pol.active || pol.score == 0) continue;

            uint256 share = (alignmentPool * pol.score) / totalAlignmentScore;
            if (share > 0) {
                wishToken.safeTransfer(pol.wallet, share);
                distributed += share;
                recipientCount++;
            }
        }

        emit AlignmentDistributed(distributed, recipientCount);
    }

    // --- UBI Management ---

    /**
     * @notice Register a citizen for UBI. Uses a World ID nullifier hash
     *         to prevent duplicate registrations (sybil resistance).
     * @param citizen Wallet address of the citizen
     * @param nullifierHash World ID nullifier hash (proof of unique personhood)
     */
    function registerForUBI(
        address citizen,
        bytes32 nullifierHash
    ) external onlyOwner {
        require(citizen != address(0), "Treasury: zero citizen");
        require(ubiCitizens[nullifierHash] == address(0), "Treasury: already registered");
        require(!isRegisteredCitizen[citizen], "Treasury: wallet already registered");

        ubiCitizens[nullifierHash] = citizen;
        isRegisteredCitizen[citizen] = true;
        citizenList.push(citizen);

        emit CitizenRegistered(citizen, nullifierHash);
    }

    /**
     * @notice Distribute UBI equally to all registered citizens.
     *         Callable by anyone — permissionless execution.
     */
    function distributeUBI() external {
        require(citizenList.length > 0, "Treasury: no citizens");

        uint256 balance = wishToken.balanceOf(address(this));
        uint256 ubiPool = (balance * ubiAllocationBps) / 10_000;
        require(ubiPool > 0, "Treasury: no UBI funds");

        uint256 perCitizen = ubiPool / citizenList.length;
        require(perCitizen > 0, "Treasury: amount too small");

        uint256 distributed = 0;
        uint256 recipientCount = 0;

        for (uint256 i = 0; i < citizenList.length; i++) {
            if (citizenList[i] != address(0)) {
                wishToken.safeTransfer(citizenList[i], perCitizen);
                distributed += perCitizen;
                recipientCount++;
            }
        }

        emit UBIDistributed(distributed, recipientCount);
    }

    /// @notice Update UBI allocation percentage. Only owner.
    function setUBIAllocation(uint256 _ubiAllocationBps) external onlyOwner {
        require(_ubiAllocationBps <= MAX_UBI_ALLOCATION_BPS, "Treasury: UBI allocation too high");
        uint256 old = ubiAllocationBps;
        ubiAllocationBps = _ubiAllocationBps;
        emit UBIAllocationUpdated(old, _ubiAllocationBps);
    }

    // --- View functions ---

    /// @notice Number of registered politicians
    function politicianCount() external view returns (uint256) {
        return politicianIds.length;
    }

    /// @notice Number of registered UBI citizens
    function citizenCount() external view returns (uint256) {
        return citizenList.length;
    }

    /// @notice Current treasury balance
    function treasuryBalance() external view returns (uint256) {
        return wishToken.balanceOf(address(this));
    }
}
