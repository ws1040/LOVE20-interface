import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi';
import { LOVE20HubAbi } from '@/src/abis/LOVE20Hub';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_PERIPHERAL_HUB as `0x${string}`;

// =====================
// === 写入 Hooks ===
// =====================

export function useContributeWithETH() {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const contribute = async (tokenAddress: `0x${string}`, to: `0x${string}`, ethAmount: bigint) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20HubAbi,
        functionName: 'contributeWithETH',
        args: [tokenAddress, to],
        value: ethAmount, // ETH 金额作为 value 传递
      });
    } catch (err) {
      console.error('Native Coin Contribute Failed:', err);
      throw err;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { contribute, writeData, isWriting, writeError, isConfirming, isConfirmed };
}
