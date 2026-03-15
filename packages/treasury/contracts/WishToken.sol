// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WishToken ($WISH)
 * @notice ERC-20 with built-in transaction tax for UBI and alignment-based governance funding.
 *
 * Mechanisms:
 *   1. Transaction tax (default 0.5%) on every transfer → sent to AlignmentTreasury
 *   2. UBI distribution via treasury → registered citizens receive periodic payouts
 *   3. Alignment-based rewards → politicians with high citizen alignment scores earn $WISH
 *
 * The transaction tax replaces income tax. The UBI replaces welfare bureaucracy.
 * World ID (external) provides sybil resistance for citizen registration.
 */
contract WishToken is ERC20, Ownable {
    /// @notice Fixed max supply — set once at deployment, never increases.
    /// Productivity gains manifest as gentle deflation (same money, more goods).
    uint256 public immutable maxSupply;

    /// @notice Treasury contract that receives tax revenue
    address public treasury;

    /// @notice Tax rate in basis points (50 = 0.5%)
    uint256 public taxRateBps;

    /// @notice Maximum tax rate: 5% (500 bps)
    uint256 public constant MAX_TAX_RATE_BPS = 500;

    /// @notice Addresses exempt from transfer tax (treasury, owner, etc.)
    mapping(address => bool) public taxExempt;

    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event TaxRateUpdated(uint256 oldRate, uint256 newRate);
    event TaxExemptionSet(address indexed account, bool exempt);

    constructor(
        address _treasury,
        uint256 _initialSupply,
        uint256 _taxRateBps
    ) ERC20("Wish", "WISH") Ownable(msg.sender) {
        require(_treasury != address(0), "WishToken: zero treasury");
        require(_taxRateBps <= MAX_TAX_RATE_BPS, "WishToken: tax too high");

        treasury = _treasury;
        taxRateBps = _taxRateBps;
        maxSupply = _initialSupply;

        // Owner and treasury are tax-exempt by default
        taxExempt[msg.sender] = true;
        taxExempt[_treasury] = true;

        _mint(msg.sender, _initialSupply);
    }

    /**
     * @notice Override transfer to apply transaction tax.
     * Tax is deducted from the transfer amount and sent to treasury.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        // No tax on mints, burns, or exempt addresses
        if (
            from == address(0) ||
            to == address(0) ||
            taxRateBps == 0 ||
            taxExempt[from] ||
            taxExempt[to]
        ) {
            super._update(from, to, value);
            return;
        }

        uint256 taxAmount = (value * taxRateBps) / 10_000;
        uint256 netAmount = value - taxAmount;

        // Send tax to treasury
        super._update(from, treasury, taxAmount);
        // Send remainder to recipient
        super._update(from, to, netAmount);
    }

    /// @notice Update the treasury address. Only owner.
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "WishToken: zero treasury");
        address old = treasury;
        taxExempt[old] = false;
        treasury = _treasury;
        taxExempt[_treasury] = true;
        emit TreasuryUpdated(old, _treasury);
    }

    /// @notice Update the tax rate in basis points. Only owner.
    function setTaxRate(uint256 _taxRateBps) external onlyOwner {
        require(_taxRateBps <= MAX_TAX_RATE_BPS, "WishToken: tax too high");
        uint256 old = taxRateBps;
        taxRateBps = _taxRateBps;
        emit TaxRateUpdated(old, _taxRateBps);
    }

    /// @notice Set tax exemption for an address. Only owner.
    function setTaxExempt(address account, bool exempt) external onlyOwner {
        taxExempt[account] = exempt;
        emit TaxExemptionSet(account, exempt);
    }

    /// @notice Mint new tokens. Only owner (governance emergency). Enforces max supply cap.
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= maxSupply, "WishToken: exceeds max supply");
        _mint(to, amount);
    }
}
