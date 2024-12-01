import React, { useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import {
  useCurrentRound,
  useJoinedAmountByActionIdByAccount,
  useJoinedAmountByActionId,
  useVerificationInfo,
} from '@/src/hooks/contracts/useLOVE20Join';
import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

interface ActionPanelForJoinProps {
  actionId: bigint;
  onRoundChange: (currentRound: bigint) => void;
}

const ActionPanelForJoin: React.FC<ActionPanelForJoinProps> = ({ actionId, onRoundChange }) => {
  const { address: account } = useAccount();
  const { token } = useContext(TokenContext) || {};

  // 获取当前轮次, 并设置状态给父组件
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();
  useEffect(() => {
    if (onRoundChange && typeof onRoundChange === 'function') {
      onRoundChange(currentRound);
    }
  }, [currentRound, onRoundChange]);

  // 获取我的行动代币数
  const {
    joinedAmountByActionIdByAccount,
    isPending: isPendingJoinedAmountByAccount,
    error: errorJoinedAmountByAccount,
  } = useJoinedAmountByActionIdByAccount(
    (token?.address as `0x${string}`) || '',
    currentRound,
    actionId,
    (account as `0x${string}`) || '',
  );

  // 获取所有用户代币数，计算参与比例
  const {
    joinedAmountByActionId,
    isPending: isPendingJoinedAmount,
    error: errorJoinedAmount,
  } = useJoinedAmountByActionId((token?.address as `0x${string}`) || '', currentRound, actionId);
  const isJoined =
    joinedAmountByActionIdByAccount &&
    joinedAmountByActionIdByAccount > 0 &&
    joinedAmountByActionId &&
    joinedAmountByActionId > 0;
  const participationRatio = isJoined
    ? Number(joinedAmountByActionIdByAccount / joinedAmountByActionId) * 100 + '%'
    : '0%';

  // 获取验证信息
  const {
    verificationInfo,
    isPending: isPendingVerificationInfo,
    error: errorVerificationInfo,
  } = useVerificationInfo(
    (token?.address as `0x${string}`) || '',
    currentRound,
    actionId,
    (account as `0x${string}`) || '',
    isJoined as boolean,
  );

  if (errorJoinedAmountByAccount) {
    console.error('errorJoinedAmountByAccount', errorJoinedAmountByAccount);
    return <div>发生错误: {errorJoinedAmountByAccount.message}</div>;
  }
  if (errorJoinedAmount) {
    console.error('errorJoinedAmount', errorJoinedAmount);
    return <div>发生错误: {errorJoinedAmount.message}</div>;
  }
  if (errorVerificationInfo) {
    console.error('errorVerificationInfo', errorVerificationInfo);
    return <div>发生错误: {errorVerificationInfo.message}</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4 px-6 pt-6 pb-2">
      <div className="stats w-full border grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center">
          <div className="stat-title">我参与本行动的代币</div>
          <div className="stat-value text-2xl">
            {isPendingJoinedAmount ? <LoadingIcon /> : formatTokenAmount(joinedAmountByActionIdByAccount || BigInt(0))}
          </div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">所占比例</div>
          <div className="stat-value text-2xl">{participationRatio}</div>
        </div>
      </div>

      {!isJoined ? (
        <Button variant="outline" className="w-full text-secondary border-secondary" asChild>
          <Link href={`/${token?.symbol}/acting/join?id=${actionId}`}>参与行动</Link>
        </Button>
      ) : (
        <div className="flex flex-col items-center">
          <Button disabled className="w-full">
            您已参与
          </Button>
          <div className="mt-2 text-sm text-greyscale-600">
            {isPendingVerificationInfo ? '加载中...' : `我的信息：${verificationInfo}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPanelForJoin;
