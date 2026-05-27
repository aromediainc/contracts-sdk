---
"@aromedia/contracts-sdk": major
---

AroSBT: opaque `uint256` tiers and candidate-triggered `mintWithApproval`.

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
