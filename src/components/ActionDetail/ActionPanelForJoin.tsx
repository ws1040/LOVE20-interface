import React, { useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

import { useCurrentRound, useJoinedAmountByActionIdByAccount, useJoinedAmountByActionId, useVerificationInfo } from '../../hooks/contracts/useLOVE20Join';
import { TokenContext } from '../../contexts/TokenContext';

interface ActionPanelForJoinProps {
  actionId: bigint;
  onRoundChange: (currentRound: bigint) => void;
}
  
const ActionPanelForJoin: React.FC<ActionPanelForJoinProps> = ({ actionId, onRoundChange }) => {
  const { address: account } = useAccount();  
  const { token } = useContext(TokenContext) || {};
  const { currentRound } = useCurrentRound();

  useEffect(() => {
    if (onRoundChange && typeof onRoundChange === 'function') {
      onRoundChange(currentRound);
    }
  }, [currentRound, onRoundChange]);

  // 获取行动代币数、用户代币数
  const {joinedAmountByActionIdByAccount, isPending: isPendingJoinedAmountByAccount, error: errorJoinedAmountByAccount} = useJoinedAmountByActionIdByAccount(token?.address as `0x${string}` || '', currentRound, actionId, account as `0x${string}` || '');
  const {joinedAmountByActionId, isPending: isPendingJoinedAmount, error: errorJoinedAmount} = useJoinedAmountByActionId(token?.address as `0x${string}` || '', currentRound, actionId);
  const isJoined = joinedAmountByActionIdByAccount && joinedAmountByActionIdByAccount > 0 && joinedAmountByActionId && joinedAmountByActionId > 0;
  const participationRatio = isJoined ?
      Number(joinedAmountByActionIdByAccount / joinedAmountByActionId) * 100 + '%'
      : '- %';

  // 获取验证信息
  const { verificationInfo, isPending: isPendingVerificationInfo, error: errorVerificationInfo } = useVerificationInfo(token?.address as `0x${string}` || '', currentRound, actionId, account as `0x${string}` || '', isJoined as boolean);

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-base-100 mb-4 border-t border-gray-100 ">
      <h1 className="text-base text-center">
        行动轮 (第 <span className="text-red-500">{Number(currentRound || BigInt(0))}</span> 轮)
      </h1>

      <div className="flex w-full justify-center space-x-20">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">我参与的代币数</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingJoinedAmount ? '加载中...' : `${joinedAmountByActionIdByAccount}`}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">所占比例</span>
          <span className="text-2xl font-bold text-orange-400">
            {participationRatio}
          </span>
        </div>
      </div>

      {!isJoined ? (
        <Link href="/participate-action" className="btn-primary btn w-full">
        参与行动
        </Link>
      ) : (
        <div className="flex flex-col items-center">
          <button disabled className="btn-disabled">
            您已参与
          </button>
          <div className="mt-2 text-sm text-gray-600">
            {isPendingVerificationInfo ? '加载中...' : verificationInfo}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPanelForJoin;
