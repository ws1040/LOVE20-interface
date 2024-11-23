import React, { useContext } from 'react';
import Link from 'next/link';

import { useJoinableActions } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useActionInfosByIds } from '@/src/hooks/contracts/useLOVE20Submit';
import { TokenContext } from '@/src/contexts/TokenContext';
import { ActionInfo } from '@/src/types/life20types';
import { formatTokenAmount } from '@/src/lib/format';

import Loading from '@/src/components/Common/Loading';

interface JoiningActionListProps {
  currentRound: bigint;
}
const JoiningActionList: React.FC<JoiningActionListProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  // 获取可加入的行动ids以及投票数、质押币数
  const {
    actions: joinableActions,
    isPending: isPendingJoinableActions,
    error: errorJoinableActions,
  } = useJoinableActions((token?.address as `0x${string}`) || '', currentRound);
  joinableActions?.sort((a, b) => Number(a.actionId) - Number(b.actionId)); // 排序：将 joinableActions 按 actionId 从小到大排序
  const actionIds = joinableActions?.map((action) => action.actionId);
  const totalVotes = joinableActions?.reduce((acc, action) => acc + action.votesNum, 0n) || 0n;

  // 获取行动详情
  const {
    actionInfos,
    isPending: isPendingActionInfosByIds,
    error: errorActionInfosByIds,
  } = useActionInfosByIds((token?.address as `0x${string}`) || '', actionIds || []);

  if (isPendingJoinableActions || (actionIds && actionIds.length > 0 && isPendingActionInfosByIds)) {
    return (
      <div className="p-4 flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (errorJoinableActions || errorActionInfosByIds) {
    return <div>加载出错，请稍后再试。</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-sm font-bold mb-4 text-gray-600">行动列表 (行动轮)</h2>
      {!actionIds?.length ? (
        <div className="text-sm text-gray-500 text-center">没有行动</div>
      ) : (
        <div className="space-y-4">
          {actionInfos?.map((action: ActionInfo, index: number) => (
            <div key={action.head.id} className="bg-white p-4 rounded-lg mb-4">
              <Link href={`/${token.symbol}/action/${action.head.id}?type=join`} key={action.head.id}>
                <div className="font-semibold mb-2">
                  <span className="text-gray-400 text-base mr-1">{`No.${action.head.id}`}</span>
                  <span className="text-gray-800 text-lg">{`${action.body.action}`}</span>
                </div>
                <p className="leading-tight">{action.body.consensus}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-sm">
                    投票占比 {((Number(joinableActions?.[index].votesNum || 0n) * 100) / Number(totalVotes)).toFixed(1)}
                    %
                  </span>
                  <span className="text-sm">
                    已参与行动代币 {formatTokenAmount(joinableActions?.[index].joinedAmount || 0n)}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoiningActionList;
