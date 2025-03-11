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

  return (
    <div className="px-4">
      <Round currentRound={currentRound ? currentRound : 0n} roundType="act" />

      <div className="stats w-full border grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center">
          <div className="stat-title">预计新增铸币</div>
          <div className="stat-value text-2xl">
            {isPendingRewardAvailable || rewardAvailable === undefined ? (
              <LoadingIcon />
            ) : (
              formatTokenAmount((rewardAvailable * 99n) / 10000n, 0)
            )}
          </div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">参与行动代币</div>
          <div className="stat-value text-2xl">
            {isPendingJoinedAmount ? <LoadingIcon /> : formatTokenAmount(joinedAmount || BigInt(0), 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActDataPanel;
