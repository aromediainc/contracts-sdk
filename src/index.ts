/**
 * @aromedia/contracts-sdk — TypeScript SDK for the Aro Media on-chain ecosystem.
 *
 * Designed for both server-side scripts (deploy helpers, indexers, jobs)
 * and the Next.js dapp. React-specific code is exposed via the `./hooks`
 * sub-path so that consumers that don't need wagmi don't pull React in.
 */

// Generated metadata (ABIs, addresses, enums).
export {
  abis,
  AroSBT_ABI,
  AroMediaRWA_ABI,
  AroMediaAssetsRegistry_ABI,
  AroMediaAccessManager_ABI,
  AroMediaIncMultiSig_ABI,
  ForcedTransferManager_ABI,
  cAROUSD_ABI,
  AroLiquidityCommitment_ABI,
} from "./generated/abis.js";
/**
 * @deprecated The on-chain `AroNomination` contract is being retired in
 * favor of an admin-portal backend flow. This export will be removed in a
 * future major release. See the migration notes in
 * `src/hooks/useAroNomination.ts`.
 */
export { AroNomination_ABI } from "./generated/abis.js";
export type { AroContractName } from "./generated/abis.js";
export {
  addresses,
  chainLabels,
  getAddress,
  ZERO_ADDRESS,
  SUPPORTED_CHAIN_IDS,
} from "./generated/addresses.js";
export type { AroChainId } from "./generated/addresses.js";
export {
  AroTier,
  AroTierLabels,
  ForcedTransferStatus,
  ForcedTransferStatusLabels,
} from "./generated/types.js";
/**
 * @deprecated Tracks on-chain nomination state. The on-chain nomination flow
 * is being retired (see `AroNomination_ABI` deprecation). Use the admin
 * portal API status values instead.
 */
export { NominationStatus, NominationStatusLabels } from "./generated/types.js";

// Chains
export {
  aroChains,
  chainById,
  DEFAULT_CHAIN,
  getChain,
  mainnet,
  sepolia,
  base,
  baseSepolia,
  hardhat,
} from "./chains.js";
export type { AroChainLabel } from "./chains.js";

// Clients
export * from "./clients/index.js";

// Workflows
export * from "./workflows/index.js";

// Utilities
export { computeKycHash, type KycPayload } from "./utils/kycHash.js";
export { tierAtLeast, tierLabel, tierRequirements } from "./utils/tiers.js";
export { decodeAroError, AroContractError } from "./utils/errors.js";
