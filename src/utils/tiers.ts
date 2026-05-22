import { AroTier, AroTierLabels } from "../generated/types.js";

export { AroTier, AroTierLabels };

/**
 * Map the SBT Tier enum value to the KYC verification depth required by
 * the policy (§6.1):
 *   STANDARD  → basic KYC
 *   VERIFIED  → enhanced ID verification
 *   TRUSTED   → full EDD including source of wealth
 *   FOUNDING  → founding members, highest vetting
 */
export const tierRequirements: Record<AroTier, string> = {
  [AroTier.STANDARD]: "Basic KYC completed.",
  [AroTier.VERIFIED]: "Enhanced identity verification with additional documentation.",
  [AroTier.TRUSTED]: "Full Enhanced Due Diligence (EDD), including source of wealth verification.",
  [AroTier.FOUNDING]: "Founding member; highest verification and vetting.",
};

export function tierLabel(tier: AroTier): string {
  return AroTierLabels[tier];
}

/** Whether a member at `held` tier meets the `required` minimum tier. */
export function tierAtLeast(held: AroTier, required: AroTier): boolean {
  return held >= required;
}
