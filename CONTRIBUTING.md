# Contributing to `@aromedia/contracts-sdk`

Thanks for your interest in improving the SDK. This document describes the development workflow, the conventions we follow, and how a change gets from a working tree to a published release.

If anything here is unclear or out of date, open an issue or a PR that fixes it — those are the easiest contributions and the most appreciated.

## Repository layout

```
aromediainc/
├── sdks/contracts-sdk/                ← this repo
│   ├── src/                           ← hand-written source
│   │   ├── clients/                   ← per-contract viem read/write clients
│   │   ├── hooks/                     ← wagmi React hooks (peer dep on wagmi + react)
│   │   ├── workflows/                 ← high-level domain helpers (onboarding, etc.)
│   │   ├── utils/                     ← chain config, hashing, error decoding
│   │   ├── generated/                 ← AUTO-GENERATED ABIs + address registry. Do not hand-edit.
│   │   ├── chains.ts                  ← supported chains
│   │   └── index.ts                   ← root entry point
│   ├── scripts/generate.ts            ← regenerates src/generated/ from the contracts repo
│   ├── .changeset/                    ← pending changesets (one per change set)
│   └── .github/workflows/             ← CI, release, sync-abis
└── aromedia-blockchain-contracts/     ← sibling; source of ABIs + deployment addresses
```

The published package only ships `dist/`, `src/`, `README.md`, and `LICENSE` (see `"files"` in `package.json`). Anything outside that list — scripts, CI, changesets, configs — is repo-only.

## Prerequisites

