import React, { useContext } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

import { useActionInfosByIds } from '@/src/hooks/contracts/useLOVE20Submit';
import { useJoinedActions } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { TokenContext } from '@/src/contexts/TokenContext';
import { JoinedAction } from '@/src/types/life20types';
import { formatTokenAmount } from '@/src/lib/format';
import Loading from '@/src/components/Common/Loading';

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
    return <Loading />;
  }

  if (errorJoinedActions) {
    return <div>加载出错，请稍后再试。</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-sm font-bold mb-4 text-gray-600">我参与的行动</h2>
      {!joinedActions?.length ? (
        <div className="text-sm text-gray-500 text-center">没有行动</div>
      ) : (
        <div className="space-y-4">
          {joinedActions?.map((action: JoinedAction, index: number) => (
            <div key={action.actionId} className="bg-white p-4 rounded-lg mb-4">
              <Link href={`/my/actrewards?id=${action.actionId}`} key={action.actionId}>
                <div className="font-semibold mb-2">
                  <span className="text-gray-400 text-base mr-1">{`No.${action.actionId}`}</span>
                  <span className="text-gray-800 text-lg">{actionInfos?.[index]?.body.action}</span>
                </div>
                <p className="leading-tight">{actionInfos?.[index]?.body.consensus}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-sm">参与到第 {action.lastJoinedRound.toString()} 轮</span>
                  <span className="text-sm">参与代币数量：{formatTokenAmount(action.stakedAmount)}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      {errorJoinedActions && <div>{(errorJoinedActions as Error).message}</div>}
      {errorActionInfosByIds && <div>{(errorActionInfosByIds as Error).message}</div>}
    </div>
  );
};

export default MyStakedActionList;
