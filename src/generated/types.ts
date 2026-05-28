// AUTO-GENERATED FILE — DO NOT EDIT BY HAND
// Source of truth: packages/sdk/scripts/generate.ts
// Re-run with `npm run sdk:generate` from the repo root.

/**
 * Conventional default tier labels for AroSBT membership.
 *
 * On-chain, the SBT's `tier` is now an opaque `uint256` whose semantics
 * are defined off-chain by the admin backend (no on-chain logic branches
 * on it). These enum values are the conventional defaults the dapp
 * displays when no off-chain override is available; new tier ids can be
 * introduced server-side without a contract upgrade or SDK release.
 */
export enum AroTier {
  STANDARD = 0,
  VERIFIED = 1,
  TRUSTED = 2,
  FOUNDING = 3,
}

export const AroTierLabels: Record<AroTier, string> = {
  [AroTier.STANDARD]: "Standard",
  [AroTier.VERIFIED]: "Verified",
  [AroTier.TRUSTED]: "Trusted",
  [AroTier.FOUNDING]: "Founding",
};

/**
 * @deprecated Mirrors AroNomination.NominationStatus. The on-chain
 * nomination flow is being retired in favor of an admin-portal backend
 * flow (see the AroNomination_ABI deprecation). New consumers should
 * read status from the admin portal API instead.
 */
export enum NominationStatus {
  NONE = 0,
  PENDING = 1,
  APPROVED = 2,
  CLEARED = 3,
}

/** @deprecated See NominationStatus. */
export const NominationStatusLabels: Record<NominationStatus, string> = {
  [NominationStatus.NONE]: "Not nominated",
  [NominationStatus.PENDING]: "Pending vouches",
  [NominationStatus.APPROVED]: "Approved — awaiting admin",
  [NominationStatus.CLEARED]: "Cleared by admin",
};

/** Mirrors ForcedTransferManager.ForcedTransferStatus. */
export enum ForcedTransferStatus {
  PENDING = 0,
  APPROVED = 1,
  EXECUTED = 2,
  CANCELLED = 3,
}

export const ForcedTransferStatusLabels: Record<ForcedTransferStatus, string> = {
  [ForcedTransferStatus.PENDING]: "Pending",
  [ForcedTransferStatus.APPROVED]: "Approved",
  [ForcedTransferStatus.EXECUTED]: "Executed",
  [ForcedTransferStatus.CANCELLED]: "Cancelled",
};
