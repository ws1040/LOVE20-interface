// hooks/useLove20Join.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20JoinAbi } from '@/src/abis/LOVE20Join';

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

  return { currentRound: data as bigint, isPending, error };
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

  return { joinedAmountByActionId: data as bigint | undefined, isPending, error };
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

  return { joinedAmountByActionIdByAccount: data as bigint | undefined, isPending, error };
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

  return { stakedAmount: data as bigint, isPending, error };
};

/**
 * Hook for submitAddress
 */
export const useSubmitAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20JoinAbi,
    functionName: 'submitAddress',
  });

  return { submitAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for voteAddress
 */
export const useVoteAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20JoinAbi,
    functionName: 'voteAddress',
  });

  return { voteAddress: data as `0x${string}` | undefined, isPending, error };
};

// =====================
// === 写入 Hook ===
// =====================

/**
 * Hook for join
 */
export const useJoin = () => {
  const { writeContract, data: writeData, isPending, error } = useWriteContract();

  const join = async (
    tokenAddress: `0x${string}`,
    actionId: bigint,
    additionalStakeAmount: bigint,
    verificationInfos_: string[],
    to: `0x${string}`,
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20JoinAbi,
        functionName: 'join',
        args: [tokenAddress, actionId, additionalStakeAmount, verificationInfos_, to],
      });
    } catch (err) {
      console.error('Join failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { join, writeData, isPending, error, isConfirming, isConfirmed };
};

/**
 * Hook for withdraw
 */
export const useWithdraw = () => {
  const { writeContract, data: writeData, isPending, error } = useWriteContract();

  const withdraw = async (tokenAddress: `0x${string}`, actionId: bigint) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20JoinAbi,
        functionName: 'withdraw',
        args: [tokenAddress, actionId],
      });
    } catch (err) {
      console.error('Withdraw failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { withdraw, writeData, isPending, error, isConfirming, isConfirmed };
};
