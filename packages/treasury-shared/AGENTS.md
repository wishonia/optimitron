# AGENTS.md — @optimitron/treasury-shared

**Lane:** Treasury & Contracts
**Owner rule:** One agent per lane at a time. Do not edit files outside your lane.

## Scope

Shared interfaces and mocks for all treasury contract packages.

## Key Exports

- `contracts/interfaces/IAavePool.sol` — Aave V3 pool interface
- `contracts/interfaces/IAlignmentScoreOracle.sol` — Alignment oracle interface
- `contracts/interfaces/IVoteToken.sol` — Vote token interface
- `contracts/mocks/MockAavePool.sol` — Test mock
- `contracts/mocks/MockERC20.sol` — Test mock

## Rules

- **Interface changes affect all treasury packages.** Coordinate with treasury-prize, treasury-iab, and treasury-wish before modifying.
- **Mocks are for testing only.** Never deploy mocks.
