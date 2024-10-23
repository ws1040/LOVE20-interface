import React, { useContext } from 'react';
import { useRouter } from 'next/router';

import { useActionInfosByPage, useActionSubmits } from '../../hooks/contracts/useLOVE20Submit';

import { TokenContext } from '../../contexts/TokenContext';
import { ActionInfo, ActionSubmit } from '../../types/life20types';
import Link from 'next/link';
import Loading from '../Common/Loading';

interface SubmitingActionListProps {
  currentRound: bigint;
}

const SubmitingActionList: React.FC<SubmitingActionListProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};
  const router = useRouter();

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

  if (errorActionInfosByPage) {
    console.error(errorActionInfosByPage);
    return <div>加载出错，请稍后再试。</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-600">所有行动</h2>
        <button
          onClick={() => router.push('/action/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          发起新行动
        </button>
      </div>
      {isPendingActionInfosByPage || isPendingActionSubmits ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {actionInfos?.map((action: ActionInfo, index: number) => {
            const isSubmitted = actionSubmits?.some((submit) => submit.actionId === action.head.id);

            return (
              <div key={action.head.id} className="bg-white p-4 rounded-lg mb-4">
                <Link href={`/action/${action.head.id}?type=submit&submitted=${isSubmitted}`} key={action.head.id}>
                  <div className="font-semibold mb-2">
                    <span className="text-gray-400 text-base mr-1">{`No.${action.head.id}`}</span>
                    <span className="text-gray-800 text-lg">{`${action.body.action}`}</span>
                  </div>
                  <p className="leading-tight">{action.body.consensus}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm">
                      {isSubmitted ? (
                        <span className="text-green-500">已推举</span>
                      ) : (
                        <span className="text-red-500">未推举</span>
                      )}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubmitingActionList;
