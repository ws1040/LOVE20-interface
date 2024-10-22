import React, { useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

import {
  useStakedAmountByAccountByActionId,
  useLastJoinedRoundByAccountByActionId,
} from '../../hooks/contracts/useLOVE20Join';
import { TokenContext } from '../../contexts/TokenContext';
import Loading from '../Common/Loading';
import { formatTokenAmount } from '../../utils/strings';

interface MyJoinInfoOfActionPancelProps {
  actionId: bigint;
  currentRound: bigint;
}

const MyJoinInfoOfActionPancel: React.FC<MyJoinInfoOfActionPancelProps> = ({ actionId, currentRound }) => {
  const { address: account } = useAccount();
  const { token } = useContext(TokenContext) || {};

  // 获取我参与的代币数
  const {
    stakedAmountByAccountByActionId,
    isPending: isPendingStakedAmountByAccountByActionId,
    error: errorStakedAmountByAccountByActionId,
  } = useStakedAmountByAccountByActionId(
    (token?.address as `0x${string}`) || '',
    (account as `0x${string}`) || '',
    actionId,
  );

  // 获取我参加到第几轮
  const {
    lastJoinedRound,
    isPending: isPendingLastJoinedRound,
    error: errorLastJoinedRound,
  } = useLastJoinedRoundByAccountByActionId(
    (token?.address as `0x${string}`) || '',
    (account as `0x${string}`) || '',
    actionId,
  );

  return (
    <div className="flex flex-col items-center space-y-6 pb-8 bg-base-100 mb-4">
      <div className="flex w-full justify-center space-x-20">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">我参与的代币数</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingStakedAmountByAccountByActionId ? (
              <Loading />
            ) : (
              formatTokenAmount(stakedAmountByAccountByActionId || BigInt(0))
            )}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">参加到第几轮</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingLastJoinedRound ? <Loading /> : lastJoinedRound?.toString()}
          </span>
        </div>
      </div>

      {!isPendingStakedAmountByAccountByActionId && stakedAmountByAccountByActionId ? (
        <button className="btn-primary btn w-1/2">取回代币</button>
      ) : (
        ''
      )}
    </div>
  );
};

export default MyJoinInfoOfActionPancel;
