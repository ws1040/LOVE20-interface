import React, { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';

import { useStakedAmountByAccountByActionId } from '@/src/hooks/contracts/useLOVE20Join';
import { TokenContext } from '@/src/contexts/TokenContext';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import { formatTokenAmount } from '@/src/lib/format';

interface MyJoinInfoOfActionAbstractProps {
  actionId: bigint;
  onStakedAmountChange?: (stakedAmount: bigint) => void;
}

const MyJoinInfoOfActionAbstract: React.FC<MyJoinInfoOfActionAbstractProps> = ({ actionId, onStakedAmountChange }) => {
  const { address: account } = useAccount();
  const { token } = useContext(TokenContext) || {};

  // 获取我参与的代币数
  const {
    stakedAmountByAccountByActionId,
    isPending: isPendingStakedAmountByAccountByActionId,
    error: errorStakedAmountByAccountByActionId,
  } = useStakedAmountByAccountByActionId(
    (token?.address as `0x${string}`) || '',
    (account as `0x${string}`) || '',
    actionId,
  );

  useEffect(() => {
    if (isPendingStakedAmountByAccountByActionId) {
      return;
    }
    onStakedAmountChange?.(stakedAmountByAccountByActionId || BigInt(0));
  }, [stakedAmountByAccountByActionId, isPendingStakedAmountByAccountByActionId]);

  if (errorStakedAmountByAccountByActionId) {
    console.error(errorStakedAmountByAccountByActionId);
    return <div>加载失败</div>;
  }

  return (
    <div className="flex items-end w-full p-4">
      <div className="stats w-full border divide-x-0">
        <div className="stat place-items-center">
          <div className="stat-title">待参与代币数</div>
          <div className="stat-value text-2xl">
            {isPendingStakedAmountByAccountByActionId ? (
              <LoadingIcon />
            ) : (
              formatTokenAmount(stakedAmountByAccountByActionId || BigInt(0))
            )}
          </div>
          <div className="stat-desc text-xs text-greyscale-400">参与之前的轮次，未取回的代币</div>
        </div>
      </div>
    </div>
  );
};

export default MyJoinInfoOfActionAbstract;
