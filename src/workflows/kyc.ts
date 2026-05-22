import { computeKycHash, type KycPayload } from "../utils/kycHash.js";

/**
 * KYC workflow helpers. These are intentionally provider-agnostic — the
 * SDK does not call Didit directly (that's the dapp/backend's job per
 * MEMO-KYC-PROVIDER), but it owns the canonical mapping from a verified
 * payload to the on-chain `kycHash` bytes32.
 *
 * Splitting concerns this way means we can swap KYC vendors later without
 * touching anything that hashes or anchors data on-chain.
 */
export { computeKycHash, type KycPayload };

/**
 * Normalized representation of a KYC verification result. Whatever vendor
 * the dapp uses, results should be mapped into this shape before hashing
 * so the on-chain hash is vendor-stable.
 */
export interface NormalizedKycResult {
  /** Vendor name — "didit" today. */
  provider: string;
  /** Vendor session id. */
  sessionId: string;
  /** Pass-through status string from the vendor. */
  status: "verified" | "failed" | "pending" | "expired";
  /** ISO-8601 timestamp from the vendor's verification decision. */
  verifiedAt: string;
  /** Wallet the verification is bound to. */
  walletAddress: `0x${string}`;
  /** Optional extras the dapp wants anchored on-chain. */
  attributes?: Record<string, string | number | boolean | null>;
}

/**
 * Hash a normalized KYC result for SBT minting. Wrapper around
 * `computeKycHash` that enforces the shape we expect from the dapp.
 */
export function hashKycResult(result: NormalizedKycResult): `0x${string}` {
  if (result.status !== "verified") {
    throw new Error(
      `Refusing to hash an un-verified KYC result (status=${result.status}).`,
    );
  }
  return computeKycHash({
    provider: result.provider,
    sessionId: result.sessionId,
    status: result.status,
    verifiedAt: result.verifiedAt,
    walletAddress: result.walletAddress,
    attributes: result.attributes,
  });
}
