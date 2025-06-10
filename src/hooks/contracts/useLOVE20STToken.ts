import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20STTokenAbi } from '@/src/abis/LOVE20STToken';

/**
 * Hook for allowance
 */
export const useAllowance = (address: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'allowance',
    args: [owner, spender],
    query: {
      enabled: !!address && !!owner && !!spender,
    },
  });

  return {
    allowance: data as bigint | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for balanceOf
 */
export const useBalanceOf = (address: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'balanceOf',
    args: [account],
    query: {
      enabled: !!address && !!account,
    },
  });

  return {
    balance: data as bigint | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for decimals
 */
export const useDecimals = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'decimals',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    decimals: data as number | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for name
 */
export const useName = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'name',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    name: data as string | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for reserve
 */
export const useReserve = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'reserve',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    reserve: data as bigint | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for symbol
 */
export const useSymbol = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'symbol',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    symbol: data as string | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for tokenAddress
 */
export const useTokenAddress = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'tokenAddress',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    tokenAddress: data as `0x${string}` | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for totalSupply
 */
export const useTotalSupply = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'totalSupply',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return {
    totalSupply: data as bigint | undefined,
    isPending,
    error,
  };
};

// =====================
// === 写入 Hook ===
// =====================

/**
 * Hook for approve
 */
export const useApprove = (address: `0x${string}`) => {
  const { writeContract, data: writeData, isPending, error } = useWriteContract();

  const approve = async (spender: `0x${string}`, value: bigint) => {
    try {
      await writeContract({
        address,
        abi: LOVE20STTokenAbi,
        functionName: 'approve',
        args: [spender, value],
      });
    } catch (err) {
      console.error('Approve failed:', err);
      // 重新抛出错误，让组件能够捕获
      throw err;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { approve, writeData, isPending, error, isConfirming, isConfirmed };
};
