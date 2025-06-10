// hooks/contracts/useLOVE20Mint.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20MintAbi } from '@/src/abis/LOVE20Mint';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MINT as `0x${string}`;

// =====================
// === 读取 Hook ===
// =====================
/**
 * Hook for ROUND_REWARD_ACTION_PER_THOUSAND
 */
export const useRoundRewardActionPerThousand = () => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'ROUND_REWARD_ACTION_PER_THOUSAND',
    args: [],
  });

  return {
    roundRewardActionPerThousand: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for ROUND_REWARD_GOV_PER_THOUSAND
 */
export const useRoundRewardGovPerThousand = () => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'ROUND_REWARD_GOV_PER_THOUSAND',
    args: [],
  });

  return {
    roundRewardGovPerThousand: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for actionReward
 */
export const useActionReward = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'actionReward',
    args: [tokenAddress, round],
  });

  return {
    actionReward: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for actionRewardByActionIdByAccount
 */
export const useActionRewardByActionIdByAccount = (
  tokenAddress: `0x${string}`,
  round: bigint,
  actionId: bigint,
  accountAddress: `0x${string}`,
) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'actionRewardByActionIdByAccount',
    args: [tokenAddress, round, actionId, accountAddress],
  });

  return {
    actionRewardByActionIdByAccount: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for actionRewardMintedByAccount
 */
export const useActionRewardMintedByAccount = (
  accountAddress: `0x${string}`,
  round: bigint,
  actionId: bigint,
  targetAddress: `0x${string}`,
) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'actionRewardMintedByAccount',
    args: [accountAddress, round, actionId, targetAddress],
  });

  return {
    actionRewardMintedByAccount: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for calculateRoundActionReward
 */
export const useCalculateRoundActionReward = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'calculateRoundActionReward',
    args: [tokenAddress],
  });

  return {
    calculateRoundActionReward: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for calculateRoundGovReward
 */
export const useCalculateRoundGovReward = (tokenAddress: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'calculateRoundGovReward',
    args: [tokenAddress],
  });

  return {
    calculateRoundGovReward: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for currentRound
 */
export const useCurrentRound = () => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'currentRound',
    args: [],
  });

  return {
    currentRound: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for govReward
 */
export const useGovReward = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'govReward',
    args: [tokenAddress, round],
  });

  return {
    govReward: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for govRewardByAccount
 */
export const useGovRewardByAccount = (tokenAddress: `0x${string}`, round: bigint, accountAddress: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'govRewardByAccount',
    args: [tokenAddress, round, accountAddress],
    query: {
      enabled: !!tokenAddress && !!accountAddress && round !== undefined,
    },
  });

  return {
    verifyReward: data?.[0] as bigint | undefined,
    boostReward: data?.[1] as bigint | undefined,
    burnReward: data?.[2] as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for govRewardMintedByAccount
 */
export const useGovRewardMintedByAccount = (
  accountAddress: `0x${string}`,
  round: bigint,
  targetAddress: `0x${string}`,
) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'govRewardMintedByAccount',
    args: [accountAddress, round, targetAddress],
  });

  return {
    govRewardMintedByAccount: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for isRewardPrepared
 */
export const useIsRewardPrepared = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'isRewardPrepared',
    args: [tokenAddress, round],
  });

  return {
    isRewardPrepared: data as boolean | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for originBlocks
 */
export const useOriginBlocks = () => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'originBlocks',
    args: [],
  });

  return {
    originBlocks: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for rewardAvailable
 */
export const useRewardAvailable = (tokenAddress: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'rewardAvailable',
    args: [tokenAddress],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    rewardAvailable: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for rewardBurned
 */
export const useRewardBurned = (accountAddress: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'rewardBurned',
    args: [accountAddress],
  });

  return {
    rewardBurned: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for rewardMinted
 */
export const useRewardMinted = (accountAddress: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'rewardMinted',
    args: [accountAddress],
  });

  return {
    rewardMinted: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for rewardReserved
 */
export const useRewardReserved = (accountAddress: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'rewardReserved',
    args: [accountAddress],
  });

  return {
    rewardReserved: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for phaseBlocks
 */
export const useRoundBlocks = () => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'phaseBlocks',
    args: [],
  });

  return {
    phaseBlocks: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for roundByBlockNumber
 */
export const useRoundByBlockNumber = (blockNumber: bigint) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'roundByBlockNumber',
    args: [blockNumber],
  });

  return {
    roundByBlockNumber: data as bigint | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for stakeAddress
 */
export const useStakeAddress = () => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'stakeAddress',
    args: [],
  });

  return {
    stakeAddress: data as `0x${string}` | undefined,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for verifyAddress
 */
export const useVerifyAddress = () => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'verifyAddress',
    args: [],
  });

  return {
    verifyAddress: data as `0x${string}` | undefined,
    isPending: isLoading,
    error,
  };
};

// =====================
// === 写入 Hook ===
// =====================

/**
 * Hook for mintActionReward
 */
export function useMintActionReward() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const mintActionReward = async (tokenAddress: `0x${string}`, round: bigint, actionId: bigint) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20MintAbi,
        functionName: 'mintActionReward',
        args: [tokenAddress, round, actionId],
      });
    } catch (err) {
      console.error('mintActionReward failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return {
    mintActionReward,
    writeData,
    isWriting,
    writeError,
    isConfirming,
    isConfirmed,
  };
}

/**
 * Hook for mintGovReward
 */
export function useMintGovReward() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const mintGovReward = async (tokenAddress: `0x${string}`, round: bigint) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20MintAbi,
        functionName: 'mintGovReward',
        args: [tokenAddress, round],
      });
    } catch (err) {
      console.error('mintGovReward failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return {
    mintGovReward,
    writeData,
    isWriting,
    writeError,
    isConfirming,
    isConfirmed,
  };
}

/**
 * Hook for prepareRewardIfNeeded
 */
export function usePrepareRewardIfNeeded() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const prepareRewardIfNeeded = async (tokenAddress: `0x${string}`, round: bigint) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20MintAbi,
        functionName: 'prepareRewardIfNeeded',
        args: [tokenAddress],
      });
    } catch (err) {
      console.error('prepareRewardIfNeeded failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return {
    prepareRewardIfNeeded,
    writeData,
    isWriting,
    writeError,
    isConfirming,
    isConfirmed,
  };
}
