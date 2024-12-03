import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

import { TokenContext } from '@/src/contexts/TokenContext';
import { ActionInfo } from '@/src/types/life20types';
import { useJoin } from '@/src/hooks/contracts/useLOVE20Join';
import { useApprove, useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
import { formatTokenAmount, parseUnits } from '@/src/lib/format';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

interface SubmitJoinProps {
  actionInfo: ActionInfo;
  stakedAmount: bigint | undefined;
}

const SubmitJoin: React.FC<SubmitJoinProps> = ({ actionInfo, stakedAmount }) => {
  const router = useRouter();
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  // 表单状态管理
  const [additionalStakeAmount, setAdditionalStakeAmount] = useState('');
  const [rounds, setRounds] = useState('');
  const [verificationInfo, setVerificationInfo] = useState('');

  // 获取代币余额
  const { balance: tokenBalance, error: errorTokenBalance } = useBalanceOf(
    token?.address as `0x${string}`,
    accountAddress as `0x${string}`,
  );

  // 授权(approve)
  const {
    approve: approveToken,
    isWriting: isPendingApproveToken,
    isConfirming: isConfirmingApproveToken,
    isConfirmed: isConfirmedApproveToken,
    writeError: errApproveToken,
  } = useApprove(token?.address as `0x${string}`);
  const handleApprove = async () => {
    if (stakedAmount && parseUnits(additionalStakeAmount) + stakedAmount > BigInt(actionInfo.body.maxStake)) {
      toast.error('增加的代币数不能超过最大参与代币数');
      return;
    }
    if (!stakedAmount && !additionalStakeAmount) {
      toast.error('请输入增加的代币数');
      return;
    }

    try {
      // 发送授权交易
      await approveToken(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_JOIN as `0x${string}`,
        parseUnits(additionalStakeAmount),
      );
    } catch (error) {
      console.error('Approve failed', error);
    }
  };

  // 执行加入提交
  const {
    join,
    isPending: isPendingJoin,
    isConfirming: isConfirmingJoin,
    isConfirmed: isConfirmedJoin,
    error: errorJoin,
  } = useJoin();
  const handleJoin = async () => {
    try {
      await join(
        token?.address as `0x${string}`,
        BigInt(actionInfo.head.id),
        parseUnits(additionalStakeAmount),
        verificationInfo,
        BigInt(rounds),
      );
    } catch (error) {
      console.error('Join failed', error);
    }
  };

  // 如果质押成功，则用toast显示质押成功并重新加载数据
  useEffect(() => {
    if (isConfirmedJoin) {
      toast.success('加入成功');
      // 重置表单
      setAdditionalStakeAmount('');
      setRounds('');
      setVerificationInfo('');
      // 2秒后返回
      setTimeout(() => {
        router.push(`/action/${actionInfo.head.id}?type=join&symbol=${token?.symbol}`);
      }, 2000);
    }
  }, [isConfirmedJoin]);

  const maxStake = BigInt(actionInfo.body.maxStake) - (stakedAmount || 0n);

  return (
    <>
      <div className="px-6 pt-0 pb-2">
        <LeftTitle title="加入行动" />
        <div className="my-4">
          <label className="block text-left mb-1 text-sm text-greyscale-500">
            增加参与代币: (当前持有：{formatTokenAmount(tokenBalance || 0n)} {token?.symbol})
          </label>
          <input
            type="number"
            disabled={maxStake <= 0n}
            placeholder={
              maxStake > 0n
                ? `${token?.symbol} 数量，不能超过 ${formatTokenAmount(maxStake)}`
                : `已到最大${formatTokenAmount(BigInt(actionInfo.body.maxStake))}，不能再追加`
            }
            value={additionalStakeAmount}
            onChange={(e) => setAdditionalStakeAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-left mb-1 text-sm text-greyscale-500">参与轮数:</label>
          <input
            type="number"
            placeholder="输入参数轮数"
            value={rounds}
            onChange={(e) => setRounds(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-left mb-1 text-sm text-greyscale-500">验证信息:</label>
          <textarea
            placeholder={`${actionInfo?.body.verificationInfoGuide}`}
            value={verificationInfo}
            onChange={(e) => setVerificationInfo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            className={`w-1/2`}
            disabled={isPendingApproveToken || isConfirmingApproveToken || isConfirmedApproveToken}
            onClick={handleApprove}
          >
            {isPendingApproveToken || isConfirmingApproveToken
              ? '1.授权中...'
              : isConfirmedApproveToken
              ? '1.已授权'
              : '1.授权'}
          </Button>
          <Button
            className={`w-1/2`}
            disabled={!isConfirmedApproveToken || isPendingJoin || isConfirmingJoin}
            onClick={handleJoin}
          >
            {isPendingJoin || isConfirmingJoin ? '2.加入中...' : isConfirmedJoin ? '2.已加入' : '2.加入'}
          </Button>
        </div>
        {errorTokenBalance && <div className="text-red-500 text-center">{errorTokenBalance.message}</div>}
        {errApproveToken && <div className="text-red-500 text-center">{errApproveToken.message}</div>}
        {errorJoin && <div className="text-red-500 text-center">{errorJoin.message}</div>}
      </div>
      <LoadingOverlay
        isLoading={isPendingApproveToken || isConfirmingApproveToken || isPendingJoin || isConfirmingJoin}
      />
    </>
  );
};

export default SubmitJoin;
