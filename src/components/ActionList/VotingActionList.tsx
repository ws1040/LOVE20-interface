import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';

// my hooks
import { ActionInfo, ActionSubmit } from '@/src/types/life20types';
import { useActionSubmits, useActionInfosByIds } from '@/src/hooks/contracts/useLOVE20Submit';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useVotesNums } from '@/src/hooks/contracts/useLOVE20Vote';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

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
    router.push(`/vote/vote?ids=${selectedIds}&symbol=${token?.symbol}`);
  };

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

  // 如果只有1个投票，就直接跳到投票页面
  if (uniqueActionIds.length === 1) {
    router.push(`/vote/vote?ids=${uniqueActionIds[0]}&symbol=${token?.symbol}`);
  }

  return (
    uniqueActionIds.length !== 1 && (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <LeftTitle title="投票中的行动" />
          {token && (
            <Button variant="outline" size="sm" className="text-secondary border-secondary" asChild>
              <Link href={`/vote/actions4submit?symbol=${token?.symbol}`}>推举其他行动</Link>
            </Button>
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
                  <Card key={action.head.id} className="shadow-none flex items-center">
                    <input
                      type="checkbox"
                      className="checkbox accent-secondary ml-2"
                      checked={selectedActions.has(BigInt(action.head.id))}
                      onChange={() => handleCheckboxChange(BigInt(action.head.id))}
                    />
                    <Link
                      href={`/action/${action.head.id}?type=vote&symbol=${token?.symbol}`}
                      key={action.head.id}
                      className="w-full"
                    >
                      <CardHeader className="px-3 pt-2 pb-1 flex-row justify-start items-baseline">
                        <span className="text-greyscale-400 text-sm mr-1">{`No.${action.head.id}`}</span>
                        <span className="font-bold text-greyscale-800">{`${action.body.action}`}</span>
                      </CardHeader>
                      <CardContent className="px-3 pt-1 pb-2">
                        <div className="text-greyscale-500">{action.body.consensus}</div>
                        <div className="flex justify-between mt-1 text-sm">
                          <span className="flex items-center">
                            <span className="text-greyscale-400 mr-1">推举人</span>
                            <span className="text-secondary">
                              <AddressWithCopyButton address={submitter} showCopyButton={false} />
                            </span>
                          </span>
                          <span>
                            <span className="text-greyscale-400 mr-1">投票占比</span>
                            <span className="text-secondary">
                              {Number(votes?.[index] || 0n) === 0
                                ? '0'
                                : ((Number(votes?.[index] || 0n) * 100) / Number(totalVotes)).toFixed(1)}
                              %
                            </span>
                          </span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                );
              })}
              <div className="flex justify-center mt-4">
                <Button variant="outline" className="w-1/2 text-secondary border-secondary" onClick={handleSubmit}>
                  给选中的行动投票
                </Button>
              </div>
            </>
          ) : (
            <div className="text-sm text-greyscale-500 text-center mt-8">本轮没有行动，请先推举</div>
          )}
        </div>
      </div>
    )
  );
};

export default VotingActionList;
