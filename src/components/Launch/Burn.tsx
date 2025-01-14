import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

// my hooks
import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';
import { checkWalletConnection } from '@/src/lib/web3';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { LaunchInfo } from '@/src/types/life20types';
import { useApprove, useBalanceOf, useBurnForParentToken, useTotalSupply } from '@/src/hooks/contracts/useLOVE20Token';

// my contexts
import { Token } from '@/src/contexts/TokenContext';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

const Burn: React.FC<{ token: Token | null | undefined; launchInfo: LaunchInfo }> = ({ token, launchInfo }) => {
  const [burnAmount, setBurnAmount] = useState('');
  const [expectedParentTokenBalance, setExpectedParentTokenBalance] = useState(0n);
  const { address: account, chain: accountChain } = useAccount();
  const router = useRouter();

  // 读取我的代币余额
  const {
    balance: balanceOfToken,
    isPending: isPendingBalanceOfToken,
    error: errorBalanceOfToken,
  } = useBalanceOf(token?.address as `0x${string}`, account as `0x${string}`);

  // 读取底池父币余额
  const {
    balance: balanceOfParentToken,
    isPending: isPendingBalanceOfParentToken,
    error: errorBalanceOfParentToken,
  } = useBalanceOf(token?.parentTokenAddress as `0x${string}`, token?.address as `0x${string}`);

  // 读取token发行总量
  const {
    totalSupply: totalSupplyOfToken,
    isPending: isPendingTotalSupplyOfToken,
    error: errorTotalSupplyOfToken,
  } = useTotalSupply(token?.address as `0x${string}`);

  // 计算预计可换回的父币数量
  useEffect(() => {
    if (totalSupplyOfToken && balanceOfParentToken) {
      setExpectedParentTokenBalance((parseUnits(burnAmount) * balanceOfParentToken) / totalSupplyOfToken);
    }
  }, [burnAmount, totalSupplyOfToken, balanceOfParentToken]);

  // 检查输入
  const checkInput = () => {
    if (!checkWalletConnection(accountChain)) {
      return false;
    }
    if (parseUnits(burnAmount) <= 0n) {
      toast.error('销毁数量不能为0');
      return false;
    }
    return true;
  };

  // 授权
  const {
    approve: approveParentToken,
    isWriting: isPendingApproveParentToken,
    isConfirming: isConfirmingApproveParentToken,
    isConfirmed: isConfirmedApproveParentToken,
    writeError: errApproveParentToken,
  } = useApprove(token?.address as `0x${string}`);
  const handleApprove = async () => {
    if (!checkInput()) {
      return;
    }
    try {
      await approveParentToken(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_LAUNCH as `0x${string}`,
        parseUnits(burnAmount),
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

  // 销毁
  const {
    burnForParentToken,
    isPending: isPendingBurn,
    isConfirming: isConfirmingBurn,
    isConfirmed: isConfirmedBurn,
    writeError: errBurn,
  } = useBurnForParentToken(token?.address as `0x${string}`);

  const handleContribute = async () => {
    if (!checkInput()) {
      return;
    }
    try {
      await burnForParentToken(parseUnits(burnAmount));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isConfirmedBurn) {
      toast.success('销毁成功');
      // 2秒后跳转到发射页面
      setTimeout(() => {
        router.push(`/launch?symbol=${token?.symbol}`);
      }, 2000);
    }
  }, [isConfirmedBurn]);

  // 设置最大金额
  const setMaxAmount = () => {
    setBurnAmount(formatUnits(balanceOfToken || 0n));
  };

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorBalanceOfToken) {
      handleContractError(errorBalanceOfToken, 'token');
    }
    if (errorBalanceOfParentToken) {
      handleContractError(errorBalanceOfParentToken, 'token');
    }
    if (errorTotalSupplyOfToken) {
      handleContractError(errorTotalSupplyOfToken, 'token');
    }
    if (errApproveParentToken) {
      handleContractError(errApproveParentToken, 'token');
    }
    if (errBurn) {
      handleContractError(errBurn, 'token');
    }
  }, [errorBalanceOfToken, errorBalanceOfParentToken, errorTotalSupplyOfToken, errApproveParentToken, errBurn]);

  const hasStartedApproving =
    isPendingApproveParentToken || isConfirmingApproveParentToken || isConfirmedApproveParentToken;

  if (!token || isPendingBalanceOfToken) {
    return <LoadingIcon />;
  }

  return (
    <>
      <div className="p-6">
        <LeftTitle title="底池销毁" />
        <div className="stats w-full">
          <div className="stat place-items-center">
            <div className="stat-title text-sm mr-6">底池总量</div>
            <div className="stat-value text-secondary mt-2">
              {formatTokenAmount(balanceOfParentToken || 0n)}
              <span className="text-greyscale-500 font-normal text-sm ml-2">{token.parentTokenSymbol}</span>
            </div>
            <div className="stat-desc text-sm mt-2">
              销毁 {token.symbol}，可从底池取回 {token.parentTokenSymbol}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center text-sm">
            <span className="text-greyscale-400">
              我的{token.symbol}: <span className="text-secondary">{formatTokenAmount(balanceOfToken || 0n)}</span>
            </span>
            <Button
              variant="link"
              size="sm"
              onClick={setMaxAmount}
              disabled={hasStartedApproving || (balanceOfToken || 0n) <= 0n}
              className="text-secondary"
            >
              全选
            </Button>
          </div>

          <div className="flex justify-between">
            <Input
              type="number"
              placeholder={`请输入销毁 ${token.symbol} 的数量`}
              value={burnAmount}
              onChange={(e) => setBurnAmount(e.target.value)}
              className="my-auto"
              disabled={hasStartedApproving || (balanceOfToken || 0n) <= 0n}
            />
          </div>

          <div className="flex items-center justify-end text-sm my-2">
            <span className="text-greyscale-400">
              预计可取回 <span className="text-secondary">{formatTokenAmount(expectedParentTokenBalance)}</span>{' '}
              {token.parentTokenSymbol}
            </span>
          </div>

          <div className="flex justify-center space-x-4">
            <Button className="w-1/2" onClick={handleApprove} disabled={hasStartedApproving}>
              {isPendingApproveParentToken
                ? '1.授权中...'
                : isConfirmingApproveParentToken
                ? '1.确认中...'
                : isConfirmedApproveParentToken
                ? '1.已授权'
                : '1.授权'}
            </Button>
            <Button
              className={`w-1/2 text-white py-2 rounded-lg`}
              onClick={handleContribute}
              disabled={!isConfirmedApproveParentToken || isPendingBurn || isConfirmingBurn || isConfirmedBurn}
            >
              {isPendingBurn
                ? '2.销毁中...'
                : isConfirmingBurn
                ? '2.确认中...'
                : isConfirmedBurn
                ? '2.销毁成功'
                : '2.销毁'}
            </Button>
          </div>
        </div>
        <div className="bg-gray-100 text-greyscale-500 rounded-lg p-4 text-sm mt-4">
          <p className="mb-1">计算公式：</p>
          <p>
            所得{token.parentTokenSymbol}数量 = 底池{token.parentTokenSymbol}总量 * (销毁{token.symbol}数量 /{` `}
            {token.symbol}总发行量)
          </p>
        </div>
      </div>
      <LoadingOverlay
        isLoading={isPendingApproveParentToken || isConfirmingApproveParentToken || isPendingBurn || isConfirmingBurn}
        text={isPendingApproveParentToken || isPendingBurn ? '提交交易...' : '确认交易...'}
      />
    </>
  );
};

export default Burn;
