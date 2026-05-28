/**
 * generate.ts
 *
 * Pulls fresh ABIs out of the contracts repo's Hardhat artifacts and fresh
 * deployment addresses out of its Ignition deployment logs, then emits
 * TypeScript modules under src/generated/. The generated files are
 * committed so SDK consumers do not need Hardhat or solc installed.
 *
 * Run with:
 *   npm run generate
 *
 * Where it looks for the contracts repo:
 *   1. `CONTRACTS_REPO_PATH` env var (absolute or relative to cwd) — used
 *      by the sync-abis CI workflow which clones the repo to a temp dir.
 *   2. Default: ../../aromedia-blockchain-contracts (sibling layout under
 *      the aromediainc/ workspace).
 *
 * Prereqs:
 *   The contracts repo must have been compiled (`npm run compile`) so that
 *   its `artifacts/contracts/*.sol/*.json` exists. Without compilation,
 *   this script will warn and leave previously-generated files untouched.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONTRACTS_REPO_PATH: string = (() => {
  const fromEnv = process.env.CONTRACTS_REPO_PATH;
  if (fromEnv && fromEnv.length > 0) {
    return isAbsolute(fromEnv) ? fromEnv : resolve(process.cwd(), fromEnv);
  }
  // Default sibling layout: aromediainc/sdks/contracts-sdk → ../../aromedia-blockchain-contracts
  return resolve(__dirname, "..", "..", "..", "aromedia-blockchain-contracts");
})();

const ARTIFACTS_DIR = join(CONTRACTS_REPO_PATH, "artifacts", "contracts");
const IGNITION_DEPLOYMENTS = join(CONTRACTS_REPO_PATH, "ignition", "deployments");
const OUT_DIR = resolve(__dirname, "..", "src", "generated");

/**
 * Contracts the SDK exposes as first-class clients.
 *
 * Each entry maps the on-chain contract name (file basename, also the
 * artifact name) to the Ignition module key used by deploy-all.ts, which
 * is what shows up in `deployed_addresses.json`. Keeping these two pieces
 * of metadata co-located makes the script self-documenting.
 */
const CONTRACTS: Array<{
  /** Solidity contract name; matches the artifact JSON filename. */
  name: string;
  /** Ignition module key as written into deployed_addresses.json. */
  ignitionKey: string;
  /**
   * Sub-directory under `artifacts/contracts/` where this contract's
   * artifact lives. Defaults to no sub-dir (top-level `contracts/`).
   * Confidential contracts live under `confidential/`.
   */
  subdir?: string;
}> = [
  { name: "AroMediaIncMultiSig", ignitionKey: "AroMediaIncMultiSigModule#AroMediaIncMultiSig" },
  { name: "AroMediaAccessManager", ignitionKey: "AroMediaAccessManagerModule#AroMediaAccessManager" },
  { name: "AroMediaRWA", ignitionKey: "AroMediaRWAModule#AroMediaRWA" },
  { name: "AroMediaAssetsRegistry", ignitionKey: "AroMediaAssetsRegistryModule#AroMediaAssetsRegistry" },
  { name: "ForcedTransferManager", ignitionKey: "ForcedTransferManagerModule#ForcedTransferManager" },
  { name: "AroSBT", ignitionKey: "AroSBTModule#AroSBT" },
  { name: "AroNomination", ignitionKey: "AroNominationModule#AroNomination" },
  { name: "cAROUSD", ignitionKey: "cAROUSDModule#cAROUSD", subdir: "confidential" },
  { name: "AroLiquidityCommitment", ignitionKey: "AroLiquidityCommitmentModule#AroLiquidityCommitment", subdir: "confidential" },
];

/**
 * Chain registry. `id` is the EVM chainId. `slug` is the directory under
 * `ignition/deployments/chain-<id>` we read from. `label` is the user-facing
 * name re-exported from the SDK so callers can switch on it.
 *
 * Keeping mainnet slots present (even when empty) gives the address registry
 * a stable shape so the generated TypeScript types do not shift between
 * deployments.
 */
