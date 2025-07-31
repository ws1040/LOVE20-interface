import { useState } from 'react';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { config } from '@/src/wagmi';
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
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const submit = async (tokenAddress: `0x${string}`, actionId: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20SubmitAbi,
        functionName: 'submit',
        args: [tokenAddress, actionId],
      });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20SubmitAbi,
        functionName: 'submit',
        args: [tokenAddress, actionId],
      });
      setHash(txHash);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash });

  const combinedError = error ?? confirmError;

  return { submit, isPending, isConfirming, writeError: combinedError, isConfirmed };
}

/**
 * Hook for submitNewAction
 */
export function useSubmitNewAction() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

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
    setIsPending(true);
    setError(null);
    try {
      // await simulateContract(config, {
      //   address: CONTRACT_ADDRESS,
      //   abi: LOVE20SubmitAbi,
      //   functionName: 'submitNewAction',
      //   args: [tokenAddress, actionBody],
      // });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20SubmitAbi,
        functionName: 'submitNewAction',
        args: [tokenAddress, actionBody],
      });
      setHash(txHash);
      return txHash;
    } catch (err: any) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash });

  const combinedError = error ?? confirmError;

  return { submitNewAction, isPending, isConfirming, writeError: combinedError, isConfirmed };
}
