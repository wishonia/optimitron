// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MonetaryPolicyOracle
 * @notice Receives off-chain optimal rate calculations and translates them
 *         into algorithmic minting decisions.
 *
 * Anti-Cantillon by design:
 *   1. Off-chain optimizer computes optimal supply expansion rate
 *   2. Owner (governance multisig) calls updatePolicy() with the rate
 *   3. Anyone calls executeMint() after the interval has passed
 *   4. New tokens go to AlignmentTreasury (NOT banks, NOT insiders)
 *   5. Treasury.distributeUBI() splits them equally among verified citizens
 *
 * New money enters through equal distribution, not through banks.
 */
contract MonetaryPolicyOracle is Ownable {
    /// @notice The $WISH token contract (must have mint() callable by this contract)
    IWishMintable public token;

    /// @notice Treasury that receives all minted tokens
    address public treasury;

    /// @notice Target supply expansion rate in basis points (e.g., 200 = 2% per interval)
    uint256 public expansionRateBps;

    /// @notice Maximum expansion rate: 10% per interval
    uint256 public constant MAX_EXPANSION_BPS = 1000;

    /// @notice Minimum time between mints (default: 30 days)
    uint256 public mintIntervalSeconds;

    /// @notice Timestamp of last mint execution
    uint256 public lastMintTimestamp;

    /// @notice Whether minting is currently paused
    bool public paused;

    event PolicyUpdated(uint256 oldRateBps, uint256 newRateBps);
    event MintExecuted(uint256 amount, address indexed treasury, uint256 timestamp);
    event MintIntervalUpdated(uint256 oldInterval, uint256 newInterval);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event PauseToggled(bool paused);

    constructor(
        address _token,
        address _treasury,
        uint256 _expansionRateBps,
        uint256 _mintIntervalSeconds
    ) Ownable(msg.sender) {
        require(_token != address(0), "Oracle: zero token");
        require(_treasury != address(0), "Oracle: zero treasury");
        require(_expansionRateBps <= MAX_EXPANSION_BPS, "Oracle: rate too high");
        require(_mintIntervalSeconds >= 1 days, "Oracle: interval too short");

        token = IWishMintable(_token);
        treasury = _treasury;
        expansionRateBps = _expansionRateBps;
        mintIntervalSeconds = _mintIntervalSeconds;
        lastMintTimestamp = block.timestamp;
    }

    /**
     * @notice Update the supply expansion rate. Called by governance after
     *         off-chain optimizer produces new optimal rate calculations.
     * @param _expansionRateBps New rate in basis points (0 = no expansion)
     */
    function updatePolicy(uint256 _expansionRateBps) external onlyOwner {
        require(_expansionRateBps <= MAX_EXPANSION_BPS, "Oracle: rate too high");
        uint256 old = expansionRateBps;
        expansionRateBps = _expansionRateBps;
        emit PolicyUpdated(old, _expansionRateBps);
    }

    /**
     * @notice Execute a mint if the interval has passed and expansion rate > 0.
     *         Permissionless — anyone can trigger this. New tokens go directly
     *         to the treasury for equal distribution via UBI.
     */
    function executeMint() external {
        require(!paused, "Oracle: paused");
        require(expansionRateBps > 0, "Oracle: zero expansion");
        require(
            block.timestamp >= lastMintTimestamp + mintIntervalSeconds,
            "Oracle: too soon"
        );

        uint256 currentSupply = token.totalSupply();
        uint256 mintAmount = (currentSupply * expansionRateBps) / 10_000;
        require(mintAmount > 0, "Oracle: mint amount zero");

        lastMintTimestamp = block.timestamp;
        token.mint(treasury, mintAmount);

        emit MintExecuted(mintAmount, treasury, block.timestamp);
    }

    /**
     * @notice Compute how many tokens would be minted right now.
     *         View function for UI display.
     */
    function pendingMintAmount() external view returns (uint256) {
        if (paused || expansionRateBps == 0) return 0;
        if (block.timestamp < lastMintTimestamp + mintIntervalSeconds) return 0;
        return (token.totalSupply() * expansionRateBps) / 10_000;
    }

    /**
     * @notice Seconds until next mint is available.
     */
    function secondsUntilNextMint() external view returns (uint256) {
        uint256 nextMint = lastMintTimestamp + mintIntervalSeconds;
        if (block.timestamp >= nextMint) return 0;
        return nextMint - block.timestamp;
    }

    // ─── Admin ──────────────────────────────────────────────────────

    function setMintInterval(uint256 _seconds) external onlyOwner {
        require(_seconds >= 1 days, "Oracle: interval too short");
        uint256 old = mintIntervalSeconds;
        mintIntervalSeconds = _seconds;
        emit MintIntervalUpdated(old, _seconds);
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Oracle: zero treasury");
        address old = treasury;
        treasury = _treasury;
        emit TreasuryUpdated(old, _treasury);
    }

    function togglePause() external onlyOwner {
        paused = !paused;
        emit PauseToggled(paused);
    }
}

/**
 * @notice Minimal interface for the WishToken mint function.
 *         The oracle needs mint() and totalSupply() — nothing else.
 */
interface IWishMintable {
    function mint(address to, uint256 amount) external;
    function totalSupply() external view returns (uint256);
}
