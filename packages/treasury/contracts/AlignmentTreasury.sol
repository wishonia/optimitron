// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title UBITreasury
 * @notice Receives $WISH from transaction tax and distributes equally
 *         to all World ID-verified citizens as Universal Basic Income.
 *
 * Flow:
 *   1. Transaction tax on every $WISH transfer flows here automatically
 *   2. Citizens register with proof of personhood (World ID nullifier hash)
 *   3. Anyone can trigger distributeUBI() — permissionless execution
 *   4. Every registered citizen gets an equal share
 *
 * Politician funding is handled separately by the IAB mechanism (80/10/10 split).
 * This contract is purely UBI — no alignment scores, no politician tracking.
 */
contract AlignmentTreasury is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public wishToken;

    // --- UBI tracking ---

    /// @notice World ID nullifier hash → citizen wallet (sybil resistance)
    mapping(bytes32 => address) public ubiCitizens;

    /// @notice Citizen wallet → registered flag
    mapping(address => bool) public isRegisteredCitizen;

    /// @notice All registered citizen addresses for iteration
    address[] public citizenList;

    // --- Events ---

    event CitizenRegistered(address indexed citizen, bytes32 nullifierHash);
    event UBIDistributed(uint256 totalAmount, uint256 recipientCount);

    constructor(address _wishToken) Ownable(msg.sender) {
        require(_wishToken != address(0), "Treasury: zero token");
        wishToken = IERC20(_wishToken);
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
     *         Distributes the entire treasury balance.
     */
    function distributeUBI() external {
        require(citizenList.length > 0, "Treasury: no citizens");

        uint256 balance = wishToken.balanceOf(address(this));
        require(balance > 0, "Treasury: no funds");

        uint256 perCitizen = balance / citizenList.length;
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

    // --- View functions ---

    /// @notice Number of registered UBI citizens
    function citizenCount() external view returns (uint256) {
        return citizenList.length;
    }

    /// @notice Current treasury balance
    function treasuryBalance() external view returns (uint256) {
        return wishToken.balanceOf(address(this));
    }
}
