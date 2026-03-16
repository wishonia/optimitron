// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title IABSplitter — 80/10/10 Fund Allocation Splitter
 * @notice Receives stablecoins from IABVault and splits them according to
 *         the Incentive Alignment Bond allocation model:
 *
 *   - 80% → PublicGoodsPool (Wishocratic allocation to trial implementers)
 *   - 10% → InvestorPool (yield returned to IAB token holders)
 *   - 10% → PoliticalIncentiveAllocator (campaign funds for aligned politicians)
 *
 * The split is permissionless — anyone can call split() to flush the
 * accumulated balance to the three recipients. This prevents funds from
 * sitting idle in the splitter contract.
 */
contract IABSplitter is Ownable {
    using SafeERC20 for IERC20;

    // --- Config ---

    IERC20 public immutable stablecoin;

    /// @notice Basis points for each allocation (must sum to 10000)
    uint256 public constant PUBLIC_GOODS_POOL_BPS = 8000;
    uint256 public constant INVESTOR_POOL_BPS = 1000;
    uint256 public constant POLITICAL_INCENTIVE_BPS = 1000;

    // --- Recipients ---

    address public publicGoodsPool;
    address public investorPool;
    address public politicalIncentiveAllocator;

    // --- Events ---

    event FundsSplit(
        uint256 toPublicGoodsPool,
        uint256 toInvestors,
        uint256 toPolitical,
        uint256 timestamp
    );

    event RecipientsUpdated(
        address publicGoodsPool,
        address investorPool,
        address politicalIncentiveAllocator
    );

    constructor(
        address _stablecoin,
        address _publicGoodsPool,
        address _investorPool,
        address _politicalIncentiveAllocator
    ) Ownable(msg.sender) {
        require(_stablecoin != address(0), "Splitter: zero stablecoin");
        require(_publicGoodsPool != address(0), "Splitter: zero public goods pool");
        require(_investorPool != address(0), "Splitter: zero investor pool");
        require(_politicalIncentiveAllocator != address(0), "Splitter: zero political allocator");

        stablecoin = IERC20(_stablecoin);
        publicGoodsPool = _publicGoodsPool;
        investorPool = _investorPool;
        politicalIncentiveAllocator = _politicalIncentiveAllocator;
    }

    // --- Core functions ---

    /**
     * @notice Split the entire stablecoin balance to the three recipients.
     *         Callable by anyone — permissionless execution.
     *
     *         The split uses integer division, so dust (up to 2 wei) may
     *         remain in the contract. This is negligible and will be swept
     *         on the next split.
     */
    function split() external {
        uint256 balance = stablecoin.balanceOf(address(this));
        require(balance > 0, "Splitter: no funds");

        uint256 toPublicGoodsPool = (balance * PUBLIC_GOODS_POOL_BPS) / 10_000;
        uint256 toInvestors = (balance * INVESTOR_POOL_BPS) / 10_000;
        uint256 toPolitical = (balance * POLITICAL_INCENTIVE_BPS) / 10_000;

        stablecoin.safeTransfer(publicGoodsPool, toPublicGoodsPool);
        stablecoin.safeTransfer(investorPool, toInvestors);
        stablecoin.safeTransfer(politicalIncentiveAllocator, toPolitical);

        emit FundsSplit(toPublicGoodsPool, toInvestors, toPolitical, block.timestamp);
    }

    // --- Admin functions ---

    /**
     * @notice Update recipient addresses. All three must be non-zero.
     * @param _publicGoodsPool New public goods pool address
     * @param _investorPool New investor pool address
     * @param _politicalIncentiveAllocator New political incentive allocator address
     */
    function setRecipients(
        address _publicGoodsPool,
        address _investorPool,
        address _politicalIncentiveAllocator
    ) external onlyOwner {
        require(_publicGoodsPool != address(0), "Splitter: zero public goods pool");
        require(_investorPool != address(0), "Splitter: zero investor pool");
        require(_politicalIncentiveAllocator != address(0), "Splitter: zero political allocator");

        publicGoodsPool = _publicGoodsPool;
        investorPool = _investorPool;
        politicalIncentiveAllocator = _politicalIncentiveAllocator;

        emit RecipientsUpdated(_publicGoodsPool, _investorPool, _politicalIncentiveAllocator);
    }

    // --- View functions ---

    /// @notice Current splitter balance available for distribution
    function pendingBalance() external view returns (uint256) {
        return stablecoin.balanceOf(address(this));
    }

    /**
     * @notice Preview how the current balance would be split.
     * @return toPublicGoodsPool Amount going to the public goods pool (80%)
     * @return toInvestors Amount going to the investor pool (10%)
     * @return toPolitical Amount going to the political allocator (10%)
     */
    function previewSplit()
        external
        view
        returns (uint256 toPublicGoodsPool, uint256 toInvestors, uint256 toPolitical)
    {
        uint256 balance = stablecoin.balanceOf(address(this));
        toPublicGoodsPool = (balance * PUBLIC_GOODS_POOL_BPS) / 10_000;
        toInvestors = (balance * INVESTOR_POOL_BPS) / 10_000;
        toPolitical = (balance * POLITICAL_INCENTIVE_BPS) / 10_000;
    }
}
