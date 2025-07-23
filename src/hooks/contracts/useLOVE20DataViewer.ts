// hooks/contracts/useLOVE20Launch.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20DataViewerAbi } from '@/src/abis/LOVE20DataViewer';
import {
  JoinedAction,
  LaunchInfo,
  VerifiedAddress,
  RewardInfo,
  TokenInfo,
  VerificationInfo,
  JoinableActionDetail,
  GovData,
  PairInfo,
  VerifyingAction,
  MyVerifyingAction,
} from '@/src/types/love20types';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_PERIPHERAL_DATAVIEWER as `0x${string}`;

// =====================
// === 读取 Hooks ===
// =====================
/**
 * Hook for joinAddress
 * Reads the address of the join contract.
 */
export const useJoinAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'joinAddress',
  });

  return { joinAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for launchAddress
 * Reads the address of the launch contract.
 */
export const useLaunchAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'launchAddress',
  });

  return { launchAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for mintAddress
 * Reads the address of the mint contract.
 */
export const useMintAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'mintAddress',
  });

  return { mintAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for launchInfos
 */
export const useLaunchInfos = (addresses: `0x${string}`[]) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'launchInfos',
    args: [addresses],
  });

  return { launchInfos: data as any[] | undefined, isPending, error };
};

/**
 * Hook for tokensByPage
 */
export const useTokensByPage = (start: bigint, end: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'tokensByPage',
    args: [start, end],
  });

  return { tokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for childTokensByPage
 */
export const useChildTokensByPage = (parentTokenAddress: `0x${string}`, start: bigint, end: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'childTokensByPage',
    args: [parentTokenAddress, start, end],
  });

  return { childTokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for launchingTokensByPage
 */
export const useLaunchingTokensByPage = (start: bigint, end: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'launchingTokensByPage',
    args: [start, end],
  });

  return { launchingTokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for launchedTokensByPage
 */
export const useLaunchedTokensByPage = (start: bigint, end: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'launchedTokensByPage',
    args: [start, end],
  });

  return { launchedTokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for launchingChildTokensByPage
 */
export const useLaunchingChildTokensByPage = (parentTokenAddress: `0x${string}`, start: bigint, end: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'launchingChildTokensByPage',
    args: [parentTokenAddress, start, end],
  });

  return { launchingChildTokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for launchedChildTokensByPage
 */
export const useLaunchedChildTokensByPage = (parentTokenAddress: `0x${string}`, start: bigint, end: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'launchedChildTokensByPage',
    args: [parentTokenAddress, start, end],
  });

  return { launchedChildTokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for participatedTokensByPage
 */
export const useParticipatedTokensByPage = (walletAddress: `0x${string}`, start: bigint, end: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'participatedTokensByPage',
    args: [walletAddress, start, end],
  });

  return { participatedTokens: data as `0x${string}`[] | undefined, isPending, error };
};

/**
 * Hook for actionSubmits
 */
export const useActionSubmits = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'actionSubmits',
    args: [tokenAddress, round],
    query: {
      enabled: !!tokenAddress && !!round,
    },
  });

  return { actionSubmits: data as any[] | undefined, isPending, error };
};

/**
 * Hook for actionInfosByIds
 */
export const useActionInfosByIds = (tokenAddress: `0x${string}`, actionIds: bigint[]) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'actionInfosByIds',
    args: [tokenAddress, actionIds],
    query: {
      enabled: !!tokenAddress && actionIds.length > 0,
    },
  });

  return { actionInfos: data as any[] | undefined, isPending, error };
};

/**
 * Hook for actionInfosByPage
 */
export const useActionInfosByPage = (tokenAddress: `0x${string}`, start: bigint, end: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'actionInfosByPage',
    args: [tokenAddress, start, end],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return { actionInfos: data as any[] | undefined, isPending, error };
};

/**
 * Hook to get the number of votes (multiple).
 */
export const useVotesNums = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'votesNums',
    args: [tokenAddress, round || BigInt(0)],
    query: {
      enabled: !!tokenAddress && round !== undefined,
    },
  });

  return {
    actionIds: data?.[0] as bigint[] | undefined,
    votes: data?.[1] as bigint[] | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for joinedActions
 * Reads the joined actions of an account for a token.
 */
export const useJoinedActions = (tokenAddress: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'joinedActions',
    args: [tokenAddress, account],
    query: {
      enabled: !!tokenAddress && !!account,
    },
  });

  return { joinedActions: data ? [...(data as unknown as JoinedAction[])] : [], isPending, error };
};

/**
 * Hook for joinableActionDetailsWithJoinedInfos
 * Reads the joinable action details with joined infos.
 */
export const useJoinableActions = (tokenAddress: `0x${string}`, round: bigint, account: `0x${string}`) => {
  const enableRead = !!tokenAddress && !!account && round !== undefined;

  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'joinableActions',
    args: [tokenAddress, round, account],
    query: {
      enabled: enableRead,
    },
  });

  // 如果条件不满足，则直接返回默认值
  if (round === 0n || !enableRead) {
    return { joinableActionDetails: [], joinedActions: [], isPending: false, error: undefined };
  }

  return {
    joinableActionDetails: data && data[0] ? [...(data[0] as unknown as JoinableActionDetail[])] : [],
    joinedActions: data && data[1] ? [...(data[1] as unknown as JoinedAction[])] : [],
    isPending,
    error,
  };
};

