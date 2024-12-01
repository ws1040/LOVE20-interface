import React, { useContext } from 'react';
import { useRewardAvailable } from '@/src/hooks/contracts/useLOVE20Mint';
import { useJoinedAmount } from '@/src/hooks/contracts/useLOVE20Join';

import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
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
    <div className="px-6">
      <Round currentRound={currentRound} roundName="行动轮" />

      <div className="stats w-full border grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center">
          <div className="stat-title">预计新增铸币</div>
          <div className="stat-value text-2xl">
            {isPendingRewardAvailable || rewardAvailable === undefined ? (
              <LoadingIcon />
            ) : (
              formatTokenAmount((rewardAvailable * 99n) / 10000n)
            )}
          </div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">参与行动代币</div>
          <div className="stat-value text-2xl">
            {isPendingJoinedAmount ? <LoadingIcon /> : formatTokenAmount(joinedAmount || BigInt(0))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActDataPanel;
