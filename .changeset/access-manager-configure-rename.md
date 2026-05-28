---
"@aromedia/contracts-sdk": patch
---

AccessManager ABI: the `wire*` permission-configuration functions were
renamed to `configureAccessControlFor*` (contracts commit `eb9541e`):
`wireRWAToken` -> `configureAccessControlForRWAToken`,
`wireForcedTransferManager` -> `configureAccessControlForForcedTransferManager`,
`wireAssetsRegistry` -> `configureAccessControlForAssetsRegistry`,
`wireSBT` -> `configureAccessControlForSBT`,
`wireAllContracts` -> `configureAccessControlForAllContracts`. Regenerate
via `npm run generate` to refresh the AccessManager ABI export.
