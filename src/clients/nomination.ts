import { getContract, type GetContractReturnType, type PublicClient, type WalletClient } from "viem";

import { AroNomination_ABI } from "../generated/abis.js";

export type AroNominationContract = GetContractReturnType<
  typeof AroNomination_ABI,
  { public: PublicClient; wallet?: WalletClient }
>;

export interface NominationClientOpts {
  address: `0x${string}`;
  publicClient: PublicClient;
  walletClient?: WalletClient;
}

export function createNominationClient(opts: NominationClientOpts): AroNominationContract {
  return getContract({
    address: opts.address,
    abi: AroNomination_ABI,
    client: opts.walletClient
      ? { public: opts.publicClient, wallet: opts.walletClient }
      : { public: opts.publicClient },
  }) as AroNominationContract;
}
