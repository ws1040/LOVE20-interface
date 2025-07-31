// hooks/contracts/useLOVE20Launch.ts
import { useState } from 'react';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { Address } from 'viem';

import { config } from '@/src/wagmi';
import { LOVE20LaunchAbi } from '@/src/abis/LOVE20Launch';
import { safeToBigInt } from '@/src/lib/clientUtils';
import { LaunchInfo } from '@/src/types/love20types';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_LAUNCH as `0x${string}`;

// =====================
// === 读取 Hook ===
// =====================

/**
 * Hook for FIRST_PARENT_TOKEN_FUNDRAISING_GOAL
 */
export const useFirstParentTokenFundraisingGoal = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'FIRST_PARENT_TOKEN_FUNDRAISING_GOAL',
    args: [],
  });

  return { firstParentTokenFundraisingGoal: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for PARENT_TOKEN_FUNDRAISING_GOAL
 */
export const useParentTokenFundraisingGoal = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'PARENT_TOKEN_FUNDRAISING_GOAL',
    args: [],
  });

  return { parentTokenFundraisingGoal: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for SECOND_HALF_MIN_BLOCKS
 */
export const useSecondHalfMinBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'SECOND_HALF_MIN_BLOCKS',
    args: [],
  });

  return { secondHalfMinBlocks: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for TOKEN_SYMBOL_LENGTH
 */
export const useTokenSymbolLength = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'TOKEN_SYMBOL_LENGTH',
    args: [],
  });

  return { tokenSymbolLength: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for childTokensCount
 */
export const useChildTokensCount = (parentTokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'childTokensCount',
    args: [parentTokenAddress],
  });

  return { childTokenNum: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for launchedChildTokensCount
 */
export const useLaunchedChildTokensCount = (parentTokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchedChildTokensCount',
    args: [parentTokenAddress],
  });

  return { launchedChildTokenNum: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for claimInfo
 */
export const useClaimInfo = (tokenAddress: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'claimInfo',
    args: [tokenAddress, account],
    query: {
      enabled: !!tokenAddress && !!account,
    },
  });

  return {
    receivedTokenAmount: safeToBigInt(data?.[0]),
    extraRefund: safeToBigInt(data?.[1]),
    isClaimed: data?.[2] as boolean,
    isPending,
    error,
  };
};

/**
 * Hook for contributed
 */
export const useContributed = (tokenAddress: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'contributed',
    args: [tokenAddress, account],
    query: {
      enabled: !!tokenAddress && !!account,
    },
  });

  return { contributed: data ? safeToBigInt(data) : undefined, isPending, error, refetch };
};

/**
 * Hook for launches
 */
export const useLaunchInfo = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchInfo',
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const launchInfo: LaunchInfo | undefined = data
    ? {
        parentTokenAddress: data.parentTokenAddress as `0x${string}`,
        parentTokenFundraisingGoal: safeToBigInt(data.parentTokenFundraisingGoal),
        secondHalfMinBlocks: safeToBigInt(data.secondHalfMinBlocks),
        launchAmount: safeToBigInt(data.launchAmount),
        startBlock: safeToBigInt(data.startBlock),
        secondHalfStartBlock: safeToBigInt(data.secondHalfStartBlock),
        endBlock: safeToBigInt(data.endBlock),
        hasEnded: data.hasEnded as boolean,
        participantCount: safeToBigInt(data.participantCount),
        totalContributed: safeToBigInt(data.totalContributed),
        totalExtraRefunded: safeToBigInt(data.totalExtraRefunded),
      }
    : undefined;

  return { launchInfo, isPending, error };
};

/**
 * Hook for tokenAddressBySymbol
 */
export const useTokenAddressBySymbol = (symbol: string) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'tokenAddressBySymbol',
    args: [symbol],
  });

  return { tokenAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for tokenNum
 */
export const useTokenCount = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'tokensCount',
    args: [],
  });

  return { tokenNum: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for lastContributedBlock
 */
export const useLastContributedBlock = (tokenAddress: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'lastContributedBlock',
    args: [tokenAddress, account],
    query: {
      enabled: !!tokenAddress && !!account,
    },
  });

  return { lastContributedBlock: data ? safeToBigInt(data) : undefined, isPending, error };
};

/**
 * Hook for remainingLaunchCount
 * 查询账户剩余可发起Launch的次数
 */
export const useRemainingLaunchCount = (parentTokenAddress: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'remainingLaunchCount',
    args: [parentTokenAddress, account],
    query: {
      enabled: !!parentTokenAddress && !!account,
    },
  });

  return {
    remainingLaunchCount: data ? safeToBigInt(data) : undefined,
    isPending,
    error,
  };
};

// =======================
// ===== Write Hooks =====
// =======================

/**
 * Hook for claim
 */
export function useClaim() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const claim = async (tokenAddress: `0x${string}`) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        abi: LOVE20LaunchAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'claim',
        args: [tokenAddress],
      });
      const txHash = await writeContract(config, {
        abi: LOVE20LaunchAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'claim',
        args: [tokenAddress],
      });
      setHash(txHash);
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

  return { claim, writeData: hash, isPending, writeError: combinedError, isConfirming, isConfirmed };
}

/**
 * Hook for contribute
 */
export function useContribute() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const contribute = async (tokenAddress: `0x${string}`, parentTokenAmount: bigint, to: `0x${string}`) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        abi: LOVE20LaunchAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'contribute',
        args: [tokenAddress, parentTokenAmount, to],
      });
      const txHash = await writeContract(config, {
        abi: LOVE20LaunchAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'contribute',
        args: [tokenAddress, parentTokenAmount, to],
      });
      setHash(txHash);
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

  return { contribute, writeData: hash, isPending, writeError: combinedError, isConfirming, isConfirmed };
}

/**
 * Hook for withdraw
 */
export function useWithdraw() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const withdraw = async (tokenAddress: `0x${string}`) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        abi: LOVE20LaunchAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'withdraw',
        args: [tokenAddress],
      });
      const txHash = await writeContract(config, {
        abi: LOVE20LaunchAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'withdraw',
        args: [tokenAddress],
      });
      setHash(txHash);
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
  } = useWaitForTransactionReceipt({
    hash,
  });

  const combinedError = error ?? confirmError;

  return { withdraw, writeData: hash, isPending, writeError: combinedError, isConfirming, isConfirmed };
}

export function useLaunchToken() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const launchToken = async (symbol: string, parent: Address) => {
    setIsPending(true);
    setError(null);
    try {
      // await simulateContract(config, {
      //   abi: LOVE20LaunchAbi,
      //   address: CONTRACT_ADDRESS,
      //   functionName: 'launchToken',
      //   args: [symbol, parent],
      // });
      const txHash = await writeContract(config, {
        abi: LOVE20LaunchAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'launchToken',
        args: [symbol, parent],
      });
      setHash(txHash);
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

  return { launchToken, isPending, isConfirming, writeError: combinedError, isConfirmed };
}
