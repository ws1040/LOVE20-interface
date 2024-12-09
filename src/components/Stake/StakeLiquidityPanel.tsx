import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

import { checkWalletConnection } from '@/src/utils/web3';
import { useStakeLiquidity } from '@/src/hooks/contracts/useLOVE20Stake';
import { useApprove } from '@/src/hooks/contracts/useLOVE20Token';
import { TokenContext, Token } from '@/src/contexts/TokenContext';
import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';
import { useGetAmountsIn, useGetAmountsOut } from '@/src/components/Stake/getAmountHooks';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

interface StakeLiquidityPanelProps {
  tokenBalance: bigint;
  parentTokenBalance: bigint;
  stakedTokenAmountOfLP: bigint;
}

const StakeLiquidityPanel: React.FC<StakeLiquidityPanelProps> = ({
  tokenBalance,
  parentTokenBalance,
  stakedTokenAmountOfLP,
}) => {
  const { address: accountAddress, chain: accountChain } = useAccount();
  const { token } = useContext(TokenContext) || {};

  // 捕获表单状态
  const [parentToken, setParentToken] = useState('');
  const [stakeToken, setStakeToken] = useState('');
  const [releasePeriod, setReleasePeriod] = useState('4');
  const [isParentTokenChangedByUser, setIsParentTokenChangedByUser] = useState(false); //是否是用户手动输入
  const [isTokenChangedByUser, setIsTokenChangedByUser] = useState(false); //是否是用户手动输入

  // ----------------- 1. 自动计算兑换数量 -----------------
  // 计算LP对应的另一种代币数量
  const pairExists = stakedTokenAmountOfLP > 0n;
  const {
    data: amountsOut,
    error: amountsOutError,
    isLoading: isAmountsOutLoading,
  } = useGetAmountsOut(
    parseUnits(parentToken),
    [token?.parentTokenAddress as `0x${string}`, token?.address as `0x${string}`],
    token as Token,
    pairExists,
    isParentTokenChangedByUser,
  );
  const {
    data: amountsIn,
    error: amountsInError,
    isLoading: isAmountsInLoading,
  } = useGetAmountsIn(
    parseUnits(stakeToken),
    [token?.parentTokenAddress as `0x${string}`, token?.address as `0x${string}`],
    token as Token,
    pairExists,
    isTokenChangedByUser,
  );

  // 验证输入是否为有效的数字且最多9位小数
  const validateInput = (value: string) => {
    const regex = /^\d+(\.\d{0,12})?$/;
    return regex.test(value);
  };

  // 处理父币输入变化
  const handleParentTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsParentTokenChangedByUser(true);
    if (value === '' || validateInput(value)) {
      setParentToken(value);
    }
    if (!value) {
      setStakeToken('0');
    }
  };
  // 设置需要的子币数量
  useEffect(() => {
    if (amountsOut && amountsOut.length > 1) {
      setIsTokenChangedByUser(false);
      setIsParentTokenChangedByUser(false);
      const amountOut = formatUnits(BigInt(amountsOut[1]));
      const amountOutShow = Number(amountOut)
        .toFixed(12)
        .replace(/\.?0+$/, '');
      setStakeToken(amountOutShow);
    }
  }, [amountsOut]);

  // 处理质押token输入变化
  const handleStakeTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsTokenChangedByUser(true);
    if (value === '' || validateInput(value)) {
      setStakeToken(value);
    }
    if (!value) {
      setParentToken('0');
    }
  };
  // 设置父币数量
  useEffect(() => {
    if (amountsIn && amountsIn.length > 1) {
      setIsParentTokenChangedByUser(false);
      setIsTokenChangedByUser(false);
      const amountIn = formatUnits(BigInt(amountsIn[0]));
      const amountInShow = Number(amountIn)
        .toFixed(12)
        .replace(/\.?0+$/, '');
      setParentToken(amountInShow);
    }
  }, [amountsIn]);

  // ----------------- 2. 授权 -----------------
  // Hooks: 授权(approve)、质押(stakeLiquidity)
  const {
    approve: approveToken,
    isWriting: isPendingApproveToken,
    isConfirming: isConfirmingApproveToken,
    isConfirmed: isConfirmedApproveToken,
    writeError: errApproveToken,
  } = useApprove(token?.address as `0x${string}`);
  const {
    approve: approveParentToken,
    isWriting: isPendingApproveParentToken,
    isConfirming: isConfirmingApproveParentToken,
    isConfirmed: isConfirmedApproveParentToken,
    writeError: errApproveParentToken,
  } = useApprove(token?.parentTokenAddress as `0x${string}`);

  const handleApprove = async () => {
    if (!checkInput()) {
      return;
    }
    try {
      const stakeAmount = parseUnits(stakeToken);
      const parentAmount = parseUnits(parentToken);
      if (stakeAmount === null || parentAmount === null) {
        toast.error('输入格式错误');
        return;
      }

      // 发送授权交易
      await approveToken(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`, stakeAmount);
      await approveParentToken(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`, parentAmount);
    } catch (error) {
      console.error('Approve failed', error);
    }
  };
  useEffect(() => {
    if (isConfirmedApproveToken || isConfirmedApproveParentToken) {
      toast.success('授权成功');
    }
  }, [isConfirmedApproveToken, isConfirmedApproveParentToken]);

  // ----------------- 3. 提交质押 -----------------
  const {
    stakeLiquidity,
    isWriting: isPendingStakeLiquidity,
    isConfirming: isConfirmingStakeLiquidity,
    isConfirmed: isConfirmedStakeLiquidity,
    writeError: errStakeLiquidity,
  } = useStakeLiquidity();

  const handleSubmit = async () => {
    if (!checkInput()) {
      return;
    }

    const bothApproved = isConfirmedApproveToken && isConfirmedApproveParentToken;

    if (bothApproved) {
      const stakeAmount = parseUnits(stakeToken);
      const parentAmount = parseUnits(parentToken);
      if (stakeAmount === null || parentAmount === null) {
        toast.error('转换金额时出错');
        return;
      }

      // 调用质押函数
      stakeLiquidity(
        token?.address as `0x${string}`,
        stakeAmount,
        parentAmount,
        BigInt(releasePeriod),
        accountAddress as `0x${string}`,
      ).catch((error) => {
        console.error('Stake failed', error);
      });
    } else {
      toast.error('请先完成授权');
    }
  };
  // 如果质押成功，则用toast显示质押成功并重新加载数据
  useEffect(() => {
    if (isConfirmedStakeLiquidity) {
      toast.success('质押成功');
      // 2秒后刷新页面
      setTimeout(() => {
        // 跳转到治理首页
        window.location.href = `/gov?symbol=${token?.symbol}`;
      }, 2000);
    }
  }, [isConfirmedStakeLiquidity]);

  // 检查输入
  const checkInput = () => {
    if (!checkWalletConnection(accountChain)) {
      return false;
    }
    if (!validateInput(parentToken) || !validateInput(stakeToken)) {
      toast.error('请输入有效的数量，最多支持12位小数');
      return false;
    }
    if (parseUnits(stakeToken) <= 0n || parseUnits(parentToken) <= 0n) {
      toast.error('质押数量不能为0');
      return false;
    }
    return true;
  };

  const isApproving = isPendingApproveToken || isPendingApproveParentToken;
  const isApproveConfirming = isConfirmingApproveToken || isConfirmingApproveParentToken;
  const isApproveConfirmed = isConfirmedApproveToken && isConfirmedApproveParentToken;
  const hadStartedApprove = isApproving || isApproveConfirming || isApproveConfirmed;

  return (
    <>
      <div className="w-full flex-col items-center p-6 mt-1">
        <LeftTitle title="质押获取治理票" />
        <form onSubmit={handleSubmit} className="w-full max-w-md mt-4">
          <div className="mb-4">
            <label className="block text-left mb-1 text-sm text-greyscale-500">
              质押父币数 (当前持有：
              <span className="text-secondary-400">
                {formatTokenAmount(parentTokenBalance)} {token?.parentTokenSymbol}
              </span>
              )
            </label>
            <input
              type="text"
              placeholder={`输入 ${token?.parentTokenSymbol} 数量`}
              value={parentToken}
              onChange={handleParentTokenChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
              disabled={hadStartedApprove}
            />
          </div>
          <div className="mb-4">
            <label className="block text-left mb-1 text-sm text-greyscale-500">
              质押token数 (当前持有：
              <span className="text-secondary-400">
                {formatTokenAmount(tokenBalance)} {token?.symbol}
              </span>
              )
            </label>
            <input
              type="text"
              placeholder={`输入 ${token?.symbol} 数量`}
              value={stakeToken}
              onChange={handleStakeTokenChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
              disabled={hadStartedApprove}
            />
          </div>
          <div className="mb-4">
            <label className="block text-left mb-1 text-sm text-greyscale-500">释放期</label>
            <select
              value={releasePeriod}
              onChange={(e) => setReleasePeriod(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring "
              required
              disabled={hadStartedApprove}
            >
              {Array.from({ length: 9 }, (_, i) => (
                <option key={i + 4} value={i + 4}>
                  {i + 4}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center space-x-4">
            <Button className={`w-1/2 `} disabled={hadStartedApprove} onClick={handleApprove}>
              {isApproving
                ? '1.授权中...'
                : isApproveConfirming
                ? '1.确认中'
                : isApproveConfirmed
                ? '1.已授权'
                : '1.授权'}
            </Button>
            <Button
              type="submit"
              className={`w-1/2`}
              disabled={
                !isApproveConfirmed ||
                isPendingStakeLiquidity ||
                isConfirmingStakeLiquidity ||
                isConfirmedStakeLiquidity
              }
            >
              {isPendingStakeLiquidity
                ? '2.质押中...'
                : isConfirmingStakeLiquidity
                ? '2.确认中...'
                : isConfirmedStakeLiquidity
                ? '2.已质押'
                : '2.质押'}
            </Button>
          </div>
        </form>
        {errStakeLiquidity && <div className="text-red-500">{errStakeLiquidity.message}</div>}
        {errApproveToken && <div className="text-red-500">{errApproveToken.message}</div>}
        {errApproveParentToken && <div className="text-red-500">{errApproveParentToken.message}</div>}
        <LoadingOverlay
          isLoading={isApproving || isApproveConfirming || isPendingStakeLiquidity || isConfirmingStakeLiquidity}
        />
      </div>
    </>
  );
};

export default StakeLiquidityPanel;
