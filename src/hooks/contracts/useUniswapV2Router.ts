import { useEffect, useState } from 'react';
import { useReadContract, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { encodeFunctionData } from 'viem';

import { config } from '@/src/wagmi';
import { UniswapV2RouterAbi } from '@/src/abis/UniswapV2Router';
import { deepLogError, logError, logWeb3Error } from '@/src/lib/debugUtils';

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
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const swap = async (
    amountIn: bigint,
    amountOutMin: bigint,
    path: `0x${string}`[],
    to: `0x${string}`,
    deadline: bigint,
  ) => {
    setIsPending(true);
    setError(null);
    try {
      // await simulateContract(config, {
      //   address: CONTRACT_ADDRESS,
      //   abi: UniswapV2RouterAbi,
      //   functionName: 'swapExactTokensForTokens',
      //   args: [amountIn, amountOutMin, path, to, deadline],
      // });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: UniswapV2RouterAbi,
        functionName: 'swapExactTokensForTokens',
        args: [amountIn, amountOutMin, path, to, deadline],
      });
      setHash(txHash);
      return txHash;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash });
  useEffect(() => {
    console.log('hash:', hash);
    if (error) {
      console.log('error@simulateContract:');
      logWeb3Error(error);
      logError(error);
    }
    if (confirmError) {
      console.log('error@useWaitForTransactionReceipt:');
      deepLogError(confirmError, 'transaction-receipt-error');
    }
  }, [hash, error, confirmError]);

  const combinedError = error ?? confirmError;
  return { swap, writeData: hash, isWriting: isPending, writeError: combinedError, isConfirming, isConfirmed };
}

/*
 * Hook for swapExactETHForTokens
 */
export function useSwapExactETHForTokens() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const swap = async (
    amountOutMin: bigint,
    path: `0x${string}`[],
    to: `0x${string}`,
    deadline: bigint,
    value: bigint,
  ) => {
    setIsPending(true);
    setError(null);
    try {
      // await simulateContract(config, {
      //   address: CONTRACT_ADDRESS,
      //   abi: UniswapV2RouterAbi,
      //   functionName: 'swapExactETHForTokens',
      //   args: [amountOutMin, path, to, deadline],
      //   value,
      // });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: UniswapV2RouterAbi,
        functionName: 'swapExactETHForTokens',
        args: [amountOutMin, path, to, deadline],
        value,
      });
      setHash(txHash);
      return txHash;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return { swap, writeData: hash, isWriting: isPending, writeError: error, isConfirming, isConfirmed };
}

/*
 * Hook for swapExactTokensForETH
 */
export function useSwapExactTokensForETH() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const swap = async (
    amountIn: bigint,
    amountOutMin: bigint,
    path: `0x${string}`[],
    to: `0x${string}`,
    deadline: bigint,
  ) => {
    setIsPending(true);
    setError(null);
    try {
      // await simulateContract(config, {
      //   address: CONTRACT_ADDRESS,
      //   abi: UniswapV2RouterAbi,
      //   functionName: 'swapExactTokensForETH',
      //   args: [amountIn, amountOutMin, path, to, deadline],
      // });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: UniswapV2RouterAbi,
        functionName: 'swapExactTokensForETH',
        args: [amountIn, amountOutMin, path, to, deadline],
      });
      setHash(txHash);
      return txHash;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return { swap, writeData: hash, isWriting: isPending, writeError: error, isConfirming, isConfirmed };
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

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: sendData,
  });

  useEffect(() => {
    console.log('hash:', sendData);
    if (sendError) {
      console.log('error@sendTransaction:');
      logWeb3Error(sendError);
      logError(sendError);
    }
    if (confirmError) {
      console.log('error@useWaitForTransactionReceipt:');
      deepLogError(confirmError, 'transaction-receipt-error');
    }
  }, [sendData, sendError, confirmError]);

  const combinedError = sendError ?? confirmError;
  return {
    swap,
    txHash: sendData,
    isWriting: isSending,
    writeError: combinedError,
    isConfirming,
    isConfirmed,
  };
}
