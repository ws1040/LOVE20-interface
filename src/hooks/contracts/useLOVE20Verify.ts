// hooks/contracts/useLOVE20Verify.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20VerifyAbi } from '../../abis/LOVE20Verify';
import { Abi } from 'abitype';

// 定义合约地址，请根据实际情况设置
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_VERIFY as `0x${string}`;

// =====================
// === 读取 Hooks ===
// =====================

/**
 * Hook for ACTION_REWARD_MIN_VOTE_PER_THOUSAND
 */
export const useActionRewardMinVotePerThousand = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'ACTION_REWARD_MIN_VOTE_PER_THOUSAND',
  });

  return { actionRewardMinVotePerThousand: data as bigint | undefined, isPending, error };
};

/**
 * Hook for RANDOM_SEED_UPDATE_MIN_PER_TEN_THOUSAND
 */
export const useRandomSeedUpdateMinPerTenThousand = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'RANDOM_SEED_UPDATE_MIN_PER_TEN_THOUSAND',
  });

  return { randomSeedUpdateMinPerTenThousand: data as bigint | undefined, isPending, error };
};

/**
 * Hook for abstentionScoreWithReward
 */
export const useAbstentionScoreWithReward = (account: `0x${string}`, someNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'abstentionScoreWithReward',
    args: [account, someNumber],
    query: {
      enabled: !!account && someNumber !== undefined,
    },
  });

  return { abstentionScoreWithReward: data as bigint | undefined, isPending, error };
};

/**
 * Hook for actionIdsVerified
 */
export const useActionIdsVerified = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'actionIdsVerified',
    args: [tokenAddress, round],
    query: {
      enabled: !!tokenAddress && round !== undefined,
    },
  });

  return { actionIdsVerified: data as bigint[] | undefined, isPending, error };
};

/**
 * Hook for actionIdsWithReward
 */
export const useActionIdsWithReward = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'actionIdsWithReward',
    args: [tokenAddress, round],
    query: {
      enabled: !!tokenAddress && round !== undefined,
    },
  });

  return { actionIdsWithReward: data as bigint[] | undefined, isPending, error };
};

/**
 * Hook for currentRound
 */
export const useCurrentRound = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'currentRound',
  });

  return { currentRound: data as bigint, isPending, error };
};

/**
 * Hook for firstTokenAddress
 */
export const useFirstTokenAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'firstTokenAddress',
  });

  return { firstTokenAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for isActionIdWithReward
 */
export const useIsActionIdWithReward = (tokenAddress: `0x${string}`, round: bigint, actionId: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'isActionIdWithReward',
    args: [tokenAddress, round, actionId],
    query: {
      enabled: !!tokenAddress && round !== undefined && actionId !== undefined,
    },
  });

  return { isActionIdWithReward: data as boolean | undefined, isPending, error };
};

/**
 * Hook for originBlocks
 */
export const useOriginBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'originBlocks',
  });

  return { originBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook for randomAddress
 */
export const useRandomAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'randomAddress',
  });

  return { randomAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for roundBlocks
 */
export const useRoundBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'roundBlocks',
  });

  return { roundBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook for roundByBlockNumber
 */
export const useRoundByBlockNumber = (blockNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'roundByBlockNumber',
    args: [blockNumber],
    query: {
      enabled: blockNumber !== undefined,
    },
  });

  return { roundByBlockNumber: data as bigint | undefined, isPending, error };
};

/**
 * Hook for roundRange
 */
export const useRoundRange = (round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'roundRange',
    args: [round],
    query: {
      enabled: round !== undefined,
    },
  });

  return { roundRange: data as { start: bigint; end: bigint } | undefined, isPending, error };
};

/**
 * Hook for score
 */
export const useScore = (account: `0x${string}`, someNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'score',
    args: [account, someNumber],
    query: {
      enabled: !!account && someNumber !== undefined,
    },
  });

  return { score: data as bigint | undefined, isPending, error };
};

/**
 * Hook for scoreByActionId
 */
export const useScoreByActionId = (account: `0x${string}`, someNumber1: bigint, someNumber2: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'scoreByActionId',
    args: [account, someNumber1, someNumber2],
    query: {
      enabled: !!account && someNumber1 !== undefined && someNumber2 !== undefined,
    },
  });

  return { scoreByActionId: data as bigint | undefined, isPending, error };
};

/**
 * Hook for scoreByActionIdByAccount
 */
export const useScoreByActionIdByAccount = (
  account: `0x${string}`,
  someNumber1: bigint,
  someNumber2: bigint,
  anotherAccount: `0x${string}`,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'scoreByActionIdByAccount',
    args: [account, someNumber1, someNumber2, anotherAccount],
    query: {
      enabled: !!account && someNumber1 !== undefined && someNumber2 !== undefined && !!anotherAccount,
    },
  });

  return { scoreByActionIdByAccount: data as bigint | undefined, isPending, error };
};

/**
 * Hook for scoreByVerifier
 */
export const useScoreByVerifier = (tokenAddress: `0x${string}`, round: bigint, verifier: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'scoreByVerifier',
    args: [tokenAddress, round, verifier],
    query: {
      enabled: !!tokenAddress && !!round && !!verifier,
    },
  });

  return { scoreByVerifier: data as bigint, isPending, error };
};

/**
 * Hook for scoreByVerifierByActionId
 */
export const useScoreByVerifierByActionId = (
  tokenAddress: `0x${string}`,
  round: bigint,
  verifier: `0x${string}`,
  actionId: bigint,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'scoreByVerifierByActionId',
    args: [tokenAddress, round, verifier, actionId],
    query: {
      enabled: !!tokenAddress && round !== undefined && !!verifier && actionId !== undefined,
    },
  });

  return { scoreByVerifierByActionId: data as bigint, isPending, error };
};

/**
 * Hook for scoreWithReward
 */
export const useScoreWithReward = (account: `0x${string}`, someNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'scoreWithReward',
    args: [account, someNumber],
    query: {
      enabled: !!account && someNumber !== undefined,
    },
  });

  return { scoreWithReward: data as bigint | undefined, isPending, error };
};

/**
 * Hook for stakeAddress
 */
export const useStakeAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'stakeAddress',
  });

  return { stakeAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for submitAddress
 */
export const useSubmitAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'submitAddress',
  });

  return { submitAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for voteAddress
 */
export const useVoteAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'voteAddress',
  });

  return { voteAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for accountsForVerify
 */
export const useAccountsForVerify = (tokenAddress: `0x${string}`, round: bigint, actionId: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20VerifyAbi,
    functionName: 'accountsForVerify',
    args: [tokenAddress, round, actionId],
    query: {
      enabled: !!tokenAddress && round !== undefined && actionId !== undefined,
    },
  });

  return { accountsForVerify: data as `0x${string}`[], isPending, error };
};

// =====================
// === 写入 Hooks ===
// =====================

/**
 * Hook for initialize
 */
export function useInitialize() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const initialize = async (randomAddress: `0x${string}`, firstTokenAddress: `0x${string}`) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20VerifyAbi,
        functionName: 'initialize',
        args: [randomAddress, firstTokenAddress],
      });
    } catch (err) {
      console.error('Initialization failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { initialize, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/**
 * Hook for verify
 */
export function useVerify() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const verify = async (tokenAddress: `0x${string}`, actionId: bigint, abstentionScore: bigint, scores: bigint[]) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20VerifyAbi,
        functionName: 'verify',
        args: [tokenAddress, actionId, abstentionScore, scores],
      });
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { verify, writeData, isWriting, writeError, isConfirming, isConfirmed };
}
