import React, { useContext } from 'react';

import { useGovVotesNum } from '../../hooks/contracts/useLOVE20Stake';
import { useTotalSupply } from '../../hooks/contracts/useLOVE20STToken';

import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/format';
import TokenLabel from '../Token/TokenLabel';
import StakedLiquidDataPanel from './StakedLiquidDataPanel';

const GovernanceDataPanel: React.FC = () => {
  const { token } = useContext(TokenContext) || {};

  const { govVotesNum, isPending: isPendingGovVotesNum } = useGovVotesNum(token?.address as `0x${string}`);
  const { totalSupply: stTokenAmount, isPending: isPendingStTokenAmount } = useTotalSupply(
    token?.stTokenAddress as `0x${string}`,
  );

  return (
    <div className="p-6 bg-base-100 border-t border-gray-100">
      <TokenLabel />

      <div className="flex w-full justify-center space-x-20">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">总治理票</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingGovVotesNum ? 'Loading...' : formatTokenAmount(govVotesNum || BigInt(0))}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">代币质押量</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingStTokenAmount ? 'Loading...' : formatTokenAmount(stTokenAmount || BigInt(0))}
          </span>
        </div>
      </div>
      <div className="w-full flex flex-col items-center space-y-4 bg-base-200 rounded p-4">
        <StakedLiquidDataPanel />
      </div>
    </div>
  );
};

export default GovernanceDataPanel;
