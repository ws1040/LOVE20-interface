import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { formatTokenAmount } from '@/src/lib/format';
import { useContributed } from '@/src/hooks/contracts/useLOVE20Launch';
import { Token } from '@/src/contexts/TokenContext';
import { LaunchInfo } from '@/src/types/life20types';
import LeftTitle from '@/src/components/Common/LeftTitle';

const ContributeInfo: React.FC<{ token: Token | null; launchInfo: LaunchInfo }> = ({ token, launchInfo }) => {
  const { address: account } = useAccount();

  const {
    contributed,
    isPending: isContributedPending,
    error: contributedError,
  } = useContributed(token?.address as `0x${string}`, account as `0x${string}`);

  if (!token) {
    return '';
  }

  return (
    <div className="p-6">
      <LeftTitle title="参与申购" />
      <div className="stats w-full">
        <div className="stat place-items-center">
          <div className="stat-title text-sm mr-6">我的申购质押</div>
          <div className="stat-value text-secondary">
            {formatTokenAmount(contributed || 0n)}
            <span className="text-greyscale-500 font-normal text-sm ml-2">{token.parentTokenSymbol}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" size="sm" className="w-1/2 text-secondary border-secondary" asChild>
          <Link href={`/${token.symbol}/launch/contribute`}>去申购</Link>
        </Button>
      </div>
    </div>
  );
};

export default ContributeInfo;
