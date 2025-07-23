import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20SubmitAbi } from '@/src/abis/LOVE20Submit';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_SUBMIT as `0x${string}`;

// =====================
// === 读取 Hook ===
// =====================

/**
 * Hook for SUBMIT_MIN_PER_THOUSAND
 */
export const useSubmitMinPerThousand = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20SubmitAbi,
    functionName: 'SUBMIT_MIN_PER_THOUSAND',
    args: [],
  });

  return { submitMinPerThousand: data as bigint | undefined, isPending, error };
};

/**
 * Hook for actionInfo
 */
export const useActionInfo = (tokenAddress: `0x${string}`, actionId: bigint | undefined) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20SubmitAbi,
    functionName: 'actionInfo',
    args: [tokenAddress, actionId || 0n],
    query: {
      enabled: !!tokenAddress && actionId !== undefined,
    },
  });

  return { actionInfo: data as any | undefined, isPending, error };
};

/**
 * Hook for actionNum
 */
export const useActionsCount = (tokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20SubmitAbi,
    functionName: 'actionsCount',
    args: [tokenAddress],
  });

  return { actionNum: data as bigint | undefined, isPending, error };
};

/**
 * Hook for canSubmit
 */
export const useCanSubmit = (tokenAddress: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20SubmitAbi,
    functionName: 'canSubmit',
    args: [tokenAddress, account],
  });

  return { canSubmit: data as boolean | undefined, isPending, error };
};

/**
 * Hook for currentRound
 */
export const useCurrentRound = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20SubmitAbi,
    functionName: 'currentRound',
    args: [],
  });

  return { currentRound: data as bigint, isPending, error };
};

/**
 * Hook for isSubmitted
 */
export const useIsSubmitted = (tokenAddress: `0x${string}`, round: bigint, actionId: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20SubmitAbi,
    functionName: 'isSubmitted',
    args: [tokenAddress, round, actionId],
  });

  return { isSubmitted: data as boolean | undefined, isPending, error };
};

/**
 * Hook for originBlocks
 */
export const useOriginBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20SubmitAbi,
    functionName: 'originBlocks',
    args: [],
  });

  return { originBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook for phaseBlocks
 */
export const useRoundBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20SubmitAbi,
    functionName: 'phaseBlocks',
    args: [],
  });

  return { phaseBlocks: data as bigint | undefined, isPending, error };
};

/**
 * Hook for roundByBlockNumber
 */
export const useRoundByBlockNumber = (blockNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20SubmitAbi,
    functionName: 'roundByBlockNumber',
    args: [blockNumber],
  });

  return { round: data as bigint | undefined, isPending, error };
};

/**
 * Hook for stakeAddress
 */
export const useStakeAddress = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20SubmitAbi,
    functionName: 'stakeAddress',
    args: [],
  });

  return { stakeAddress: data as `0x${string}` | undefined, isPending, error };
};

// =====================
// === 写入 Hook ===
// =====================

/**
 * Hook for submit
 */
export function useSubmit() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const submit = async (tokenAddress: `0x${string}`, actionId: bigint) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20SubmitAbi,
        functionName: 'submit',
        args: [tokenAddress, actionId],
      });
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { submit, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/**
 * Hook for submitNewAction
 */
export function useSubmitNewAction() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const submitNewAction = async (
    tokenAddress: `0x${string}`,
    actionBody: {
      minStake: bigint;
      maxRandomAccounts: bigint;
      whiteListAddress: `0x${string}`;
      title: string;
      verificationRule: string;
      verificationKeys: string[];
      verificationInfoGuides: string[];
    },
  ) => {
    try {
      const tx = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20SubmitAbi,
        functionName: 'submitNewAction',
        args: [tokenAddress, actionBody],
      });
      return tx;
    } catch (err) {
      console.error('Submit New Action failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { submitNewAction, writeData, isWriting, writeError, isConfirming, isConfirmed };
}
