import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi';
import { UniswapV2RouterAbi } from '@/src/abis/UniswapV2Router';
import { useState } from 'react';
import { encodeFunctionData } from 'viem';

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
      throw err;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { swap, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/*
 * Hook for swapExactETHForTokens
 */
export function useSwapExactETHForTokens() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const swap = async (
    amountOutMin: bigint,
    path: `0x${string}`[],
    to: `0x${string}`,
    deadline: bigint,
    value: bigint, // ETH 数量
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: UniswapV2RouterAbi,
        functionName: 'swapExactETHForTokens',
        args: [amountOutMin, path, to, deadline],
        value, // 发送的 ETH 数量
      });
    } catch (err) {
      console.error('swapExactETHForTokens 兑换代币失败:', err);
      throw err;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { swap, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/*
 * Hook for swapExactTokensForETH
 */
export function useSwapExactTokensForETH() {
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
        functionName: 'swapExactTokensForETH',
        args: [amountIn, amountOutMin, path, to, deadline],
      });
    } catch (err) {
      console.error('代币兑换 swapExactTokensForETH 失败:', err);
      throw err;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { swap, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/**
 * 为了解决错误：

error ContractFunctionExecutionError: Position `3.9638773911973445e+75` is out of bounds (`0 < position < 132`).

Contract Call:
  address:   0x6f6Ccc786299cA62312511Cc44d0094ce02869bD
  function:  swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)
  args:                           (1155939642686539746972093, ["0xEd681d43198A3d537E65cF0eD576576E90D3DE83","0xfb579184bF73E3c140d7f5461c84b3206c93D054"], 0x4B8824cE487ef8319831F7AA8CefABe8FBa9e1D8, 1748962114)
  sender:    0x4B8824cE487ef8319831F7AA8CefABe8FBa9e1D8

Docs: https://viem.sh/docs/contract/simulateContract
Version: viem@2.17.0
    at getContractError (getContractError.js:34:12)
    at simulateContract (simulateContract.js:83:98)
    at async simulateContract (simulateContract.js:26:33)
    at async writeContract (writeContract.js:32:46)Caused by: PositionOutOfBoundsError: Position `3.9638773911973445e+75` is out of bounds (`0 < position < 132`).
*/
// 添加一个新的 hook，直接使用较低级别的 API 绕过 simulateContract
export function useSwapExactETHForTokensDirect() {
  const { sendTransaction, data: sendData, isPending: isSending, error: sendError } = useSendTransaction();

  const swap = async (
    amountOutMin: bigint,
    path: `0x${string}`[],
    to: `0x${string}`,
    deadline: bigint,
    value: bigint,
  ) => {
    try {
      // 使用 viem 编码交易数据
      const data = encodeFunctionData({
        abi: UniswapV2RouterAbi,
        functionName: 'swapExactETHForTokens',
        args: [amountOutMin, path, to, deadline],
      });

      console.log('🔧 直接发送交易，绕过 simulateContract:', {
        to: CONTRACT_ADDRESS,
        value: value.toString(),
        data,
        args: [amountOutMin.toString(), path, to, deadline.toString()],
      });

      await sendTransaction({
        to: CONTRACT_ADDRESS,
        value,
        data,
      });

      console.log('✅ 交易请求已发送');
    } catch (err) {
      console.error('直接交易失败:', err);
      throw err;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: sendData,
  });

  return {
    swap,
    txHash: sendData,
    isWriting: isSending,
    writeError: sendError,
    isConfirming,
    isConfirmed,
  };
}
