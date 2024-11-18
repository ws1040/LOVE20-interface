import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20SLTokenAbi } from '@/src/abis/LOVE20SLToken';
import { useEffect, useState } from 'react';

// =====================
// === 读取 Hook ===
// =====================

/**
 * Hook for allowance
 */
export const useAllowance = (address: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'allowance',
    args: [owner, spender],
    query: {
      enabled: !!address && !!owner && !!spender,
    },
  });

  return { allowance: data as bigint | undefined, isPending, error };
};

/**
 * Hook for balanceOf
 */
export const useBalanceOf = (address: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'balanceOf',
    args: [account],
    query: {
      enabled: !!address && !!account,
    },
  });

  return { balance: data as bigint | undefined, isPending, error };
};

/**
 * Hook for decimals
 */
export const useDecimals = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'decimals',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { decimals: data as number | undefined, isPending, error };
};

/**
 * Hook for mintableAddress
 */
export const useMintableAddress = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'mintableAddress',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { mintableAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for name
 */
export const useName = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'name',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { name: data as string | undefined, isPending, error };
};

/**
 * Hook for parentTokenAddress
 */
export const useParentTokenAddress = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'parentTokenAddress',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { parentTokenAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for symbol
 */
export const useSymbol = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'symbol',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { symbol: data as string | undefined, isPending, error };
};

/**
 * Hook for tokenAddress
 */
export const useTokenAddress = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'tokenAddress',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { tokenAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * Hook for tokenAmounts
 */
export const useTokenAmounts = (address: `0x${string}`) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isPending, error, refetch } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'tokenAmounts',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (address) {
      refetch();
    }
  }, [address, refreshKey, refetch]);

  // 提供一个方法来手动刷新数据
  const refreshData = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return {
    tokenAmount: data?.[0],
    parentTokenAmount: data?.[1],
    feeTokenAmount: data?.[2],
    feeParentTokenAmount: data?.[3],
    isPending,
    error,
    refreshData, // 返回刷新数据的方法
  };
};

/**
 * Hook for tokenAmountsBySlAmount
 */
export const useTokenAmountsBySlAmount = (address: `0x${string}`, slAmount: bigint) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'tokenAmountsBySlAmount',
    args: [slAmount],
    query: {
      enabled: !!address && slAmount !== BigInt(0),
    },
  });

  return {
    tokenAmountsBySlAmount: data
      ? {
          tokenAmount: (data as any).tokenAmount as bigint,
          parentTokenAmount: (data as any).parentTokenAmount as bigint,
        }
      : undefined,
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
    abi: LOVE20SLTokenAbi,
    functionName: 'totalSupply',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { totalSupply: data as bigint | undefined, isPending, error };
};

/**
 * Hook for uniswapV2Pair
 */
export const useUniswapV2Pair = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20SLTokenAbi,
    functionName: 'uniswapV2Pair',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  return { uniswapV2Pair: data as `0x${string}` | undefined, isPending, error };
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
        abi: LOVE20SLTokenAbi,
        functionName: 'approve',
        args: [spender, value],
      });
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { approve, writeData, isPending, error, isConfirming, isConfirmed };
};

/**
 * Hook for burn
 */
export const useBurn = (address: `0x${string}`) => {
  const { writeContract, data: writeData, isPending, error } = useWriteContract();

  const burn = async (to: `0x${string}`) => {
    try {
      await writeContract({
        address,
        abi: LOVE20SLTokenAbi,
        functionName: 'burn',
        args: [to],
      });
    } catch (err) {
      console.error('Burn failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { burn, writeData, isPending, error, isConfirming, isConfirmed };
};

/**
 * Hook for mint
 */
export const useMint = (address: `0x${string}`) => {
  const { writeContract, data: writeData, isPending, error } = useWriteContract();

  const mint = async (to: `0x${string}`) => {
    try {
      await writeContract({
        address,
        abi: LOVE20SLTokenAbi,
        functionName: 'mint',
        args: [to],
      });
    } catch (err) {
      console.error('Minting failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { mint, writeData, isPending, error, isConfirming, isConfirmed };
};

/**
 * Hook for transfer
 */
export const useTransfer = (address: `0x${string}`) => {
  const { writeContract, data: writeData, isPending, error } = useWriteContract();

  const transfer = async (to: `0x${string}`, value: bigint) => {
    try {
      await writeContract({
        address,
        abi: LOVE20SLTokenAbi,
        functionName: 'transfer',
        args: [to, value],
      });
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { transfer, writeData, isPending, error, isConfirming, isConfirmed };
};

/**
 * Hook for transferFrom
 */
export const useTransferFrom = (address: `0x${string}`) => {
  const { writeContract, data: writeData, isPending, error } = useWriteContract();

  const transferFrom = async (from: `0x${string}`, to: `0x${string}`, value: bigint) => {
    try {
      await writeContract({
        address,
        abi: LOVE20SLTokenAbi,
        functionName: 'transferFrom',
        args: [from, to, value],
      });
    } catch (err) {
      console.error('TransferFrom failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { transferFrom, writeData, isPending, error, isConfirming, isConfirmed };
};

/**
 * Hook for withdrawFee
 */
export const useWithdrawFee = (address: `0x${string}`) => {
  const { writeContract, data: writeData, isPending, error } = useWriteContract();

  const withdrawFee = async (to: `0x${string}`) => {
    try {
      await writeContract({
        address,
        abi: LOVE20SLTokenAbi,
        functionName: 'withdrawFee',
        args: [to],
      });
    } catch (err) {
      console.error('WithdrawFee failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { withdrawFee, writeData, isPending, error, isConfirming, isConfirmed };
};
