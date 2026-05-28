---
"@aromedia/contracts-sdk": patch
---

AccessManager ABI: `wireAllContracts` is now 4 args (rwaToken,
assetsRegistry, forcedTransferManager, sbt) and `wireNomination` was
removed, since AroNomination is deprecated and no longer deployed
(contracts commit `27a96ec`). Regenerate via `npm run generate` to refresh
the AccessManager ABI export.
