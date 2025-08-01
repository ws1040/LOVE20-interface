// hooks/useLove20Join.ts

import { useState, useEffect } from 'react';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { useUniversalTransaction } from '@/src/lib/universalTransaction';
import { deepLogError, logError, logWeb3Error } from '@/src/lib/debugUtils';
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

  return { originBlocks: data ? safeToBigInt(data) : undefined, isPending, error };
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

  return { phaseBlocks: data ? safeToBigInt(data) : undefined, isPending, error };
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

  return { round: data ? safeToBigInt(data) : undefined, isPending, error };
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
/**
 * Hook for join (统一交易处理器版本)
 * 自动兼容TUKE钱包和其他标准钱包
 */
export function useJoin() {
  // 使用统一交易处理器
  const { execute, isPending, isConfirming, isConfirmed, error, hash, isTukeMode } = useUniversalTransaction(
    LOVE20JoinAbi,
    CONTRACT_ADDRESS,
    'join',
  );

  // 包装join函数，保持原有的接口
  const join = async (
    tokenAddress: `0x${string}`,
    actionId: bigint,
    additionalStakeAmount: bigint,
    verificationInfos_: string[],
  ) => {
    console.log('提交join交易:', { tokenAddress, actionId, additionalStakeAmount, verificationInfos_, isTukeMode });
    return await execute([tokenAddress, actionId, additionalStakeAmount, verificationInfos_]);
  };

  // 错误日志记录
  useEffect(() => {
    if (hash) {
      console.log('join tx hash:', hash);
    }
    if (error) {
      console.log('提交join交易错误:');
      logWeb3Error(error);
      logError(error);
    }
  }, [hash, error]);

  return {
    join,
    isPending,
    isConfirming,
    writeError: error,
    isConfirmed,
    hash,
    isTukeMode,
  };
}

/**
 * Hook for withdraw
 */
/**
 * Hook for withdraw (统一交易处理器版本)
 * 自动兼容TUKE钱包和其他标准钱包
 */
export function useWithdraw() {
  // 使用统一交易处理器
  const { execute, isPending, isConfirming, isConfirmed, error, hash, isTukeMode } = useUniversalTransaction(
    LOVE20JoinAbi,
    CONTRACT_ADDRESS,
    'withdraw',
  );

  // 包装withdraw函数，保持原有的接口
  const withdraw = async (tokenAddress: `0x${string}`, actionId: bigint) => {
    console.log('提交withdraw交易:', { tokenAddress, actionId, isTukeMode });
    return await execute([tokenAddress, actionId]);
  };

  // 错误日志记录
  useEffect(() => {
    if (hash) {
      console.log('withdraw tx hash:', hash);
    }
    if (error) {
      console.log('提交withdraw交易错误:');
      logWeb3Error(error);
      logError(error);
    }
  }, [hash, error]);

  return {
    withdraw,
    isPending,
    isConfirming,
    writeError: error,
    isConfirmed,
    hash,
    isTukeMode,
  };
}
