// hooks/contracts/useLOVE20RoundViewer.ts

import { useReadContract } from 'wagmi';
import { LOVE20RoundViewerAbi } from '@/src/abis/LOVE20RoundViewer';
import {
  JoinedAction,
  VerifiedAddress,
  RewardInfo,
  VerificationInfo,
  JoinableAction,
  GovData,
  VerifyingAction,
  MyVerifyingAction,
  VotingAction,
  TokenStats,
  ActionReward,
  ActionInfo,
} from '@/src/types/love20types';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_PERIPHERAL_ROUNDVIEWER as `0x${string}`;

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
    abi: LOVE20RoundViewerAbi,
    functionName: 'joinAddress',
  });

  return { joinAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for mintAddress
 * Reads the address of the mint contract.
 */
export const useMintAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'mintAddress',
  });

  return { mintAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for submitAddress
 * Reads the address of the submit contract.
 */
export const useSubmitAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'submitAddress',
  });

  return { submitAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for verifyAddress
 * Reads the address of the verify contract.
 */
export const useVerifyAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'verifyAddress',
  });

  return { verifyAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for voteAddress
 * Reads the address of the vote contract.
 */
export const useVoteAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'voteAddress',
  });

  return { voteAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for actionSubmits
 */
export const useActionSubmits = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
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
    abi: LOVE20RoundViewerAbi,
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
    abi: LOVE20RoundViewerAbi,
    functionName: 'actionInfosByPage',
    args: [tokenAddress, start, end],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return { actionInfos: data as any[] | undefined, isPending, error };
};

/**
 * Hook for votingActions
 */
export const useVotingActions = (tokenAddress: `0x${string}`, round: bigint, account: `0x${string}`) => {
  const enableRead = !!tokenAddress && !!account && round !== undefined;

  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'votingActions',
    args: [tokenAddress, round, account],
    query: {
      enabled: enableRead,
    },
  });

  if (round === 0n || !enableRead) {
    return { votingActions: [], isPending: false, error: undefined };
  }

  return {
    votingActions: data ? [...(data as unknown as VotingAction[])] : [],
    isPending,
    error,
  };
};

/**
 * Hook for joinableActions
 */
export const useJoinableActions = (tokenAddress: `0x${string}`, round: bigint, account: `0x${string}`) => {
  const enableRead = !!tokenAddress && !!account && round !== undefined;

  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'joinableActions',
    args: [tokenAddress, round, account],
    query: {
      enabled: enableRead,
    },
  });

  if (round === 0n || !enableRead) {
    return { joinableActions: [], isPending: false, error: undefined };
  }

  return {
    joinableActions: data ? [...(data as unknown as JoinableAction[])] : [],
    isPending,
    error,
  };
};

/**
 * Hook for joinedActions
 */
export const useJoinedActions = (tokenAddress: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'joinedActions',
    args: [tokenAddress, account],
    query: {
      enabled: !!tokenAddress && !!account,
    },
  });

  return { joinedActions: data ? [...(data as unknown as JoinedAction[])] : [], isPending, error };
};

/**
 * Hook for verifyingActions
 */
export const useVerifyingActions = (tokenAddress: `0x${string}`, round: bigint, account: `0x${string}`) => {
  const enableRead = !!tokenAddress && !!account && round !== undefined;

  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
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
 * Hook for verifyingActionsByAccount
 */
export const useVerifingActionsByAccount = (tokenAddress: `0x${string}`, round: bigint, account: `0x${string}`) => {
  const enableRead = !!tokenAddress && !!account && round !== undefined;

  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'verifyingActionsByAccount',
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
 * Hook for verifiedAddressesByAction
 * Reads the verified addresses by action.
 */
export const useVerifiedAddressesByAction = (tokenAddress: `0x${string}`, round: bigint, actionId: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'verifiedAddressesByAction',
    args: [tokenAddress, round, actionId],
    query: {
      enabled: !!tokenAddress && round !== undefined && actionId !== undefined,
    },
  });
  return { verifiedAddresses: data as VerifiedAddress[], isPending, error };
};

