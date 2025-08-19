'use client';
import React, { useContext, useEffect } from 'react';

// my hooks
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
import { useEstimatedActionRewardOfCurrentRound } from '@/src/hooks/contracts/useLOVE20RoundViewer';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

// my utils
import { calculateActionAPY } from '@/src/lib/domainUtils';

const JOIN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_JOIN as `0x${string}`;

interface ActDataPanelProps {
  currentRound: bigint;
}

const ActDataPanel: React.FC<ActDataPanelProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  // 获取数据
  const {
    balance: joinedAmount,
    isPending: isPendingJoinedAmount,
    error: errorJoinedAmount,
  } = useBalanceOf((token?.address as `0x${string}`) || '', JOIN_CONTRACT_ADDRESS);

  const {
    reward: expectedReward,
    isPending: isPendingEstimatedActionReward,
    error: errorEstimatedActionReward,
  } = useEstimatedActionRewardOfCurrentRound((token?.address as `0x${string}`) || '');

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorJoinedAmount) {
      handleContractError(errorJoinedAmount, 'join');
    }
    if (errorEstimatedActionReward) {
      handleContractError(errorEstimatedActionReward, 'dataViewer');
    }
  }, [errorJoinedAmount, errorEstimatedActionReward]);

  return (
    <div className="px-4">
      <div className="w-full border rounded-lg p-0">
        <div className="stats w-full grid grid-cols-2 divide-x-0">
          <div className="stat place-items-center pb-2">
            <div className="stat-title text-sm pb-1">参与行动代币总数</div>
            <div className="stat-value text-xl text-secondary">
              {isPendingJoinedAmount ? <LoadingIcon /> : formatTokenAmount(joinedAmount ?? 0n)}
            </div>
          </div>
          <div className="stat place-items-center pb-2">
            <div className="stat-title text-sm pb-1">预计新增铸币</div>
            <div className="stat-value text-xl text-secondary">
              {isPendingEstimatedActionReward ? (
                <LoadingIcon />
              ) : (
                formatTokenAmount(currentRound == 2n ? 9000000n * 10n ** 18n : expectedReward ?? 0n)
              )}
            </div>
          </div>
        </div>
        <div className="text-center text-xs mb-2 text-greyscale-500">
          预估年化收益率（APY）：
          {isPendingJoinedAmount || isPendingEstimatedActionReward ? (
            <LoadingIcon />
          ) : (
            calculateActionAPY(expectedReward, joinedAmount)
          )}
        </div>
      </div>
    </div>
  );
};

export default ActDataPanel;
