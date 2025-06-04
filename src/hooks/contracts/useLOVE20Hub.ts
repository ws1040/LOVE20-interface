import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi';
import { LOVE20HubAbi } from '@/src/abis/LOVE20Hub';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_PERIPHERAL_HUB as `0x${string}`;

// =====================
// === 读取 Hooks ===
// =====================

/**
 * 获取 WETH 地址
 */
export function useWETHAddress() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20HubAbi,
    functionName: 'WETHAddress',
  });
}

/**
 * 检查合约是否已初始化
 */
export function useInitialized() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20HubAbi,
    functionName: 'initialized',
  });
}

/**
 * 获取 launch 地址
 */
export function useLaunchAddress() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20HubAbi,
    functionName: 'launchAddress',
  });
}

/**
 * 获取 submit 地址
 */
export function useSubmitAddress() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20HubAbi,
    functionName: 'submitAddress',
  });
}

/**
 * 获取 vote 地址
 */
export function useVoteAddress() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20HubAbi,
    functionName: 'voteAddress',
  });
}

/**
 * 获取 join 地址
 */
export function useJoinAddress() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20HubAbi,
    functionName: 'joinAddress',
  });
}

/**
 * 获取 verify 地址
 */
export function useVerifyAddress() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20HubAbi,
    functionName: 'verifyAddress',
  });
}

/**
 * 获取 mint 地址
 */
export function useMintAddress() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20HubAbi,
    functionName: 'mintAddress',
  });
}

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
