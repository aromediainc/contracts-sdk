---
"@aromedia/contracts-sdk": minor
---

Initial public release.

- Typed viem clients for every contract in `aromedia-blockchain-contracts`:
  `AroSBT`, `AroNomination`, `AroMediaRWA`, `AroMediaAssetsRegistry`,
  `AroMediaAccessManager`, `AroMediaIncMultiSig`, `ForcedTransferManager`.
- `createAroSdk({ chain, walletClient? })` factory bundling all clients
  with a per-chain address registry.
- Wagmi React hooks via `@aromedia/contracts-sdk/hooks`:
  `useMembership`, `useHasSBT`, `useMemberData`, `useNomination`,
  `useNominationStatus`, `useHasVouched`, `useAroAddresses`.
- KYC-policy-aligned onboarding workflows: `describeOnboardingState`,
  `nominateCandidate`, `vouchForCandidate`, `clearNomination`,
  `mintSBTForApproved`, `hashKycResult`, `computeKycHash`.
- Friendly error decoding via `decodeAroError` mapping every custom revert
  to a user-facing message.
- Tree-shake-friendly sub-path exports for `./abis`, `./addresses`,
  `./chains`, `./workflows`, and `./hooks`.
- Address registry pre-populated for Sepolia (live deployment); Base
  Sepolia, Base Mainnet, Ethereum Mainnet, and Hardhat slots reserved.
