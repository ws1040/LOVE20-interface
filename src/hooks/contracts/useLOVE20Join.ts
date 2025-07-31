// hooks/useLove20Join.ts

import { useState } from 'react';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { config } from '@/src/wagmi';

import { LOVE20JoinAbi } from '@/src/abis/LOVE20Join';
import { safeToBigInt } from '@/src/lib/clientUtils';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_JOIN as `0x${string}`;

// =====================
// === 读取 Hook ===
// =====================

/**
 * Hook for currentRound
 */
export const useCurrentRound = (flag: boolean = true) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20JoinAbi,
    functionName: 'currentRound',
    query: {
      enabled: flag,
    },
  });

  return { currentRound: safeToBigInt(data), isPending, error };
};

/**
 * Hook for joinedAmountByActionId tokenAddress => actionId => amount
 */
export const useJoinedAmountByActionId = (tokenAddress: `0x${string}`, actionId: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20JoinAbi,
    functionName: 'amountByActionId',
    args: [tokenAddress, actionId],
    query: {
      enabled: !!tokenAddress && actionId !== undefined,
    },
  });

  return { joinedAmountByActionId: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for joinedAmountByActionIdByAccount
 */
export const useJoinedAmountByActionIdByAccount = (
  tokenAddress: `0x${string}`,
  actionId: bigint,
  account: `0x${string}`,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20JoinAbi,
    functionName: 'amountByActionIdByAccount',
    args: [tokenAddress, actionId, account],
    query: {
      enabled: !!tokenAddress && !!account && actionId !== undefined,
    },
  });

  return { joinedAmountByActionIdByAccount: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for originBlocks
 */
export const useOriginBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20JoinAbi,
    functionName: 'originBlocks',
  });

  return { originBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook for phaseBlocks
 */
export const useRoundBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20JoinAbi,
    functionName: 'phaseBlocks',
  });

  return { phaseBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook for roundByBlockNumber
 */
export const useRoundByBlockNumber = (blockNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20JoinAbi,
    functionName: 'roundByBlockNumber',
    args: [blockNumber],
  });

  return { round: data as bigint | undefined, isPending, error };
};

/**
 * Hook for stakedAmountByAccount
 */
export const useStakedAmountByAccount = (tokenAddress: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20JoinAbi,
    functionName: 'amountByAccount',
    args: [tokenAddress, account],
    query: {
      enabled: !!tokenAddress && !!account,
    },
  });

  return { stakedAmount: safeToBigInt(data), isPending, error };
};

// =====================
// === 写入 Hook ===
// =====================

/**
 * Hook for join
 */
export function useJoin() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const join = async (
    tokenAddress: `0x${string}`,
    actionId: bigint,
    additionalStakeAmount: bigint,
    verificationInfos_: string[],
  ) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20JoinAbi,
        functionName: 'join',
        args: [tokenAddress, actionId, additionalStakeAmount, verificationInfos_],
      });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20JoinAbi,
        functionName: 'join',
        args: [tokenAddress, actionId, additionalStakeAmount, verificationInfos_],
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

  return { join, isPending, isConfirming, writeError: combinedError, isConfirmed };
}

/**
 * Hook for withdraw
 */
export function useWithdraw() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const withdraw = async (tokenAddress: `0x${string}`, actionId: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20JoinAbi,
        functionName: 'withdraw',
        args: [tokenAddress, actionId],
      });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20JoinAbi,
        functionName: 'withdraw',
        args: [tokenAddress, actionId],
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

  return { withdraw, isPending, isConfirming, writeError: combinedError, isConfirmed };
}
