// AUTO-GENERATED FILE — DO NOT EDIT BY HAND
// Source of truth: packages/sdk/scripts/generate.ts
// Re-run with `npm run sdk:generate` from the repo root.

import type { AroContractName } from "./abis.js";

/** Reserved when a contract is not yet deployed on a chain. */
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export const SUPPORTED_CHAIN_IDS = [
  1, // ethereum
  11155111, // sepolia
  8453, // base
  84532, // baseSepolia
  31337, // hardhat
] as const;

export type AroChainId = (typeof SUPPORTED_CHAIN_IDS)[number];

/**
 * Deployed contract addresses, keyed by EVM chainId then by contract name.
 * Entries set to ZERO_ADDRESS indicate the contract has not been deployed
 * to that chain yet — callers should treat ZERO_ADDRESS as "no deployment".
 */
export const addresses: Record<AroChainId, Record<AroContractName, `0x${string}`>> = {
  1: { // ethereum
    AroMediaIncMultiSig: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaAccessManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaRWA: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaAssetsRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    ForcedTransferManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroSBT: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroNomination: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    cAROUSD: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroLiquidityCommitment: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  11155111: { // sepolia
    AroMediaIncMultiSig: "0x6527c5F8F713435CfFB3CcCEF8E5A6DF0F3CFB20" as `0x${string}`,
    AroMediaAccessManager: "0x6b8600FaD1549D7bBa9A7Dd40e0f7D1cf2046168" as `0x${string}`,
    AroMediaRWA: "0x723a7F57bF2d23011f584Eb155a9f7AEbCfCaf12" as `0x${string}`,
    AroMediaAssetsRegistry: "0xa0ccaAAaCC7A97F0aFa7fa9db5B0a09EB8933f9d" as `0x${string}`,
    ForcedTransferManager: "0xcEa2CD3ceB141Ac18F38DBBD018C8d77feF44fA6" as `0x${string}`,
    AroSBT: "0xE4151d629aC7cfe05f00bC593426e80cD6e6fde3" as `0x${string}`,
    AroNomination: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    cAROUSD: "0xa76BBE008611a9416e709b712b3f72fB0D000Fc2" as `0x${string}`,
    AroLiquidityCommitment: "0xe744c518Fc436FFE55e2fb84F1a2F6B921e6f5d4" as `0x${string}`,
  },
  8453: { // base
    AroMediaIncMultiSig: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaAccessManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaRWA: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaAssetsRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    ForcedTransferManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroSBT: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroNomination: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    cAROUSD: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroLiquidityCommitment: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  84532: { // baseSepolia
    AroMediaIncMultiSig: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaAccessManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaRWA: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaAssetsRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    ForcedTransferManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroSBT: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroNomination: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    cAROUSD: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroLiquidityCommitment: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  31337: { // hardhat
    AroMediaIncMultiSig: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaAccessManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaRWA: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroMediaAssetsRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    ForcedTransferManager: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroSBT: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroNomination: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    cAROUSD: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroLiquidityCommitment: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
};

/** Convenience labels by chainId. */
export const chainLabels: Record<AroChainId, string> = {
  1: "ethereum",
  11155111: "sepolia",
  8453: "base",
  84532: "baseSepolia",
  31337: "hardhat",
};

/** Look up a single address — throws if chain or contract is unknown. */
export function getAddress(chainId: AroChainId, contract: AroContractName): `0x${string}` {
  const row = addresses[chainId];
  if (!row) throw new Error(`Unsupported chainId ${chainId}`);
  const addr = row[contract];
  if (!addr || addr === ZERO_ADDRESS) {
    throw new Error(`${contract} not deployed on chain ${chainId}`);
  }
  return addr;
}
