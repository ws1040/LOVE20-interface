'use client';
import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ChevronRight } from 'lucide-react';

import { JoinableActionDetail } from '@/src/types/love20types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { formatTokenAmount } from '@/src/lib/format';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useJoinableActions } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useHandleContractError } from '@/src/lib/errorUtils';

import RoundLite from '@/src/components/Common/RoundLite';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

interface JoiningActionListProps {
  currentRound: bigint;
}

const JoiningActionList: React.FC<JoiningActionListProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  // 使用合并后的钩子，一次性获取所有相关数据
  const { joinableActionDetails, joinedActions, isPending, error } = useJoinableActions(
    (token?.address as `0x${string}`) || '',
    currentRound ? currentRound : 0n,
    accountAddress as `0x${string}`,
  );

  // 对返回的 joinableActionDetails 根据 action 的 id 进行排序
  joinableActionDetails?.sort((a, b) => Number(a.action.head.id) - Number(b.action.head.id));

  // 计算所有 joinableActionDetails 的总票数，用于计算投票占比
  const totalVotes = joinableActionDetails?.reduce((acc, action) => acc + action.votesNum, 0n) || 0n;

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (error) {
      handleContractError(error, 'dataViewer');
    }
  }, [error]);

  return (
    <div className="px-4 py-6">
      <LeftTitle title="本轮可参与的行动：" />
      <RoundLite currentRound={currentRound} roundType="act" />
      {!accountAddress && <div className="text-sm mt-4 text-greyscale-500 text-center">请先连接钱包</div>}
      {accountAddress && isPending && (
        <div className="p-4 flex justify-center items-center">
          <LoadingIcon />
        </div>
      )}
      {accountAddress && !isPending && !joinableActionDetails?.length && (
        <div className="text-sm mt-4 text-greyscale-500 text-center">本轮暂无行动</div>
      )}
      {!isPending && joinableActionDetails && joinableActionDetails.length > 0 && (
        <div className="mt-2 space-y-4">
          {joinableActionDetails.map((actionDetail: JoinableActionDetail, index: number) => {
            // 判断当前账户是否已经加入该行动
            const isJoined = joinedActions?.some(
              (joinedAction) => joinedAction.action.head.id === actionDetail.action.head.id,
            );

            // 根据是否已加入，设置不同的链接
            const href = isJoined
              ? `/action/${actionDetail.action.head.id}?type=join&symbol=${token?.symbol}`
              : `/acting/join?id=${actionDetail.action.head.id}&symbol=${token?.symbol}`;

            return (
              <Card key={actionDetail.action.head.id} className="shadow-none">
                <Link href={href} className="relative block">
                  <CardHeader className="px-3 pt-2 pb-1 flex-row items-baseline">
                    <span className="text-greyscale-400 text-sm mr-1">{`No.${actionDetail.action.head.id}`}</span>
                    <span className="font-bold text-greyscale-800">{`${actionDetail.action.body.action}`}</span>
                  </CardHeader>
                  <CardContent className="px-3 pt-1 pb-2">
                    <div className="text-greyscale-500">{actionDetail.action.body.consensus}</div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>
                        <span className="text-greyscale-400 mr-1">投票占比</span>
                        <span className="text-greyscale-400">
                          {((Number(joinableActionDetails[index].votesNum || 0n) * 100) / Number(totalVotes)).toFixed(
                            1,
                          )}
                          %
                        </span>
                      </span>
                      <span>
                        <span className="text-greyscale-400 mr-1">参与代币数</span>
                        <span className="text-greyscale-400">
                          {formatTokenAmount(joinableActionDetails[index].joinedAmount || 0n, 0)}
                        </span>
                      </span>
                    </div>
                  </CardContent>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-greyscale-400 pointer-events-none" />
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JoiningActionList;
