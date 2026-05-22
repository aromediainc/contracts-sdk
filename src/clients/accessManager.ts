import { getContract, type GetContractReturnType, type PublicClient, type WalletClient } from "viem";

import { AroMediaAccessManager_ABI } from "../generated/abis.js";

export type AroAccessManagerContract = GetContractReturnType<
  typeof AroMediaAccessManager_ABI,
  { public: PublicClient; wallet?: WalletClient }
>;

export interface AccessManagerClientOpts {
  address: `0x${string}`;
  publicClient: PublicClient;
  walletClient?: WalletClient;
}

export function createAccessManagerClient(
  opts: AccessManagerClientOpts,
): AroAccessManagerContract {
  return getContract({
    address: opts.address,
    abi: AroMediaAccessManager_ABI,
    client: opts.walletClient
      ? { public: opts.publicClient, wallet: opts.walletClient }
      : { public: opts.publicClient },
  }) as AroAccessManagerContract;
}

/**
 * Role IDs as defined in AroMediaAccessManager.sol. Mirroring them here
 * lets the dapp grant/revoke without re-reading the contract just to know
 * which uint64 corresponds to which role.
 */
export const AroRoles = {
  ORG_ADMIN: 0n,
  PROTOCOL_ADMIN: 1n,
  TREASURY_CONTROLLER: 2n,
  MARKET_MAKER: 3n,
  MINTER: 4n,
} as const;

export type AroRoleName = keyof typeof AroRoles;
