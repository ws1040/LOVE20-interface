// hooks/contracts/useLOVE20Vote.ts

import { useEffect, useState } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { lOVE20VoteAbi } from '../../abis/LOVE20Vote';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_VOTE as `0x${string}`;


// =======================
// ===== Read Hooks ======
// =======================

/**
 * Hook to check if tokens can be voted.
 */
export const useCanBeVoted = (
  tokenAddress: `0x${string}`,
  round: bigint,
  actionIds: bigint[]
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'canBeVoted',
    args: [tokenAddress, round, actionIds],
  });

  return { canBeVoted: data as boolean | undefined, isPending, error };
};

/**
 * Hook to check if an account can vote.
 */
export const useCanVote = (
  tokenAddress: `0x${string}`,
  accountAddress: `0x${string}`
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'canVote',
    args: [tokenAddress, accountAddress],
  });

  return { canVote: data as boolean | undefined, isPending, error };
};

/**
 * Hook to get the current round.
 */
export const useCurrentRound = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'currentRound',
    args: [],
  });

  return { currentRound: data as bigint | undefined, isPending, error };
};

/**
 * Hook to check if an action ID has been voted.
 */
export const useIsActionIdVoted = (
  tokenAddress: `0x${string}`,
  round: bigint,
  actionId: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'isActionIdVoted',
    args: [tokenAddress, round, actionId],
  });

  return { isActionIdVoted: data as boolean | undefined, isPending, error };
};

/**
 * Hook to get the maximum number of votes.
 */
export const useMaxVotesNum = (
  tokenAddress: `0x${string}`,
  accountAddress: `0x${string}`
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'maxVotesNum',
    args: [tokenAddress, accountAddress],
  });

  return { maxVotesNum: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the origin blocks.
 */
export const useOriginBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'originBlocks',
    args: [],
  });

  return { originBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the round blocks.
 */
export const useRoundBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'roundBlocks',
    args: [],
  });

  return { roundBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the round by block number.
 */
export const useRoundByBlockNumber = (blockNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'roundByBlockNumber',
    args: [blockNumber],
  });

  return { round: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the round range.
 */
export const useRoundRange = (round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'roundRange',
    args: [round],
  });

  return {
    start: data?.[0] as bigint | undefined,
    end: data?.[1] as bigint | undefined,
    isPending,
    error,
  };
};

/**
 * Hook to get the stake address.
 */
export const useStakeAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
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
    abi: lOVE20VoteAbi,
    functionName: 'submitAddress',
    args: [],
  });

  return { submitAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook to get voted action IDs.
 */
export const useVotedActionIds = (
  account: `0x${string}`,
  round: bigint,
  actionId: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'votedActionIds',
    args: [account, round, actionId],
  });

  return { votedActionIds: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get voted action IDs by account.
 */
export const useVotedActionIdsByAccount = (
  account: `0x${string}`,
  round: bigint,
  anotherAccount: `0x${string}`,
  actionId: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'votedActionIdsByAccount',
    args: [account, round, anotherAccount, actionId],
  });

  return { votedActionIdsByAccount: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the number of votes.
 */
export const useVotesNum = (
  tokenAddress: `0x${string}`,
  round: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'votesNum',
    args: [tokenAddress, round],
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
export const useVotesNumByAccount = (
  tokenAddress: `0x${string}`,
  round: bigint,
  accountAddress: `0x${string}`
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'votesNumByAccount',
    args: [tokenAddress, round, accountAddress],
  });

  return {
    votesNumByAccount: data as bigint | undefined,
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
  actionId: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'votesNumByAccountByActionId',
    args: [tokenAddress, round, accountAddress, actionId],
  });

  return { votesNumByAccountByActionId: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the number of votes by action ID.
 */
export const useVotesNumByActionId = (
  tokenAddress: `0x${string}`,
  round: bigint,
  actionId: bigint
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'votesNumByActionId',
    args: [tokenAddress, round, actionId],
  });

  return { votesNumByActionId: data as bigint | undefined, isPending, error };
};

/**
 * Hook to get the number of votes (multiple).
 */
export const useVotesNums = (
  tokenAddress: `0x${string}`,
  round?: bigint
) => {
  const [actionIds, setActionIds] = useState<bigint[] | undefined>(undefined);
  const [votes, setVotes] = useState<bigint[] | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 如果 round 为 undefined 或 BigInt(0)，则跳过网络调用
    if (!round || round === BigInt(0)) {
      setActionIds(undefined);
      setVotes(undefined);
      setIsPending(false);
      setError(null);
      return;
    }

    const fetchVotesNums = async () => {
      setIsPending(true);
      setError(null);
      try {
        const {data} = useReadContract({
          address: CONTRACT_ADDRESS,
          abi: lOVE20VoteAbi,
          functionName: 'votesNums',
          args: [tokenAddress, round],
        });
        setActionIds(data?.[0] as bigint[]);
        setVotes(data?.[1] as bigint[] | undefined);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsPending(false);
      }
    };

    fetchVotesNums();
  }, [tokenAddress, round]);

  return {
    actionIds,
    votes,
    isPending,
    error,
  };
};

/**
 * Hook to get the number of votes by account (multiple).
 */
export const useVotesNumsByAccount = (
  tokenAddress: `0x${string}`,
  round: bigint,
  accountAddress: `0x${string}`
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'votesNumsByAccount',
    args: [tokenAddress, round, accountAddress],
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
  actionIds: bigint[]
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
    functionName: 'votesNumsByAccountByActionIds',
    args: [tokenAddress, round, accountAddress, actionIds],
  });

  return { votesNumsByAccountByActionIds: data as bigint[] | undefined, isPending, error };
};

/**
 * Hook to get the number of votes by multiple action IDs.
 */
export const useVotesNumsByActionIds = (
  tokenAddress: `0x${string}`,
  round: bigint,
  actionIds: bigint[]
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: lOVE20VoteAbi,
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
  const {
    writeContract,
    isPending: isWriting,
    data: writeData,
    error: writeError,
  } = useWriteContract();

  const vote = async (
    tokenAddress: `0x${string}`,
    actionIds: bigint[],
    votes: bigint[]
  ) => {
    try {
      await writeContract?.({
        address: CONTRACT_ADDRESS,
        abi: lOVE20VoteAbi,
        functionName: 'vote',
        args: [tokenAddress, actionIds, votes],
      });
    } catch (err) {
      console.error('Voting failed:', err);
    }
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { vote, writeData, isWriting, writeError, isConfirming, isConfirmed };
}
