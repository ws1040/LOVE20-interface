import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useActionSubmits, useActionInfosByIds } from '../../hooks/contracts/useLOVE20Submit';
import { useVotesNums } from '../../hooks/contracts/useLOVE20Vote';

import { TokenContext } from '../../contexts/TokenContext';
import { ActionInfo, ActionSubmit } from '../../types/life20types';
import Link from 'next/link';
import Loading from '../Common/Loading';
import AddressWithCopyButton from '../Common/AddressWithCopyButton';

interface VotingActionListProps {
  currentRound: bigint;
}

const VotingActionList: React.FC<VotingActionListProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};
  const router = useRouter();

  // 投票数
  const {
    votes,
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

  // 选择复选框
  const [selectedActions, setSelectedActions] = useState<Set<bigint>>(new Set());
  const handleCheckboxChange = (actionId: bigint) => {
    setSelectedActions((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(actionId)) {
        newSelected.delete(actionId);
      } else {
        newSelected.add(actionId);
      }
      return newSelected;
    });
  };

  // 计算投票总数： 累计
  const totalVotes = votes?.reduce((acc, vote) => acc + vote, 0n) || 0n;

  // 投票
  const handleSubmit = () => {
    const selectedIds = Array.from(selectedActions).join(',');
    if (selectedIds.length === 0) {
      toast.error('请选择行动');
      return;
    }
    router.push(`/vote/vote?ids=${selectedIds}`);
  };

  // 加载中
  if (
    isPendingVotesNums ||
    isPendingActionSubmits ||
    (uniqueActionIds && uniqueActionIds.length > 0 && isPendingActionInfosByIds)
  ) {
    return (
      <div className="p-4 flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  // 加载失败
  if (errorActionSubmits || errorActionInfosByIds) {
    return <div>加载出错，请稍后再试。</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-sm font-bold mb-4 text-gray-600">行动列表 (行动轮)</h2>
      <div className="space-y-4">
        {uniqueActionIds.length > 0 ? (
          <>
            {actionInfos?.map((action: ActionInfo, index: number) => {
              const submitter = actionSubmits?.find(
                (submit: ActionSubmit) => BigInt(submit.actionId) === BigInt(action.head.id),
              )?.submitter;

              return (
                <div key={action.head.id} className="flex bg-white p-4 rounded-lg mb-4">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-warning mr-2"
                    checked={selectedActions.has(BigInt(action.head.id))}
                    onChange={() => handleCheckboxChange(BigInt(action.head.id))}
                  />
                  <Link href={`/action/${action.head.id}?type=vote`} className="flex-grow block">
                    <div className="font-semibold mb-2">
                      <span className="text-gray-400 text-base mr-1">{`No.${action.head.id}`}</span>
                      <span className="text-gray-800 text-lg">{`${action.body.action}`}</span>
                    </div>
                    <p className="leading-tight">{action.body.consensus}</p>
                    <div className="flex justify-between mt-1 text-gray-400">
                      <span className="text-sm flex-1">
                        推举人 <AddressWithCopyButton address={submitter} showCopyButton={false} />
                      </span>
                      <span className="text-sm flex-1 text-right">
                        <span className="mr-1">投票占比</span>
                        {Number(votes?.[index] || 0n) === 0
                          ? '0'
                          : ((Number(votes?.[index] || 0n) * 100) / Number(totalVotes)).toFixed(1)}
                        %
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
            <div className="flex justify-center mt-4">
              <button className="btn btn-primary w-1/2" onClick={handleSubmit}>
                投票
              </button>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500 text-center">没有行动</div>
        )}
      </div>
    </div>
  );
};

export default VotingActionList;
