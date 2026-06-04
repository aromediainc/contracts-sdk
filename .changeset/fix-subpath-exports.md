---
"@aromedia/contracts-sdk": patch
---

fix(exports): point the `./abis` and `./addresses` subpath exports at `dist/generated/*`.

The build emits these entries under `dist/generated/` (tsup uses `src/` as the
common base), but the `exports` map referenced `./dist/abis.js` and
`./dist/addresses.js`, which do not exist. Consumers importing
`@aromedia/contracts-sdk/abis` or `/addresses` got a module-resolution error.
The root (`.`) entry already re-exports the same symbols, so this was the only
broken path. No API changes.