/**
 * Hook for verifyingActions
 */
export const useVerifyingActions = (tokenAddress: `0x${string}`, round: bigint, account: `0x${string}`) => {
  const enableRead = !!tokenAddress && !!account && round !== undefined;

  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'verifyingActions',
    args: [tokenAddress, round, account],
    query: {
      enabled: enableRead,
    },
  });

  if (round === 0n || !enableRead) {
    return { verifyingActions: [], isPending: false, error: undefined };
  }

  return {
    verifyingActions: data ? [...(data as unknown as VerifyingAction[])] : [],
    isPending,
    error,
  };
};

/**
 * Hook for verifingActionsByAccount
 */
export const useVerifingActionsByAccount = (tokenAddress: `0x${string}`, round: bigint, account: `0x${string}`) => {
  const enableRead = !!tokenAddress && !!account && round !== undefined;

  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'verifingActionsByAccount',
    args: [tokenAddress, round, account],
    query: {
      enabled: enableRead,
    },
  });

  if (round === 0n || !enableRead) {
    return { myVerifyingActions: [], isPending: false, error: undefined };
  }

  return {
    myVerifyingActions: data ? [...(data as unknown as MyVerifyingAction[])] : [],
    isPending,
    error,
  };
};

/**
 * Hook for tokenDetail
 * Reads the details of a token.
 */
export const useTokenDetail = (tokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'tokenDetail',
    args: [tokenAddress],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    token: data?.[0] as TokenInfo | undefined,
    launchInfo: data?.[1] as LaunchInfo | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for tokenDetailBySymbol
 * Reads the details of a token by symbol.
 */
export const useTokenDetailBySymbol = (symbol: string) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'tokenDetailBySymbol',
    args: [symbol],
    query: {
      enabled: !!symbol,
    },
  });
  return {
    token: data?.[0] as TokenInfo | undefined,
    launchInfo: data?.[1] as LaunchInfo | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for tokenDetails
 * Reads the details of multiple tokens.
 */
export const useTokenDetails = (tokenAddresses: `0x${string}`[]) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'tokenDetails',
    args: [tokenAddresses],
  });
  return {
    tokens: data?.[0] as TokenInfo[] | undefined,
    launchInfos: data?.[1] as LaunchInfo[] | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for verifiedAddressesByAction
 * Reads the verified addresses by action.
 */
export const useVerifiedAddressesByAction = (tokenAddress: `0x${string}`, round: bigint, actionId: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'verifiedAddressesByAction',
    args: [tokenAddress, round, actionId],
    query: {
      enabled: !!tokenAddress && round !== undefined && actionId !== undefined,
    },
  });
  return { verifiedAddresses: data as VerifiedAddress[], isPending, error };
};

/**
 * Hook for govRewardsByAccountByRounds
 * Reads the gov rewards by account by rounds.
 */
export const useGovRewardsByAccountByRounds = (
  tokenAddress: `0x${string}`,
  account: `0x${string}`,
  startRound: bigint,
  endRound: bigint,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'govRewardsByAccountByRounds',
    args: [tokenAddress, account, startRound, endRound],
    query: {
      enabled: !!tokenAddress && !!account && startRound !== undefined && endRound !== undefined,
    },
  });

  return { rewards: data as RewardInfo[], isPending, error };
};

export const useVerificationInfosByAction = (tokenAddress: `0x${string}`, round: bigint, actionId: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'verificationInfosByAction',
    args: [tokenAddress, round, actionId],
    query: {
      enabled: !!tokenAddress && round !== undefined && actionId !== undefined,
    },
  });
  return { verificationInfos: data as VerificationInfo[], isPending, error };
};

export const useVerificationInfosByAccount = (
  tokenAddress: `0x${string}`,
  actionId: bigint,
  account: `0x${string}`,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'verificationInfosByAccount',
    args: [tokenAddress, actionId, account],
    query: {
      enabled: !!tokenAddress && !!account && actionId !== undefined,
    },
  });

  return {
    verificationKeys: data?.[0] as string[],
    verificationInfos: data?.[1] as string[],
    isPending,
    error,
  };
};

export const useGovData = (tokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'govData',
    args: [tokenAddress],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return { govData: data as GovData, isPending, error };
};

export const useTokenPairInfoWithAccount = (
  account: `0x${string}`,
  tokenAddress: `0x${string}`,
  parentTokenAddress: `0x${string}`,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'tokenPairInfoWithAccount',
    args: [account, tokenAddress, parentTokenAddress],
    query: {
      enabled: !!account && !!tokenAddress && !!parentTokenAddress,
    },
  });

  return { pairInfo: data as PairInfo, isPending, error };
};
