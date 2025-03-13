'use client';
import React, { useContext, useEffect } from 'react';

// my hooks
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
import { useRewardAvailable } from '@/src/hooks/contracts/useLOVE20Mint';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import Round from '@/src/components/Common/Round';

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
    rewardAvailable,
    isPending: isPendingRewardAvailable,
    error: errorRewardAvailable,
  } = useRewardAvailable((token?.address as `0x${string}`) || '');
  const {
    balance: joinedAmount,
    isPending: isPendingJoinedAmount,
    error: errorJoinedAmount,
  } = useBalanceOf((token?.address as `0x${string}`) || '', JOIN_CONTRACT_ADDRESS);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorJoinedAmount) {
      handleContractError(errorJoinedAmount, 'join');
    }
    if (errorRewardAvailable) {
      handleContractError(errorRewardAvailable, 'mint');
    }
  }, [errorJoinedAmount, errorRewardAvailable]);

  // 计算预计新增铸币
  const expectedReward = ((rewardAvailable || BigInt(0)) * 99n) / 20000n;

  return (
    <div className="px-4">
      <Round currentRound={currentRound ? currentRound : 0n} roundType="act" />

      <div className="w-full border rounded-lg mt-4 p-0">
        <div className="stats w-full grid grid-cols-2 divide-x-0">
          <div className="stat place-items-center pb-2">
            <div className="stat-title text-sm pb-1">参与行动代币</div>
            <div className="stat-value text-xl text-secondary">
              {isPendingJoinedAmount ? <LoadingIcon /> : formatTokenAmount(joinedAmount || BigInt(0), 0)}
            </div>
          </div>
          <div className="stat place-items-center pb-2">
            <div className="stat-title text-sm pb-1">预计新增铸币</div>
            <div className="stat-value text-xl text-secondary">
              {isPendingRewardAvailable || rewardAvailable === undefined ? (
                <LoadingIcon />
              ) : (
                formatTokenAmount(expectedReward, 2)
              )}
            </div>
          </div>
        </div>
        <div className="text-center text-xs mb-2 text-greyscale-500">
          预估年化收益率（APY）：{calculateActionAPY(expectedReward, joinedAmount)}
        </div>
      </div>
    </div>
  );
};

export default ActDataPanel;
