import React, { useContext } from 'react';
import Link from 'next/link';

import { useVotesNums } from '../../hooks/contracts/useLOVE20Vote';
import { useActionInfosByIds } from '../../hooks/contracts/useLOVE20Submit';

import { TokenContext } from '../../contexts/TokenContext';
import { ActionInfo } from '../../types/life20types';

import Loading from '../Common/Loading';

interface JoiningActionListProps {
  currentRound: bigint;
}
const JoiningActionList: React.FC<JoiningActionListProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};
  const {
    actionIds,
    votes,
    isPending: isPendingVotesNums,
    error: errorVotesNums,
  } = useVotesNums((token?.address as `0x${string}`) || '', currentRound);
  // console.log('actionIds', actionIds);
  // console.log('votes', votes);
  const {
    actionInfos,
    isPending: isPendingActionInfosByIds,
    error: errorActionInfosByIds,
  } = useActionInfosByIds((token?.address as `0x${string}`) || '', actionIds || []);

  if (isPendingVotesNums || isPendingActionInfosByIds) {
    return <Loading />;
  }

  if (errorVotesNums || errorActionInfosByIds) {
    return <div>加载出错，请稍后再试。</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-sm font-bold mb-4 text-gray-600">待验证行动</h2>
      <div className="space-y-4">
        {actionInfos?.map((action: ActionInfo, index: number) => (
          <div key={action.head.id} className="bg-white p-4 rounded-lg mb-4">
            <Link href={`/verify/${action.head.id}`} key={action.head.id}>
              <div className="font-semibold mb-2">
                <span className="text-gray-400 text-base mr-1">{`No.${action.head.id}`}</span>
                <span className="text-gray-800 text-lg">{`${action.body.action}`}</span>
              </div>
              <p className="leading-tight">{action.body.consensus}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoiningActionList;
