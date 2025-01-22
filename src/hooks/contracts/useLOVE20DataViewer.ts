// hooks/contracts/useLOVE20Launch.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20DataViewerAbi } from '@/src/abis/LOVE20DataViewer';
import {
  JoinableAction,
  JoinedAction,
  LaunchInfo,
  VerifiedAddress,
  GovReward,
  TokenInfo,
  VerificationInfo,
} from '@/src/types/life20types';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_PERIPHERAL_DATAVIEWER as `0x${string}`;

// =====================
// === 读取 Hooks ===
// =====================

/**
 * Hook for initSetter
 * Reads the address of the current initSetter.
 */
export const useInitSetter = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'initSetter',
  });

  return { initSetter: data as `0x${string}` | undefined, isPending, error };
};

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
 * Hook for joinableActions
 * Reads the joinable actions based on tokenAddress and round.
 */
export const useJoinableActions = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'joinableActions',
    args: [tokenAddress, round],
    query: {
      enabled: !!tokenAddress && !!round,
    },
  });

  return { actions: data as JoinableAction[] | undefined, isPending, error };
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

  return { rewards: data as GovReward[], isPending, error };
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
  isJoined: boolean,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20DataViewerAbi,
    functionName: 'verificationInfosByAccount',
    args: [tokenAddress, actionId, account],
    query: {
      enabled: isJoined && !!tokenAddress && !!account && actionId !== undefined,
    },
  });

  return {
    verificationKeys: data?.[0] as string[],
    verificationInfos: data?.[1] as string[],
    isPending,
    error,
  };
};

// =====================
// === 写入 Hooks ===
// =====================

/**
 * Hook for setInitSetter
 * Updates the initSetter to a new address.
 */
export const useSetInitSetter = () => {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const setInitSetter = async (newInitSetter: `0x${string}`) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20DataViewerAbi,
        functionName: 'setInitSetter',
        args: [newInitSetter],
      });
    } catch (err) {
      console.error('setInitSetter failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { setInitSetter, writeData, isWriting, writeError, isConfirming, isConfirmed };
};
