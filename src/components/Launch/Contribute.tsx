import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';
import { useContribute, useContributed } from '@/src/hooks/contracts/useLOVE20Launch';
import { useBalanceOf, useApprove } from '@/src/hooks/contracts/useLOVE20Token';
import { Token } from '@/src/contexts/TokenContext';
import { LaunchInfo } from '@/src/types/life20types';
import LeftTitle from '@/src/components/Common/LeftTitle';

const Contribute: React.FC<{ token: Token | null; launchInfo: LaunchInfo }> = ({ token, launchInfo }) => {
  const [contributeAmount, setContributeAmount] = useState('');
  const { address: account } = useAccount();

  // 读取信息hooks
  const {
    balance: balanceOfParentToken,
    isPending: isPendingBalanceOfParentToken,
    error: errorBalanceOfParentToken,
  } = useBalanceOf(token?.parentTokenAddress as `0x${string}`, account as `0x${string}`);
  const {
    contributed,
    isPending: isContributedPending,
    error: contributedError,
  } = useContributed(token?.address as `0x${string}`, account as `0x${string}`);

  // 授权
  const {
    approve: approveParentToken,
    isWriting: isPendingApproveParentToken,
    isConfirming: isConfirmingApproveParentToken,
    isConfirmed: isConfirmedApproveParentToken,
    writeError: errApproveParentToken,
  } = useApprove(token?.parentTokenAddress as `0x${string}`);
  const handleApprove = async () => {
    try {
      await approveParentToken(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_LAUNCH as `0x${string}`,
        parseUnits(contributeAmount),
      );
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isConfirmedApproveParentToken) {
      toast.success('授权成功');
    }
  }, [isConfirmedApproveParentToken]);

  console.log('parseUnits(contributeAmount)', parseUnits(contributeAmount));

  // 申购
  const {
    contribute,
    isPending: isPendingContributeToken,
    isConfirming: isConfirmingContributeToken,
    isConfirmed: isConfirmedContributeToken,
    writeError: errContributeToken,
  } = useContribute();
  const handleContribute = async () => {
    try {
      await contribute(token?.address as `0x${string}`, parseUnits(contributeAmount));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isConfirmedContributeToken) {
      toast.success('申购成功');
      // 2秒后刷新
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isConfirmedContributeToken]);

  // 设置最大金额
  const setMaxAmount = () => {
    setContributeAmount(formatUnits(balanceOfParentToken || 0n));
  };

  const hasStartedApproving =
    isPendingApproveParentToken || isConfirmingApproveParentToken || isConfirmedApproveParentToken;

  if (!token) {
    return '';
  }

  return (
    <div className="p-6">
      <LeftTitle title="参与申购" />
      <div className="stats w-full">
        <div className="stat place-items-center">
          <div className="stat-title text-sm mr-6">我已申购质押</div>
          <div className="stat-value text-secondary">
            {formatTokenAmount(contributed || 0n)}
            <span className="text-greyscale-500 font-normal text-sm ml-2">{token.parentTokenSymbol}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <Input
            type="number"
            placeholder={`增加申购数量(${token.parentTokenSymbol})`}
            value={contributeAmount}
            onChange={(e) => setContributeAmount(e.target.value)}
            className="my-auto"
            disabled={hasStartedApproving || (balanceOfParentToken || 0n) <= 0n}
          />
        </div>

        <div className="flex items-center text-sm mb-4">
          <span className="text-greyscale-400">
            {formatTokenAmount(balanceOfParentToken || 0n)} {token.parentTokenSymbol}
          </span>
          <Button
            variant="link"
            size="sm"
            onClick={setMaxAmount}
            disabled={hasStartedApproving || (balanceOfParentToken || 0n) <= 0n}
            className="text-secondary"
          >
            最高
          </Button>
          <Link href={`/launch/deposit?symbol=${token.symbol}`}>
            <Button variant="link" size="sm" className="text-secondary">
              获取{token.parentTokenSymbol}
            </Button>
          </Link>
        </div>

        <div className="flex flex-row gap-2">
          <Button className="w-1/2" onClick={handleApprove} disabled={hasStartedApproving}>
            {!hasStartedApproving
              ? isPendingApproveParentToken || isConfirmingApproveParentToken
                ? '授权中...'
                : '1.授权'
              : '1.已授权'}
          </Button>
          <Button
            className={`w-1/2 text-white py-2 rounded-lg`}
            onClick={handleContribute}
            disabled={
              !isConfirmedApproveParentToken ||
              isPendingContributeToken ||
              isConfirmingContributeToken ||
              isConfirmedContributeToken
            }
          >
            {isPendingContributeToken || isConfirmingContributeToken
              ? '申购中...'
              : isConfirmedContributeToken
              ? '2.申购成功'
              : '2.申购'}
          </Button>
        </div>
      </div>
      {errApproveParentToken && <div className="text-red-500">{errApproveParentToken.message}</div>}
      {errContributeToken && <div className="text-red-500">{errContributeToken.message}</div>}
    </div>
  );
};

export default Contribute;
