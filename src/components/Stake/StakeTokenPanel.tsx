import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';

import { useStakeToken } from '../../hooks/contracts/useLOVE20Stake';
import { useApprove } from '../../hooks/contracts/useLOVE20Token';
import { useTotalSupply } from '../../hooks/contracts/useLOVE20STToken';
import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/format';
import Loading from '../Common/Loading';

interface StakeTokenPanelProps {
  tokenBalance: bigint;
}

const StakeTokenPanel: React.FC<StakeTokenPanelProps> = ({ tokenBalance }) => {
  const { address: accountAddress } = useAccount();
  const { token } = useContext(TokenContext) || {};
  const decimals = process.env.NEXT_PUBLIC_TOKEN_DECIMALS || 18;

  const { totalSupply: stTokenAmount, isPending: isPendingStTokenAmount } = useTotalSupply(
    token?.stTokenAddress as `0x${string}`,
  );

  // Hooks: 授权(approve)、质押(stakeToken)
  const {
    approve: approveToken,
    isWriting: isPendingApproveToken,
    isConfirmed: isConfirmedApproveToken,
    writeError: errApproveToken,
  } = useApprove(token?.address as `0x${string}`);

  const {
    stakeToken,
    isWriting: isPendingStakeToken,
    isConfirming: isConfirmingStakeToken,
    isConfirmed: isConfirmedStakeToken,
    writeError: errStakeToken,
  } = useStakeToken();

  // 捕获表单状态
  const [stakeTokenAmount, setStakeTokenAmount] = useState('');
  const [releasePeriod, setReleasePeriod] = useState('4'); // 将初始值从 '1' 改为 '4'

  // 提交
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async () => {
    if (BigInt(stakeTokenAmount) === 0n) {
      toast.error('请输入正确的数量');
      return;
    }
    console.log('stakeTokenAmount', stakeTokenAmount, 'releasePeriod', releasePeriod);
    try {
      setIsSubmitted(true);
      // 发送授权交易
      await approveToken(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`,
        BigInt(stakeTokenAmount) * 10n ** BigInt(decimals),
      );
    } catch (error) {
      console.error('Approve failed', error);
      setIsSubmitted(false);
    }
  };

  // 监听授权交易的确认状态
  useEffect(() => {
    const bothApproved = isConfirmedApproveToken && isSubmitted;

    if (bothApproved) {
      // 调用质押函数
      stakeToken(
        token?.address as `0x${string}`,
        BigInt(stakeTokenAmount) * 10n ** BigInt(decimals),
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
  }, [isConfirmedApproveToken, isSubmitted]);

  // 如果质押成功，则用toast显示质押成功并重新加载数据
  useEffect(() => {
    if (isConfirmedStakeToken) {
      toast.success('质押成功');
      // 重置表单
      setStakeTokenAmount('');
      setReleasePeriod('');
      // 2秒后刷新页面
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isConfirmedStakeToken]);

  return (
    <>
      <div className="flex justify-center w-full items-center rounded p-4 bg-base-100 mt-4">
        <span>
          <span className="text-sm text-gray-500 mr-2">代币质押总量</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingStakeToken ? <Loading /> : formatTokenAmount(stTokenAmount || BigInt(0))}
          </span>
        </span>
      </div>
      <div className="w-full flex flex-col items-center rounded p-4 bg-base-100 mt-1">
        <div className="w-full text-left mb-4">
          <h2 className="relative pl-4 text-gray-700 text-base font-medium before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-500">
            质押增加治理收益：<span className="text-gray-500 text-sm font-normal">(最多两倍)</span>
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-left mb-1 text-sm text-gray-500">
              质押token数 (当前持有：{formatTokenAmount(tokenBalance)} {token?.symbol})
            </label>
            <input
              type="number"
              placeholder={`输入 ${token?.symbol} 数量`}
              value={stakeTokenAmount}
              onChange={(e) => {
                const stakeValue = e.target.value;
                setStakeTokenAmount(stakeValue);
              }}
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
              type="button"
              className="w-1/2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={isPendingStakeToken || isConfirmingStakeToken}
              onClick={handleSubmit}
            >
              {isPendingStakeToken || isConfirmingStakeToken ? '质押中...' : '质押'}
            </button>
          </div>
        </form>
        {errStakeToken && <div className="text-red-500">{errStakeToken.message}</div>}
        {errApproveToken && <div className="text-red-500">{errApproveToken.message}</div>}
      </div>
    </>
  );
};

export default StakeTokenPanel;
