import { getContract, type GetContractReturnType, type PublicClient, type WalletClient } from "viem";

import { AroMediaRWA_ABI } from "../generated/abis.js";

export type AroRWAContract = GetContractReturnType<
  typeof AroMediaRWA_ABI,
  { public: PublicClient; wallet?: WalletClient }
>;

export interface RwaClientOpts {
  address: `0x${string}`;
  publicClient: PublicClient;
  walletClient?: WalletClient;
}

export function createRwaClient(opts: RwaClientOpts): AroRWAContract {
  return getContract({
    address: opts.address,
    abi: AroMediaRWA_ABI,
    client: opts.walletClient
      ? { public: opts.publicClient, wallet: opts.walletClient }
      : { public: opts.publicClient },
  }) as AroRWAContract;
}
