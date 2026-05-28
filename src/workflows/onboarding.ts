import type { Account, Hex, WalletClient } from "viem";

import type { AroSdk } from "../clients/createAroSdk.js";
import { AroNomination_ABI, AroSBT_ABI } from "../generated/abis.js";
import { AroTier, NominationStatus } from "../generated/types.js";
import { decodeAroError } from "../utils/errors.js";

/**
 * Onboarding workflow helpers.
 *
 * STATUS: The on-chain nomination + admin-mint helpers below are
 * @deprecated and slated for removal in a future major release. The
 * nomination flow has moved to the admin backend (see the admin portal's
 * /access-control + onboarding API), and SBT minting is now
 * candidate-triggered against an EIP-712 voucher
 * (`AroSBT.mintWithApproval`; see `../utils/mintApproval.ts` and
 * `../hooks/useAroSBT.ts::useMintWithApproval`). The on-chain
 * `AroNomination` contract is retained on Sepolia for compatibility but
 * is no longer deployed to new networks.
 *
 * Status-read helpers (`checkMembershipStatus`, `describeOnboardingState`)
 * remain useful regardless of the underlying flow and are NOT deprecated.
 *
 * Original mental model (kept for reference; pre-migration):
 *
 *   1. Existing member calls `nominateCandidate(candidate)`.
 *      The nominator's vouch counts as the first vouch automatically.
 *
 *   2. Other existing members call `vouchForCandidate(candidate)`. Each
 *      vouch increments the count; once `threshold` is reached (3 per
 *      policy), the nomination moves to APPROVED.
 *
 *   3. Off-chain: candidate completes Didit KYC (per MEMO-KYC-PROVIDER).
 *      Webhook posts back the verification result.
 *
 *   4. Compliance Officer reviews and either rejects (`clearNomination`)
 *      or mints the SBT (`mintSBTForApproved`) with the KYC hash.
 *
 *   5. SBT minted → AccessManager grants member roles → access unlocked.
 *
 * The write paths use `walletClient.writeContract` directly rather than
 * the typed contract `.write` namespace. This is intentional: viem
 * narrows the contract handle's write surface away when the SDK is
 * instantiated without a walletClient, but workflows are run on demand
 * after the dapp's wallet connects.
 */

export interface MembershipStatus {
  hasSBT: boolean;
  /**
   * Opaque tier id (uint256) as returned by AroSBT.getMemberData. Compare
   * with `tierLabel`, `tierAtLeast`, or the AroTier enum values for the
   * conventional defaults; semantics live off-chain in the admin backend.
   */
  tier?: bigint;
  tokenId?: bigint;
  memberId?: bigint;
  issuanceDate?: bigint;
  kycHash?: `0x${string}`;
}

/**
 * One-call read for the dapp's access-gate page. Returns whether the
 * connected wallet holds an SBT and, if so, decoded member data.
 *
 * Implementation note: reads are issued via `publicClient.readContract`
 * with the ABI rather than the typed contract instance's `.read`
 * namespace. viem ≥2.50 narrows `contract.read.*` based on whether a
 * walletClient was bound at construction time; bypassing that gives us a
 * stable, version-independent signature.
 */
export async function checkMembershipStatus(
  sdk: AroSdk,
  account: `0x${string}`,
): Promise<MembershipStatus> {
  const sbtAddress = sdk.addressOf("AroSBT");

  const hasSBT = (await sdk.publicClient.readContract({
    address: sbtAddress,
    abi: AroSBT_ABI,
    functionName: "hasSBT",
    args: [account],
  })) as boolean;
  if (!hasSBT) return { hasSBT: false };

  const tokenId = (await sdk.publicClient.readContract({
    address: sbtAddress,
    abi: AroSBT_ABI,
    functionName: "tokenOfMember",
    args: [account],
  })) as bigint;
  const data = (await sdk.publicClient.readContract({
    address: sbtAddress,
    abi: AroSBT_ABI,
    functionName: "getMemberData",
    args: [account],
  })) as {
    memberId: bigint;
    issuanceDate: bigint;
    tier: bigint; // uint256 since the Tier enum was retired; semantics off-chain
    kycHash: `0x${string}`;
  };

  return {
    hasSBT: true,
    tokenId,
    tier: data.tier,
    memberId: data.memberId,
    issuanceDate: data.issuanceDate,
    kycHash: data.kycHash,
  };
}

