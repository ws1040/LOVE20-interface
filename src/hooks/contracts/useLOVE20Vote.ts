// hooks/contracts/useLOVE20Vote.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20VoteAbi } from '@/src/abis/LOVE20Vote';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_VOTE as `0x${string}`;

// =======================
// ===== Read Hooks ======
// =======================

/**
 * Hook to check if tokens can be voted.
 */
export const useCanBeVoted = (tokenAddress: `0x${string}`, round: bigint, actionIds: bigint[]) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'canBeVoted',
    args: [tokenAddress, round, actionIds],
  });

  return { canBeVoted: data as boolean | undefined, isPending, error };
};

/**
 * Hook to check if an account can vote.
 */
export const useCanVote = (tokenAddress: `0x${string}`, accountAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'canVote',
    args: [tokenAddress, accountAddress],
  });

  return { canVote: data as boolean, isPending, error };
};

/**
 * Hook to get the current round.
 */
export const useCurrentRound = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'currentRound',
    args: [],
  });
  return { currentRound: data as bigint, isPending, error };
};

/**
 * Hook to check if an action ID has been voted.
 */
export const useIsActionIdVoted = (tokenAddress: `0x${string}`, round: bigint, actionId: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'isActionIdVoted',
    args: [tokenAddress, round, actionId],
  });

  return { isActionIdVoted: data as boolean, isPending, error };
};

/**
 * Hook to get the maximum number of votes.
 */
export const useMaxVotesNum = (tokenAddress: `0x${string}`, accountAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'maxVotesNum',
    args: [tokenAddress, accountAddress],
  });

  return { maxVotesNum: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the origin blocks.
 */
export const useOriginBlocks = (flag: boolean) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'originBlocks',
    args: [],
    query: {
      enabled: flag,
    },
  });

  return { originBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the round blocks.
 */
export const useRoundBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'phaseBlocks',
    args: [],
  });

  return { phaseBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the round by block number.
 */
export const useRoundByBlockNumber = (blockNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'roundByBlockNumber',
    args: [blockNumber],
  });

  return { round: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the stake address.
 */
export const useStakeAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'stakeAddress',
    args: [],
  });

  return { stakeAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook to get the submit address.
 */
export const useSubmitAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'submitAddress',
    args: [],
  });

  return { submitAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook to get the number of votes.
 */
export const useVotesNum = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'votesNum',
    args: [tokenAddress, round],
    query: {
      enabled: !!tokenAddress && round !== undefined,
    },
  });

  return {
    votes: data as bigint | undefined,
    isPending,
    error,
  };
};

/**
 * Hook to get the number of votes by account.
 */
export const useVotesNumByAccount = (tokenAddress: `0x${string}`, round: bigint, accountAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'votesNumByAccount',
    args: [tokenAddress, round, accountAddress],
    query: {
      enabled: !!tokenAddress && !!accountAddress && round !== undefined,
    },
  });

  return {
    votesNumByAccount: data as bigint,
    isPending,
    error,
  };
};

/**
 * Hook to get the number of votes by account and action ID.
 */
export const useVotesNumByAccountByActionId = (
  tokenAddress: `0x${string}`,
  round: bigint,
  accountAddress: `0x${string}`,
  actionId: bigint,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'votesNumByAccountByActionId',
    args: [tokenAddress, round, accountAddress, actionId],
    query: {
      enabled: !!tokenAddress && !!accountAddress && !!round && actionId !== undefined,
    },
  });

  return { votesNumByAccountByActionId: data as bigint, isPending, error };
};

/**
 * Hook to get the number of votes by action ID.
 */
export const useVotesNumByActionId = (tokenAddress: `0x${string}`, round: bigint, actionId: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'votesNumByActionId',
    args: [tokenAddress, round, actionId],
    query: {
      enabled: !!tokenAddress && round !== undefined && actionId !== undefined,
    },
  });

  return { votesNumByActionId: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the number of votes (multiple).
 */
export const useVotesNums = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
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
 * Hook to get the number of votes by account (multiple).
 */
export const useVotesNumsByAccount = (tokenAddress: `0x${string}`, round: bigint, accountAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'votesNumsByAccount',
    args: [tokenAddress, round, accountAddress],
    query: {
      enabled: !!tokenAddress && !!accountAddress && round !== undefined,
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
 * Hook to get the number of votes by account and multiple action IDs.
 */
export const useVotesNumsByAccountByActionIds = (
  tokenAddress: `0x${string}`,
  round: bigint,
  accountAddress: `0x${string}`,
  actionIds: bigint[],
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'votesNumsByAccountByActionIds',
    args: [tokenAddress, round, accountAddress, actionIds],
  });

  return { votesNumsByAccountByActionIds: data as bigint[] | undefined, isPending, error };
};

/**
 * Hook to get the number of votes by multiple action IDs.
 */
export const useVotesNumsByActionIds = (tokenAddress: `0x${string}`, round: bigint, actionIds: bigint[]) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VoteAbi,
    functionName: 'votesNumsByActionIds',
    args: [tokenAddress, round, actionIds],
  });

  return { votesNumsByActionIds: data as bigint[] | undefined, isPending, error };
};

// =======================
// ===== Write Hook =====
// =======================

/**
 * Hook to perform a vote transaction.
 */
export function useVote() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const vote = async (tokenAddress: `0x${string}`, actionIds: bigint[], votes: bigint[]) => {
    try {
      await writeContract?.({
        address: CONTRACT_ADDRESS,
        abi: LOVE20VoteAbi,
        functionName: 'vote',
        args: [tokenAddress, actionIds, votes],
      });
    } catch (err) {
      console.error('Voting failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { vote, writeData, isWriting, writeError, isConfirming, isConfirmed };
}
