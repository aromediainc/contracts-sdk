---
"@aromedia/contracts-sdk": minor
---

Deprecate `AroNomination_ABI`, `useAroNomination`, and the on-chain nomination
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
