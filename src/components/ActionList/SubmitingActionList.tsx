'use client';
import React, { useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';

// my hooks
import { useActionInfosByPage, useActionSubmits } from '@/src/hooks/contracts/useLOVE20Submit';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my context
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import { ActionInfo } from '@/src/types/life20types';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LeftTitle from '@/src/components/Common/LeftTitle';

interface SubmitingActionListProps {
  currentRound: bigint;
}

const SubmitingActionList: React.FC<SubmitingActionListProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  const {
    actionInfos,
    isPending: isPendingActionInfosByPage,
    error: errorActionInfosByPage,
  } = useActionInfosByPage((token?.address as `0x${string}`) || '', 0n, 100n, false);

  const {
    actionSubmits,
    isPending: isPendingActionSubmits,
    error: errorActionSubmits,
  } = useActionSubmits((token?.address as `0x${string}`) || '', currentRound);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorActionInfosByPage) {
      handleContractError(errorActionInfosByPage, 'submit');
    }
    if (errorActionSubmits) {
      handleContractError(errorActionSubmits, 'submit');
    }
  }, [errorActionInfosByPage, errorActionSubmits]);

  if (!token) {
    return <LoadingIcon />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <LeftTitle title="所有行动" />
        <Button variant="link" className="text-secondary border-secondary" asChild>
          <Link href={`/action/new`}>发起新行动</Link>
        </Button>
      </div>
      {isPendingActionInfosByPage || isPendingActionSubmits ? (
        <LoadingIcon />
      ) : (
        <div className="space-y-4">
          {actionInfos?.map((action: ActionInfo, index: number) => {
            const isSubmitted = actionSubmits?.some((submit) => submit.actionId === action.head.id);
            return (
              <Card key={action.head.id} className="shadow-none">
                <Link href={`/action/${action.head.id}?type=submit&submitted=${isSubmitted}`} key={action.head.id}>
                  <CardHeader className="px-3 pt-2 pb-1 flex-row justify-start items-baseline">
                    <span className="text-greyscale-400 text-sm mr-1">{`No.${action.head.id}`}</span>
                    <span className="font-bold text-greyscale-800">{`${action.body.action}`}</span>
                  </CardHeader>
                  <CardContent className="px-3 pt-1 pb-2">
                    <div className="text-base text-greyscale-600">{action.body.consensus}</div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span className="text-sm">
                        {isSubmitted ? (
                          <span className="text-secondary">已推举</span>
                        ) : (
                          <span className="text-greyscale-600">未推举</span>
                        )}
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

export default SubmitingActionList;
