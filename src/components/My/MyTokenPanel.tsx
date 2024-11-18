import { useAccount } from 'wagmi';
import { useContext } from 'react';

import { TokenContext } from '@/src/contexts/TokenContext';
import { useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
import { formatTokenAmount } from '@/src/lib/format';
import Loading from '@/src/components/Common/Loading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const MyTokenPanel = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();
  const { balance, isPending, error } = useBalanceOf(token?.address as `0x${string}`, accountAddress as `0x${string}`);

  if (isPending) return <Loading />;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto p-4 bg-base-100 mb-4 border-t border-gray-100">
      <p className="text-gray-500 text-sm">持有代币数量</p>
      <p className="mt-2">
        {isPending ? (
          <Loading />
        ) : (
          <span className="text-orange-500 text-2xl font-bold">{formatTokenAmount(balance || 0n)}</span>
        )}
        <span className="text-gray-500 ml-2">{token?.symbol}</span>
      </p>
      <Button className="mt-2 w-1/2 bg-blue-600 hover:bg-blue-700" asChild>
        <Link href="/dex/swap">去交易</Link>
      </Button>
    </div>
  );
};

export default MyTokenPanel;
