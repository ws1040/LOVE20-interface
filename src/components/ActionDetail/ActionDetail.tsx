// components/ActivityDetail/ActivityDetail.tsx

import React, { useContext } from 'react';

import { useActionInfo } from '@/src/hooks/contracts/useLOVE20Submit';
import { useActionSubmits } from '@/src/hooks/contracts/useLOVE20Submit';
import { ActionSubmit } from '@/src/types/life20types';
import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';

import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import Loading from '@/src/components/Common/Loading';

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

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white mb-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">No.{actionInfo?.head.id.toString()}</span>
          <span className="text-2xl font-bold text-black">{actionInfo?.body.action}</span>
        </div>
        <div className="mt-2">
          <span className="text-gray-600">{actionInfo?.body.consensus}</span>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
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
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-base text-gray-500">参与资产上限</h3>
            <p className="text-lg">{formatTokenAmount(actionInfo?.body.maxStake || BigInt(0))}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-base text-gray-500">随机奖励地址数</h3>
            <p className="text-lg">{actionInfo?.body.maxRandomAccounts.toString() || '-'}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-base text-gray-500">验证规则</h3>
            <p className="text-lg">{actionInfo?.body.verificationRule || '-'}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-base text-gray-500">验证信息填写指引</h3>
            <p className="text-lg">{actionInfo?.body.verificationInfoGuide || '-'}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-base text-gray-500">白名单</h3>
            <p className="text-lg flex flex-wrap items-center">
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

        {(isPendingActionInfo || (showSubmitter && isPendingActionSubmits)) && <Loading />}

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
