import { AroTier, AroTierLabels } from "../generated/types.js";

export { AroTier, AroTierLabels };

/**
 * Conventional KYC verification depth per default tier id.
 *
 * On-chain, the SBT's tier is an opaque `uint256`; no contract logic
 * branches on it. These conventional labels and policy descriptions are
 * the defaults the dapp displays when the admin backend hasn't supplied
 * an override. New tier ids can be defined server-side without a
 * contract upgrade or SDK release.
 */
export const tierRequirements: Record<AroTier, string> = {
  [AroTier.STANDARD]: "Basic KYC completed.",
  [AroTier.VERIFIED]: "Enhanced identity verification with additional documentation.",
  [AroTier.TRUSTED]: "Full Enhanced Due Diligence (EDD), including source of wealth verification.",
  [AroTier.FOUNDING]: "Founding member; highest verification and vetting.",
};

/**
 * Resolve a tier id to a human-readable label. Falls back to a generic
 * `Tier <n>` for unknown ids (the admin backend can introduce new tiers
 * without an SDK release).
 */
export function tierLabel(tier: bigint | number): string {
  const asNumber = typeof tier === "bigint" ? Number(tier) : tier;
  if (Number.isInteger(asNumber) && asNumber in AroTierLabels) {
    return AroTierLabels[asNumber as AroTier];
  }
  return `Tier ${asNumber}`;
}

/**
 * Whether a member at `held` tier meets the `required` minimum tier, by
 * numeric ordering. Convention: higher ids are stricter. Non-linear
 * tier orderings should be implemented off-chain in the admin backend.
 */
export function tierAtLeast(held: bigint | number, required: bigint | number): boolean {
  const heldNum = typeof held === "bigint" ? held : BigInt(held);
  const requiredNum = typeof required === "bigint" ? required : BigInt(required);
  return heldNum >= requiredNum;
}
