'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';

// my hooks
import { useGovData } from '@/src/hooks/contracts/useLOVE20DataViewer';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import Round from '@/src/components/Common/Round';
import { useHandleContractError } from '@/src/lib/errorUtils';

const GovernanceDataPanel: React.FC<{ currentRound: bigint }> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  // 使用 useGovData 获取治理数据
  const { govData, isPending, error } = useGovData(token?.address as `0x${string}`);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (error) {
      handleContractError(error, 'govData');
    }
  }, [error]);

  if (!token) {
    return <LoadingIcon />;
  }

  return (
    <div className="px-4 pb-4">
      <Round currentRound={currentRound} roundType="vote" />

      <div className="border rounded-lg mt-4 p-0">
        <div className="stats w-full">
          <div className="stat place-items-center pb-0">
            <div className="stat-title text-base">总治理票数</div>
            <div className="stat-value text-secondary text-2xl">
              {isPending ? <LoadingIcon /> : formatTokenAmount(govData?.govVotes || BigInt(0), 2)}
            </div>
            <div className="stat-desc text-xs">
              <Button variant="link" size="sm" className="w-full text-gray-400" asChild>
                <Link href={`/gov/liquid?symbol=${token?.symbol}`}>流动性质押数据&gt;&gt;</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="stats w-full grid grid-cols-2 divide-x-0">
          <div className="stat place-items-center pt-2 pb-0 mb-0">
            <div className="stat-title text-sm">流动性质押sl{token.symbol}</div>
            <div className="stat-value text-xl">
              {isPending ? <LoadingIcon /> : formatTokenAmount(govData?.slAmount || BigInt(0), 2)}
            </div>
            <div className="stat-desc text-xs">
              <Button variant="link" className="text-secondary font-normal border-secondary" asChild>
                <Link href={`/gov/stakelp/?symbol=${token.symbol}`}>质押&获取治理票&nbsp;&gt;&gt;</Link>
              </Button>
            </div>
          </div>
          <div className="stat place-items-center pt-2 pb-0 mb-0">
            <div className="stat-title text-sm">质押代币st{token.symbol}</div>
            <div className="stat-value text-xl">
              {isPending ? <LoadingIcon /> : formatTokenAmount(govData?.stAmount || BigInt(0), 2)}
            </div>
            <div className="stat-desc text-xs">
              <Button variant="link" className="text-secondary font-normal border-secondary" asChild>
                <Link href={`/gov/staketoken?symbol=${token.symbol}`}>质押&增加收益&nbsp;&gt;&gt;</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceDataPanel;
