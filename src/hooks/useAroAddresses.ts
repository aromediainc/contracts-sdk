import { useMemo } from "react";
import { useChainId } from "wagmi";

import { addresses, SUPPORTED_CHAIN_IDS, type AroChainId } from "../generated/addresses.js";

/**
 * Returns the deployed contract addresses for the chain the user is
 * currently connected to. Returns `null` for chains the SDK does not
 * recognize so the dapp can render a "switch network" prompt.
 */
export function useAroAddresses(): Record<keyof typeof addresses[AroChainId], `0x${string}`> | null {
  const chainId = useChainId();
  return useMemo(() => {
    if (!isSupportedChain(chainId)) return null;
    return addresses[chainId];
  }, [chainId]);
}

export function useAroChainId(): AroChainId | null {
  const chainId = useChainId();
  return isSupportedChain(chainId) ? chainId : null;
}

function isSupportedChain(id: number): id is AroChainId {
  return (SUPPORTED_CHAIN_IDS as readonly number[]).includes(id);
}
