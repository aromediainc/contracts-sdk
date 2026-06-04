---
"@aromedia/contracts-sdk": patch
---

Fix `tier` type mismatches in the onboarding workflow. `AroSBT.getMemberData`
returns `tier` as a `uint256` (viem `bigint`), so the internal cast and the
`mint` call now use `bigint` and convert to `number` only for the public
`MembershipStatus.tier` field. Resolves the DTS build errors (TS2352/TS2322).
