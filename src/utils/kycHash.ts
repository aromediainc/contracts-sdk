import { keccak256, stringToBytes } from "viem";
import type { Hex } from "viem";

/**
 * KYC hash computation as required by the ARO KYC/AML/CFT Policy §6.2.
 *
 * The on-chain `kycHash` (bytes32) is a keccak256 over a deterministic
 * serialization of the verified identity payload returned by the KYC
 * provider (Didit, per MEMO-KYC-PROVIDER). Storing only the hash on-chain
 * gives us tamper-evidence without ever exposing PII on a public ledger.
 *
 * Why deterministic serialization: the same identity payload must hash to
 * the same value across processes, languages, and timezones — JSON object
 * key order is otherwise implementation-dependent, which would silently
 * change the hash and break audit-trail equivalence.
 *
 * The serializer:
 *   • Sorts object keys recursively.
 *   • Coerces undefined → null so it survives JSON.stringify.
 *   • Refuses functions, symbols, bigints, and class instances.
 */
export interface KycPayload {
  /** Provider's verification session id (e.g. Didit `session_id`). */
  sessionId: string;
  /** Provider name — lets us roll over to a different vendor later. */
  provider: string;
  /** Verification status returned by the provider. */
  status: string;
  /** ISO-8601 timestamp of the provider's verification decision. */
  verifiedAt: string;
  /** Wallet address the verification is bound to. */
  walletAddress: `0x${string}`;
  /** Anything else the provider returned that we want anchored on-chain. */
  attributes?: Record<string, JsonScalar | JsonScalar[]>;
}

type JsonScalar = string | number | boolean | null;

function stableStringify(value: unknown): string {
  if (value === undefined) return "null";
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("KYC payload must not contain Infinity or NaN");
    }
    return JSON.stringify(value);
  }
  if (typeof value === "boolean") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const parts = keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`);
    return `{${parts.join(",")}}`;
  }
  throw new Error(`Unsupported type in KYC payload: ${typeof value}`);
}

/**
 * Compute the bytes32 hash stored on-chain in AroSBT.MemberData.kycHash.
 *
 * @param payload  Verified identity payload from the KYC provider.
 * @returns        Hex-encoded keccak256 (`0x...`, 66 chars).
 */
export function computeKycHash(payload: KycPayload): Hex {
  const serialized = stableStringify(payload);
  return keccak256(stringToBytes(serialized));
}

/** Re-export for convenience when the dapp needs to hash arbitrary blobs. */
export { keccak256, stringToBytes } from "viem";
