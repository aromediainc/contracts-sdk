# @aromedia/contracts-sdk

## 1.0.0

### Major Changes

- [`b3d95ab`](https://github.com/aromediainc/contracts-sdk/commit/b3d95ab26d963a8539936b54f3c36627e9b69223) Thanks [@zaghadon](https://github.com/zaghadon)! - AroSBT: opaque `uint256` tiers and candidate-triggered `mintWithApproval`.

  Two AroSBT contract changes (commits `b55bbd0`, `7b20237`) that consumers
  must pick up via `npm run generate`:

  1. Tier is now an opaque `uint256` instead of the `Tier` enum. The
     `AroTier` enum export becomes a plain numeric label whose meaning is
     defined off-chain in the admin backend. `mint(...,uint256)` and
     `setTier(uint256,uint256)` selectors changed. Update `src/utils/tiers.ts`
     so tier metadata (labels, requirements) is sourced from off-chain config
     rather than a hardcoded enum.

  2. New `mintWithApproval(MintApproval approval, bytes signature)` for the
     candidate-triggered mint. Add a typed helper + hook that builds the
     EIP-712 `MintApproval` payload (domain: name "AroSBT", version "1") and
     calls the function. The admin portal issues the voucher; the dapp signs
     nothing here, it just submits the approver's signature.

  BREAKING: the tier type change alters ABIs and the `AroTier` shape. Bumps
  the SDK to its next 0.x minor once `changeset version` runs.

### Minor Changes

- [`e0915f0`](https://github.com/aromediainc/contracts-sdk/commit/e0915f0823fb0b16b17be8af15908c32f313c699) Thanks [@zaghadon](https://github.com/zaghadon)! - Add `cAROUSD` confidential payment rail exports.

  The `cAROUSD` (Aro confidential USD) contract was added to the contracts repo
  in `feat(confidential): add cAROUSD confidential payment rail` (commit
  `2d8c33a`) but had not been picked up into the SDK. Run `npm run generate` to
  regenerate `src/generated/abis.ts` and `src/generated/addresses.ts` with the
  new contract, then export the ABI and address helpers from `src/index.ts`
  alongside the other contracts.

  Forthcoming in a follow-up changeset:

  - AroSBT: `mintWithApproval` for candidate-triggered minting against an
    EIP-712 voucher (see [[aro-admin-onboarding-flow]] migration).
  - Multisig: address refresh after the broken Sepolia deployment is replaced
    (see the `fix(multisig)` series in the contracts repo).

- [`0e842c2`](https://github.com/aromediainc/contracts-sdk/commit/0e842c25e867c3dcffdde9d4e468842a3f20f141) Thanks [@zaghadon](https://github.com/zaghadon)! - Deprecate `AroNomination_ABI`, `useAroNomination`, and the on-chain nomination
  workflow exports.

  The on-chain nomination and vouching flow is being moved to the admin backend
  because the on-chain nominator/voucher record exposes the social graph of
  prospective members publicly. The contract is marked deprecated in the
  contracts repo (`docs(nomination)` commit `c58065d`); SDK consumers should
  migrate to the admin portal API.

  This release flags the exports as deprecated but does not remove them. A
  future major-bump release will remove `AroNomination_ABI`, the
  `useAroNomination` hook, and the on-chain `onboarding`/`nomination` workflow
  helpers once the dapp and admin portal have migrated.

  Migration path: see the admin portal's nomination API once it lands. The
  candidate-triggered SBT mint will use an EIP-712 approval voucher
  (`mintWithApproval` on `AroSBT`).

### Patch Changes

- [`4cbc263`](https://github.com/aromediainc/contracts-sdk/commit/4cbc26353afa6cdf0d241336a5c974fc5f4cb657) Thanks [@zaghadon](https://github.com/zaghadon)! - AccessManager ABI: the `wire*` permission-configuration functions were
  renamed to `configureAccessControlFor*` (contracts commit `eb9541e`):
  `wireRWAToken` -> `configureAccessControlForRWAToken`,
  `wireForcedTransferManager` -> `configureAccessControlForForcedTransferManager`,
  `wireAssetsRegistry` -> `configureAccessControlForAssetsRegistry`,
  `wireSBT` -> `configureAccessControlForSBT`,
  `wireAllContracts` -> `configureAccessControlForAllContracts`. Regenerate
  via `npm run generate` to refresh the AccessManager ABI export.

- [`a957927`](https://github.com/aromediainc/contracts-sdk/commit/a9579271e94663720965241de7f1c0e33ffb2269) Thanks [@zaghadon](https://github.com/zaghadon)! - AccessManager ABI: `wireAllContracts` is now 4 args (rwaToken,
  assetsRegistry, forcedTransferManager, sbt) and `wireNomination` was
  removed, since AroNomination is deprecated and no longer deployed
  (contracts commit `27a96ec`). Regenerate via `npm run generate` to refresh
  the AccessManager ABI export.

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
