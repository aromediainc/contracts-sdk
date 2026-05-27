/**
 * @file Deprecated on-chain nomination hooks.
 *
 * The on-chain `AroNomination` contract is being retired because the
 * on-chain record of nominators and vouchers exposes the social graph of
 * prospective members publicly. The nomination and vouching flow has moved
 * to the admin portal backend (Next.js + Prisma + Postgres); consumers
 * should call its API instead of these hooks.
 *
 * These exports will be removed in a future major release.
 */

import { useReadContract, useWriteContract, type UseReadContractParameters } from "wagmi";

import { AroNomination_ABI } from "../generated/abis.js";
import { useAroAddresses } from "./useAroAddresses.js";

/**
 * Read the full nomination record for a candidate.
 *
 * @deprecated Use the admin portal nomination API. The on-chain nomination
 * contract is being retired; see the file header for migration notes.
 */
export function useNomination(
  candidate: `0x${string}` | undefined,
  opts: Partial<UseReadContractParameters> = {},
) {
  const addrs = useAroAddresses();
  return useReadContract({
    address: addrs?.AroNomination,
    abi: AroNomination_ABI,
    functionName: "getNomination",
    args: candidate ? [candidate] : undefined,
    query: {
      enabled: Boolean(addrs?.AroNomination && candidate),
      ...((opts as { query?: unknown }).query as object | undefined),
    },
    ...opts,
  } as UseReadContractParameters);
}

/**
 * Convenience read: just the status enum, when the dapp only needs to
 * branch on PENDING / APPROVED / CLEARED.
 *
 * @deprecated Use the admin portal nomination API. See file header.
 */
export function useNominationStatus(
  candidate: `0x${string}` | undefined,
  opts: Partial<UseReadContractParameters> = {},
) {
  const addrs = useAroAddresses();
  return useReadContract({
    address: addrs?.AroNomination,
    abi: AroNomination_ABI,
    functionName: "getNominationStatus",
    args: candidate ? [candidate] : undefined,
    query: {
      enabled: Boolean(addrs?.AroNomination && candidate),
      ...((opts as { query?: unknown }).query as object | undefined),
    },
    ...opts,
  } as UseReadContractParameters);
}

/**
 * Current vouch threshold (typically 3 per KYC Policy §6.3).
 *
 * @deprecated Use the admin portal nomination API. See file header.
 */
export function useNominationThreshold(opts: Partial<UseReadContractParameters> = {}) {
  const addrs = useAroAddresses();
  return useReadContract({
    address: addrs?.AroNomination,
    abi: AroNomination_ABI,
    functionName: "threshold",
    query: {
      enabled: Boolean(addrs?.AroNomination),
      ...((opts as { query?: unknown }).query as object | undefined),
    },
    ...opts,
  } as UseReadContractParameters);
}

/**
 * Whether `voucher` has already vouched for `candidate`.
 *
 * @deprecated Use the admin portal nomination API. See file header.
 */
export function useHasVouched(
  voucher: `0x${string}` | undefined,
  candidate: `0x${string}` | undefined,
  opts: Partial<UseReadContractParameters> = {},
) {
  const addrs = useAroAddresses();
  return useReadContract({
    address: addrs?.AroNomination,
    abi: AroNomination_ABI,
    functionName: "hasVouched",
    args: voucher && candidate ? [voucher, candidate] : undefined,
    query: {
      enabled: Boolean(addrs?.AroNomination && voucher && candidate),
      ...((opts as { query?: unknown }).query as object | undefined),
    },
    ...opts,
  } as UseReadContractParameters);
}

/**
 * Write hook returning `writeContractAsync` for nominate/vouch/clear.
 *
 * @deprecated Use the admin portal nomination API. See file header.
 */
export function useNominationWriter() {
  return useWriteContract();
}
