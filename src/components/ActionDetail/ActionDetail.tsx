// components/ActivityDetail/ActivityDetail.tsx

import React, { useContext } from 'react';

import { useActionInfo } from '../../hooks/contracts/useLOVE20Submit';
import { useActionSubmits } from '../../hooks/contracts/useLOVE20Submit';

import { ActionSubmit } from '../../types/life20types';
import { TokenContext } from '../../contexts/TokenContext';
import AddressWithCopyButton from '../Common/AddressWithCopyButton';

interface ActivityDetailProps {
  actionId: bigint;
  round: bigint;
}

const ActionDetail: React.FC<ActivityDetailProps> = ({ actionId , round}) => {
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
  } = useActionSubmits(token?.address as `0x${string}`, round);

  // 找到当前动作的提交者
  const submitter = actionSubmits?.find((submit: ActionSubmit) => submit.actionId == Number(actionId))?.submitter || 'N/A';

  return (
    <>
    <div className="max-w-4xl mx-auto p-6 bg-base-100 mb-4">
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
          <div className="flex items-center">
            推举人 <AddressWithCopyButton address={submitter as `0x${string}`} />
          </div>
        </div>
    </div>
    <div className="max-w-4xl mx-auto p-6 bg-base-100">
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-500">参与资产上限</h3>
          <p className="text-lg">{actionInfo?.body.maxStake.toString() || '-'}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-500">随机奖励地址数</h3>
          <p className="text-lg">{actionInfo?.body.maxRandomAccounts.toString() || '-'}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-500">验证规则</h3>
          <p className="text-lg">{actionInfo?.body.verificationRule || '-'}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-500">验证信息填写指引</h3>
          <p className="text-lg">{actionInfo?.body.verificationInfoGuide || '-'}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-500">白名单</h3>
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

      {(isPendingActionInfo || isPendingActionSubmits) && (
        <div className="text-center text-sm text-gray-500">加载中...</div>
      )}

      {(errorActionInfo || errorActionSubmits) && (
        <div className="text-center text-sm text-red-500">
          {errorActionInfo?.message || errorActionSubmits?.message}
        </div>
      )}
    </div>
    </>
  );
};

export default ActionDetail;
