import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { UniswapV2RouterAbi } from '@/src/abis/UniswapV2Router';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_UNISWAP_V2_ROUTER as `0x${string}`;

// =====================
// === 读取 Hooks ===
// =====================

/**
 * Hook for getAmountsOut
 */
export const useGetAmountsOut = (amountIn: bigint, path: `0x${string}`[], isEnabled = true) => {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: UniswapV2RouterAbi,
    functionName: 'getAmountsOut',
    args: [amountIn, path],
    query: {
      enabled: !!amountIn && path.length >= 2 && isEnabled,
    },
  });

  return { data, error, isLoading };
};

/**
 * Hook for getAmountsIn
 */
export const useGetAmountsIn = (amountOut: bigint, path: `0x${string}`[], isEnabled = true) => {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: UniswapV2RouterAbi,
    functionName: 'getAmountsIn',
    args: [amountOut, path],
    query: {
      enabled: !!amountOut && path.length >= 2 && isEnabled,
    },
  });

  return { data, error, isLoading };
};

// =====================
// === 写入 Hooks ===
// =====================

/*
 * Hook for swapExactTokensForTokens
 */
export function useSwapExactTokensForTokens() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const swap = async (
    amountIn: bigint,
    amountOutMin: bigint,
    path: `0x${string}`[],
    to: `0x${string}`,
    deadline: bigint,
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: UniswapV2RouterAbi,
        functionName: 'swapExactTokensForTokens',
        args: [amountIn, amountOutMin, path, to, deadline],
      });
    } catch (err) {
      console.error('Swap failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { swap, writeData, isWriting, writeError, isConfirming, isConfirmed };
}