const CHAINS = [
  { id: 1, slug: "chain-1", label: "ethereum" },
  { id: 11155111, slug: "chain-11155111", label: "sepolia" },
  { id: 8453, slug: "chain-8453", label: "base" },
  { id: 84532, slug: "chain-84532", label: "baseSepolia" },
  { id: 31337, slug: "chain-31337", label: "hardhat" },
] as const;

type ChainEntry = (typeof CHAINS)[number];

function header(scriptName: string): string {
  return [
    "// AUTO-GENERATED FILE — DO NOT EDIT BY HAND",
    `// Source of truth: packages/sdk/scripts/${scriptName}`,
    "// Re-run with `npm run sdk:generate` from the repo root.",
    "",
  ].join("\n");
}

function ensureOutDir(): void {
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }
}

function readArtifact(name: string, subdir?: string): { abi: unknown[] } | null {
  const base = subdir ? join(ARTIFACTS_DIR, subdir) : ARTIFACTS_DIR;
  const artifactPath = join(base, `${name}.sol`, `${name}.json`);
  if (!existsSync(artifactPath)) {
    console.warn(`  ⚠ missing artifact for ${name} (${artifactPath})`);
    return null;
  }
  return JSON.parse(readFileSync(artifactPath, "utf8"));
}

function readDeployedAddresses(slug: string): Record<string, string> {
  const path = join(IGNITION_DEPLOYMENTS, slug, "deployed_addresses.json");
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    console.warn(`  ⚠ failed to parse ${path}: ${(err as Error).message}`);
    return {};
  }
}

function emitAbis(): void {
  console.log("→ Emitting ABIs from artifacts/");

  const lines: string[] = [header("generate.ts")];
  const exportedNames: string[] = [];
  let foundCount = 0;

  for (const { name, subdir } of CONTRACTS) {
    const artifact = readArtifact(name, subdir);
    if (!artifact) continue;
    foundCount += 1;

    // The `as const` cast is what unlocks viem's type inference on
    // read/write contract calls. Without it viem falls back to `unknown`.
    const exportName = `${name}_ABI`;
    lines.push(`/** ABI for ${name}. */`);
    lines.push(`export const ${exportName} = ${JSON.stringify(artifact.abi, null, 2)} as const;`);
    lines.push("");
    exportedNames.push(`${name}: ${exportName}`);
  }

  // Bundle map so callers can do `abis.AroSBT` without import gymnastics.
  lines.push(`/** All ABIs keyed by contract name. */`);
  lines.push(`export const abis = {`);
  for (const entry of exportedNames) {
    lines.push(`  ${entry},`);
  }
  lines.push(`} as const;`);
  lines.push("");
  lines.push(`export type AroContractName = keyof typeof abis;`);
  lines.push("");

  writeFileSync(join(OUT_DIR, "abis.ts"), lines.join("\n"));
  console.log(`  ✓ wrote src/generated/abis.ts (${foundCount}/${CONTRACTS.length} contracts)`);
}

