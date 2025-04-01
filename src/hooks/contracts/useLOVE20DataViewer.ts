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
} from '@/src/types/life20types';
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

  return { joinedActions: data as JoinedAction[], isPending, error };
};

/**
 * Hook for joinableActionDetailsWithJoinedInfos
 * Reads the joinable action details with joined infos.
 */
export const useJoinableActionDetailsWithJoinedInfos = (
  tokenAddress: `0x${string}`,
  round: bigint,
  account: `0x${string}`,
) => {
  const enableRead = !!tokenAddress && !!account;

  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'joinableActionDetailsWithJoinedInfos',
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
