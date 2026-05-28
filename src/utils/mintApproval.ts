// =============================================================================
// AroSBT.mintWithApproval VOUCHER HELPER
// =============================================================================
// EIP-712 typed-data builder + signer for the candidate-triggered SBT mint
// flow. The admin backend signs a MintApproval voucher with the approver key
// (which holds ROLE_MINTER == APPROVER_ROLE on AroSBT); the candidate
// submits the voucher and signature to AroSBT.mintWithApproval, which
// recovers the signer, checks the AccessManager role, marks the voucher
// nullified, and mints to msg.sender.

import type { Account, Hex, LocalAccount, TypedDataDomain } from "viem";

// -----------------------------------------------------------------------------
// Domain and types
// -----------------------------------------------------------------------------

/**
 * EIP-712 domain for AroSBT.mintWithApproval. Mirrors the contract's
 * `EIP712("AroSBT", "1")` constructor.
 */
export function mintApprovalDomain(
  chainId: number | bigint,
  sbtAddress: `0x${string}`,
): TypedDataDomain {
  return {
    name: "AroSBT",
    version: "1",
    chainId: typeof chainId === "bigint" ? Number(chainId) : chainId,
    verifyingContract: sbtAddress,
  };
}

/**
 * Typed-data types for the MintApproval voucher. The field order is
 * load-bearing (it must match the order in the contract's
 * MINT_APPROVAL_TYPEHASH string).
 */
export const MINT_APPROVAL_TYPES = {
  MintApproval: [
    { name: "candidate", type: "address" },
    { name: "tier", type: "uint256" },
    { name: "kycHash", type: "bytes32" },
    { name: "nominationId", type: "bytes32" },
    { name: "metadataURI", type: "string" },
    { name: "deadline", type: "uint64" },
    { name: "nonce", type: "bytes32" },
  ],
} as const;

// -----------------------------------------------------------------------------
// Payload types
// -----------------------------------------------------------------------------

/** Fields the approver signs. Matches the on-chain MintApproval struct. */
export interface MintApprovalPayload {
  candidate: `0x${string}`;
  /** Opaque tier id (semantics live off-chain in the admin backend). */
  tier: bigint;
  kycHash: `0x${string}`;
  /** Admin-backend nomination record id, encoded as bytes32. */
  nominationId: `0x${string}`;
  /** IPFS / HTTP URI for the candidate's profile metadata. */
  metadataURI: string;
  /** Unix seconds; voucher is rejected after this. */
  deadline: bigint;
  /** 32-byte unique value; the digest is the on-chain nullifier key. */
  nonce: `0x${string}`;
}

/** A signed voucher, ready for the candidate to submit. */
export interface SignedMintApproval {
  payload: MintApprovalPayload;
  signature: Hex;
  domain: TypedDataDomain;
}

// -----------------------------------------------------------------------------
// Sign + verify
// -----------------------------------------------------------------------------

/**
 * Sign a MintApproval voucher with the approver's key.
 *
 * The account must hold ROLE_MINTER on the AccessManager (mintWithApproval
 * checks this on-chain). Typical use: the admin backend builds the payload
 * once the candidate's review is complete, signs it with a server-held
 * signer (viem `privateKeyToAccount` / `mnemonicToAccount`), and stores
 * (or directly returns) the signed voucher for the candidate's mint call.
 *
 * @param account     Any viem account with `signTypedData` support
 *                    (LocalAccount, JsonRpcAccount, etc.).
 * @param sbtAddress  Deployed AroSBT contract address.
 * @param chainId     EVM chain id the voucher is bound to.
 * @param payload     The MintApproval fields.
 */
export async function signMintApproval(
  account: Account & { signTypedData: LocalAccount["signTypedData"] },
  sbtAddress: `0x${string}`,
  chainId: number | bigint,
  payload: MintApprovalPayload,
): Promise<SignedMintApproval> {
  const domain = mintApprovalDomain(chainId, sbtAddress);
  const signature = await account.signTypedData({
    domain,
    types: MINT_APPROVAL_TYPES,
    primaryType: "MintApproval",
    message: payload,
  });
  return { payload, signature, domain };
}

/**
 * Reconstruct the typed-data argument the candidate (or any signer)
 * passes to `signTypedData` / `verifyTypedData`. Useful when the signing
 * step happens in code outside the SDK (e.g. browser wallet flow).
 */
export function mintApprovalTypedData(
  sbtAddress: `0x${string}`,
  chainId: number | bigint,
  payload: MintApprovalPayload,
) {
  return {
    domain: mintApprovalDomain(chainId, sbtAddress),
    types: MINT_APPROVAL_TYPES,
    primaryType: "MintApproval" as const,
    message: payload,
  };
}
