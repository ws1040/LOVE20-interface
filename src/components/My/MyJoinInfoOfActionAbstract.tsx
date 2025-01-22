import React, { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';

// my funcs
import { formatTokenAmount } from '@/src/lib/format';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useJoinedAmountByActionIdByAccount } from '@/src/hooks/contracts/useLOVE20Join';
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
    joinedAmountByActionIdByAccount,
    isPending: isPendingStakedAmountByAccountByActionId,
    error: errorStakedAmountByAccountByActionId,
  } = useJoinedAmountByActionIdByAccount(
    (token?.address as `0x${string}`) || '',
    actionId,
    (account as `0x${string}`) || '',
  );

  useEffect(() => {
    if (isPendingStakedAmountByAccountByActionId) {
      return;
    }
    onStakedAmountChange?.(joinedAmountByActionIdByAccount || BigInt(0));
  }, [joinedAmountByActionIdByAccount, isPendingStakedAmountByAccountByActionId]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorStakedAmountByAccountByActionId) {
      handleContractError(errorStakedAmountByAccountByActionId, 'join');
    }
  }, [errorStakedAmountByAccountByActionId]);

  return joinedAmountByActionIdByAccount && joinedAmountByActionIdByAccount > 0n ? (
    <div className="px-6 py-4">
      <LeftTitle title="我的参与" />
      <div className="stats w-full divide-x-0">
        <div className="stat place-items-center">
          <div className="stat-title">已参与的代币</div>
          <div className="stat-value text-2xl text-secondary">
            {isPendingStakedAmountByAccountByActionId ? (
              <LoadingIcon />
            ) : (
              formatTokenAmount(joinedAmountByActionIdByAccount || BigInt(0))
            )}
          </div>
          <div className="stat-desc text-xs text-greyscale-400">
            <span className="text-secondary">提示：</span>已参与的代币，再加入时默认直接参与
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default MyJoinInfoOfActionAbstract;
