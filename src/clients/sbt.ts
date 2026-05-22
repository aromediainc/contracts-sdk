import { getContract, type GetContractReturnType, type PublicClient, type WalletClient } from "viem";

import { AroSBT_ABI } from "../generated/abis.js";

/**
 * Typed viem contract handle for AroSBT.
 *
 * Use `read.hasSBT(address)`, `read.getMemberData(address)`, etc. for views;
 * `write.mint(...)`, `write.revoke(...)`, etc. for state-changing calls when
 * a wallet client is bound.
 */
export type AroSBTContract = GetContractReturnType<
  typeof AroSBT_ABI,
  { public: PublicClient; wallet?: WalletClient }
>;

export interface SbtClientOpts {
  address: `0x${string}`;
  publicClient: PublicClient;
  walletClient?: WalletClient;
}

/**
 * Bind the AroSBT ABI to its deployed address and the caller's viem
 * clients. The returned object is a thin proxy — calling `client.read.x`
 * preserves full type inference from the ABI.
 */
export function createSbtClient(opts: SbtClientOpts): AroSBTContract {
  return getContract({
    address: opts.address,
    abi: AroSBT_ABI,
    client: opts.walletClient
      ? { public: opts.publicClient, wallet: opts.walletClient }
      : { public: opts.publicClient },
  }) as AroSBTContract;
}
