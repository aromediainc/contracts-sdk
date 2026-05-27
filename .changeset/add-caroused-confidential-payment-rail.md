---
"@aromedia/contracts-sdk": minor
---

Add `cAROUSD` confidential payment rail exports.

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
