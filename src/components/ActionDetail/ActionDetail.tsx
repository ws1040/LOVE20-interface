// components/ActivityDetail/ActivityDetail.tsx

import React, { useContext } from 'react';

import { useActionInfo } from '@/src/hooks/contracts/useLOVE20Submit';
import { useActionSubmits } from '@/src/hooks/contracts/useLOVE20Submit';
import { ActionSubmit } from '@/src/types/life20types';
import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

interface ActivityDetailProps {
  actionId: bigint;
  round: bigint;
  showSubmitter: boolean;
}

const ActionDetail: React.FC<ActivityDetailProps> = ({ actionId, round, showSubmitter }) => {
  const { token } = useContext(TokenContext) || {};

  // 行动详情
  const {
    actionInfo,
    isPending: isPendingActionInfo,
    error: errorActionInfo,
  } = useActionInfo(token?.address as `0x${string}`, actionId);

  // 发起提案者
  const {
    actionSubmits,
    isPending: isPendingActionSubmits,
    error: errorActionSubmits,
  } = useActionSubmits(token?.address as `0x${string}`, showSubmitter ? round : 0n);

  // 找到当前动作的提交者
  const submitter =
    actionSubmits?.find((submit: ActionSubmit) => submit.actionId == Number(actionId))?.submitter || 'N/A';

  if (isPendingActionInfo) {
    return <LoadingIcon />;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 pt-4 pb-2 border-t border-greyscale-100">
        <div className="flex flex-col">
          <span className="text-sm text-greyscale-500">No.{actionInfo?.head.id.toString()}</span>
          <span className="text-xl font-bold text-black">{actionInfo?.body.action}</span>
        </div>
        <div className="mt-1">
          <span className="text-greyscale-600">{actionInfo?.body.consensus}</span>
        </div>
        <div className="mt-0 text-xs text-greyscale-500 flex justify-between">
          <div className="flex items-center">
            创建人 <AddressWithCopyButton address={actionInfo?.head.author as `0x${string}`} />
          </div>
          {showSubmitter && (
            <div className="flex items-center">
              推举人{' '}
              {isPendingActionSubmits ? (
                <LoadingIcon />
              ) : (
                <AddressWithCopyButton address={submitter as `0x${string}`} />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6 pt-4 pb-2">
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold">参与资产上限</h3>
            <p className="text-greyscale-500">{formatTokenAmount(actionInfo?.body.maxStake || BigInt(0))}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold">随机奖励地址数</h3>
            <p className="text-greyscale-500">{actionInfo?.body.maxRandomAccounts.toString() || '-'}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold">验证规则</h3>
            <p className="text-greyscale-500">{actionInfo?.body.verificationRule || '-'}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold">验证信息填写指引</h3>
            <p className="text-greyscale-500">{actionInfo?.body.verificationInfoGuide || '-'}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold">白名单</h3>
            <p className="text-greyscale-500 flex flex-wrap items-center">
              {actionInfo?.body.whiteList.length
                ? actionInfo.body.whiteList.map((addr: string, index: number) => (
                    <span key={index} className="flex items-center mr-2">
                      <AddressWithCopyButton address={addr as `0x${string}`} />
                    </span>
                  ))
                : '无限制'}
            </p>
          </div>
        </div>

        {(errorActionInfo || (showSubmitter && errorActionSubmits)) && (
          <div className="text-center text-sm text-red-500">
            {errorActionInfo?.message || errorActionSubmits?.message}
          </div>
        )}
      </div>
    </>
  );
};

export default ActionDetail;
