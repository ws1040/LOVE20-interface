import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useContext } from 'react';

import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';
import { useGovVotesNum } from '@/src/hooks/contracts/useLOVE20Stake';
import { useTotalSupply } from '@/src/hooks/contracts/useLOVE20STToken';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import Round from '@/src/components/Common/Round';

const GovernanceDataPanel: React.FC<{ currentRound: bigint }> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  const { govVotesNum, isPending: isPendingGovVotesNum } = useGovVotesNum(token?.address as `0x${string}`);
  const { totalSupply: stTokenAmount, isPending: isPendingStTokenAmount } = useTotalSupply(
    token?.stTokenAddress as `0x${string}`,
  );

  return (
    <div className="px-6 pb-2">
      <Round currentRound={currentRound} roundName="投票轮" />

      <div className="border rounded-lg p-0">
        <div className="stats  w-full grid grid-cols-2 divide-x-0">
          <div className="stat place-items-center pt-3 pb-0 mb-0">
            <div className="stat-title">总治理票数</div>
            <div className="stat-value text-2xl">
              {isPendingGovVotesNum ? <LoadingIcon /> : formatTokenAmount(govVotesNum || BigInt(0))}
            </div>
          </div>
          <div className="stat place-items-center pt-3 pb-0 mb-0">
            <div className="stat-title">质押代币数</div>
            <div className="stat-value text-2xl">
              {isPendingStTokenAmount ? <LoadingIcon /> : formatTokenAmount(stTokenAmount || BigInt(0))}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center py-0 mt-0 mb-0">
          <Button variant="link" size="sm" className="w-full text-secondary" asChild>
            <Link href={`/gov/liquid?symbol=${token?.symbol}`}>流动性质押数据</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GovernanceDataPanel;
