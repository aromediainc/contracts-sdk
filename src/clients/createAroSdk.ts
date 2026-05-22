import {
  createPublicClient,
  http,
  type Chain,
  type PublicClient,
  type Transport,
  type WalletClient,
} from "viem";

import { addresses, getAddress, type AroChainId } from "../generated/addresses.js";
import { createAccessManagerClient, type AroAccessManagerContract } from "./accessManager.js";
import { createAssetsRegistryClient, type AroAssetsRegistryContract } from "./assetsRegistry.js";
import { createForcedTransferClient, type ForcedTransferManagerContract } from "./forcedTransfer.js";
import { createMultiSigClient, type AroMultiSigContract } from "./multisig.js";
import { createNominationClient, type AroNominationContract } from "./nomination.js";
import { createRwaClient, type AroRWAContract } from "./rwa.js";
import { createSbtClient, type AroSBTContract } from "./sbt.js";

/**
 * Per-contract address overrides. Useful for:
 *   • local Hardhat where ignition deployments aren't picked up at build time
 *   • staging deployments living outside of `ignition/deployments`
 *   • forked-network testing where contracts are at non-canonical addresses
 */
export type AroAddressOverrides = Partial<Record<
  | "AroSBT"
  | "AroNomination"
  | "AroMediaRWA"
  | "AroMediaAssetsRegistry"
  | "AroMediaAccessManager"
  | "AroMediaIncMultiSig"
  | "ForcedTransferManager",
  `0x${string}`
>>;

export interface CreateAroSdkOpts {
  /** Target chain. Must be a chainId the SDK knows about. */
  chain: Chain & { id: AroChainId };
  /** viem transport — defaults to `http()` against the chain's default RPC. */
  transport?: Transport;
  /** Optional wallet client for state-changing calls. */
  walletClient?: WalletClient;
  /** Override one or more contract addresses (local dev, staging, etc.). */
  overrides?: AroAddressOverrides;
}

export interface AroSdk {
  chainId: AroChainId;
  publicClient: PublicClient;
  walletClient?: WalletClient;
  /** Soulbound identity token. */
  sbt: AroSBTContract;
  /** Nomination + vouching workflow. */
  nomination: AroNominationContract;
  /** RWA security token (ARO). */
  rwa: AroRWAContract;
  /** ERC-721 assets registry. */
  assetsRegistry: AroAssetsRegistryContract;
  /** Centralized AccessManager (role grants/revokes). */
  accessManager: AroAccessManagerContract;
  /** ERC-7913 multi-sig smart-contract wallet. */
  multiSig: AroMultiSigContract;
  /** Regulator-driven forced transfer workflow. */
  forcedTransfer: ForcedTransferManagerContract;
  /** Resolve a contract address from the registry (with overrides applied). */
  addressOf: (name: keyof AroAddressOverrides) => `0x${string}`;
}

/**
 * The single entry point most consumers reach for. Returns a bundle of
 * typed contract handles bound to a viem PublicClient (and optionally a
 * WalletClient for writes).
 *
 * @example
 *   const sdk = createAroSdk({
 *     chain: sepolia as Chain & { id: 11155111 },
 *     walletClient,
 *   });
 *   const isMember = await sdk.sbt.read.hasSBT([userAddress]);
 *   if (!isMember) await sdk.nomination.write.nominate([userAddress]);
 */
export function createAroSdk(opts: CreateAroSdkOpts): AroSdk {
  const chainId = opts.chain.id;
  const overrides = opts.overrides ?? {};

  // Build a default PublicClient if the caller didn't pass a transport. We
  // intentionally do NOT bind a walletClient here — wallet state is the
  // dapp's concern, the SDK just consumes whatever it's given.
  const publicClient = createPublicClient({
    chain: opts.chain,
    transport: opts.transport ?? http(),
  });

  const resolve = (name: keyof AroAddressOverrides): `0x${string}` => {
    return overrides[name] ?? getAddress(chainId, name);
  };

  return {
    chainId,
    publicClient,
    walletClient: opts.walletClient,
    sbt: createSbtClient({
      address: resolve("AroSBT"),
      publicClient,
      walletClient: opts.walletClient,
    }),
    nomination: createNominationClient({
      address: resolve("AroNomination"),
      publicClient,
      walletClient: opts.walletClient,
    }),
    rwa: createRwaClient({
      address: resolve("AroMediaRWA"),
      publicClient,
      walletClient: opts.walletClient,
    }),
    assetsRegistry: createAssetsRegistryClient({
      address: resolve("AroMediaAssetsRegistry"),
      publicClient,
      walletClient: opts.walletClient,
    }),
    accessManager: createAccessManagerClient({
      address: resolve("AroMediaAccessManager"),
      publicClient,
      walletClient: opts.walletClient,
    }),
    multiSig: createMultiSigClient({
      address: resolve("AroMediaIncMultiSig"),
      publicClient,
      walletClient: opts.walletClient,
    }),
    forcedTransfer: createForcedTransferClient({
      address: resolve("ForcedTransferManager"),
      publicClient,
      walletClient: opts.walletClient,
    }),
    addressOf: resolve,
  };
}

/** Helper: peek at the address registry without instantiating an SDK. */
export function addressesFor(chainId: AroChainId): Record<keyof AroAddressOverrides, `0x${string}`> {
  return addresses[chainId];
}
