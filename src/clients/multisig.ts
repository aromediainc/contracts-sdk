import { getContract, type GetContractReturnType, type PublicClient, type WalletClient } from "viem";

import { AroMediaIncMultiSig_ABI } from "../generated/abis.js";

export type AroMultiSigContract = GetContractReturnType<
  typeof AroMediaIncMultiSig_ABI,
  { public: PublicClient; wallet?: WalletClient }
>;

export interface MultiSigClientOpts {
  address: `0x${string}`;
  publicClient: PublicClient;
  walletClient?: WalletClient;
}

export function createMultiSigClient(opts: MultiSigClientOpts): AroMultiSigContract {
  return getContract({
    address: opts.address,
    abi: AroMediaIncMultiSig_ABI,
    client: opts.walletClient
      ? { public: opts.publicClient, wallet: opts.walletClient }
      : { public: opts.publicClient },
  }) as AroMultiSigContract;
}
