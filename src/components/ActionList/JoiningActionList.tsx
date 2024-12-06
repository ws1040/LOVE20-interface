import React, { useContext } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';

import { ActionInfo } from '@/src/types/life20types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { formatTokenAmount } from '@/src/lib/format';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useJoinableActions } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useActionInfosByIds } from '@/src/hooks/contracts/useLOVE20Submit';
import { useJoinedActions } from '@/src/hooks/contracts/useLOVE20DataViewer';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

interface JoiningActionListProps {
  currentRound: bigint;
}

const JoiningActionList: React.FC<JoiningActionListProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  // 获取可加入的行动ids以及投票数、质押币数 TODO：将3个API合并1个外围API
  const {
    actions: joinableActions,
    isPending: isPendingJoinableActions,
    error: errorJoinableActions,
  } = useJoinableActions((token?.address as `0x${string}`) || '', currentRound);
  joinableActions?.sort((a, b) => Number(a.actionId) - Number(b.actionId)); // 排序：将 joinableActions 按 actionId 从小到大排序
  const actionIds = joinableActions?.map((action) => action.actionId);
  const totalVotes = joinableActions?.reduce((acc, action) => acc + action.votesNum, 0n) || 0n;

  // 获取行动详情 TODO：将3个API合并1个外围API
  const {
    actionInfos,
    isPending: isPendingActionInfosByIds,
    error: errorActionInfosByIds,
  } = useActionInfosByIds((token?.address as `0x${string}`) || '', actionIds || []);

  // 获取已加入的行动 TODO：将3个API合并1个外围API
  const {
    joinedActions,
    isPending: isPendingJoinedActions,
    error: errorJoinedActions,
  } = useJoinedActions((token?.address as `0x${string}`) || '', accountAddress as `0x${string}`);

  if (errorJoinableActions || errorActionInfosByIds || errorJoinedActions) {
    console.error('errorJoinableActions', errorJoinableActions);
    console.error('errorActionInfosByIds', errorActionInfosByIds);
    console.error('errorJoinedActions', errorJoinedActions);
    return <div>加载出错，请稍后再试。</div>;
  }

  const isLoading =
    isPendingJoinableActions ||
    (joinableActions && joinableActions.length > 0 && isPendingActionInfosByIds) ||
    isPendingJoinedActions;

  return (
    <div className="p-6">
      <LeftTitle title="进行中的行动" />
      {isLoading && (
        <div className="p-4 flex justify-center items-center">
          <LoadingIcon />
        </div>
      )}
      {!isLoading && !actionIds?.length && (
        <div className="text-sm mt-4 text-greyscale-500 text-center">本轮暂无行动</div>
      )}
      {!isLoading && actionIds && actionIds.length > 0 && (
        <div className="mt-4 space-y-4">
          {actionInfos?.map((action: ActionInfo, index: number) => {
            const isJoined = joinedActions?.some((joinedAction) => joinedAction.actionId === BigInt(action.head.id));

            const href = isJoined
              ? `/action/${action.head.id}?type=join&symbol=${token?.symbol}`
              : `/acting/join?id=${action.head.id}&symbol=${token?.symbol}`;

            return (
              <Card key={action.head.id} className="shadow-none">
                <Link href={href}>
                  <CardHeader className="px-3 pt-2 pb-1 flex-row justify-start items-baseline">
                    <span className="text-greyscale-400 text-sm mr-1">{`No.${action.head.id}`}</span>
                    <span className="font-bold text-greyscale-800">{`${action.body.action}`}</span>
                  </CardHeader>
                  <CardContent className="px-3 pt-1 pb-2">
                    <div className="text-greyscale-500">{action.body.consensus}</div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>
                        <span className="text-greyscale-400 mr-1">投票占比</span>
                        <span className="text-secondary">
                          {((Number(joinableActions?.[index].votesNum || 0n) * 100) / Number(totalVotes)).toFixed(1)}%
                        </span>
                      </span>
                      <span>
                        <span className="text-greyscale-400 mr-1">参与代币数</span>
                        <span className="text-secondary">
                          {formatTokenAmount(joinableActions?.[index].joinedAmount || 0n)}
                        </span>
                      </span>
                    </div>
                  </CardContent>
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
