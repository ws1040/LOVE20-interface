// hooks/contracts/useLOVE20Hub.ts

import { useEffect } from 'react';
import { useUniversalTransaction } from '@/src/lib/universalTransaction';
import { logError, logWeb3Error } from '@/src/lib/debugUtils';

import { LOVE20HubAbi } from '@/src/abis/LOVE20Hub';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_PERIPHERAL_HUB as `0x${string}`;

// =====================
// === 写入 Hooks ===
// =====================

/**
 * Hook for contributeFirstTokenWithETH
 */
export function useContributeFirstTokenWithETH() {
  const { execute, isPending, isConfirming, isConfirmed, error, hash, isTukeMode } = useUniversalTransaction(
    LOVE20HubAbi,
    CONTRACT_ADDRESS,
    'contributeFirstTokenWithETH',
  );

  const contribute = async (tokenAddress: `0x${string}`, to: `0x${string}`, ethAmount: bigint) => {
    console.log('提交contributeWithETH交易:', { tokenAddress, to, ethAmount, isTukeMode });
    return await execute([tokenAddress, to], ethAmount);
  };

  // 错误日志记录
  useEffect(() => {
    if (hash) {
      console.log('contributeFirstTokenWithETH tx hash:', hash);
    }
    if (error) {
      console.log('提交contributeWithETH交易错误:');
      logWeb3Error(error);
      logError(error);
    }
  }, [hash, error]);

  return {
    contribute,
    isPending,
    isConfirming,
    writeError: error,
    isConfirmed,
    hash,
    isTukeMode,
  };
}

/**
 * Hook for stakeLiquidity
 */
export function useStakeLiquidity() {
  const { execute, isPending, isConfirming, isConfirmed, error, hash, isTukeMode } = useUniversalTransaction(
    LOVE20HubAbi,
    CONTRACT_ADDRESS,
    'stakeLiquidity',
  );

  const stakeLiquidity = async (
    tokenAddress: `0x${string}`,
    tokenAmount: bigint,
    parentTokenAmount: bigint,
    tokenAmountMin: bigint,
    parentTokenAmountMin: bigint,
    promisedWaitingPhases: bigint,
    to: `0x${string}`,
  ) => {
    console.log('提交stakeLiquidity交易:', {
      tokenAddress,
      tokenAmount,
      parentTokenAmount,
      tokenAmountMin,
      parentTokenAmountMin,
      promisedWaitingPhases,
      to,
      isTukeMode,
    });
    return await execute([
      tokenAddress,
      tokenAmount,
      parentTokenAmount,
      tokenAmountMin,
      parentTokenAmountMin,
      promisedWaitingPhases,
      to,
    ]);
  };

  // 错误日志记录
  useEffect(() => {
    if (hash) {
      console.log('stakeLiquidity tx hash:', hash);
    }
    if (error) {
      console.log('提交stakeLiquidity交易错误:');
      logWeb3Error(error);
      logError(error);
    }
  }, [hash, error]);

  return {
    stakeLiquidity,
    isPending,
    isConfirming,
    isConfirmed,
    writeError: error,
    hash,
    isTukeMode,
  };
}
