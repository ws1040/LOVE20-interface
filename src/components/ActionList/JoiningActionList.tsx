'use client';
import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ChevronRight, UserPen } from 'lucide-react';

import { JoinableActionDetail } from '@/src/types/love20types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

// my utils
import { calculateActionAPY, calculateExpectedActionReward } from '@/src/lib/domainUtils';
import { formatPercentage, formatSeconds } from '@/src/lib/format';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useJoinableActions } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useRewardAvailable } from '@/src/hooks/contracts/useLOVE20Mint';

// my components
import RoundLite from '@/src/components/Common/RoundLite';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';

interface JoiningActionListProps {
  currentRound: bigint;
}

const JoiningActionList: React.FC<JoiningActionListProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};
  const { address: account } = useAccount();

  // 获取行动参与相关数据
  const { joinableActionDetails, joinedActions, isPending, error } = useJoinableActions(
    (token?.address as `0x${string}`) || '',
    currentRound ? currentRound : 0n,
    account as `0x${string}`,
  );
  const {
    rewardAvailable,
    isPending: isPendingRewardAvailable,
    error: errorRewardAvailable,
  } = useRewardAvailable((token?.address as `0x${string}`) || '');

  // 对返回的 joinableActionDetails 根据 action 的 id 进行排序
  joinableActionDetails?.sort((a, b) => Number(a.action.head.id) - Number(b.action.head.id));

  // 计算所有 joinableActionDetails 的总票数，用于计算投票占比
  const totalVotes = joinableActionDetails?.reduce((acc, action) => acc + action.votesNum, 0n) || 0n;

  // 计算预计新增铸币
  const displayRound = token ? currentRound - BigInt(token.initialStakeRound) + 1n : 0n;
  const expectedReward = calculateExpectedActionReward(rewardAvailable, displayRound);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (error) {
      handleContractError(error, 'dataViewer');
    }
    if (errorRewardAvailable) {
      handleContractError(errorRewardAvailable, 'mint');
    }
  }, [error, errorRewardAvailable]);

  return (
    <div className="px-4 py-6">
      <LeftTitle title="本轮可参与的行动：" />
      <RoundLite currentRound={currentRound} roundType="act" />
      {!account && <div className="text-sm mt-4 text-greyscale-500 text-center">请先连接钱包</div>}
      {account && isPending && (
        <div className="p-4 flex justify-center items-center">
          <LoadingIcon />
        </div>
      )}
      {account && !isPending && !joinableActionDetails?.length && (
        <div className="text-sm mt-4 text-greyscale-500 text-center">本轮暂无行动</div>
      )}
      {!isPending && joinableActionDetails && joinableActionDetails.length > 0 && (
        <div className="mt-2 space-y-4">
          {joinableActionDetails.map((actionDetail: JoinableActionDetail, index: number) => {
            // 判断当前账户是否已经加入该行动
            const isJoined = joinedActions?.some(
              (joinedAction) => joinedAction.action.head.id === actionDetail.action.head.id,
            );

            // 计算投票占比
            const voteRatio =
              Number(totalVotes) > 0 ? Number(joinableActionDetails[index].votesNum || 0n) / Number(totalVotes) : 0;

            // 根据是否已加入，设置不同的链接
            const href = isJoined
              ? `/action/${actionDetail.action.head.id}?type=join&symbol=${token?.symbol}`
              : `/acting/join?id=${actionDetail.action.head.id}&symbol=${token?.symbol}`;

            return (
              <Card key={actionDetail.action.head.id} className="shadow-none">
                <Link href={href} className="relative block">
                  <CardHeader className="px-3 pt-2 pb-1 flex-row items-baseline">
                    <span className="text-greyscale-400 text-sm">{`No.`}</span>
                    <span className="text-secondary text-xl font-bold mr-2">{String(actionDetail.action.head.id)}</span>
                    <span className="font-bold text-greyscale-800">{`${actionDetail.action.body.title}`}</span>
                  </CardHeader>
                  <CardContent className="px-3 pt-1 pb-2">
                    <div className="flex justify-between mt-1 text-sm">
                      <span className="flex items-center">
                        <UserPen className="text-greyscale-400 mr-1 h-3 w-3 -translate-y-0.5" />
                        <span className="text-greyscale-400">
                          <AddressWithCopyButton
                            address={joinableActionDetails[index].action.head.author as `0x${string}`}
                            showCopyButton={false}
                            colorClassName2="text-secondary"
                          />
                        </span>
                      </span>
                      {voteRatio * 100 < Number(process.env.NEXT_PUBLIC_ACTION_REWARD_MIN_VOTE_PER_THOUSAND) / 10 ? (
                        <span className="flex justify-between text-error text-sm">无铸币奖励</span>
                      ) : (
                        <span>
                          <span className="text-greyscale-400 mr-1">预估年化(APY)</span>
                          <span className="text-secondary">
                            {isPendingRewardAvailable ? (
                              <LoadingIcon />
                            ) : (
                              calculateActionAPY(
                                BigInt(Math.floor(Number(expectedReward || 0n) * voteRatio)),
                                joinableActionDetails[index].joinedAmount,
                              )
                            )}
                          </span>
                        </span>
                      )}

                      <span>
                        <span className="text-greyscale-400 mr-1">投票</span>
                        <span className="text-secondary">{formatPercentage(voteRatio * 100)}</span>
                      </span>
                    </div>
                  </CardContent>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-greyscale-400 pointer-events-none" />
                </Link>
              </Card>
            );
          })}

          <div className="text-sm mt-4 text-greyscale-500 text-center">
            <span className="text-red-500 font-bold">提醒：</span>
            <span>
              每个行动阶段，最后{process.env.NEXT_PUBLIC_JOIN_END_PHASE_BLOCKS}
              个区块（约
              {formatSeconds(
                (Number(process.env.NEXT_PUBLIC_JOIN_END_PHASE_BLOCKS) * Number(process.env.NEXT_PUBLIC_BLOCK_TIME)) /
                  100,
              )}
              ），无法参与行动报名
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoiningActionList;
