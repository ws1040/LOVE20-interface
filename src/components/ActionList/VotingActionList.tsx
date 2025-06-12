'use client';
import { useRouter } from 'next/router';
import { ChevronRight, UserPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';

// my hooks
import { ActionInfo, ActionSubmit } from '@/src/types/love20types';
import { useActionSubmits, useActionInfosByIds } from '@/src/hooks/contracts/useLOVE20Submit';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useVotesNums } from '@/src/hooks/contracts/useLOVE20Vote';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

// my lib
import { formatTokenAmount } from '@/src/lib/format';

interface VotingActionListProps {
  currentRound: bigint;
}

const VotingActionList: React.FC<VotingActionListProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};
  const router = useRouter();

  // 投票数
  const {
    votes,
    actionIds: votesActionIds,
    isPending: isPendingVotesNums,
    error: errorVotesNums,
  } = useVotesNums((token?.address as `0x${string}`) || '', currentRound);

  // 推举信息
  const {
    actionSubmits,
    isPending: isPendingActionSubmits,
    error: errorActionSubmits,
  } = useActionSubmits((token?.address as `0x${string}`) || '', currentRound);

  // 行动详情
  const actionIds = actionSubmits?.map((actionSubmit: ActionSubmit) => BigInt(actionSubmit.actionId)) || [];
  const uniqueActionIds = Array.from(new Set(actionIds)).sort((a, b) => Number(a) - Number(b)); //从小到大排列
  const {
    actionInfos,
    isPending: isPendingActionInfosByIds,
    error: errorActionInfosByIds,
  } = useActionInfosByIds((token?.address as `0x${string}`) || '', uniqueActionIds);
  console.log('actionInfos', actionInfos);

  // 创建一个根据actionId获取投票数的函数
  const getVotesByActionId = (actionId: bigint): bigint => {
    if (!votesActionIds || !votes) return 0n;
    const index = votesActionIds.findIndex((id) => id === actionId);
    return index !== -1 ? votes[index] : 0n;
  };

  // 计算投票总数： 累计
  const totalVotes = votes?.reduce((acc, vote) => acc + vote, 0n) || 0n;

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorVotesNums) {
      handleContractError(errorVotesNums, 'vote');
    }
    if (errorActionInfosByIds) {
      handleContractError(errorActionInfosByIds, 'submit');
    }
  }, [errorVotesNums, errorActionInfosByIds]);

  // 加载中
  if (
    isPendingVotesNums ||
    isPendingActionSubmits ||
    (uniqueActionIds && uniqueActionIds.length > 0 && isPendingActionInfosByIds)
  ) {
    return (
      <div className="p-4 flex justify-center items-center">
        <LoadingIcon />
      </div>
    );
  }

  if (!token) {
    return <LoadingIcon />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <LeftTitle title="投票中的行动" />
        {token && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-secondary border-secondary" asChild>
              <Link href={`/vote/actions4submit?symbol=${token?.symbol}`}>推举其他行动</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-secondary border-secondary" asChild>
              <Link href={`/gov?symbol=${token?.symbol}`}>返回治理首页</Link>
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {uniqueActionIds.length > 0 ? (
          <>
            {actionInfos?.map((action: ActionInfo, index: number) => {
              const submitter = actionSubmits?.find(
                (submit: ActionSubmit) => BigInt(submit.actionId) === BigInt(action.head.id),
              )?.submitter;

              return (
                <Card key={action.head.id} className="shadow-none flex items-center relative">
                  <Link
                    href={`/action/${action.head.id}?type=vote&symbol=${token?.symbol}`}
                    key={action.head.id}
                    className="w-full"
                  >
                    <CardHeader className="px-3 pt-2 pb-1 flex-row justify-start items-baseline">
                      <span className="text-greyscale-400 text-sm">No.</span>
                      <span className="text-secondary text-xl font-bold mr-2">{String(action.head.id)}</span>
                      <span className="font-bold text-greyscale-800">{`${action.body.action}`}</span>
                    </CardHeader>
                    <CardContent className="px-3 pt-1 pb-2">
                      <div className="text-greyscale-500">{action.body.consensus}</div>
                      <div className="flex justify-between gap-0 mt-1 text-sm">
                        <span className="flex items-center">
                          <UserPen className="text-greyscale-400 mr-1 h-3 w-3 -translate-y-0.5" />
                          <span className="text-greyscale-400">
                            <AddressWithCopyButton
                              address={action.head.author as `0x${string}`}
                              showCopyButton={false}
                              colorClassName2="text-secondary"
                            />
                          </span>
                        </span>
                        <span>
                          <span className="text-greyscale-400 mr-1">投票数</span>
                          <span className="text-secondary">
                            {formatTokenAmount(getVotesByActionId(BigInt(action.head.id)), 0)}
                          </span>
                        </span>
                        <span>
                          <span className="text-greyscale-400 mr-1">投票占比</span>
                          <span className="text-secondary">
                            {Number(getVotesByActionId(BigInt(action.head.id))) === 0
                              ? '0'
                              : (
                                  (Number(getVotesByActionId(BigInt(action.head.id))) * 100) /
                                  Number(totalVotes)
                                ).toFixed(1)}
                            %
                          </span>
                        </span>
                      </div>
                    </CardContent>
                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-greyscale-400 pointer-events-none" />
                  </Link>
                </Card>
              );
            })}
          </>
        ) : (
          <div className="text-sm text-greyscale-500 text-center mt-8">还没推举行动，请先推举</div>
        )}
      </div>
    </div>
  );
};

export default VotingActionList;
