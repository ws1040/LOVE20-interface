import React, { useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// my hooks
import { useJoinedAmountByActionIdByAccount, useWithdraw } from '@/src/hooks/contracts/useLOVE20Join';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my funcs
import { checkWalletConnection } from '@/src/lib/web3';
import { formatTokenAmount } from '@/src/lib/format';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

interface MyJoinInfoOfActionPancelProps {
  actionId: bigint;
}

const MyJoinInfoOfActionPancel: React.FC<MyJoinInfoOfActionPancelProps> = ({ actionId }) => {
  const { address: account, chain: accountChain } = useAccount();
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

  // 取回代币
  const {
    withdraw,
    isPending: isPendingWithdraw,
    isConfirming: isConfirmingWithdraw,
    isConfirmed: isConfirmedWithdraw,
    error: errorWithdraw,
  } = useWithdraw();

  const handleWithdraw = async () => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    // 如果代币为0, toast
    if (joinedAmountByActionIdByAccount != undefined && joinedAmountByActionIdByAccount <= 2n) {
      toast.error('你还没有参与，无需取回');
      return;
    }
    await withdraw((token?.address as `0x${string}`) || '', actionId);
  };

  useEffect(() => {
    if (isConfirmedWithdraw) {
      toast.success('取回成功');
    }
  }, [isConfirmedWithdraw]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorStakedAmountByAccountByActionId) {
      handleContractError(errorStakedAmountByAccountByActionId, 'join');
    }
    if (errorWithdraw) {
      handleContractError(errorWithdraw, 'join');
    }
  }, [errorStakedAmountByAccountByActionId, errorWithdraw]);

  // 加载中
  if (isPendingStakedAmountByAccountByActionId) {
    return (
      <div className="px-4 pt-4 pb-2">
        <LeftTitle title="我的参与" />
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-2">
      <LeftTitle title="我的参与" />
      <div className="stats mt-2 w-full flex justify-center">
        <div className="stat place-items-center">
          <div className="stat-title">我参与的代币数</div>
          <div className="stat-value text-2xl text-secondary">
            {formatTokenAmount(joinedAmountByActionIdByAccount || BigInt(0))}
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-2">
        <Button type="button" className="w" disabled={true}>
          第1次内测体验, 暂时关闭 取回和追加代币 功能
        </Button>
        {/* {joinedAmountByActionIdByAccount != undefined && joinedAmountByActionIdByAccount <= 2n ? (
          <Button variant="outline" className="w-1/3 text-secondary border-secondary" disabled>
            已取回
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-1/3 text-secondary border-secondary"
            onClick={handleWithdraw}
            disabled={isPendingWithdraw || isConfirmingWithdraw || isConfirmedWithdraw}
          >
            {isPendingWithdraw
              ? '提交中'
              : isConfirmingWithdraw
              ? '确认中'
              : isConfirmedWithdraw
              ? '已取回'
              : '取回代币'}
          </Button>
        )}
        
        <Button variant="outline" className="w-1/3 text-secondary border-secondary" asChild>
          <Link href={`/acting/join?id=${actionId}&symbol=${token?.symbol}`}>增加参与代币</Link>
        </Button> */}
      </div>
      <LoadingOverlay
        isLoading={isPendingWithdraw || isConfirmingWithdraw}
        text={isPendingWithdraw ? '提交交易...' : '确认交易...'}
      />
    </div>
  );
};

export default MyJoinInfoOfActionPancel;
