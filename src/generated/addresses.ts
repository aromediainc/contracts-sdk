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
    AroMediaIncMultiSig: "0x8d2A0721f124464B8937994D5F72cFec180F314B" as `0x${string}`,
    AroMediaAccessManager: "0x3BA2b821354921dBD9509583d5B319105c70eD03" as `0x${string}`,
    AroMediaRWA: "0xa5292d74f8baCF0A3e68302F2CA8032bc9F6765b" as `0x${string}`,
    AroMediaAssetsRegistry: "0x17d9Dc6a0c8D043058193C836ed001235bACE5fe" as `0x${string}`,
    ForcedTransferManager: "0x92D447b7E585B48CA405DbAaFe0a6C1D0682678c" as `0x${string}`,
    AroSBT: "0xc1562aD0232271Bb3F5D0E555F43AD645C3A5dAf" as `0x${string}`,
    AroNomination: "0xF86305E1B89C778a8f92Eb6510138865a97842F8" as `0x${string}`,
    cAROUSD: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    AroLiquidityCommitment: "0x0000000000000000000000000000000000000000" as `0x${string}`,
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
