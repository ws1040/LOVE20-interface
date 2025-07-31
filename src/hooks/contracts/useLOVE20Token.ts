// hooks/useLove20Token.ts

import { useState } from 'react';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { config } from '@/src/wagmi';

import { LOVE20TokenAbi } from '@/src/abis/LOVE20Token';
import { safeToBigInt } from '@/src/lib/clientUtils';

/* =======================
   ===== Read Hooks ======
   ======================= */

/**
 * useAllowance Hook
 * @param owner - Address of the owner
 * @param spender - Address of the spender
 */
export const useAllowance = (
  token: `0x${string}`,
  owner: `0x${string}`,
  spender: `0x${string}`,
  flag: boolean = true,
) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'allowance',
    args: [owner, spender],
    query: {
      enabled: !!token && !!owner && !!spender && flag,
    },
  });

  return { allowance: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * useBalanceOf Hook
 * @param account - Address of the account
 */
export const useBalanceOf = (token: `0x${string}`, account: `0x${string}`, flag: boolean = true) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'balanceOf',
    args: [account],
    query: {
      enabled: !!token && !!account && flag,
    },
  });

  return { balance: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * useDecimals Hook
 */
export const useDecimals = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'decimals',
    args: [],
    query: {
      enabled: !!token,
    },
  });

  return { decimals: data as number | undefined, isPending, error };
};

/**
 * useMaxSupply Hook
 */
export const useMaxSupply = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'maxSupply',
    args: [],
    query: {
      enabled: !!token,
    },
  });

  return { maxSupply: data as bigint | undefined, isPending, error };
};

/**
 * useName Hook
 */
export const useName = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'name',
    args: [],
    query: {
      enabled: !!token,
    },
  });

  return { name: data as string | undefined, isPending, error };
};

/**
 * useParentPool Hook
 */
export const useParentPool = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'parentPool',
    args: [],
    query: {
      enabled: !!token,
    },
  });

  return { parentPool: data as bigint | undefined, isPending, error };
};

/**
 * useParentTokenAddress Hook
 */
export const useParentTokenAddress = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'parentTokenAddress',
    args: [],
    query: {
      enabled: !!token,
    },
  });

  return { parentTokenAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * useSymbol Hook
 */
export const useSymbol = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'symbol',
    args: [],
    query: {
      enabled: !!token,
    },
  });

  return { symbol: data as string | undefined, isPending, error };
};

/**
 * useTotalSupply Hook
 */
export const useTotalSupply = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'totalSupply',
    args: [],
    query: {
      enabled: !!token,
    },
  });

  return { totalSupply: data ? safeToBigInt(data) : undefined, isPending, error };
};

/* =======================
   ===== Write Hooks =====
   ======================= */
/**
 * useApprove Hook
 */
export function useApprove(token: `0x${string}`) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const approve = async (spender: `0x${string}`, value: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'approve',
        args: [spender, value],
      });
      const txHash = await writeContract(config, {
        address: token,
        abi: LOVE20TokenAbi,
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

/**
 * useBurn Hook
 */
export function useBurn(token: `0x${string}`) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const burn = async (amount: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'burn',
        args: [amount],
      });
      const txHash = await writeContract(config, {
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'burn',
        args: [amount],
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

  return { burn, isPending, isConfirming, writeError: combinedError, isConfirmed };
}

/**
 * useBurnForParentToken Hook
 */
export function useBurnForParentToken(token: `0x${string}`) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const burnForParentToken = async (amount: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'burnForParentToken',
        args: [amount],
      });
      const txHash = await writeContract(config, {
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'burnForParentToken',
        args: [amount],
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

  return { burnForParentToken, isPending, isConfirming, writeError: combinedError, isConfirmed };
}
