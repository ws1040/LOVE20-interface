import React, { useContext } from 'react';

import { useActionSubmits, useActionInfosByIds } from '../../hooks/contracts/useLOVE20Submit';
import { useVotesNums } from '../../hooks/contracts/useLOVE20Vote';

import { TokenContext } from '../../contexts/TokenContext';
import { ActionInfo, ActionSubmit } from '../../types/life20types';
import Link from 'next/link';
import Loading from '../Common/Loading';

interface VotingActionListProps {
  currentRound: bigint;
}

const VotingActionList: React.FC<VotingActionListProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  const {
    votes,
    isPending: isPendingVotesNums,
    error: errorVotesNums,
  } = useVotesNums((token?.address as `0x${string}`) || '', currentRound);
  const {
    actionSubmits,
    isPending: isPendingActionSubmits,
    error: errorActionSubmits,
  } = useActionSubmits((token?.address as `0x${string}`) || '', currentRound);

  const actionIds = actionSubmits?.map((actionSubmit: ActionSubmit) => BigInt(actionSubmit.actionId)) || [];
  const {
    actionInfos,
    isPending: isPendingActionInfosByIds,
    error: errorActionInfosByIds,
  } = useActionInfosByIds((token?.address as `0x${string}`) || '', actionIds);

  if (isPendingVotesNums || isPendingActionSubmits || isPendingActionInfosByIds) {
    return <Loading />;
  }

  if (errorActionSubmits || errorActionInfosByIds) {
    return <div>加载出错，请稍后再试。</div>;
  }

  // 计算投票总数： 累计
  const totalVotes = votes?.reduce((acc, vote) => acc + vote, 0n) || 0n;

  return (
    <div className="p-4">
      <h2 className="text-sm font-bold mb-4 text-gray-600">行动列表 (行动轮)</h2>
      <div className="space-y-4">
        {actionInfos?.map((action: ActionInfo, index: number) => (
          <div key={action.head.id} className="bg-white p-4 rounded-lg mb-4">
            <Link href={`/action/${action.head.id}?type=join`} key={action.head.id}>
              <div className="font-semibold mb-2">
                <span className="text-gray-400 text-base mr-1">{`No.${action.head.id}`}</span>
                <span className="text-gray-800 text-lg">{`${action.body.action}`}</span>
              </div>
              <p className="leading-tight">{action.body.consensus}</p>
              <div className="flex justify-between mt-1">
                <span className="text-sm">
                  <span className="mr-1">投票占比</span>
                  {Number(votes?.[index] || 0n) === 0
                    ? '0'
                    : ((Number(votes?.[index] || 0n) * 100) / Number(totalVotes)).toFixed(1)}
                  %
                </span>
                <span className="text-sm">已参与行动代币 -</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingActionList;
