import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';
import { useContribute, useContributed } from '@/src/hooks/contracts/useLOVE20Launch';
import { useBalanceOf, useApprove } from '@/src/hooks/contracts/useLOVE20Token';
import { TOKEN_CONFIG } from '@/src/config/tokenConfig';
import { Token } from '@/src/contexts/TokenContext';
import { LaunchInfo } from '@/src/types/life20types';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

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
    <div className="bg-white p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-medium mb-2">我的申购</h3>
        <div className="flex justify-center mb-6">
          <p>
            <span className="text-2xl font-bold text-orange-400 mr-1">{formatTokenAmount(contributed || 0n)}</span>
            <span className="text-sm text-gray-500">{token.parentTokenSymbol}</span>
          </p>
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
          <span className="text-gray-400">
            {formatTokenAmount(balanceOfParentToken || 0n)} {token.parentTokenSymbol}
          </span>
          <Button
            variant="link"
            size="sm"
            onClick={setMaxAmount}
            className={`${
              hasStartedApproving || (balanceOfParentToken || 0n) <= 0n
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600'
            }`}
            disabled={hasStartedApproving || (balanceOfParentToken || 0n) <= 0n}
          >
            最高
          </Button>
          <Link href={`/${token.symbol}/launch/deposit`}>
            <Button
              variant="link"
              size="sm"
              className={`${(balanceOfParentToken || 0n) > 0n ? 'text-gray-400' : 'text-blue-600'}`}
            >
              获取{token.parentTokenSymbol}
            </Button>
          </Link>
        </div>

        <div className="flex flex-row gap-2">
          <Button
            className={`w-1/2 text-white ${
              !hasStartedApproving ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleApprove}
            disabled={hasStartedApproving}
          >
            {!hasStartedApproving
              ? isPendingApproveParentToken || isConfirmingApproveParentToken
                ? '授权中...'
                : '1.授权'
              : '1.已授权'}
          </Button>
          <Button
            className={`w-1/2 text-white py-2 rounded-lg ${
              isConfirmedApproveParentToken ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
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
