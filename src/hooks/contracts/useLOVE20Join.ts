// hooks/useLove20Join.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { lOVE20JoinAbi } from '../../abis/LOVE20Join';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_JOIN as `0x${string}`;

// =====================
// === 读取 Hook ===
// =====================

/**
 * Hook for _caculateRandomAccounts
 */
export const useCaculateRandomAccounts = (
  randomSeed: bigint,
  num: bigint,
  tokenAddress: `0x${string}`,
  round: bigint,
  actionId: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: '_caculateRandomAccounts',
    args: [randomSeed, num, tokenAddress, round, actionId],
  });

  return { randomAccounts: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for cumulatedJoinedAmountsByActionId
 */
export const useCumulatedJoinedAmountsByActionId = (
  account: `0x${string}`,
  param1: bigint,
  param2: bigint,
  param3: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'cumulatedJoinedAmountsByActionId',
    args: [account, param1, param2, param3],
  });

  return { cumulatedAmount: data as bigint | undefined, isPending, error };
};

/**
 * Hook for currentRound
 */
export const useCurrentRound = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'currentRound',
  });

  return { currentRound: data as bigint, isPending, error };
};

/**
 * Hook for joinedAccountsByActionId tokenAddress => round => actionId => accounts
 */
export const useJoinedAccountsByActionId = (
  tokenAddress: `0x${string}`,
  round: bigint,
  actionId: bigint,
  accountIndex: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'joinedAccountsByActionId',
    args: [tokenAddress, round, actionId, accountIndex],
  });

  return { joinedAccount: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for joinedAmount
 */
export const useJoinedAmount = (
  tokenAddress: `0x${string}`,
  round?: bigint
) => {

  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'joinedAmount',
    args: [tokenAddress, round || BigInt(0)],
    query: {
      enabled: !!tokenAddress && round !== undefined && round !== BigInt(0), 
    },
  });

  return {
    joinedAmount: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for joinedAmountByActionId tokenAddress => round => actionId => amount
 */
export const useJoinedAmountByActionId = (
  tokenAddress: `0x${string}`,
  round: bigint,
  actionId: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'joinedAmountByActionId',
    args: [tokenAddress, round, actionId],
    query: {
      enabled: !!tokenAddress && !!round && actionId !== undefined, 
    },
  });

  return { joinedAmountByActionId: data as bigint | undefined, isPending, error };
};

/**
 * Hook for joinedAmountByActionIdByAccount
 */
export const useJoinedAmountByActionIdByAccount = (
  tokenAddress: `0x${string}`,
  round: bigint,
  actionId: bigint,
  account: `0x${string}`
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'joinedAmountByActionIdByAccount',
    args: [tokenAddress, round, actionId, account],
    query: {
      enabled: !!tokenAddress && !!round && !!account && actionId !== undefined, 
    },
  });

  return { joinedAmountByActionIdByAccount: data as bigint | undefined, isPending, error };
};

/**
 * Hook for lastJoinedRoundByAccountByActionId
 */
export const useLastJoinedRoundByAccountByActionId = (
  tokenAddress: `0x${string}`,
  account: `0x${string}`,
  actionId: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'lastJoinedRoundByAccountByActionId',
    args: [tokenAddress, account, actionId],
    query: {
      enabled: !!tokenAddress && !!account, 
    },
  });

  return { lastJoinedRound: data as bigint | undefined, isPending, error };
};

/**
 * Hook for originBlocks
 */
export const useOriginBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'originBlocks',
  });

  return { originBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook for randomAccounts
 */
export const useRandomAccounts = (
  tokenAddress: `0x${string}`,
  round: bigint,
  actionId: bigint,
  randomSeed: bigint,
  num: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'randomAccounts',
    args: [tokenAddress, round, actionId, randomSeed, num],
  });

  return { randomAccounts: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for roundBlocks
 */
export const useRoundBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'roundBlocks',
  });

  return { roundBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook for roundByBlockNumber
 */
export const useRoundByBlockNumber = (blockNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'roundByBlockNumber',
    args: [blockNumber],
  });

  return { round: data as bigint | undefined, isPending, error };
};

/**
 * Hook for roundRange
 */
export const useRoundRange = (round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'roundRange',
    args: [round],
  });

  return {
    start: data?.[0] as bigint | undefined,
    end: data?.[1] as bigint | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for stakedActionIdsByAccount
 */
export const useStakedActionIdsByAccount = (
  account1: `0x${string}`,
  account2: `0x${string}`,
  param: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'stakedActionIdsByAccount',
    args: [account1, account2, param],
  });

  return { stakedActionId: data as bigint | undefined, isPending, error };
};

/**
 * Hook for stakedAmountByAccount
 */
export const useStakedAmountByAccount = (
  tokenAddress: `0x${string}`,
  account: `0x${string}`
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'stakedAmountByAccount',
    args: [tokenAddress, account],
  });

  return { stakedAmount: data as bigint | undefined, isPending, error };
};

