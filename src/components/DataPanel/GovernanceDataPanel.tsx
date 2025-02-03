import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';

// my hooks
import { useGovVotesNum } from '@/src/hooks/contracts/useLOVE20Stake';
import { useTotalSupply } from '@/src/hooks/contracts/useLOVE20STToken';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import Round from '@/src/components/Common/Round';
import { useHandleContractError } from '@/src/lib/errorUtils';

const GovernanceDataPanel: React.FC<{ currentRound: bigint }> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  // 获取数据
  const {
    govVotesNum,
    isPending: isPendingGovVotesNum,
    error: errorGovVotesNum,
  } = useGovVotesNum(token?.address as `0x${string}`);
  const {
    totalSupply: stTokenAmount,
    isPending: isPendingStTokenAmount,
    error: errorStTokenAmount,
  } = useTotalSupply(token?.stTokenAddress as `0x${string}`);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorGovVotesNum) {
      handleContractError(errorGovVotesNum, 'stake');
    }
    if (errorStTokenAmount) {
      handleContractError(errorStTokenAmount, 'stToken');
    }
  }, [errorGovVotesNum, errorStTokenAmount]);

  return (
    <div className="px-4 pb-4">
      <Round currentRound={currentRound} roundType="vote" />

      <div className="border rounded-lg p-0">
        <div className="stats  w-full grid grid-cols-2 divide-x-0">
          <div className="stat place-items-center pt-3 pb-0 mb-0">
            <div className="stat-title">总治理票数</div>
            <div className="stat-value text-2xl">
              {isPendingGovVotesNum ? <LoadingIcon /> : formatTokenAmount(govVotesNum || BigInt(0), 0)}
            </div>
          </div>
          <div className="stat place-items-center pt-3 pb-0 mb-0">
            <div className="stat-title">质押代币数</div>
            <div className="stat-value text-2xl">
              {isPendingStTokenAmount ? <LoadingIcon /> : formatTokenAmount(stTokenAmount || BigInt(0), 0)}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center py-0 mt-0 mb-0">
          <Button variant="link" size="sm" className="w-full text-gray-400" asChild>
            <Link href={`/gov/liquid?symbol=${token?.symbol}`}>流动性质押数据&gt;&gt;</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GovernanceDataPanel;