function emitAddresses(): void {
  console.log("→ Emitting per-chain addresses from ignition/deployments/");

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
  const perChain: Record<number, Record<string, string>> = {};

  for (const chain of CHAINS as readonly ChainEntry[]) {
    const deployed = readDeployedAddresses(chain.slug);
    const row: Record<string, string> = {};
    for (const { name, ignitionKey } of CONTRACTS) {
      row[name] = deployed[ignitionKey] ?? ZERO_ADDRESS;
    }
    perChain[chain.id] = row;
  }

  const lines: string[] = [header("generate.ts")];
  lines.push(`import type { AroContractName } from "./abis.js";`);
  lines.push("");
  lines.push(`/** Reserved when a contract is not yet deployed on a chain. */`);
  lines.push(`export const ZERO_ADDRESS = "${ZERO_ADDRESS}" as const;`);
  lines.push("");
  lines.push(`export const SUPPORTED_CHAIN_IDS = [`);
  for (const chain of CHAINS) {
    lines.push(`  ${chain.id}, // ${chain.label}`);
  }
  lines.push(`] as const;`);
  lines.push("");
  lines.push(`export type AroChainId = (typeof SUPPORTED_CHAIN_IDS)[number];`);
  lines.push("");
  lines.push(`/**`);
  lines.push(` * Deployed contract addresses, keyed by EVM chainId then by contract name.`);
  lines.push(` * Entries set to ZERO_ADDRESS indicate the contract has not been deployed`);
  lines.push(` * to that chain yet — callers should treat ZERO_ADDRESS as "no deployment".`);
  lines.push(` */`);
  lines.push(`export const addresses: Record<AroChainId, Record<AroContractName, \`0x\${string}\`>> = {`);
  for (const chain of CHAINS) {
    lines.push(`  ${chain.id}: { // ${chain.label}`);
    const row = perChain[chain.id]!;
    for (const { name } of CONTRACTS) {
      lines.push(`    ${name}: "${row[name] as string}" as \`0x\${string}\`,`);
    }
    lines.push(`  },`);
  }
  lines.push(`};`);
  lines.push("");
  lines.push(`/** Convenience labels by chainId. */`);
  lines.push(`export const chainLabels: Record<AroChainId, string> = {`);
  for (const chain of CHAINS) {
    lines.push(`  ${chain.id}: "${chain.label}",`);
  }
  lines.push(`};`);
  lines.push("");
  lines.push(`/** Look up a single address — throws if chain or contract is unknown. */`);
  lines.push(`export function getAddress(chainId: AroChainId, contract: AroContractName): \`0x\${string}\` {`);
  lines.push(`  const row = addresses[chainId];`);
  lines.push(`  if (!row) throw new Error(\`Unsupported chainId \${chainId}\`);`);
  lines.push(`  const addr = row[contract];`);
  lines.push(`  if (!addr || addr === ZERO_ADDRESS) {`);
  lines.push(`    throw new Error(\`\${contract} not deployed on chain \${chainId}\`);`);
  lines.push(`  }`);
  lines.push(`  return addr;`);
  lines.push(`}`);
  lines.push("");

  writeFileSync(join(OUT_DIR, "addresses.ts"), lines.join("\n"));
  console.log(`  ✓ wrote src/generated/addresses.ts`);
}

function emitTypes(): void {
  console.log("→ Emitting mirrored Solidity enums");

  // These mirror the on-chain enums one-for-one so callers can use named
  // values instead of magic numbers in the dapp.
  const content = `${header("generate.ts")}
/**
 * Conventional default tier labels for AroSBT membership.
 *
 * On-chain, the SBT's \`tier\` is now an opaque \`uint256\` whose semantics
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
`;
  writeFileSync(join(OUT_DIR, "types.ts"), content);
  console.log(`  ✓ wrote src/generated/types.ts`);
}

function emitIndex(): void {
  const content = `${header("generate.ts")}
export * from "./abis.js";
export * from "./addresses.js";
export * from "./types.js";
`;
  writeFileSync(join(OUT_DIR, "index.ts"), content);
  console.log(`  ✓ wrote src/generated/index.ts`);
}

function main(): void {
  console.log("=".repeat(60));
  console.log("@aromedia/contracts-sdk — code generation");
  console.log("=".repeat(60));
  console.log(`Contracts repo: ${CONTRACTS_REPO_PATH}`);
  console.log(`Artifacts:      ${ARTIFACTS_DIR}`);
  console.log(`Out dir:        ${OUT_DIR}`);
  console.log("");

  if (!existsSync(CONTRACTS_REPO_PATH)) {
    console.error(
      `✗ Contracts repo not found at ${CONTRACTS_REPO_PATH}.\n` +
        `  Set CONTRACTS_REPO_PATH or clone aromedia-blockchain-contracts as a sibling directory.`,
    );
    process.exit(1);
  }
  if (!existsSync(ARTIFACTS_DIR)) {
    console.warn(`⚠ artifacts/ not found. Run \`npm run compile\` in the contracts repo first.`);
    console.warn(`  Address registry will still be emitted from ignition/deployments.`);
  }

  ensureOutDir();
  emitAbis();
  emitAddresses();
  emitTypes();
  emitIndex();

  console.log("");
  console.log("✓ generation complete");
}

main();
