/**
 * UBIDistributor ABI — receives $WISH from the UBI budget category
 * in WishocraticTreasury and distributes equally to all World ID-verified citizens.
 *
 * This contract is the recipient wallet for the UNIVERSAL_BASIC_INCOME category.
 * Other categories send to DAO/NGO wallets directly. UBI uniquely needs
 * per-citizen equal splitting, which is what this contract does.
 */
export const ubiDistributorAbi = [
  // Constructor
  {
    type: "constructor",
    inputs: [{ name: "_wishToken", type: "address" }],
    stateMutability: "nonpayable",
  },

  // --- View functions ---

  {
    type: "function",
    name: "wishToken",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isRegisteredCitizen",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingBalance",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "citizenCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },

  // --- Write functions (permissionless) ---

  {
    type: "function",
    name: "distributeUBI",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },

  // --- Write functions (owner only) ---

  {
    type: "function",
    name: "registerForUBI",
    inputs: [
      { name: "citizen", type: "address" },
      { name: "nullifierHash", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },

  // --- Events ---

  {
    type: "event",
    name: "CitizenRegistered",
    inputs: [
      { name: "citizen", type: "address", indexed: true },
      { name: "nullifierHash", type: "bytes32", indexed: false },
    ],
  },
  {
    type: "event",
    name: "UBIDistributed",
    inputs: [
      { name: "totalAmount", type: "uint256", indexed: false },
      { name: "recipientCount", type: "uint256", indexed: false },
    ],
  },
] as const;
