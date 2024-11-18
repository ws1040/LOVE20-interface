// hooks/useLove20Join.ts

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { WETH9Abi } from '@/src/abis/WETH9';
import { parseEther } from 'viem';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ROOT_PARENT_TOKEN as `0x${string}`;

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
