// hooks/contracts/useLOVE20Launch.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20LaunchAbi } from '@/src/abis/LOVE20Launch';
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

  return { firstParentTokenFundraisingGoal: data as bigint | undefined, isPending, error };
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

  return { parentTokenFundraisingGoal: data as bigint | undefined, isPending, error };
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

  return { secondHalfMinBlocks: data as bigint | undefined, isPending, error };
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

  return { tokenSymbolLength: data as bigint | undefined, isPending, error };
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

  return { childTokenNum: data as bigint | undefined, isPending, error };
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

  return { launchedChildTokenNum: data as bigint | undefined, isPending, error };
};

/**
 * Hook for claimed
 */
export const useClaimed = (tokenAddress: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'claimed',
    args: [tokenAddress, account],
    query: {
      enabled: !!tokenAddress && !!account,
    },
  });

  return { claimed: data as boolean | undefined, isPending, error };
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

  return { contributed: data as bigint | undefined, isPending, error, refetch };
};

/**
 * Hook for extraRefunded
 */
export const useExtraRefunded = (tokenAddress: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'extraRefunded',
    args: [tokenAddress, account],
    query: {
      enabled: !!tokenAddress && !!account,
    },
  });

  return { extraRefunded: data as bigint | undefined, isPending, error };
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
        parentTokenFundraisingGoal: data.parentTokenFundraisingGoal as bigint,
        secondHalfMinBlocks: data.secondHalfMinBlocks as bigint,
        launchAmount: data.launchAmount as bigint,
        startBlock: data.startBlock as bigint,
        secondHalfStartBlock: data.secondHalfStartBlock as bigint,
        endBlock: data.endBlock as bigint,
        hasEnded: data.hasEnded as boolean,
        participantCount: data.participantCount as bigint,
        totalContributed: data.totalContributed as bigint,
        totalExtraRefunded: data.totalExtraRefunded as bigint,
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

  return { tokenNum: data as bigint | undefined, isPending, error };
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

  return { lastContributedBlock: data as bigint | undefined, isPending, error };
};

// =======================
// ===== Write Hooks =====
// =======================

/**
 * Hook for claim
 */
export function useClaim() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const claim = async (tokenAddress: `0x${string}`) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20LaunchAbi,
        functionName: 'claim',
        args: [tokenAddress],
      });
    } catch (err) {
      console.error('Claim failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { claim, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/**
 * Hook for contribute
 */
export function useContribute() {
  const { writeContract, isPending, data: writeData, error: writeError } = useWriteContract();

  const contribute = async (tokenAddress: `0x${string}`, parentTokenAmount: bigint, to: `0x${string}`) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20LaunchAbi,
        functionName: 'contribute',
        args: [tokenAddress, parentTokenAmount, to],
      });
    } catch (err) {
      console.error('Contribute failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { contribute, writeData, isPending, writeError, isConfirming, isConfirmed };
}

/**
 * Hook for withdraw
 */
export function useWithdraw() {
  const { writeContract, isPending, data: writeData, error: writeError } = useWriteContract();

  const withdraw = async (tokenAddress: `0x${string}`) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20LaunchAbi,
        functionName: 'withdraw',
        args: [tokenAddress],
      });
    } catch (err) {
      console.error('Withdraw failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { withdraw, writeData, isPending, writeError, isConfirming, isConfirmed };
}

/**
 * Hook for deployToken
 */
export function useLaunchToken() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const launchToken = async (tokenSymbol: string, parentTokenAddress: `0x${string}`) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20LaunchAbi,
        functionName: 'launchToken',
        args: [tokenSymbol, parentTokenAddress],
      });
    } catch (err) {
      console.error('DeployToken failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { launchToken, writeData, isWriting, writeError, isConfirming, isConfirmed };
}
