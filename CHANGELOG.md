# @aromedia/contracts-sdk

## 0.2.0

### Minor Changes

- [`d6b6bfa`](https://github.com/aromediainc/contracts-sdk/commit/d6b6bfa4c9d84c5b3d758eeb8f81cde943f4fa0c) Thanks [@zaghadon](https://github.com/zaghadon)! - Initial public release.

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
