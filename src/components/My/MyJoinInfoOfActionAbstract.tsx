import React, { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';

// my funcs
import { formatTokenAmount } from '@/src/lib/format';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useStakedAmountByAccountByActionId } from '@/src/hooks/contracts/useLOVE20Join';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

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

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorStakedAmountByAccountByActionId) {
      handleContractError(errorStakedAmountByAccountByActionId, 'join');
    }
  }, [errorStakedAmountByAccountByActionId]);

  return (
    <div className="px-6 py-4">
      <LeftTitle title="上次参与" />
      <div className="stats w-full divide-x-0">
        <div className="stat place-items-center">
          <div className="stat-title">已结束, 未取回的代币</div>
          <div className="stat-value text-2xl text-secondary">
            {isPendingStakedAmountByAccountByActionId ? (
              <LoadingIcon />
            ) : (
              formatTokenAmount(stakedAmountByAccountByActionId || BigInt(0))
            )}
          </div>
          <div className="stat-desc text-xs text-greyscale-400">
            <span className="text-secondary">提示：</span>未取回的代币，再加入时默认直接参与
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJoinInfoOfActionAbstract;
