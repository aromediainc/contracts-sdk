import { getContract, type GetContractReturnType, type PublicClient, type WalletClient } from "viem";

import { AroMediaAssetsRegistry_ABI } from "../generated/abis.js";

export type AroAssetsRegistryContract = GetContractReturnType<
  typeof AroMediaAssetsRegistry_ABI,
  { public: PublicClient; wallet?: WalletClient }
>;

export interface AssetsRegistryClientOpts {
  address: `0x${string}`;
  publicClient: PublicClient;
  walletClient?: WalletClient;
}

export function createAssetsRegistryClient(
  opts: AssetsRegistryClientOpts,
): AroAssetsRegistryContract {
  return getContract({
    address: opts.address,
    abi: AroMediaAssetsRegistry_ABI,
    client: opts.walletClient
      ? { public: opts.publicClient, wallet: opts.walletClient }
      : { public: opts.publicClient },
  }) as AroAssetsRegistryContract;
}
