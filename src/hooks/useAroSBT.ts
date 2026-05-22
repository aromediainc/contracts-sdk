import { useReadContract, useWriteContract, type UseReadContractParameters } from "wagmi";

import { AroSBT_ABI } from "../generated/abis.js";
import { useAroAddresses } from "./useAroAddresses.js";

/**
 * Read whether an address holds an SBT. Returns `undefined` while loading
 * and `false` if the address has been confirmed as a non-member.
 */
export function useHasSBT(
  account: `0x${string}` | undefined,
  opts: Partial<UseReadContractParameters> = {},
) {
  const addrs = useAroAddresses();
  return useReadContract({
    address: addrs?.AroSBT,
    abi: AroSBT_ABI,
    functionName: "hasSBT",
    args: account ? [account] : undefined,
    query: {
      enabled: Boolean(addrs?.AroSBT && account),
      ...((opts as { query?: unknown }).query as object | undefined),
    },
    ...opts,
  } as UseReadContractParameters);
}

/**
 * Decoded MemberData for an address. Throws on-chain if the address has
 * no SBT, so the dapp should only call this after `useHasSBT` returns true.
 */
export function useMemberData(
  account: `0x${string}` | undefined,
  opts: Partial<UseReadContractParameters> = {},
) {
  const addrs = useAroAddresses();
  return useReadContract({
    address: addrs?.AroSBT,
    abi: AroSBT_ABI,
    functionName: "getMemberData",
    args: account ? [account] : undefined,
    query: {
      enabled: Boolean(addrs?.AroSBT && account),
      ...((opts as { query?: unknown }).query as object | undefined),
    },
    ...opts,
  } as UseReadContractParameters);
}

/**
 * Admin write hook for minting an SBT. The contract gates this behind
 * ROLE_MINTER, so the caller's wallet must be a holder of that role —
 * the dapp's UI should hide this control for non-admin users.
 */
export function useMintSBT() {
  return useWriteContract();
}
