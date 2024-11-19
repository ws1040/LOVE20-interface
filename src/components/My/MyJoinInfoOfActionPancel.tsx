import React, { useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

import {
  useStakedAmountByAccountByActionId,
  useLastJoinedRoundByAccountByActionId,
  useWithdraw,
} from '@/src/hooks/contracts/useLOVE20Join';
import { TokenContext } from '@/src/contexts/TokenContext';
import Loading from '@/src/components/Common/Loading';
import { formatTokenAmount } from '@/src/lib/format';

interface MyJoinInfoOfActionPancelProps {
  actionId: bigint;
  currentRound: bigint;
}

const MyJoinInfoOfActionPancel: React.FC<MyJoinInfoOfActionPancelProps> = ({ actionId, currentRound }) => {
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
    return <Loading />;
  }

  if (errorStakedAmountByAccountByActionId || errorLastJoinedRound) {
    console.error(errorStakedAmountByAccountByActionId, errorLastJoinedRound);
    return <div className="text-red-500">加载失败</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center space-y-6 pb-8 bg-white mb-4">
        <div className="flex w-full justify-center space-x-20">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">我参与的代币数</span>
            <span className="text-2xl font-bold text-orange-400">
              {formatTokenAmount(stakedAmountByAccountByActionId || BigInt(0))}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">参加到第几轮</span>
            <span className="text-2xl font-bold text-orange-400">{lastJoinedRound?.toString()}</span>
          </div>
        </div>

        {stakedAmountByAccountByActionId <= 0 ? (
          <Button className="w-full bg-gray-400 cursor-not-allowed">已取回</Button>
        ) : lastJoinedRound && Number(lastJoinedRound) + 1 < Number(currentRound) ? (
          <Button
            className="btn-primary btn w-1/2"
            onClick={handleWithdraw}
            disabled={isPendingWithdraw || isConfirmingWithdraw}
          >
            {isPendingWithdraw || isConfirmingWithdraw ? <Loading /> : '取回代币'}
          </Button>
        ) : (
          <span className="text-sm text-gray-500">
            提示：到第 {(1 + Number(lastJoinedRound)).toString()} 轮后可取回
          </span>
        )}
      </div>

      {errorStakedAmountByAccountByActionId && (
        <div className="text-red-500">{(errorStakedAmountByAccountByActionId as Error).message}</div>
      )}
      {errorLastJoinedRound && <div className="text-red-500">{(errorLastJoinedRound as Error).message}</div>}
      {errorWithdraw && <div className="text-red-500">{(errorWithdraw as Error).message}</div>}
    </>
  );
};

export default MyJoinInfoOfActionPancel;
