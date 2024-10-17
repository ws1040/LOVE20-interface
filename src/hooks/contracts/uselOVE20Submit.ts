import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { lOVE20SubmitAbi } from '../../abis/LOVE20Submit';

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
      abi: lOVE20SubmitAbi,
      functionName: 'SUBMIT_MIN_PER_THOUSAND',
      args: [],
    });
  
    return { submitMinPerThousand: data as bigint | undefined, isPending, error };
  };
  
  /**
   * Hook for actionIdsByAuthor
   */
  export const useActionIdsByAuthor = (tokenAddress: `0x${string}`, author: `0x${string}`) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'actionIdsByAuthor',
      args: [tokenAddress, author],
    });
  
    return { actionIds: data as bigint[] | undefined, isPending, error };
  };
  
  /**
   * Hook for actionInfo
   */
  export const useActionInfo = (tokenAddress: `0x${string}`, actionId: bigint) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'actionInfo',
      args: [tokenAddress, actionId],
      query: {
        enabled: !!tokenAddress && actionId !== undefined, 
      },
    });
  
    return { actionInfo: data as any | undefined, isPending, error };
  };
  
  /**
   * Hook for actionInfos
   */
  export const useActionInfos = (tokenAddress: `0x${string}`, index: bigint) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'actionInfos',
      args: [tokenAddress, index],
    });
  
    return { actionInfo: data as any | undefined, isPending, error };
  };
  
  /**
   * Hook for actionInfosByIds
   */
  export const useActionInfosByIds = (tokenAddress: `0x${string}`, actionIds: bigint[]) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'actionInfosByIds',
      args: [tokenAddress, actionIds],
    });
  
    return { actionInfos: data as any[] | undefined, isPending, error };
  };
  
  /**
   * Hook for actionInfosByPage
   */
  export const useActionInfosByPage = (
    tokenAddress: `0x${string}`,
    start: bigint,
    end: bigint,
    reverse: boolean
  ) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'actionInfosByPage',
      args: [tokenAddress, start, end, reverse],
    });
  
    return { actionInfos: data as any[] | undefined, isPending, error };
  };
  
  /**
   * Hook for actionNum
   */
  export const useActionNum = (tokenAddress: `0x${string}`) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'actionNum',
      args: [tokenAddress],
    });
  
    return { actionNum: data as bigint | undefined, isPending, error };
  };
  
  /**
   * Hook for actionSubmits
   */
  export const useActionSubmits = (tokenAddress: `0x${string}`, round: bigint) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'actionSubmits',
      args: [tokenAddress, round],
      query: {
        enabled: !!tokenAddress && !!round 
      }
    });
  
    return { actionSubmits: data as any[] | undefined, isPending, error };
  };
  
  /**
   * Hook for authorActionIds
   */
  export const useAuthorActionIds = (
    address1: `0x${string}`,
    address2: `0x${string}`,
    index: bigint
  ) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'authorActionIds',
      args: [address1, address2, index],
    });
  
    return { authorActionId: data as bigint | undefined, isPending, error };
  };
  
  /**
   * Hook for canSubmit
   */
  export const useCanSubmit = (tokenAddress: `0x${string}`, accountAddress: `0x${string}`) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'canSubmit',
      args: [tokenAddress, accountAddress],
    });
  
    return { canSubmit: data as boolean | undefined, isPending, error };
  };
  
  /**
   * Hook for currentRound
   */
  export const useCurrentRound = () => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'currentRound',
      args: [],
    });
  
    return { currentRound: data as bigint | undefined, isPending, error };
  };
  
  /**
   * Hook for isSubmitted
   */
  export const useIsSubmitted = (
    tokenAddress: `0x${string}`,
    round: bigint,
    actionId: bigint
  ) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
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
      abi: lOVE20SubmitAbi,
      functionName: 'originBlocks',
      args: [],
    });
  
    return { originBlocks: data as bigint | undefined, isPending, error };
  };
  
  /**
   * Hook for roundBlocks
   */
  export const useRoundBlocks = () => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'roundBlocks',
      args: [],
    });
  
    return { roundBlocks: data as bigint | undefined, isPending, error };
  };
  
  /**
   * Hook for roundByBlockNumber
   */
  export const useRoundByBlockNumber = (blockNumber: bigint) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'roundByBlockNumber',
      args: [blockNumber],
    });
  
    return { round: data as bigint | undefined, isPending, error };
  };
  
  /**
   * Hook for roundRange
   */
  export const useRoundRange = (round: bigint) => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
      functionName: 'roundRange',
      args: [round],
    });
  
    return { roundRange: data as { start: bigint; end: bigint } | undefined, isPending, error };
  };
  
  /**
   * Hook for stakeAddress
   */
  export const useStakeAddress = () => {
    const { data, isPending, error } = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: lOVE20SubmitAbi,
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
    const {
      writeContract,
      isPending: isWriting,
      data: writeData,
      error: writeError,
    } = useWriteContract();
  
    const submit = async (tokenAddress: `0x${string}`, actionId: bigint) => {
      try {
        await writeContract({
          address: CONTRACT_ADDRESS,
          abi: lOVE20SubmitAbi,
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
    const {
      writeContract,
      isPending: isWriting,
      data: writeData,
      error: writeError,
    } = useWriteContract();
  
    const submitNewAction = async (
      tokenAddress: `0x${string}`,
      actionBody: {
        maxStake: bigint;
        maxRandomAccounts: bigint;
        whiteList: `0x${string}`[];
        action: string;
        consensus: string;
        verificationRule: string;
        verificationInfoGuide: string;
      }
    ) => {
      try {
        const tx = await writeContract({
          address: CONTRACT_ADDRESS,
          abi: lOVE20SubmitAbi,
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
  