import { base, baseSepolia, hardhat, mainnet, sepolia } from "viem/chains";
import type { Chain } from "viem";

import type { AroChainId } from "./generated/addresses.js";

/**
 * Chains the SDK has first-class support for. Re-exported from viem to keep
 * the consumer's chain instance identical to ours — this matters because
 * wagmi keys its provider registry by chain object identity.
 */
export const aroChains = {
  mainnet,
  sepolia,
  base,
  baseSepolia,
  hardhat,
} as const;

export type AroChainLabel = keyof typeof aroChains;

/** Map from chainId → viem chain. */
export const chainById: Record<AroChainId, Chain> = {
  1: mainnet,
  11155111: sepolia,
  8453: base,
  84532: baseSepolia,
  31337: hardhat,
};

/**
 * The chain we treat as the production deployment target. Sepolia today;
 * flip to `base` or `mainnet` once the contracts are deployed there.
 */
export const DEFAULT_CHAIN: Chain = sepolia;

export function getChain(chainId: AroChainId): Chain {
  const chain = chainById[chainId];
  if (!chain) throw new Error(`Unsupported chainId ${chainId}`);
  return chain;
}

export { mainnet, sepolia, base, baseSepolia, hardhat };
