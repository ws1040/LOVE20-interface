'use client';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// my hooks
import { useActionInfosByIds } from '@/src/hooks/contracts/useLOVE20Submit';
import { useJoinedActions } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my contexts
import { Token } from '@/src/contexts/TokenContext';

// my types & funcs
import { JoinedAction } from '@/src/types/life20types';
import { formatTokenAmount } from '@/src/lib/format';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

interface MyStakedActionListProps {
  token: Token | null | undefined;
}

const MyStakedActionList: React.FC<MyStakedActionListProps> = ({ token }) => {
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

  // 错误处理
  const { handleContractError } = useHandleContractError();
  if (errorJoinedActions) {
    handleContractError(errorJoinedActions, 'dataViewer');
  }
  if (errorActionInfosByIds) {
    handleContractError(errorActionInfosByIds, 'submit');
  }

  if (isPendingJoinedActions || (joinedActions && joinedActions.length > 0 && isPendingActionInfosByIds)) {
    return (
      <>
        <div className="pt-4 px-4">
          <LeftTitle title="我参与的行动" />
          <div className="text-sm mt-4 text-greyscale-500 text-center">
            <LoadingIcon />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="pt-4 px-4">
      <LeftTitle title="我参与的行动" />
      {!joinedActions?.length ? (
        <div className="text-sm text-greyscale-500 text-center">没有行动</div>
      ) : (
        <div className="mt-4 space-y-4">
          {joinedActions?.map((action: JoinedAction, index: number) => (
            <Card key={action.actionId} className="shadow-none">
              <Link
                href={`/my/actrewards?id=${action.actionId}&symbol=${token?.symbol}`}
                key={action.actionId}
                className="relative block"
              >
                <CardHeader className="px-3 pt-2 pb-1 flex-row justify-start items-baseline">
                  <span className="text-greyscale-400 text-sm mr-1">{`No.${action.actionId}`}</span>
                  <span className="font-bold text-greyscale-800">{`${actionInfos?.[index]?.body.action}`}</span>
                </CardHeader>
                <CardContent className="px-3 pt-1 pb-2">
                  <div className="text-greyscale-500">{actionInfos?.[index]?.body.consensus}</div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>
                      <span className="text-greyscale-400 mr-1">参与代币数</span>
                      <span className="text-secondary">{formatTokenAmount(action.stakedAmount)}</span>
                    </span>
                  </div>
                </CardContent>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-greyscale-400 pointer-events-none" />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyStakedActionList;
