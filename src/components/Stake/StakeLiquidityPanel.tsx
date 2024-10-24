import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';

import StakedLiquidDataPanel from '../DataPanel/StakedLiquidDataPanel';
import { useStakeLiquidity } from '../../hooks/contracts/useLOVE20Stake';
import { useApprove } from '../../hooks/contracts/useLOVE20Token';
import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/format';

interface StakeLiquidityPanelProps {
  tokenBalance: bigint;
  parentTokenBalance: bigint;
}

const StakeLiquidityPanel: React.FC<StakeLiquidityPanelProps> = ({ tokenBalance, parentTokenBalance }) => {
  const { address: accountAddress } = useAccount();
  const { token } = useContext(TokenContext) || {};
  const decimals = parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || '18', 10);

  // Hooks: 授权(approve)、质押(stakeLiquidity)
  const {
    approve: approveToken,
    isWriting: isPendingApproveToken,
    isConfirmed: isConfirmedApproveToken,
    writeError: errApproveToken,
  } = useApprove(token?.address as `0x${string}`);
  const {
    approve: approveParentToken,
    isWriting: isPendingApproveParentToken,
    isConfirmed: isConfirmedApproveParentToken,
    writeError: errApproveParentToken,
  } = useApprove(token?.parentTokenAddress as `0x${string}`);
  const {
    stakeLiquidity,
    isWriting: isPendingStakeLiquidity,
    isConfirming: isConfirmingStakeLiquidity,
    isConfirmed: isConfirmedStakeLiquidity,
    writeError: errStakeLiquidity,
  } = useStakeLiquidity();

  // 捕获表单状态
  const [parentToken, setParentToken] = useState('');
  const [stakeToken, setStakeToken] = useState('');
  const [releasePeriod, setReleasePeriod] = useState('4'); // 将初始值从 '1' 改为 '4'

  // 提交质押
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput(parentToken) || !validateInput(stakeToken)) {
      toast.error('请输入有效的数量，最多支持9位小数');
      return;
    }

    try {
      setIsSubmitted(true);
      const stakeAmount = decimalToBigInt(stakeToken, decimals);
      const parentAmount = decimalToBigInt(parentToken, decimals);

      if (stakeAmount === null || parentAmount === null) {
        toast.error('输入格式错误');
        setIsSubmitted(false);
        return;
      }

      // 发送授权交易
      await approveToken(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`, stakeAmount);
      await approveParentToken(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`, parentAmount);
    } catch (error) {
      console.error('Approve failed', error);
      setIsSubmitted(false);
    }
  };

  // 验证输入是否为有效的数字且最多9位小数
  const validateInput = (value: string) => {
    const regex = /^\d+(\.\d{0,9})?$/;
    return regex.test(value);
  };

  // 将十进制字符串转换为 BigInt
  const decimalToBigInt = (value: string, decimals: number): bigint | null => {
    const parts = value.split('.');
    if (parts.length > 2) return null;
    const whole = parts[0];
    const fraction = parts[1] || '';
    if (fraction.length > 9) return null;
    const paddedFraction = fraction.padEnd(decimals, '0');
    try {
      return BigInt(whole) * BigInt(10) ** BigInt(decimals) + BigInt(paddedFraction.slice(0, decimals));
    } catch {
      return null;
    }
  };

  // 格式化显示，去除多余的0
  const formatInputValue = (value: string) => {
    if (value.includes('.')) {
      return parseFloat(value).toString();
    }
    return value;
  };

  // 监听授权交易的确认状态
  useEffect(() => {
    const bothApproved = isConfirmedApproveToken && isConfirmedApproveParentToken && isSubmitted;

    if (bothApproved) {
      const stakeAmount = decimalToBigInt(stakeToken, decimals);
      const parentAmount = decimalToBigInt(parentToken, decimals);
      if (stakeAmount === null || parentAmount === null) {
        toast.error('转换金额时出错');
        setIsSubmitted(false);
        return;
      }

      // 调用质押函数
      stakeLiquidity(
        token?.address as `0x${string}`,
        stakeAmount,
        parentAmount,
        BigInt(releasePeriod),
        accountAddress as `0x${string}`,
      )
        .then(() => {
          setIsSubmitted(false); // 重置提交状态
        })
        .catch((error) => {
          console.error('Stake failed', error);
          setIsSubmitted(false);
        });
    }
  }, [
    isConfirmedApproveToken,
    isConfirmedApproveParentToken,
    isSubmitted,
    stakeLiquidity,
    token,
    releasePeriod,
    accountAddress,
    decimals,
    parentToken,
    stakeToken,
  ]);

  // 如果质押成功，则用toast显示质押成功并重新加载数据
  useEffect(() => {
    if (isConfirmedStakeLiquidity) {
      toast.success('质押成功');
      // 重置表单
      setParentToken('');
      setStakeToken('');
      setReleasePeriod('4');
      // 2秒后刷新页面
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isConfirmedStakeLiquidity]);

  // 处理父币输入变化
  const handleParentTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || validateInput(value)) {
      setParentToken(value);
      if (value && !value.endsWith('.')) {
        const stakeValue = (parseFloat(value) * 100000).toFixed(9).replace(/\.?0+$/, '');
        setStakeToken(stakeValue);
      } else {
        setStakeToken(value);
      }
    }
  };

  // 处理质押token输入变化
  const handleStakeTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || validateInput(value)) {
      setStakeToken(value);
      if (value && !value.endsWith('.')) {
        const parentValue = (parseFloat(value) / 100000).toFixed(9).replace(/\.?0+$/, '');
        setParentToken(parentValue);
      } else {
        setParentToken(value);
      }
    }
  };

  // 处理父币输入失去焦点
  const handleParentTokenBlur = () => {
    if (parentToken) {
      setParentToken(formatInputValue(parentToken));
    }
    if (stakeToken) {
      setStakeToken(formatInputValue(stakeToken));
    }
  };

  // 处理质押token输入失去焦点
  const handleStakeTokenBlur = () => {
    if (stakeToken) {
      setStakeToken(formatInputValue(stakeToken));
    }
    if (parentToken) {
      setParentToken(formatInputValue(parentToken));
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center rounded p-4 bg-base-100 border-t border-gray-100">
        <StakedLiquidDataPanel showStakeToken={false} />
      </div>
      <div className="w-full flex flex-col items-center rounded p-4 bg-base-100 mt-1">
        <div className="w-full text-left mb-4">
          <h2 className="relative pl-4 text-gray-700 text-base font-medium before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-500">
            质押获取治理票：
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-left mb-1 text-sm text-gray-500">
              质押父币数 (当前持有：{formatTokenAmount(parentTokenBalance)} {token?.parentTokenSymbol})
            </label>
            <input
              type="text"
              placeholder={`输入 ${token?.parentTokenSymbol} 数量`}
              value={parentToken}
              onChange={handleParentTokenChange}
              onBlur={handleParentTokenBlur}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-left mb-1 text-sm text-gray-500">
              质押token数 (当前持有：{formatTokenAmount(tokenBalance)} {token?.symbol})
            </label>
            <input
              type="text"
              placeholder={`输入 ${token?.symbol} 数量`}
              value={stakeToken}
              onChange={handleStakeTokenChange}
              onBlur={handleStakeTokenBlur}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-left mb-1 text-sm text-gray-500">释放期</label>
            <select
              value={releasePeriod}
              onChange={(e) => setReleasePeriod(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
            >
              {Array.from({ length: 9 }, (_, i) => (
                <option key={i + 4} value={i + 4}>
                  {i + 4}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={isPendingStakeLiquidity || isConfirmingStakeLiquidity}
            >
              {isPendingStakeLiquidity || isConfirmingStakeLiquidity ? '质押中...' : '质押'}
            </button>
          </div>
        </form>
        {errStakeLiquidity && <div className="text-red-500">{errStakeLiquidity.message}</div>}
        {errApproveToken && <div className="text-red-500">{errApproveToken.message}</div>}
        {errApproveParentToken && <div className="text-red-500">{errApproveParentToken.message}</div>}
      </div>
    </>
  );
};

export default StakeLiquidityPanel;
