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
 * Hook for canDeployToken
 */
export const useCanDeployToken = (accountAddress: `0x${string}`, parentTokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'canDeployToken',
    args: [accountAddress, parentTokenAddress],
  });

  return { isEligible: data as boolean | undefined, isPending, error };
};

/**
 * Hook for childTokenNum
 */
export const useChildTokenNum = (parentTokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'childTokenNum',
    args: [parentTokenAddress],
  });

  return { childTokenNum: data as bigint | undefined, isPending, error };
};

/**
 * Hook for childTokensByPage
 */
export const useChildTokensByPage = (
  parentTokenAddress: `0x${string}`,
  start: bigint,
  end: bigint,
  reverse: boolean,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'childTokensByPage',
    args: [parentTokenAddress, start, end, reverse],
  });

  return { childTokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for childTokensByParent
 */
export const useChildTokensByParent = (parentAddress: `0x${string}`, index: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'childTokensByParent',
    args: [parentAddress, index],
  });

  return { childToken: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for claimed
 */
export const useClaimed = (tokenAddress: `0x${string}`, accountAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'claimed',
    args: [tokenAddress, accountAddress],
    query: {
      enabled: !!tokenAddress && !!accountAddress,
    },
  });

  return { claimed: data as boolean | undefined, isPending, error };
};

/**
 * Hook for contributed
 */
export const useContributed = (tokenAddress: `0x${string}`, accountAddress: `0x${string}`) => {
  const { data, isPending, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'contributed',
    args: [tokenAddress, accountAddress],
    query: {
      enabled: !!tokenAddress && !!accountAddress,
    },
  });

  return { contributed: data as bigint | undefined, isPending, error, refetch };
};

/**
 * Hook for extraRefunded
 */
export const useExtraRefunded = (tokenAddress: `0x${string}`, accountAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'extraRefunded',
    args: [tokenAddress, accountAddress],
    query: {
      enabled: !!tokenAddress && !!accountAddress,
    },
  });

  return { extraRefunded: data as bigint | undefined, isPending, error };
};

/**
 * Hook for initialized
 */
export const useInitialized = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'initialized',
    args: [],
  });

  return { initialized: data as boolean | undefined, isPending, error };
};

/**
 * Hook for launchInfos
 */
export const useLaunchInfos = (addresses: `0x${string}`[]) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchInfos',
    args: [addresses],
  });

  return { launchInfos: data as any[] | undefined, isPending, error };
};

/**
 * Hook for launchedChildTokenNum
 */
export const useLaunchedChildTokenNum = (parentTokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchedChildTokenNum',
    args: [parentTokenAddress],
  });

  return { launchedChildTokenNum: data as bigint | undefined, isPending, error };
};

/**
 * Hook for launchedChildTokensByPage
 */
export const useLaunchedChildTokensByPage = (
  parentTokenAddress: `0x${string}`,
  start: bigint,
  end: bigint,
  reverse: boolean,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchedChildTokensByPage',
    args: [parentTokenAddress, start, end, reverse],
  });

  return { launchedChildTokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for launchedTokenNum
 */
export const useLaunchedTokenNum = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchedTokenNum',
    args: [],
  });

  return { launchedTokenNum: data as bigint | undefined, isPending, error };
};

/**
 * Hook for launchedTokensByPage
 */
export const useLaunchedTokensByPage = (start: bigint, end: bigint, reverse: boolean) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchedTokensByPage',
    args: [start, end, reverse],
  });

  return { launchedTokens: data as `0x${string}`[] | undefined, isPending, error };
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
        hasEnded: data.hasEnded as boolean,
        participantCount: data.participantCount as bigint,
        totalContributed: data.totalContributed as bigint,
        totalExtraRefunded: data.totalExtraRefunded as bigint,
      }
    : undefined;

  return { launchInfo, isPending, error };
};

/**
 * Hook for launchingChildTokenNum
 */
export const useLaunchingChildTokenNum = (parentTokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchingChildTokenNum',
    args: [parentTokenAddress],
  });

  return { launchingChildTokenNum: data as bigint | undefined, isPending, error };
};

/**
 * Hook for launchingChildTokensByPage
 */
export const useLaunchingChildTokensByPage = (
  parentTokenAddress: `0x${string}`,
  start: bigint,
  end: bigint,
  reverse: boolean,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchingChildTokensByPage',
    args: [parentTokenAddress, start, end, reverse],
  });

  return { launchingChildTokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for launchingTokenNum
 */
export const useLaunchingTokenNum = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchingTokenNum',
    args: [],
  });

  return { launchingTokenNum: data as bigint | undefined, isPending, error };
};

/**
 * Hook for launchingTokens
 */
export const useLaunchingTokens = (index: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchingTokens',
    args: [index],
  });

  return { launchingToken: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for launchingTokensByPage
 */
export const useLaunchingTokensByPage = (start: bigint, end: bigint, reverse: boolean) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'launchingTokensByPage',
    args: [start, end, reverse],
  });

  return { launchingTokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for mintAddress
 */
export const useMintAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'mintAddress',
    args: [],
  });

  return { mintAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for participatedTokenNum
 */
export const useParticipatedTokenNum = (walletAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'participatedTokenNum',
    args: [walletAddress],
  });

  return { participatedTokenNum: data as bigint | undefined, isPending, error };
};

/**
 * Hook for participatedTokensByPage
 */
export const useParticipatedTokensByPage = (
  walletAddress: `0x${string}`,
  start: bigint,
  end: bigint,
  reverse: boolean,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'participatedTokensByPage',
    args: [walletAddress, start, end, reverse],
  });

  return { participatedTokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for stakeAddress
 */
export const useStakeAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'stakeAddress',
    args: [],
  });

  return { stakeAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for submitAddress
 */
export const useSubmitAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'submitAddress',
    args: [],
  });

  return { submitAddress: data as `0x${string}` | undefined, isPending, error };
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
 * Hook for tokenAddresses
 */
export const useTokenAddresses = (index: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'tokenAddresses',
    args: [index],
  });

  return { tokenAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for tokenNum
 */
export const useTokenNum = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'tokenNum',
    args: [],
  });

  return { tokenNum: data as bigint | undefined, isPending, error };
};

/**
 * Hook for tokensByPage
 */
export const useTokensByPage = (start: bigint, end: bigint, reverse: boolean) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'tokensByPage',
    args: [start, end, reverse],
  });

  return { tokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for lastContributedBlock
 */
export const useLastContributedBlock = (tokenAddress: `0x${string}`, accountAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20LaunchAbi,
    functionName: 'lastContributedBlock',
    args: [tokenAddress, accountAddress],
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
export function useDeployToken() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const deployToken = async (tokenSymbol: string, parentTokenAddress: `0x${string}`) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20LaunchAbi,
        functionName: 'deployToken',
        args: [tokenSymbol, parentTokenAddress],
      });
    } catch (err) {
      console.error('DeployToken failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { deployToken, writeData, isWriting, writeError, isConfirming, isConfirmed };
}