/**
 * Hook for stakedAmountByAccountByActionId
 */
export const useStakedAmountByAccountByActionId = (
  account1: `0x${string}`,
  account2: `0x${string}`,
  actionId: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'stakedAmountByAccountByActionId',
    args: [account1, account2, actionId],
  });

  return { stakedAmountByAccountByActionId: data as bigint | undefined, isPending, error };
};

/**
 * Hook for stakedAmountByActionId
 */
export const useStakedAmountByActionId = (
  account: `0x${string}`,
  actionId: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'stakedAmountByActionId',
    args: [account, actionId],
  });

  return { stakedAmountByActionId: data as bigint | undefined, isPending, error };
};

/**
 * Hook for submitAddress
 */
export const useSubmitAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'submitAddress',
  });

  return { submitAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for verificationInfo
 */
export const useVerificationInfo = (
  tokenAddress: `0x${string}`,
  round: bigint,
  actionId: bigint,
  account: `0x${string}`,
  isJoined: boolean
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'verificationInfo',
    args: [tokenAddress, round, actionId, account],
    query: {
      enabled: isJoined && !!tokenAddress && !!round && !!account && actionId !== undefined, 
    },
  });

  return { verificationInfo: data as string | undefined, isPending, error };
};

/**
 * Hook for verificationInfoStrings
 */
export const useVerificationInfoStrings = (index: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'verificationInfoStrings',
    args: [index],
  });

  return { verificationInfoString: data as string | undefined, isPending, error };
};

/**
 * Hook for verificationInfos
 */
export const useVerificationInfos = (
  account: `0x${string}`,
  param1: bigint,
  param2: bigint,
  anotherAccount: `0x${string}`
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'verificationInfos',
    args: [account, param1, param2, anotherAccount],
  });

  return { verificationInfoValue: data as bigint | undefined, isPending, error };
};

/**
 * Hook for voteAddress
 */
export const useVoteAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20JoinAbi,
    functionName: 'voteAddress',
  });

  return { voteAddress: data as `0x${string}` | undefined, isPending, error };
};

// =====================
// === 写入 Hook ===
// =====================

/**
 * Hook for generateAndStoreRandomAccounts
 */
export const useGenerateAndStoreRandomAccounts = () => {
  const {
    writeContract,
    data: writeData,
    isPending,
    error,
  } = useWriteContract();

  const generateAndStoreRandomAccounts = async (
    tokenAddress: `0x${string}`,
    round: bigint,
    actionId: bigint,
    randomSeed: bigint,
    num: bigint
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: lOVE20JoinAbi,
        functionName: 'generateAndStoreRandomAccounts',
        args: [tokenAddress, round, actionId, randomSeed, num],
      });
    } catch (err) {
      console.error('Generate and Store Random Accounts failed:', err);
    }
  };

  const { isPending: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { generateAndStoreRandomAccounts, writeData, isPending, error, isConfirming, isConfirmed };
};

/**
 * Hook for join
 */
export const useJoin = () => {
  const {
    writeContract,
    data: writeData,
    isPending,
    error,
  } = useWriteContract();

  const join = async (
    tokenAddress: `0x${string}`,
    actionId: bigint,
    additionalStakeAmount: bigint,
    verificationInfo_: string,
    rounds: bigint
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: lOVE20JoinAbi,
        functionName: 'join',
        args: [tokenAddress, actionId, additionalStakeAmount, verificationInfo_, rounds],
      });
    } catch (err) {
      console.error('Join failed:', err);
    }
  };

  const { isPending: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { join, writeData, isPending, error, isConfirming, isConfirmed };
};

/**
 * Hook for updateVerificationInfo
 */
export const useUpdateVerificationInfo = () => {
  const {
    writeContract,
    data: writeData,
    isPending,
    error,
  } = useWriteContract();

  const updateVerificationInfo = async (
    tokenAddress: `0x${string}`,
    actionId: bigint,
    aVerificationInfo: string,
    rounds: bigint
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: lOVE20JoinAbi,
        functionName: 'updateVerificationInfo',
        args: [tokenAddress, actionId, aVerificationInfo, rounds],
      });
    } catch (err) {
      console.error('Update Verification Info failed:', err);
    }
  };

  const { isPending: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { updateVerificationInfo, writeData, isPending, error, isConfirming, isConfirmed };
};

/**
 * Hook for withdraw
 */
export const useWithdraw = () => {
  const {
    writeContract,
    data: writeData,
    isPending,
    error,
  } = useWriteContract();

  const withdraw = async (
    tokenAddress: `0x${string}`,
    actionId: bigint
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: lOVE20JoinAbi,
        functionName: 'withdraw',
        args: [tokenAddress, actionId],
      });
    } catch (err) {
      console.error('Withdraw failed:', err);
    }
  };

  const { isPending: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { withdraw, writeData, isPending, error, isConfirming, isConfirmed };
};