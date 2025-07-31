// hooks/contracts/useLOVE20STToken.ts

import { useState } from 'react';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { config } from '@/src/wagmi';

import { LOVE20STTokenAbi } from '@/src/abis/LOVE20STToken';
import { safeToBigInt } from '@/src/lib/clientUtils';

/**
 * Hook for allowance
 */
export const useAllowance = (address: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'allowance',
    args: [owner, spender],
    query: {
      enabled: !!address && !!owner && !!spender,
    },
  });

  return {
    allowance: data ? safeToBigInt(data) : undefined,
    isPending,
    error,
  };
};

/**
 * Hook for balanceOf
 */
export const useBalanceOf = (address: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'balanceOf',
    args: [account],
    query: {
      enabled: !!address && !!account,
    },
  });

  return {
    balance: data ? safeToBigInt(data) : undefined,
    isPending,
    error,
  };
};

/**
 * Hook for decimals
 */
export const useDecimals = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'decimals',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    decimals: data as number | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for name
 */
export const useName = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'name',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    name: data as string | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for reserve
 */
export const useReserve = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'reserve',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    reserve: data ? safeToBigInt(data) : undefined,
    isPending,
    error,
  };
};

/**
 * Hook for symbol
 */
export const useSymbol = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'symbol',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    symbol: data as string | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for tokenAddress
 */
export const useTokenAddress = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'tokenAddress',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    tokenAddress: data as `0x${string}` | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for totalSupply
 */
export const useTotalSupply = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'totalSupply',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    totalSupply: data ? safeToBigInt(data) : undefined,
    isPending,
    error,
  };
};

// =====================
// === 写入 Hook ===
// =====================

/**
 * Hook for approve
 */
export function useApprove(address: `0x${string}`) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const approve = async (spender: `0x${string}`, value: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address,
        abi: LOVE20STTokenAbi,
        functionName: 'approve',
        args: [spender, value],
      });
      const txHash = await writeContract(config, {
        address,
        abi: LOVE20STTokenAbi,
        functionName: 'approve',
        args: [spender, value],
      });
      setHash(txHash);
      return txHash;
    } catch (err: any) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash });

  const combinedError = error ?? confirmError;

  return { approve, isPending, isConfirming, writeError: combinedError, isConfirmed };
}