export interface NominationSnapshot {
  status: NominationStatus;
  nominator: `0x${string}`;
  vouchers: readonly `0x${string}`[];
  nominatedAt: bigint;
  voucherCount: number;
  threshold: number;
  remaining: number;
  ready: boolean;
}

/**
 * Snapshot of the candidate's progress through the vouch flow. The dapp
 * shows this as "you need N more vouches" in the onboarding UI.
 *
 * @deprecated On-chain nomination is retired. Read this status from the
 * admin portal's onboarding API instead. Removal planned in a future
 * major release.
 */
export async function getNominationSnapshot(
  sdk: AroSdk,
  candidate: `0x${string}`,
): Promise<NominationSnapshot> {
  const nominationAddress = sdk.addressOf("AroNomination");
  const [nomination, threshold] = (await Promise.all([
    sdk.publicClient.readContract({
      address: nominationAddress,
      abi: AroNomination_ABI,
      functionName: "getNomination",
      args: [candidate],
    }),
    sdk.publicClient.readContract({
      address: nominationAddress,
      abi: AroNomination_ABI,
      functionName: "threshold",
    }),
  ])) as [
    [
      `0x${string}`,
      readonly `0x${string}`[],
      bigint,
      number,
    ],
    bigint,
  ];

  const [nominator, vouchers, nominatedAt, status] = nomination;
  const voucherCount = vouchers.length;
  const thresholdN = Number(threshold);

  return {
    status: status as NominationStatus,
    nominator,
    vouchers,
    nominatedAt,
    voucherCount,
    threshold: thresholdN,
    remaining: Math.max(0, thresholdN - voucherCount),
    ready: status === NominationStatus.APPROVED,
  };
}

/** Resolve the account to use when sending a write transaction. */
function pickAccount(
  wallet: WalletClient,
  passed?: Account | `0x${string}`,
): Account | `0x${string}` {
  if (passed) return passed;
  if (wallet.account) return wallet.account;
  throw new Error(
    "No account available — pass one explicitly or use a walletClient bound to an account.",
  );
}

/**
 * @deprecated On-chain nomination is retired. Use the admin portal's
 * onboarding API instead. Removal planned in a future major release.
 *
 * Send `nominate(candidate)` from the connected wallet. The contract
 * gates this behind "caller must already be an SBT holder"; we surface
 * the right user-facing message via `AroContractError`.
 */
export async function nominateCandidate(
  sdk: AroSdk,
  candidate: `0x${string}`,
  opts: { account?: Account | `0x${string}` } = {},
): Promise<Hex> {
  if (!sdk.walletClient) {
    throw new Error("nominateCandidate requires a walletClient on the SDK");
  }
  const wallet = sdk.walletClient;
  try {
    return await wallet.writeContract({
      account: pickAccount(wallet, opts.account),
      chain: wallet.chain,
      address: sdk.addressOf("AroNomination"),
      abi: AroNomination_ABI,
      functionName: "nominate",
      args: [candidate],
    });
  } catch (err) {
    throw decodeAroError(err) ?? err;
  }
}

/**
 * @deprecated On-chain vouching is retired. Use the admin portal's
 * onboarding API instead. Removal planned in a future major release.
 */
export async function vouchForCandidate(
  sdk: AroSdk,
  candidate: `0x${string}`,
  opts: { account?: Account | `0x${string}` } = {},
): Promise<Hex> {
  if (!sdk.walletClient) {
    throw new Error("vouchForCandidate requires a walletClient on the SDK");
  }
  const wallet = sdk.walletClient;
  try {
    return await wallet.writeContract({
      account: pickAccount(wallet, opts.account),
      chain: wallet.chain,
      address: sdk.addressOf("AroNomination"),
      abi: AroNomination_ABI,
      functionName: "vouch",
      args: [candidate],
    });
  } catch (err) {
    throw decodeAroError(err) ?? err;
  }
}

/**
 * @deprecated On-chain nomination is retired. The admin portal handles
 * rejections in its backend. Removal planned in a future major release.
 *
 * Admin path: clear (reject) a nomination. Restricted to authorized roles
 * via AccessManager; will revert with AccessManagedUnauthorized if the
 * caller lacks the role.
 */
