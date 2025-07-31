// hooks/useWETH.ts

import { useState } from 'react';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { config } from '@/src/wagmi';

import { WETH9Abi } from '@/src/abis/WETH9';
import { safeToBigInt } from '@/src/lib/clientUtils';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ROOT_PARENT_TOKEN as `0x${string}`;

/* =======================
   ===== Read Hooks ======
   ======================= */

/**
 * useBalanceOf Hook
 * @param account - Address of the account
 */
export const useBalanceOf = (token: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: WETH9Abi,
    functionName: 'balanceOf',
    args: [account],
    query: {
      enabled: !!token && !!account,
    },
  });

  return { balance: data ? safeToBigInt(data) : undefined, isPending, error };
};

// =====================
// === 写入 Hook ===
// =====================

/**
 * Hook for deposit
 */
export const useDeposit = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const deposit = async (ethAmount: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: CONTRACT_ADDRESS,
        abi: WETH9Abi,
        functionName: 'deposit',
        args: [],
        value: ethAmount,
      });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: WETH9Abi,
        functionName: 'deposit',
        args: [],
        value: ethAmount,
      });
      setHash(txHash);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return { deposit, isPending, isConfirming, writeError: error, isConfirmed };
};

/**
 * Hook for withdraw
 */
export const useWithdraw = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const withdraw = async (wethAmount: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: CONTRACT_ADDRESS,
        abi: WETH9Abi,
        functionName: 'withdraw',
        args: [wethAmount],
      });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: WETH9Abi,
        functionName: 'withdraw',
        args: [wethAmount],
      });
      setHash(txHash);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return { withdraw, isPending, isConfirming, writeError: error, isConfirmed };
};
