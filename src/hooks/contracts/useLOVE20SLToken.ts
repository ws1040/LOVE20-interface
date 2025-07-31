// hooks/contracts/useLOVE20SLToken.ts

import { useState } from 'react';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { config } from '@/src/wagmi';

import { LOVE20SLTokenAbi } from '@/src/abis/LOVE20SLToken';
import { safeToBigInt } from '@/src/lib/clientUtils';

// =====================
// === 读取 Hook ===
// =====================

/**
 * Hook for allowance
 */
export const useAllowance = (address: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'allowance',
    args: [owner, spender],
    query: {
      enabled: !!address && !!owner && !!spender,
    },
  });

  return { allowance: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for balanceOf
 */
export const useBalanceOf = (address: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'balanceOf',
    args: [account],
    query: {
      enabled: !!address && !!account,
    },
  });

  return { balance: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for decimals
 */
export const useDecimals = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'decimals',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { decimals: data as number | undefined, isPending, error };
};

/**
 * Hook for name
 */
export const useName = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'name',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { name: data as string | undefined, isPending, error };
};

/**
 * Hook for parentTokenAddress
 */
export const useParentTokenAddress = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'parentTokenAddress',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { parentTokenAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for symbol
 */
export const useSymbol = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'symbol',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { symbol: data as string | undefined, isPending, error };
};

/**
 * Hook for tokenAddress
 */
export const useTokenAddress = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'tokenAddress',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { tokenAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for tokenAmounts
 */
export const useTokenAmounts = (address: `0x${string}`, flag: boolean = true) => {
  const { data, isPending, error, refetch } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'tokenAmounts',
    args: [],
    query: {
      enabled: !!address && !!flag,
    },
  });

  return {
    tokenAmount: data?.[0],
    parentTokenAmount: data?.[1],
    feeTokenAmount: data?.[2],
    feeParentTokenAmount: data?.[3],
    isPending,
    error,
  };
};

/**
 * Hook for tokenAmountsBySlAmount
 */
export const useTokenAmountsBySlAmount = (address: `0x${string}`, slAmount: bigint) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'tokenAmountsBySlAmount',
    args: [slAmount],
    query: {
      enabled: !!address && slAmount !== BigInt(0),
    },
  });

  return {
    tokenAmountsBySlAmount: data
      ? {
          tokenAmount: safeToBigInt((data as any)?.tokenAmount),
          parentTokenAmount: safeToBigInt((data as any)?.parentTokenAmount),
        }
      : undefined,
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
    abi: LOVE20SLTokenAbi,
    functionName: 'totalSupply',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { totalSupply: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for uniswapV2Pair
 */
export const useUniswapV2Pair = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'uniswapV2Pair',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { uniswapV2Pair: data as `0x${string}` | undefined, isPending, error };
};

// =====================
// === 写入 Hook ===
// =====================

/**
 * Hook for approve
 */
export const useApprove = (address: `0x${string}`) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const approve = async (spender: `0x${string}`, value: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address,
        abi: LOVE20SLTokenAbi,
        functionName: 'approve',
        args: [spender, value],
      });
      const txHash = await writeContract(config, {
        address,
        abi: LOVE20SLTokenAbi,
        functionName: 'approve',
        args: [spender, value],
      });
      setHash(txHash);
      return txHash;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const combinedError = error ?? confirmError;

  return { approve, isPending, isConfirming, writeError: combinedError, isConfirmed };
};