export async function clearNomination(
  sdk: AroSdk,
  candidate: `0x${string}`,
  opts: { account?: Account | `0x${string}` } = {},
): Promise<Hex> {
  if (!sdk.walletClient) {
    throw new Error("clearNomination requires a walletClient on the SDK");
  }
  const wallet = sdk.walletClient;
  try {
    return await wallet.writeContract({
      account: pickAccount(wallet, opts.account),
      chain: wallet.chain,
      address: sdk.addressOf("AroNomination"),
      abi: AroNomination_ABI,
      functionName: "clearNomination",
      args: [candidate],
    });
  } catch (err) {
    throw decodeAroError(err) ?? err;
  }
}

export interface MintSBTOpts {
  to: `0x${string}`;
  /** keccak256 of the verified KYC payload — see utils/kycHash.ts. */
  kycHash: `0x${string}`;
  /** Off-chain profile metadata URI (ipfs://... or https://...). */
  metadataURI: string;
  /**
   * Initial tier id (opaque uint256; defaults to 0 / "Standard"). Accepts
   * AroTier enum values for the conventional defaults, or any bigint id
   * defined off-chain by the admin backend.
   */
  tier?: bigint | AroTier;
  account?: Account | `0x${string}`;
}

/**
 * @deprecated SBT minting is now candidate-triggered against an EIP-712
 * voucher (`AroSBT.mintWithApproval`). The admin backend issues vouchers
 * via `signMintApproval` in `../utils/mintApproval`, and the candidate
 * submits via the `useMintWithApproval` hook in `../hooks/useAroSBT`.
 * The direct admin mint below remains gated by ROLE_MINTER but is the
 * legacy path; removal planned in a future major release.
 *
 * Admin-only: mint the SBT for an approved candidate. The contract gates
 * this behind ROLE_MINTER via AccessManager (per AroMediaAccessManager).
 *
 * Calls the 4-arg mint overload explicitly so the tier is always
 * specified — the 3-arg overload silently defaults to STANDARD, which
 * we don't want callers to rely on implicitly.
 */
export async function mintSBTForApproved(
  sdk: AroSdk,
  opts: MintSBTOpts,
): Promise<Hex> {
  if (!sdk.walletClient) {
    throw new Error("mintSBTForApproved requires a walletClient on the SDK");
  }
  const wallet = sdk.walletClient;
  const tier: bigint =
    opts.tier === undefined
      ? 0n
      : typeof opts.tier === "bigint"
        ? opts.tier
        : BigInt(opts.tier);
  try {
    return await wallet.writeContract({
      account: pickAccount(wallet, opts.account),
      chain: wallet.chain,
      address: sdk.addressOf("AroSBT"),
      abi: AroSBT_ABI,
      // Disambiguate the overload by writing the explicit 4-arg form.
      functionName: "mint",
      args: [opts.to, opts.kycHash, opts.metadataURI, tier],
    });
  } catch (err) {
    throw decodeAroError(err) ?? err;
  }
}

/**
 * Convenience: enumerate the policy-derived next action for a wallet so
 * the onboarding UI can render the correct step (Connect → Nominate →
 * Vouch → KYC → Mint).
 */
export type OnboardingStep =
  | "needs-wallet"
  | "needs-nomination"
  | "needs-vouches"
  | "needs-kyc"
  | "needs-admin-mint"
  | "member";

export interface OnboardingState {
  step: OnboardingStep;
  membership: MembershipStatus;
  nomination?: NominationSnapshot;
}

export async function describeOnboardingState(
  sdk: AroSdk,
  wallet: `0x${string}` | undefined,
): Promise<OnboardingState> {
  if (!wallet) {
    return {
      step: "needs-wallet",
      membership: { hasSBT: false },
    };
  }
  const membership = await checkMembershipStatus(sdk, wallet);
  if (membership.hasSBT) return { step: "member", membership };

  const nomination = await getNominationSnapshot(sdk, wallet);
  if (nomination.status === NominationStatus.NONE) {
    return { step: "needs-nomination", membership, nomination };
  }
  if (nomination.status === NominationStatus.PENDING) {
    return { step: "needs-vouches", membership, nomination };
  }
  if (nomination.status === NominationStatus.APPROVED) {
    // The dapp distinguishes these client-side: if the user has finished
    // Didit, we move to needs-admin-mint; otherwise needs-kyc. The SDK
    // returns the on-chain reading and lets the UI overlay KYC state.
    return { step: "needs-kyc", membership, nomination };
  }
  // CLEARED — admin rejected. Surfaced as "needs-nomination" because the
  // candidate would need a fresh nomination from another member.
  return { step: "needs-nomination", membership, nomination };
}
