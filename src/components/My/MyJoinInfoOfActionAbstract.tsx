import React, { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';

import { useStakedAmountByAccountByActionId } from '@/src/hooks/contracts/useLOVE20Join';
import { TokenContext } from '@/src/contexts/TokenContext';
import Loading from '@/src/components/Common/Loading';
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
    <div className="flex items-end w-full p-4 bg-white mb-4">
      <span className="text-sm text-gray-500 mr-2">待参与代币数:</span>
      <span className="text-xl font-bold text-orange-400">
        {isPendingStakedAmountByAccountByActionId ? (
          <Loading />
        ) : (
          formatTokenAmount(stakedAmountByAccountByActionId || BigInt(0))
        )}
      </span>
      <span className="text-xs text-gray-400 ml-auto">(之前参与，未取回的代币)</span>
    </div>
  );
};

export default MyJoinInfoOfActionAbstract;
