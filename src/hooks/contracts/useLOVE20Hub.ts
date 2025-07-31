// hooks/contracts/useLOVE20Hub.ts

import { useState } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { config } from '@/src/wagmi';

import { LOVE20HubAbi } from '@/src/abis/LOVE20Hub';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_PERIPHERAL_HUB as `0x${string}`;

// =====================
// === 写入 Hooks ===
// =====================

export function useContributeWithETH() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const contribute = async (tokenAddress: `0x${string}`, to: `0x${string}`, ethAmount: bigint) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20HubAbi,
        functionName: 'contributeWithETH',
        args: [tokenAddress, to],
        value: ethAmount, // ETH 金额作为 value 传递
      });
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: LOVE20HubAbi,
        functionName: 'contributeWithETH',
        args: [tokenAddress, to],
        value: ethAmount, // ETH 金额作为 value 传递
      });
      setHash(txHash);
      return txHash;
    } catch (err: any) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return { contribute, isPending, isConfirming, writeError: error, isConfirmed };
}
