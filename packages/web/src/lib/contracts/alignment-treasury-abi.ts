/**
 * AlignmentTreasury ABI — $WISH UBI Treasury.
 * Receives $WISH from transaction tax, distributes 100% as UBI
 * equally to all World ID-verified citizens.
 *
 * Politician funding is handled separately by the IAB mechanism (80/10/10).
 * This contract is purely UBI — no alignment scores, no politician tracking.
 */
export const alignmentTreasuryAbi = [
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
    name: "treasuryBalance",
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