- **Node 20+** (matches CI; the package itself declares `engines.node >= 18`).
- **npm 10+** (ships with Node 20).
- A local clone of [`aromedia-blockchain-contracts`](https://github.com/aromediainc/aromedia-blockchain-contracts) **only if you need to regenerate ABIs/addresses**. Most contributions don't touch generated code.

## Setup

```bash
git clone git@github.com:aromediainc/contracts-sdk.git
cd contracts-sdk
npm ci
npm run typecheck
npm run build
```

If `npm run build` succeeds and `dist/` is populated, you're set up correctly.

## Day-to-day commands

| Command | What it does |
| :--- | :--- |
| `npm run typecheck` | `tsc --noEmit` over `src/`. Fast feedback, no bundling. |
| `npm run build` | tsup bundle to `dist/` (ESM + CJS + `.d.ts`). Mirrors what CI builds. |
| `npm run dev` | tsup in watch mode for the root entry point. Useful when iterating with a local consumer. |
| `npm run generate` | Regenerate `src/generated/` from the contracts repo. See [Regenerating ABIs](#regenerating-abis-and-addresses). |
| `npm run clean` | Remove `dist/`. |
| `npm run changeset` | Start an interactive changeset for your change. See [Changesets](#changesets). |

## Branching and PR conventions

- Branch off `main`. Name branches `feat/...`, `fix/...`, `chore/...`, or `docs/...` — the prefix isn't enforced, but it makes the PR list easier to scan.
- Keep PRs focused. One conceptual change per PR. Mechanical refactors (renames, formatting passes) belong in their own PRs.
- Reference any related contracts-repo PR in the description if your change tracks a contract change.
- A PR is mergeable when:
  - CI is green (typecheck + build + the `src/generated/` drift check).
  - It includes a changeset for any change that affects published behavior (anything outside docs, CI, internal scripts).
  - At least one maintainer has approved.

## Changesets

Versioning is driven by [Changesets](https://github.com/changesets/changesets). Every change that affects the published surface area needs a changeset.

```bash
npm run changeset
```

Pick the bump level:

- **patch** — bug fixes, doc fixes inside published files, dependency bumps that don't change behavior, regenerated ABIs/addresses with no behavioral consequence.
- **minor** — new exports, new hooks, new workflows, additive changes to existing types.
- **major** — anything that removes a public export, renames a function, narrows a type in a breaking way, or otherwise forces consumers to change their code.

When in doubt, prefer the larger bump. Consumers prefer a surprising version number to a surprising breaking change.

Changes that do **not** require a changeset:

- Edits to files not shipped in the published package (`.github/`, `scripts/`, `tsup.config.ts`, `tsconfig.json`, `CONTRIBUTING.md`, etc.).
- Pure CI tweaks.

If you're unsure, add the changeset — extra ones are easy to drop, missing ones hold up a release.

## Regenerating ABIs and addresses

`src/generated/` is auto-generated from the contracts repo and **must not be hand-edited**. CI fails any PR where `src/generated/` is dirty after a fresh `npm run generate`.

There are two ways to regenerate:

### Locally (when iterating)

```bash
# in aromedia-blockchain-contracts/
npm run compile

# in this repo
CONTRACTS_REPO_PATH=../../aromedia-blockchain-contracts npm run generate
npm run build
npm run typecheck
```

`CONTRACTS_REPO_PATH` is optional if the contracts repo lives at the conventional sibling path. The script looks for `artifacts/contracts/*.sol/*.json` and `ignition/deployments/chain-*/deployed_addresses.json`. Chains with no deployment get `ZERO_ADDRESS` placeholders so the registry shape stays stable.

### Via the `sync-abis` workflow (the supported path)

The `sync-abis` GitHub Actions workflow runs nightly and on manual dispatch. It clones the contracts repo, compiles, regenerates, and opens a PR titled `chore: sync ABIs from contracts repo` with a `patch` changeset.

When you review a sync PR:

1. Look at the diff under `src/generated/`.
2. If the ABI changes are additive (new functions, new events), bump the auto-generated changeset to `minor`.
3. If anything was removed, renamed, or had its signature changed, bump to `major`.
4. Approve + merge.

## Releasing

The repo uses the standard Changesets release flow.

1. PRs land on `main` carrying their own changesets.
2. The `release` workflow opens (or updates) a PR titled **"chore: version packages"** that consumes all pending changesets, bumps `package.json`, and updates `CHANGELOG.md`.
3. Reviewing that PR is reviewing the next release. The diff is exactly what will ship.
4. Merging the Version PR triggers a second run of the `release` workflow, which builds and runs `changeset publish` against npm.

There are no manual `npm publish` steps. If the workflow can't publish, the fix is to make it publish — not to publish from a laptop.

### Required repository secrets

- `NPM_TOKEN` — npm automation token with publish access to the `@aromedia` scope. Used as both `NPM_TOKEN` and `NODE_AUTH_TOKEN` in the release workflow.
- `CONTRACTS_REPO_TOKEN` — only needed if the contracts repo is private; PAT with `repo` scope so `sync-abis` can clone it. If the contracts repo is public, the workflow falls back to `GITHUB_TOKEN` and no secret is required.

## Code style

- TypeScript with `strict` mode. No `any` in published surface area — prefer `unknown` and narrow, or define a proper type.
- Exports are explicit. Avoid `export *` in the root barrel; re-export named symbols so the published `.d.ts` is a documentation source.
- Hooks live in `src/hooks/` and import only from `wagmi`, `viem`, `react`, and the SDK's own modules. They must never import server-only code.
- Workflows in `src/workflows/` are pure functions over a `createAroSdk(...)` instance — no hidden global state.
- Errors thrown by clients should round-trip through `decodeAroError` so the user-facing message is meaningful.

Formatting follows whatever the repo's `prettier` config produces (run via your editor). There's no separate format script in `package.json`; CI does not enforce formatting.

## Reporting bugs

Open a GitHub issue with:

- The SDK version (`@aromedia/contracts-sdk@x.y.z`).
- The chain you're hitting (Sepolia, Base Sepolia, etc.).
- A minimal reproduction — ideally a snippet that calls `createAroSdk(...)` and the offending hook/workflow.
- The full error, including any decoded message from `decodeAroError`.

## Security disclosures

Do not file public issues for security problems. Email `security@aro.media` with details and we'll coordinate from there.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE) covering the rest of the codebase.
