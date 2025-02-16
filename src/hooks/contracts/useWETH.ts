// hooks/useLove20Join.ts

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { WETH9Abi } from '@/src/abis/WETH9';

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

  return { balance: data as bigint | undefined, isPending, error };
};

// =====================
// === 写入 Hook ===
// =====================

/**
 * Hook for deposit
 */
export const useDeposit = () => {
  const { writeContract, data: writeData, isPending, error } = useWriteContract();

  const deposit = async (ethAmount: bigint) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: WETH9Abi,
        functionName: 'deposit',
        args: [],
        value: ethAmount,
      });
    } catch (err) {
      console.error('Deposit failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { deposit, writeData, isPending, error, isConfirming, isConfirmed };
};

/**
 * Hook for withdraw
 */
export const useWithdraw = () => {
  const { writeContract, data: writeData, isPending, error } = useWriteContract();

  const withdraw = async (wethAmount: bigint) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: WETH9Abi,
        functionName: 'withdraw',
        args: [wethAmount],
      });
    } catch (err) {
      console.error('Withdraw failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { withdraw, writeData, isPending, error, isConfirming, isConfirmed };
};
