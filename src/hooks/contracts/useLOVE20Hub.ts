// hooks/contracts/useLOVE20Hub.ts

import { useState, useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { useUniversalTransaction } from '@/src/lib/universalTransaction';
import { deepLogError, logError, logWeb3Error } from '@/src/lib/debugUtils';
import { config } from '@/src/wagmi';

import { LOVE20HubAbi } from '@/src/abis/LOVE20Hub';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_PERIPHERAL_HUB as `0x${string}`;

// =====================
// === 写入 Hooks ===
// =====================

/**
 * Hook for contributeWithETH (统一交易处理器版本)
 * 自动兼容TUKE钱包和其他标准钱包
 */
export function useContributeWithETH() {
  // 使用统一交易处理器
  const { execute, isPending, isConfirming, isConfirmed, error, hash, isTukeMode } = useUniversalTransaction(
    LOVE20HubAbi,
    CONTRACT_ADDRESS,
    'contributeWithETH',
  );

  // 包装contribute函数，保持原有的接口
  const contribute = async (tokenAddress: `0x${string}`, to: `0x${string}`, ethAmount: bigint) => {
    console.log('提交contributeWithETH交易:', { tokenAddress, to, ethAmount, isTukeMode });
    return await execute([tokenAddress, to], ethAmount);
  };

  // 错误日志记录
  useEffect(() => {
    if (hash) {
      console.log('contributeWithETH tx hash:', hash);
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
