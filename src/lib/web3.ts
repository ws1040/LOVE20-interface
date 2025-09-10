import { config } from '@/src/wagmi';

const getExpectedChainId = (): number | undefined => {
  const idFromConfig = config.chains?.[0]?.id;
  if (typeof idFromConfig === 'number') return idFromConfig;
  const idFromEnv = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
  return Number.isFinite(idFromEnv) ? idFromEnv : undefined;
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
