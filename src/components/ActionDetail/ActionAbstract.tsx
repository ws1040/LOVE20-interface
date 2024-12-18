// components/ActivityDetail/ActionAbstract.tsx

import React, { useContext } from 'react';

import { useActionSubmits } from '@/src/hooks/contracts/useLOVE20Submit';

import { ActionInfo, ActionSubmit } from '@/src/types/life20types';
import { TokenContext } from '@/src/contexts/TokenContext';
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

interface ActionAbstractProps {
  actionInfo: ActionInfo;
  round: bigint;
  showSubmitter?: boolean;
}

const ActionAbstract: React.FC<ActionAbstractProps> = ({ actionInfo, round, showSubmitter = true }) => {
  const { token } = useContext(TokenContext) || {};

  // 发起提案者
  const {
    actionSubmits,
    isPending: isPendingActionSubmits,
    error: errorActionSubmits,
  } = useActionSubmits(token?.address as `0x${string}`, showSubmitter ? round : 0n);

  // 找到当前动作的提交者
  const submitter =
    actionSubmits?.find((submit: ActionSubmit) => submit.actionId == Number(actionInfo?.head.id))?.submitter || '-';

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 pt-4 pb-2">
        <div className="flex flex-col">
          <span className="text-sm text-greyscale-500">No.{actionInfo?.head.id.toString()}</span>
          <span className="text-2xl font-bold text-black">{actionInfo?.body.action}</span>
        </div>
        <div className="mt-2">
          <span className="text-greyscale-600">{actionInfo?.body.consensus}</span>
        </div>
        <div className="mt-2 text-xs text-greyscale-500 flex justify-between">
          <div className="flex items-center">
            创建人 <AddressWithCopyButton address={actionInfo?.head.author as `0x${string}`} />
          </div>
          {showSubmitter && (
            <div className="flex items-center">
              推举人 <AddressWithCopyButton address={submitter as `0x${string}`} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ActionAbstract;
