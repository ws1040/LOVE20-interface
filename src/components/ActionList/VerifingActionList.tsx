import React, { useContext } from 'react';
import Link from 'next/link';

import { ActionInfo } from '@/src/types/life20types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useVotesNums } from '@/src/hooks/contracts/useLOVE20Vote';
import { useActionInfosByIds } from '@/src/hooks/contracts/useLOVE20Submit';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

interface VerifingActionListProps {
  currentRound: bigint;
}
const VerifingActionList: React.FC<VerifingActionListProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  // 获取投票id列表、投票数
  const {
    actionIds,
    votes,
    isPending: isPendingVotesNums,
    error: errorVotesNums,
  } = useVotesNums((token?.address as `0x${string}`) || '', currentRound);

  // 获取行动详情
  const {
    actionInfos,
    isPending: isPendingActionInfosByIds,
    error: errorActionInfosByIds,
  } = useActionInfosByIds((token?.address as `0x${string}`) || '', actionIds || []);

  if (isPendingVotesNums || (actionIds && actionIds.length > 0 && isPendingActionInfosByIds)) {
    return (
      <div className="p-6 flex justify-center items-center">
        <LoadingIcon />
      </div>
    );
  }

  if (errorVotesNums || errorActionInfosByIds) {
    console.log('errorVotesNums', errorVotesNums);
    console.log('errorActionInfosByIds', errorActionInfosByIds);
    return <div>加载出错，请稍后再试。</div>;
  }

  if (!token) {
    return <LoadingIcon />;
  }

  return (
    <div className="p-6">
      <LeftTitle title="待验证行动" />
      <div className="mt-4 space-y-4">
        {actionInfos?.map((action: ActionInfo, index: number) => (
          <Card key={action.head.id} className="shadow-none">
            <Link href={`/verify/${action.head.id}?symbol=${token?.symbol}`}>
              <CardHeader className="px-3 pt-2 pb-1 flex-row justify-start items-baseline">
                <span className="text-greyscale-400 text-sm mr-1">{`No.${action.head.id}`}</span>
                <span className="font-bold text-greyscale-800">{`${action.body.action}`}</span>
              </CardHeader>
              <CardContent className="px-3 pt-1 pb-2">
                <div className="text-greyscale-500">{action.body.consensus}</div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VerifingActionList;