/**
 * Hook for verificationInfosByAction
 */
export const useVerificationInfosByAction = (tokenAddress: `0x${string}`, round: bigint, actionId: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'verificationInfosByAction',
    args: [tokenAddress, round, actionId],
    query: {
      enabled: !!tokenAddress && round !== undefined && actionId !== undefined,
    },
  });
  return { verificationInfos: data as VerificationInfo[], isPending, error };
};

/**
 * Hook for verificationInfosByAccount
 */
export const useVerificationInfosByAccount = (
  tokenAddress: `0x${string}`,
  actionId: bigint,
  account: `0x${string}`,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
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

export const useActionRewardsByAccountOfLastRounds = (
  tokenAddress: `0x${string}`,
  account: `0x${string}`,
  latestRounds: bigint,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'actionRewardsByAccountOfLastRounds',
    args: [tokenAddress, account, latestRounds],
    query: {
      enabled: !!tokenAddress && !!account && !!latestRounds,
    },
  });
  const actions = (data?.[0] as unknown as ActionInfo[]) || [];
  const rewards = (data?.[1] as unknown as ActionReward[]) || [];
  return { actions, rewards, isPending, error };
};

export const useHasUnmintedActionRewardOfLastRounds = (
  tokenAddress: `0x${string}`,
  account: `0x${string}`,
  latestRounds: bigint,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'hasUnmintedActionRewardOfLastRounds',
    args: [tokenAddress, account, latestRounds],
    query: {
      enabled: !!tokenAddress && !!account && !!latestRounds,
    },
  });
  return { hasUnmintedActionRewardOfLastRounds: data as boolean, isPending, error };
};

export const useActionRewardsByAccountByActionIdByRounds = (
  tokenAddress: `0x${string}`,
  account: `0x${string}`,
  actionId: bigint,
  startRound: bigint,
  endRound: bigint,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'actionRewardsByAccountByActionIdByRounds',
    args: [tokenAddress, account, actionId, startRound, endRound],
    query: {
      enabled: !!tokenAddress && !!account && actionId !== undefined && startRound !== undefined && !!endRound,
      // 翻页时保留上一页数据，避免数据瞬空导致 UI 闪烁
      placeholderData: (previousData) => previousData,
      refetchOnWindowFocus: false,
    },
  });
  const rewards = (data as RewardInfo[]) || [];
  return { rewards, isPending, error };
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
    abi: LOVE20RoundViewerAbi,
    functionName: 'govRewardsByAccountByRounds',
    args: [tokenAddress, account, startRound, endRound],
    query: {
      enabled: !!tokenAddress && !!account && startRound !== undefined && !!endRound,
    },
  });

  return { rewards: data as RewardInfo[], isPending, error };
};

/**
 * Hook for govData
 */
export const useGovData = (tokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'govData',
    args: [tokenAddress],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return { govData: data as GovData, isPending, error };
};

/**
 * Hook for estimatedActionRewardOfCurrentRound
 */
export const useEstimatedActionRewardOfCurrentRound = (tokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'estimatedActionRewardOfCurrentRound',
    args: [tokenAddress],
    query: {
      enabled: !!tokenAddress,
    },
  });
  return { reward: data as bigint, isPending, error };
};

/**
 * Hook for estimatedGovRewardOfCurrentRound
 */
export const useEstimatedGovRewardOfCurrentRound = (tokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'estimatedGovRewardOfCurrentRound',
    args: [tokenAddress],
    query: {
      enabled: !!tokenAddress,
    },
  });
  return { reward: data as bigint, isPending, error };
};

/**
 * Hook for tokenStatistics
 */
export const useTokenStatistics = (tokenAddress: `0x${string}`, flag: boolean = true) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20RoundViewerAbi,
    functionName: 'tokenStatistics',
    args: [tokenAddress],
    query: {
      enabled: !!tokenAddress && flag,
    },
  });
  return { tokenStatistics: data as TokenStats, isPending, error };
};
