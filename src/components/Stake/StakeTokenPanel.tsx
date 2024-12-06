import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

import { checkWalletConnection } from '@/src/utils/web3';
import { useStakeToken } from '@/src/hooks/contracts/useLOVE20Stake';
import { useApprove } from '@/src/hooks/contracts/useLOVE20Token';
import { useTotalSupply } from '@/src/hooks/contracts/useLOVE20STToken';
import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount, parseUnits } from '@/src/lib/format';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

interface StakeTokenPanelProps {
  tokenBalance: bigint;
}

const StakeTokenPanel: React.FC<StakeTokenPanelProps> = ({ tokenBalance }) => {
  const { address: accountAddress, chain: accountChain } = useAccount();
  const { token } = useContext(TokenContext) || {};

  const { totalSupply: stTokenAmount, isPending: isPendingStTokenAmount } = useTotalSupply(
    token?.stTokenAddress as `0x${string}`,
  );

  // Hooks: 授权(approve)、质押(stakeToken)
  const {
    approve: approveToken,
    isWriting: isPendingApproveToken,
    isConfirming: isConfirmingApproveToken,
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

  // 检查输入
  const checkInput = () => {
    if (!checkWalletConnection(accountChain)) {
      return false;
    }
    if (BigInt(stakeTokenAmount) === 0n) {
      toast.error('请输入正确的数量');
      return;
    }
    return true;
  };

  // 处理授权
  const handleApprove = async () => {
    if (!checkInput()) {
      return;
    }
    try {
      await approveToken(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`, parseUnits(stakeTokenAmount));
    } catch (error: any) {
      toast.error(error?.message || '授权失败');
      console.error('Approve failed', error);
    }
  };
  useEffect(() => {
    if (isConfirmedApproveToken) {
      toast.success('授权成功');
    }
  }, [isConfirmedApproveToken]);

  // 处理质押
  const handleStake = async () => {
    if (!checkInput()) {
      return;
    }
    try {
      await stakeToken(
        token?.address as `0x${string}`,
        parseUnits(stakeTokenAmount),
        BigInt(releasePeriod),
        accountAddress as `0x${string}`,
      );
    } catch (error) {
      console.error('Stake failed', error);
    }
  };
  // 监听质押交易的确认状态
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
      <div className="w-full flex flex-col items-center p-6 mt-1">
        <div className="w-full text-left mb-4">
          <LeftTitle title="质押增加治理收益" />
        </div>
        <form className="w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-left mb-1 text-sm text-greyscale-500">
              质押数 (当前持有数量：
              <span className="text-secondary">
                {formatTokenAmount(tokenBalance)} {token?.symbol}
              </span>
              )
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
            <label className="block text-left mb-1 text-sm text-greyscale-500">释放期</label>
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
              disabled={
                !isConfirmedApproveToken || isPendingStakeToken || isConfirmingStakeToken || isConfirmedStakeToken
              }
              onClick={handleStake}
            >
              {isPendingStakeToken || isConfirmingStakeToken
                ? '2.质押中...'
                : isConfirmedStakeToken
                ? '2.已质押'
                : '2.质押'}
            </Button>
          </div>
        </form>
        {errStakeToken && <div className="text-red-500">{errStakeToken.message}</div>}
        {errApproveToken && <div className="text-red-500">{errApproveToken.message}</div>}
        <LoadingOverlay
          isLoading={isPendingApproveToken || isConfirmingApproveToken || isPendingStakeToken || isConfirmingStakeToken}
        />
      </div>
    </>
  );
};

export default StakeTokenPanel;
