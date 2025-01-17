import { toast } from 'react-hot-toast';

export const checkWalletConnection = (accountChain: any): boolean => {
  if (!accountChain) {
    toast.error(`请先将钱包链接 ${process.env.NEXT_PUBLIC_CHAIN}`);
    return false;
  }
  return true;
};
