import React, { useContext } from 'react';
import { useRewardAvailable } from '../../hooks/contracts/useLOVE20Mint';
import { useJoinedAmount } from '../../hooks/contracts/useLOVE20Join';

import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/strings';
import Loading from '../Common/Loading';

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
    <div className="flex flex-col items-center space-y-4 p-6 bg-base-100">
      <h1 className="text-base text-center">
        行动轮（第 <span className="text-red-500">{Number(currentRound)}</span> 轮）
      </h1>

      <div className="flex w-full justify-center space-x-20">
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

      <a href="#" className="text-blue-400 text-sm hover:underline">
        查看以往轮次奖励 &gt;&gt;
      </a>
    </div>
  );
};

export default ActDataPanel;
