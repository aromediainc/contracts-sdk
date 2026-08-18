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
    AroMediaIncMultiSig: "0xbd4be1a7E2E262E8aa86a9094C84fb6171f41cfD" as `0x${string}`,
    AroMediaAccessManager: "0xfA551cE5ED900C71289CE1695703A8307d5d9C50" as `0x${string}`,
    AroMediaRWA: "0x78d53382E8bbE11E3c4D71Ba3758c64A3501E605" as `0x${string}`,
    AroMediaAssetsRegistry: "0x342614aE69b9197bcDa2F74d501b4483c34F56c3" as `0x${string}`,
    ForcedTransferManager: "0x0F6a7FA9e4353987991258A3e6A61Eb675C09238" as `0x${string}`,
    AroSBT: "0x17b4e7740046B6b976f34996b4F8DA2085763D8c" as `0x${string}`,
    AroNomination: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    cAROUSD: "0x432aD3CE16Fc6058e6fA6C730f40e7bBa0336959" as `0x${string}`,
    AroLiquidityCommitment: "0x1dab83E3ccE56524a70f99A01547C8D43D42cE82" as `0x${string}`,
  },
  11155111: { // sepolia
    AroMediaIncMultiSig: "0x192DDDdE31Cd3d9B0aCA76859D7e22FFb4Eab7a4" as `0x${string}`,
    AroMediaAccessManager: "0xdAeBA557cF4811c6E0d6A0AAd0f73BD053E9AB6E" as `0x${string}`,
    AroMediaRWA: "0x15014fd20111c4Ad8219ed1DC9Bbdb3453AE60aB" as `0x${string}`,
    AroMediaAssetsRegistry: "0x521a1B07C89bc7494Eda6C22acd909B36C2A6fD0" as `0x${string}`,
    ForcedTransferManager: "0x7613e2Bc20E697EBa02Bf7891a96c6857acB5ED3" as `0x${string}`,
    AroSBT: "0x4DdC4C814120AB70A4Bc9C1Cdf3a995e4A0bD7f7" as `0x${string}`,
    AroNomination: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    cAROUSD: "0x5966c30B33D05222D63f359a81910239f594e09C" as `0x${string}`,
    AroLiquidityCommitment: "0xC7F864De358E2571b969FfF461Cc4606A8a30ED2" as `0x${string}`,
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
