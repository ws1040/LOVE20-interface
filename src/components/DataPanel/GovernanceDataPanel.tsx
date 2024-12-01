import React, { useContext } from 'react';

import { useGovVotesNum } from '@/src/hooks/contracts/useLOVE20Stake';
import { useTotalSupply } from '@/src/hooks/contracts/useLOVE20STToken';

import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';
import StakedLiquidDataPanel from './StakedLiquidDataPanel';
import LoadingIcon from '../Common/LoadingIcon';
import Round from '../Common/Round';

const GovernanceDataPanel: React.FC<{ currentRound: bigint }> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  const { govVotesNum, isPending: isPendingGovVotesNum } = useGovVotesNum(token?.address as `0x${string}`);
  const { totalSupply: stTokenAmount, isPending: isPendingStTokenAmount } = useTotalSupply(
    token?.stTokenAddress as `0x${string}`,
  );

  return (
    <div className="px-6 pb-6">
      <Round currentRound={currentRound} roundName="投票轮" />

      <div className="stats border w-full grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center">
          <div className="stat-title">总治理票</div>
          <div className="stat-value text-2xl">
            {isPendingGovVotesNum ? <LoadingIcon /> : formatTokenAmount(govVotesNum || BigInt(0))}
          </div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">代币质押量</div>
          <div className="stat-value text-2xl">
            {isPendingStTokenAmount ? <LoadingIcon /> : formatTokenAmount(stTokenAmount || BigInt(0))}
          </div>
        </div>
      </div>

      {/* 改为弹窗 <div className="w-full flex flex-col items-center space-y-4 bg-gray-100 rounded p-4">
        <StakedLiquidDataPanel />
      </div> */}
    </div>
  );
};

export default GovernanceDataPanel;
