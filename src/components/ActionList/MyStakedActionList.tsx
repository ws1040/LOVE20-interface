import React, { useContext } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';

import { formatTokenAmount } from '@/src/lib/format';
import { JoinedAction } from '@/src/types/life20types';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useActionInfosByIds } from '@/src/hooks/contracts/useLOVE20Submit';
import { useJoinedActions } from '@/src/hooks/contracts/useLOVE20DataViewer';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

const MyStakedActionList: React.FC = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();
  const {
    joinedActions,
    isPending: isPendingJoinedActions,
    error: errorJoinedActions,
  } = useJoinedActions((token?.address as `0x${string}`) || '', accountAddress as `0x${string}`);

  const {
    actionInfos,
    isPending: isPendingActionInfosByIds,
    error: errorActionInfosByIds,
  } = useActionInfosByIds(
    (token?.address as `0x${string}`) || '',
    joinedActions?.map((action) => action.actionId) || [],
  );

  if (isPendingJoinedActions || (joinedActions && joinedActions.length > 0 && isPendingActionInfosByIds)) {
    return <LoadingIcon />;
  }

  if (errorJoinedActions) {
    return <div>加载出错，请稍后再试。</div>;
  }

  return (
    <div className="p-6">
      <LeftTitle title="我参与的行动" />
      {!joinedActions?.length ? (
        <div className="text-sm text-greyscale-500 text-center">没有行动</div>
      ) : (
        <div className="mt-4 space-y-4">
          {joinedActions?.map((action: JoinedAction, index: number) => (
            <Card key={action.actionId} className="shadow-none">
              <Link href={`/${token?.symbol}/my/actrewards?id=${action.actionId}`} key={action.actionId}>
                <CardHeader className="px-3 pt-2 pb-1 flex-row justify-start items-baseline">
                  <span className="text-greyscale-400 text-sm mr-1">{`No.${action.actionId}`}</span>
                  <span className="font-bold text-greyscale-800">{`${actionInfos?.[index]?.body.action}`}</span>
                </CardHeader>
                <CardContent className="px-3 pt-1 pb-2">
                  <div className="text-greyscale-500">{actionInfos?.[index]?.body.consensus}</div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>
                      <span className="text-greyscale-400 mr-1">参与到第</span>
                      <span className="text-secondary">{action.lastJoinedRound.toString()}</span>
                      <span className="text-greyscale-400 ml-1">轮</span>
                    </span>
                    <span>
                      <span className="text-greyscale-400 mr-1">参与代币数</span>
                      <span className="text-secondary">{formatTokenAmount(action.stakedAmount)}</span>
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
      {errorJoinedActions && <div>{(errorJoinedActions as Error).message}</div>}
      {errorActionInfosByIds && <div>{(errorActionInfosByIds as Error).message}</div>}
    </div>
  );
};

export default MyStakedActionList;
