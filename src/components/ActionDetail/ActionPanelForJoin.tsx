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
import Loading from '@/src/components/Common/Loading';
import Round from '@/src/components/Common/Round';

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

  return (
    <div className="flex flex-col items-center space-y-4 p-8 bg-white mb-4  ">
      {isPendingCurrentRound ? <Loading /> : <Round currentRound={currentRound} roundName="行动轮" />}

      <div className="flex w-full justify-center space-x-20">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">我参与的代币数</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingJoinedAmount ? <Loading /> : formatTokenAmount(joinedAmountByActionIdByAccount || BigInt(0))}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">所占比例</span>
          <span className="text-2xl font-bold text-orange-400">{participationRatio}</span>
        </div>
      </div>

      {!isJoined ? (
        <Link href={`/${token.symbol}/acting/join?id=${actionId}`} className="w-1/2">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">参与行动</Button>
        </Link>
      ) : (
        <div className="flex flex-col items-center">
          <Button disabled className="w-full bg-gray-400 cursor-not-allowed">
            您已参与
          </Button>
          <div className="mt-2 text-sm text-gray-600">{isPendingVerificationInfo ? '加载中...' : verificationInfo}</div>
        </div>
      )}
    </div>
  );
};

export default ActionPanelForJoin;
