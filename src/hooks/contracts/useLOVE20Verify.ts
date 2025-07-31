// hooks/contracts/useLOVE20Verify.ts

import { useState } from 'react';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { config } from '@/src/wagmi';

import { LOVE20VerifyAbi } from '@/src/abis/LOVE20Verify';
import { safeToBigInt } from '@/src/lib/clientUtils';

// 定义合约地址，请根据实际情况设置
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_VERIFY as `0x${string}`;

// =====================
// === 读取 Hooks ===
// =====================

/**
 * Hook for currentRound
 */
export const useCurrentRound = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'currentRound',
  });

  return { currentRound: safeToBigInt(data), isPending, error };
};

/**
 * Hook for firstTokenAddress
 */
export const useFirstTokenAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'firstTokenAddress',
  });

  return { firstTokenAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for originBlocks
 */
export const useOriginBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'originBlocks',
  });

  return { originBlocks: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for randomAddress
 */
export const useRandomAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'randomAddress',
  });

  return { randomAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for phaseBlocks
 */
export const useRoundBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
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
    abi: LOVE20VerifyAbi,
    functionName: 'roundByBlockNumber',
    args: [blockNumber],
    query: {
      enabled: blockNumber !== undefined,
    },
  });

  return { roundByBlockNumber: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for score
 */
export const useScore = (account: `0x${string}`, someNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'score',
    args: [account, someNumber],
    query: {
      enabled: !!account && someNumber !== undefined,
    },
  });

  return { score: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for scoreByActionId
 */
export const useScoreByActionId = (account: `0x${string}`, someNumber1: bigint, someNumber2: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'scoreByActionId',
    args: [account, someNumber1, someNumber2],
    query: {
      enabled: !!account && someNumber1 !== undefined && someNumber2 !== undefined,
    },
  });

  return { scoreByActionId: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for scoreByActionIdByAccount
 */
export const useScoreByActionIdByAccount = (
  account: `0x${string}`,
  someNumber1: bigint,
  someNumber2: bigint,
  anotherAccount: `0x${string}`,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'scoreByActionIdByAccount',
    args: [account, someNumber1, someNumber2, anotherAccount],
    query: {
      enabled: !!account && someNumber1 !== undefined && someNumber2 !== undefined && !!anotherAccount,
    },
  });

  return { scoreByActionIdByAccount: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for scoreByVerifier
 */
export const useScoreByVerifier = (tokenAddress: `0x${string}`, round: bigint, verifier: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'scoreByVerifier',
    args: [tokenAddress, round, verifier],
    query: {
      enabled: !!tokenAddress && !!verifier && round !== undefined,
    },
  });
  return { scoreByVerifier: safeToBigInt(data), isPending, error };
};

/**
 * Hook for scoreByVerifierByActionId
 */
export const useScoreByVerifierByActionId = (
  tokenAddress: `0x${string}`,
  round: bigint,
  verifier: `0x${string}`,
  actionId: bigint,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'scoreByVerifierByActionId',
    args: [tokenAddress, round, verifier, actionId],
    query: {
      enabled: !!tokenAddress && round !== undefined && !!verifier && actionId !== undefined,
    },
  });

  return { scoreByVerifierByActionId: safeToBigInt(data), isPending, error };
};

/**
 * Hook for scoreWithReward
 */
export const useScoreWithReward = (account: `0x${string}`, someNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'scoreWithReward',
    args: [account, someNumber],
    query: {
      enabled: !!account && someNumber !== undefined,
    },
  });

  return { scoreWithReward: data ? safeToBigInt(data) : undefined, isPending, error };
};

// =====================
// === 写入 Hooks ===
// =====================

/**
 * Hook for verify
 */
export function useVerify() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const verify = async (tokenAddress: `0x${string}`, actionId: bigint, abstentionScore: bigint, scores: bigint[]) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20VerifyAbi,
        functionName: 'verify',
        args: [tokenAddress, actionId, abstentionScore, scores],
      });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20VerifyAbi,
        functionName: 'verify',
        args: [tokenAddress, actionId, abstentionScore, scores],
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

  return { verify, isPending, isConfirming, writeError: combinedError, isConfirmed };
}
