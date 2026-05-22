// AUTO-GENERATED FILE — DO NOT EDIT BY HAND
// Source of truth: packages/sdk/scripts/generate.ts
// Re-run with `npm run sdk:generate` from the repo root.

/** Mirrors AroSBT.Tier. */
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

/** Mirrors AroNomination.NominationStatus. */
export enum NominationStatus {
  NONE = 0,
  PENDING = 1,
  APPROVED = 2,
  CLEARED = 3,
}

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
