import { useMemo } from "react";
import { useReadContracts } from "wagmi";

import { AroNomination_ABI } from "../generated/abis.js";
import { AroSBT_ABI } from "../generated/abis.js";
import { AroTier, NominationStatus } from "../generated/types.js";
import type { OnboardingState, OnboardingStep } from "../workflows/onboarding.js";
import { useAroAddresses } from "./useAroAddresses.js";

/**
 * The hook the access-gate page reaches for. Batches the three reads it
 * needs (hasSBT, nomination, threshold) into a single multicall and
 * returns a derived OnboardingState matching `describeOnboardingState`
 * from the workflows module — but reactive instead of a one-shot read.
 */
export function useMembership(wallet: `0x${string}` | undefined): {
  data?: OnboardingState;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} {
  const addrs = useAroAddresses();

  const reads = useReadContracts({
    contracts:
      addrs && wallet
        ? [
            {
              address: addrs.AroSBT,
              abi: AroSBT_ABI,
              functionName: "hasSBT",
              args: [wallet],
            },
            {
              address: addrs.AroNomination,
              abi: AroNomination_ABI,
              functionName: "getNomination",
              args: [wallet],
            },
            {
              address: addrs.AroNomination,
              abi: AroNomination_ABI,
              functionName: "threshold",
            },
            {
              address: addrs.AroSBT,
              abi: AroSBT_ABI,
              functionName: "getMemberData",
              args: [wallet],
            },
          ]
        : [],
    query: { enabled: Boolean(addrs && wallet) },
  });

  const data = useMemo<OnboardingState | undefined>(() => {
    if (!wallet) return { step: "needs-wallet", membership: { hasSBT: false } };
    if (!reads.data) return undefined;

    const [hasSBTResult, nomResult, thresholdResult, memberDataResult] = reads.data;
    const hasSBT = (hasSBTResult?.result as boolean) ?? false;

    if (hasSBT) {
      const md = memberDataResult?.result as
        | {
            memberId: bigint;
            issuanceDate: bigint;
            tier: bigint; // uint256 since the Tier enum was retired
            kycHash: `0x${string}`;
          }
        | undefined;
      return {
        step: "member" as OnboardingStep,
        membership: {
          hasSBT: true,
          tier: md?.tier,
          memberId: md?.memberId,
          issuanceDate: md?.issuanceDate,
          kycHash: md?.kycHash,
        },
      };
    }

    const nomTuple = nomResult?.result as
      | [`0x${string}`, readonly `0x${string}`[], bigint, number]
      | undefined;
    const threshold = thresholdResult?.result as bigint | undefined;

    if (!nomTuple || threshold === undefined) {
      return { step: "needs-nomination", membership: { hasSBT: false } };
    }

    const [nominator, vouchers, nominatedAt, status] = nomTuple;
    const thresholdN = Number(threshold);
    const voucherCount = vouchers.length;
    const snapshot = {
      status: status as NominationStatus,
      nominator,
      vouchers,
      nominatedAt,
      voucherCount,
      threshold: thresholdN,
      remaining: Math.max(0, thresholdN - voucherCount),
      ready: status === NominationStatus.APPROVED,
    };

    let step: OnboardingStep = "needs-nomination";
    if (snapshot.status === NominationStatus.PENDING) step = "needs-vouches";
    else if (snapshot.status === NominationStatus.APPROVED) step = "needs-kyc";

    return { step, membership: { hasSBT: false }, nomination: snapshot };
  }, [reads.data, wallet]);

  return {
    data,
    isLoading: reads.isLoading,
    isError: reads.isError,
    refetch: reads.refetch,
  };
}
