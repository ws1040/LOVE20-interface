import { toast } from 'react-hot-toast';
import { config } from '@/src/wagmi';

export const checkWalletConnection = (accountChain: any): boolean => {
  if (!accountChain) {
    toast.error(`请先将钱包链接 ${process.env.NEXT_PUBLIC_CHAIN_NAME ?? process.env.NEXT_PUBLIC_CHAIN}`);
    return false;
  }
  return true;
};

const getExpectedChainId = (): number | undefined => {
  const idFromConfig = config.chains?.[0]?.id;
  if (typeof idFromConfig === 'number') return idFromConfig;
  const idFromEnv = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
  return Number.isFinite(idFromEnv) ? idFromEnv : undefined;
};

export const checkWalletConnectionByChainId = (chainId?: number): boolean => {
  const expected = getExpectedChainId();
  if (!chainId || !expected || chainId !== expected) {
    toast.error(`请先将钱包链接 ${process.env.NEXT_PUBLIC_CHAIN_NAME ?? process.env.NEXT_PUBLIC_CHAIN}`);
    return false;
  }
  return true;
};

export const checkWalletNetworkStatus = async (): Promise<{
  isValid: boolean;
  currentChainId?: number;
  expectedChainId?: number;
}> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return { isValid: false };
  }

  try {
    // 获取钱包当前网络
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChainId = parseInt(chainId, 16);

    // 获取期望的网络
    const expectedChainId = getExpectedChainId();

    if (!expectedChainId) {
      console.error('未配置目标网络');
      return { isValid: false };
    }

    const isValid = currentChainId === expectedChainId;

    return {
      isValid,
      currentChainId,
      expectedChainId,
    };
  } catch (error) {
    console.error('检测钱包网络失败:', error);
    return { isValid: false };
  }
};

// 检查并提示网络状态的函数
export const validateWalletNetwork = async (): Promise<boolean> => {
  const networkStatus = await checkWalletNetworkStatus();

  if (!networkStatus.isValid) {
    const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME ?? process.env.NEXT_PUBLIC_CHAIN;
    if (networkStatus.currentChainId && networkStatus.expectedChainId) {
      toast.error(`网络不匹配！当前网络: ${networkStatus.currentChainId}，请切换到 ${chainName}`);
    } else {
      toast.error(`请先将钱包连接到 ${chainName}`);
    }
    return false;
  }

  return true;
};
