# @aromedia/contracts-sdk

TypeScript SDK for the [Aro Media](https://aro.media) on-chain ecosystem. Wraps every contract in [`aromedia-blockchain-contracts`](https://github.com/aromediainc/aromedia-blockchain-contracts) — SBT identity, nomination workflow, RWA security token, assets registry, access manager, multisig, forced-transfer manager — behind a single typed API.

Designed for both server-side use (deploy helpers, indexers, jobs) and the Next.js dapp. React-specific code is gated behind a sub-path so consumers that don't need wagmi don't pull React in.

```bash
npm install @aromedia/contracts-sdk
```

## Quick start

### Core (server, scripts, anything non-React)

```ts
import { createAroSdk, sepolia } from "@aromedia/contracts-sdk";

const sdk = createAroSdk({ chain: sepolia });
const isMember = await sdk.sbt.read.hasSBT([userAddress]);
```

### React / wagmi

```tsx
import { useMembership } from "@aromedia/contracts-sdk/hooks";

const { data, isLoading } = useMembership(account);
// data.step ∈ "needs-wallet" | "needs-nomination" | "needs-vouches"
//           | "needs-kyc" | "needs-admin-mint" | "member"
```

### Onboarding (aligned with the ARO KYC/AML/CFT Policy)

```ts
import {
  describeOnboardingState,
  nominateCandidate,
  vouchForCandidate,
  mintSBTForApproved,
  hashKycResult,
  AroTier,
} from "@aromedia/contracts-sdk";

await nominateCandidate(sdk, candidateAddress);
await vouchForCandidate(sdk, candidateAddress);

const kycHash = hashKycResult({
  provider: "didit",
  sessionId,
  status: "verified",
  verifiedAt,
  walletAddress: candidateAddress,
});

await mintSBTForApproved(sdk, {
  to: candidateAddress,
  kycHash,
  metadataURI: "ipfs://...",
  tier: AroTier.STANDARD,
});
```

## Entry points

| Import path                          | What it gives you                                    |
| :----------------------------------- | :--------------------------------------------------- |
| `@aromedia/contracts-sdk`            | Clients, workflows, utils, types — no React          |
| `@aromedia/contracts-sdk/hooks`      | wagmi React hooks (peer dep on wagmi + react)        |
| `@aromedia/contracts-sdk/abis`       | Raw ABIs only (tree-shake friendly, zero runtime)    |
| `@aromedia/contracts-sdk/addresses`  | Per-chain deployed-address registry                  |
| `@aromedia/contracts-sdk/chains`     | Chain configs the SDK supports                       |
| `@aromedia/contracts-sdk/workflows`  | High-level domain helpers                            |

## Development

### Repository layout

```
aromediainc/
├── sdks/contracts-sdk/                ← this repo
└── aromedia-blockchain-contracts/     ← sibling; source of ABIs + deployment addresses
```

The SDK ships generated ABIs and addresses under `src/generated/`, so installing the published package does NOT require Hardhat. The generator is only needed when contracts change.

### Regenerating from the contracts repo

```bash
# in aromedia-blockchain-contracts/
npm run compile           # rebuild Hardhat artifacts

# in this repo
npm run generate          # reads sibling contracts repo, writes src/generated/
npm run build             # bundle dist/
npm run typecheck
```

You can override the contracts repo location with `CONTRACTS_REPO_PATH`:

```bash
CONTRACTS_REPO_PATH=/path/to/aromedia-blockchain-contracts npm run generate
```

### Releasing

This repo uses [Changesets](https://github.com/changesets/changesets) for semver-driven releases.

1. After your change, run `npm run changeset` and describe the change (`patch` / `minor` / `major`).
2. Commit the resulting file under `.changeset/` alongside your code.
3. When the PR merges to `main`, the `release` workflow opens (or updates) a "Version Packages" PR that consumes pending changesets and bumps the version + CHANGELOG.
4. Merging the Version Packages PR triggers the publish step, which builds and runs `changeset publish` against npm.

### CI

- `ci.yml` — typecheck + build on every PR.
- `release.yml` — Version PR + npm publish on `main`.
- `sync-abis.yml` — nightly job that clones the contracts repo, regenerates ABIs/addresses, and opens a PR if anything changed.

## References

- ARO KYC/AML/CFT Policy v1.0 — onboarding flow, tier definitions, hash anchoring (§6).
- MEMO-KYC-PROVIDER — Didit Protocol selection, webhook → mint pipeline.
- [aromedia-blockchain-contracts](https://github.com/aromediainc/aromedia-blockchain-contracts) — source contracts.

## License

[MIT](./LICENSE) © Aro Media Inc.
