// hooks/contracts/useLOVE20Mint.ts

import { useState } from 'react';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { config } from '@/src/wagmi';

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
  account: `0x${string}`,
) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'actionRewardByActionIdByAccount',
    args: [tokenAddress, round, actionId, account],
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
  account: `0x${string}`,
  round: bigint,
  actionId: bigint,
  targetAddress: `0x${string}`,
) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'actionRewardMintedByAccount',
    args: [account, round, actionId, targetAddress],
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
export const useGovRewardByAccount = (tokenAddress: `0x${string}`, round: bigint, account: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'govRewardByAccount',
    args: [tokenAddress, round, account],
    query: {
      enabled: !!tokenAddress && !!account && round !== undefined,
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
export const useGovRewardMintedByAccount = (account: `0x${string}`, round: bigint, targetAddress: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'govRewardMintedByAccount',
    args: [account, round, targetAddress],
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
export const useRewardBurned = (account: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'rewardBurned',
    args: [account],
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
export const useRewardMinted = (account: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'rewardMinted',
    args: [account],
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
export const useRewardReserved = (account: `0x${string}`) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20MintAbi,
    functionName: 'rewardReserved',
    args: [account],
  });

  return {
    rewardReserved: data as bigint | undefined,
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
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const mintActionReward = async (tokenAddress: `0x${string}`, round: bigint, actionId: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20MintAbi,
        functionName: 'mintActionReward',
        args: [tokenAddress, round, actionId],
      });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20MintAbi,
        functionName: 'mintActionReward',
        args: [tokenAddress, round, actionId],
      });
      setHash(txHash);
      return txHash;
    } catch (err: any) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return {
    mintActionReward,
    isPending,
    isConfirming,
    writeError: error,
    isConfirmed,
  };
}

/**
 * Hook for mintGovReward
 */
export function useMintGovReward() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const mintGovReward = async (tokenAddress: `0x${string}`, round: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20MintAbi,
        functionName: 'mintGovReward',
        args: [tokenAddress, round],
      });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20MintAbi,
        functionName: 'mintGovReward',
        args: [tokenAddress, round],
      });
      setHash(txHash);
      return txHash;
    } catch (err: any) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return {
    mintGovReward,
    isPending,
    isConfirming,
    writeError: error,
    isConfirmed,
  };
}

/**
 * Hook for prepareRewardIfNeeded
 */
export function usePrepareRewardIfNeeded() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const prepareRewardIfNeeded = async (tokenAddress: `0x${string}`, round: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20MintAbi,
        functionName: 'prepareRewardIfNeeded',
        args: [tokenAddress],
      });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20MintAbi,
        functionName: 'prepareRewardIfNeeded',
        args: [tokenAddress],
      });
      setHash(txHash);
      return txHash;
    } catch (err: any) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return {
    prepareRewardIfNeeded,
    isPending,
    isConfirming,
    writeError: error,
    isConfirmed,
  };
}
