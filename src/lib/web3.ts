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
