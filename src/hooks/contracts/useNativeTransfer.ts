// hooks/useNativeTransfer.ts

import React, { useEffect } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { isTukeWallet, waitForTukeTransaction } from '@/src/lib/tukeWalletUtils';
import { logWeb3Error, logError } from '@/src/lib/debugUtils';
import { checkWalletNetworkStatus } from '@/src/lib/web3';

/**
 * useNativeTransfer Hook - for native token transfers (ETH, BNB, etc.)
 */
export function useNativeTransfer() {
  const isTuke = isTukeWallet();

  // 标准钱包模式使用 wagmi 的 useSendTransaction
  const {
    sendTransaction: wagmiSendTransaction,
    isPending: wagmiIsPending,
    error: wagmiError,
    data: wagmiHash,
  } = useSendTransaction();

  // 等待交易确认（仅非TUKE钱包）
  const {
    isLoading: wagmiIsConfirming,
    isSuccess: wagmiIsConfirmed,
    error: wagmiConfirmError,
  } = useWaitForTransactionReceipt({
    hash: !isTuke && wagmiHash ? wagmiHash : undefined,
  });

  // TUKE钱包状态管理
  const [tukeState, setTukeState] = React.useState({
    isPending: false,
    isConfirming: false,
    isConfirmed: false,
    error: null as Error | null,
    hash: undefined as `0x${string}` | undefined,
  });

  const transfer = async (to: `0x${string}`, amount: bigint) => {
    console.log('发送原生代币转账:', { to, amount, isTuke });

    try {
      // 交易前网络检查
      const networkStatus = await checkWalletNetworkStatus();
      if (!networkStatus.isValid) {
        const errorMsg = `网络不匹配！请切换到 ${process.env.NEXT_PUBLIC_CHAIN_NAME} 网络`;
        const networkError = new Error(errorMsg);
        throw networkError;
      }

      if (isTuke) {
        // TUKE钱包模式
        setTukeState((prev) => ({ ...prev, isPending: true, error: null, isConfirmed: false }));

        try {
          // 使用TUKE钱包发送原生代币转账
          // 注意：这里需要特殊处理原生代币转账，不需要ABI
          const provider = (window as any).ethereum.getProvider();
          const signer = provider.getSigner();

          const tx = await signer.sendTransaction({
            to,
            value: amount,
          });

          const txHash = tx.hash as `0x${string}`;
          console.log('TUKE原生代币转账发送成功:', txHash);

          setTukeState((prev) => ({ ...prev, isPending: false, hash: txHash, isConfirming: true }));

          // 等待交易确认
          const receipt = await waitForTukeTransaction(txHash);
          console.log('TUKE原生代币转账确认成功:', receipt);

          setTukeState((prev) => ({ ...prev, isConfirming: false, isConfirmed: true }));

          return txHash;
        } catch (error: any) {
          console.error('TUKE原生代币转账失败:', error);
          setTukeState((prev) => ({ ...prev, isPending: false, isConfirming: false, error }));
          throw error;
        }
      } else {
        // 标准钱包模式
        return wagmiSendTransaction({
          to,
          value: amount,
        });
      }
    } catch (error: any) {
      console.error('原生代币转账失败:', error);
      logWeb3Error(error);
      logError(error);
      throw error;
    }
  };

  // 统一状态
  const isPending = isTuke ? tukeState.isPending : wagmiIsPending;
  const isConfirming = isTuke ? tukeState.isConfirming : wagmiIsConfirming;
  const isConfirmed = isTuke ? tukeState.isConfirmed : wagmiIsConfirmed;
  const error = isTuke ? tukeState.error : wagmiError || wagmiConfirmError;
  const hash = isTuke ? tukeState.hash : wagmiHash;

  // 错误日志记录
  useEffect(() => {
    if (hash) {
      console.log('原生代币转账 tx hash:', hash);
    }
    if (error) {
      console.log('原生代币转账错误:');
      logWeb3Error(error);
      logError(error);
    }
  }, [hash, error]);

  return {
    transfer,
    isPending,
    isConfirming,
    isConfirmed,
    writeError: error,
    hash,
    isTukeMode: isTuke,
  };
}
