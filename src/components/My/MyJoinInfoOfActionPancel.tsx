import React, { useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

import {
  useStakedAmountByAccountByActionId,
  useLastJoinedRoundByAccountByActionId,
  useWithdraw,
} from '@/src/hooks/contracts/useLOVE20Join';
import { checkWalletConnection } from '@/src/utils/web3';
import { formatTokenAmount } from '@/src/lib/format';
import { TokenContext } from '@/src/contexts/TokenContext';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

interface MyJoinInfoOfActionPancelProps {
  actionId: bigint;
  currentJoinRound: bigint;
}

const MyJoinInfoOfActionPancel: React.FC<MyJoinInfoOfActionPancelProps> = ({ actionId, currentJoinRound }) => {
  const { address: account, chain: accountChain } = useAccount();
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

  // 获取我参加到第几轮
  const {
    lastJoinedRound,
    isPending: isPendingLastJoinedRound,
    error: errorLastJoinedRound,
  } = useLastJoinedRoundByAccountByActionId(
    (token?.address as `0x${string}`) || '',
    (account as `0x${string}`) || '',
    actionId,
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
    await withdraw((token?.address as `0x${string}`) || '', actionId);
  };

  useEffect(() => {
    if (isConfirmedWithdraw) {
      toast.success('取回成功');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isConfirmedWithdraw]);

  if (isPendingStakedAmountByAccountByActionId || isPendingLastJoinedRound) {
    return (
      <div className="px-6 pt-4 pb-2">
        <LeftTitle title="我的参与" />
        <LoadingIcon />
      </div>
    );
  }

  if (errorStakedAmountByAccountByActionId || errorLastJoinedRound) {
    console.error(errorStakedAmountByAccountByActionId, errorLastJoinedRound);
    return <div className="text-red-500">加载失败</div>;
  }

  return (
    <div className="px-6 pt-4 pb-2">
      <LeftTitle title="我的参与" />
      <div className="stats w-full border grid grid-cols-2 divide-x-0 mt-2">
        <div className="stat place-items-center">
          <div className="stat-title">我参与的代币数</div>
          <div className="stat-value text-2xl">{formatTokenAmount(stakedAmountByAccountByActionId || BigInt(0))}</div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">参加到第几轮</div>
          <div className="stat-value text-2xl">{lastJoinedRound?.toString()}</div>
        </div>
      </div>
      <div className="flex justify-center mt-2">
        {stakedAmountByAccountByActionId <= 0 ? (
          <Button className="w-1/2" disabled>
            已取回
          </Button>
        ) : lastJoinedRound && Number(lastJoinedRound) + 1 <= Number(currentJoinRound) ? (
          <Button
            className="w-1/2"
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
        ) : (
          <Button className="w-1/2" disabled>
            第 {(1 + Number(lastJoinedRound)).toString()} 轮后可取回
          </Button>
        )}
      </div>
      <LoadingOverlay
        isLoading={isPendingWithdraw || isConfirmingWithdraw}
        text={isPendingWithdraw ? '提交交易...' : '确认交易...'}
      />
    </div>
  );
};

export default MyJoinInfoOfActionPancel;
