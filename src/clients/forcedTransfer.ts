import { getContract, type GetContractReturnType, type PublicClient, type WalletClient } from "viem";

import { ForcedTransferManager_ABI } from "../generated/abis.js";

export type ForcedTransferManagerContract = GetContractReturnType<
  typeof ForcedTransferManager_ABI,
  { public: PublicClient; wallet?: WalletClient }
>;

export interface ForcedTransferClientOpts {
  address: `0x${string}`;
  publicClient: PublicClient;
  walletClient?: WalletClient;
}

export function createForcedTransferClient(
  opts: ForcedTransferClientOpts,
): ForcedTransferManagerContract {
  return getContract({
    address: opts.address,
    abi: ForcedTransferManager_ABI,
    client: opts.walletClient
      ? { public: opts.publicClient, wallet: opts.walletClient }
      : { public: opts.publicClient },
  }) as ForcedTransferManagerContract;
}
