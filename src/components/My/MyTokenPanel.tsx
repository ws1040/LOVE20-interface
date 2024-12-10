import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { Token } from '@/src/contexts/TokenContext';
import { useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
import { useStakedAmountByAccount } from '@/src/hooks/contracts/useLOVE20Join';
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LeftTitle from '@/src/components/Common/LeftTitle';

const MyTokenPanel: React.FC<{ token: Token | null | undefined }> = ({ token }) => {
  const { address: accountAddress } = useAccount();

  // 获取代币余额
  const {
    balance,
    isPending: isPendingBalance,
    error: errorBalance,
  } = useBalanceOf(token?.address as `0x${string}`, accountAddress as `0x${string}`);

  // 获取行动锁定代币总量
  const {
    stakedAmount,
    isPending: isPendingStakedAmount,
    error: errorStakedAmount,
  } = useStakedAmountByAccount(token?.address as `0x${string}`, accountAddress as `0x${string}`);

  if (errorBalance) {
    console.log('errorBalance', errorBalance);
    return <div>错误: {errorBalance.message}</div>;
  }

  if (errorStakedAmount) {
    console.log('errorStakedAmount', errorStakedAmount);
    return <div>错误: {errorStakedAmount.message}</div>;
  }

  if (!token) {
    return <LoadingIcon />;
  }
  if (!accountAddress) {
    return (
      <>
        <div className="flex-col items-center px-6 py-2">
          <LeftTitle title="我的代币" />
          <div className="text-sm mt-4 text-greyscale-500 text-center">请先连接钱包</div>
        </div>
      </>
    );
  }

  return (
    <div className="flex-col items-center px-6 py-2">
      <div className="flex justify-between items-center">
        <LeftTitle title="我的代币" />
        <Button variant="link" className="text-secondary border-secondary" asChild>
          <Link href={`/dex/swap?symbol=${token.symbol}`}>交易代币</Link>
        </Button>
      </div>
      <div className="stats w-full grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center">
          <div className="stat-title text-sm mb-1">持有 {token?.symbol}</div>
          <div className="stat-value text-xl">
            {isPendingBalance ? <LoadingIcon /> : formatTokenAmount(balance || BigInt(0))}
          </div>
          <div className="stat-desc mt-0 text-xs text-greyscale-400 font-light">不含质押、锁定</div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title text-sm">行动锁定 {token?.symbol}</div>
          <div className="stat-value text-xl">
            {isPendingStakedAmount ? <LoadingIcon /> : formatTokenAmount(stakedAmount || BigInt(0))}
          </div>
          <div className="stat-desc mt-0 text-xs text-greyscale-400 font-light">行动结束可取回</div>
        </div>
      </div>
    </div>
  );
};

export default MyTokenPanel;
