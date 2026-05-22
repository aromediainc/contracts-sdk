import { BaseError, type ContractFunctionRevertedError } from "viem";

/**
 * Friendly error class wrapping a decoded custom error from one of the Aro
 * contracts. We keep both the raw cause (for retry/logging) and a friendly
 * message that maps cleanly to user-facing copy in the dapp.
 */
export class AroContractError extends Error {
  readonly errorName: string;
  readonly args: readonly unknown[];
  override readonly cause?: unknown;

  constructor(opts: {
    errorName: string;
    args: readonly unknown[];
    message: string;
    cause?: unknown;
  }) {
    super(opts.message);
    this.name = "AroContractError";
    this.errorName = opts.errorName;
    this.args = opts.args;
    this.cause = opts.cause;
  }
}

/**
 * Translate a viem ContractFunctionRevertedError into a known Aro-specific
 * message where possible. Unknown errors are returned as-is so callers
 * can still display the raw revert reason.
 */
const FRIENDLY: Record<string, (args: readonly unknown[]) => string> = {
  // AroSBT
  AlreadyHasSBT: ([who]) => `Address ${String(who)} already holds an SBT.`,
  SoulboundTransferBlocked: () => "SBTs are soulbound — transfers are not permitted.",
  NoSBT: ([who]) => `Address ${String(who)} does not hold an SBT.`,
  // AroNomination
  CallerHasNoSBT: () => "Only existing SBT holders can nominate or vouch.",
  AlreadyNominated: ([who]) => `Address ${String(who)} is already nominated.`,
  CandidateAlreadyMember: ([who]) => `Address ${String(who)} is already a member.`,
  NotNominated: ([who]) => `Address ${String(who)} has not been nominated.`,
  AlreadyVouched: ([voucher, candidate]) =>
    `Address ${String(voucher)} already vouched for ${String(candidate)}.`,
  NominatorCannotVouch: () => "The original nominator cannot also vouch.",
  ThresholdCannotBeZero: () => "Vouch threshold must be at least 1.",
  NominationNotPending: ([who]) =>
    `Nomination for ${String(who)} is not in PENDING status.`,
};

export function decodeAroError(err: unknown): AroContractError | null {
  if (!(err instanceof BaseError)) return null;

  const reverted = err.walk(
    (e) => e instanceof Error && e.name === "ContractFunctionRevertedError",
  ) as ContractFunctionRevertedError | null;
  if (!reverted || !reverted.data) return null;

  const errorName = reverted.data.errorName ?? "UnknownError";
  const args = (reverted.data.args ?? []) as readonly unknown[];
  const friendly = FRIENDLY[errorName];
  const message = friendly ? friendly(args) : `Revert: ${errorName}`;

  return new AroContractError({ errorName, args, message, cause: err });
}
