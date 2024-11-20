import React, { useContext } from 'react';
import { useRewardAvailable } from '@/src/hooks/contracts/useLOVE20Mint';
import { useJoinedAmount } from '@/src/hooks/contracts/useLOVE20Join';

import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';
import Loading from '@/src/components/Common/Loading';
import Round from '@/src/components/Common/Round';

interface ActDataPanelProps {
  currentRound: bigint;
}

const ActDataPanel: React.FC<ActDataPanelProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  const {
    rewardAvailable,
    isPending: isPendingRewardAvailable,
    error: errorRewardAvailable,
  } = useRewardAvailable((token?.address as `0x${string}`) || '');
  const {
    joinedAmount,
    isPending: isPendingJoinedAmount,
    error: errorJoinedAmount,
  } = useJoinedAmount((token?.address as `0x${string}`) || '', currentRound);

  return (
    <div className="flex flex-col items-center p-6 bg-white">
      <Round currentRound={currentRound} roundName="行动轮" />

      <div className="flex w-full justify-center space-x-20 mt-4">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">预计新增铸币</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingRewardAvailable || rewardAvailable === undefined ? (
              <Loading />
            ) : (
              formatTokenAmount((rewardAvailable * 99n) / 10000n)
            )}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">参与行动代币</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingJoinedAmount ? <Loading /> : formatTokenAmount(joinedAmount || BigInt(0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActDataPanel;
