import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';
import { toast } from 'react-hot-toast';
import { useDeposit } from '@/src/hooks/contracts/useWETH';
import Loading from '@/src/components/Common/Loading';

const Deposit: React.FC = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const { address: account } = useAccount();
  const router = useRouter();
  // 读取余额
  const {
    data: balance,
    error: errBalance,
    isLoading: isLoadingBalance,
    refetch,
  } = useBalance({
    address: account,
  });

  // 兑换
  const {
    deposit,
    isPending: isPendingDeposit,
    isConfirming: isConfirmingDeposit,
    isConfirmed: isConfirmedDeposit,
    error: errDeposit,
  } = useDeposit();
  const handleDeposit = async () => {
    try {
      await deposit(parseUnits(depositAmount));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isConfirmedDeposit) {
      toast.success('兑换成功');
      // 2秒后刷新
      setTimeout(() => {
        //跳到上一页
        router.back();
      }, 2000);
    }
  }, [isConfirmedDeposit]);

  // 设置最大金额
  const setMaxAmount = () => {
    setDepositAmount(formatUnits(balance?.value || 0n));
  };

  useEffect(() => {
    if (errBalance) {
      toast.error(errBalance.message);
    }
  }, [errBalance]);

  return (
    <div className="bg-white p-6 shadow-sm space-y-6">
      <div className="flex items-center mb-2">
        <h3 className="text-base font-medium">兑换{process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL}</h3>
        <span className="text-gray-400 text-sm ml-2">
          (1{balance?.symbol} = 1{process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL})
        </span>
      </div>
      <div className="flex justify-between">
        <Input
          type="number"
          placeholder={`填写 ${balance?.symbol} 数量`}
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="my-auto"
          disabled={isPendingDeposit || isConfirmingDeposit}
        />
      </div>

      <div className="flex items-center text-sm mb-4">
        <span className="text-gray-400">
          {isLoadingBalance ? <Loading /> : formatTokenAmount(balance?.value || 0n)} {balance?.symbol}
        </span>
        <Button
          variant="link"
          size="sm"
          onClick={setMaxAmount}
          className="text-blue-600"
          disabled={isLoadingBalance || isPendingDeposit || isConfirmingDeposit}
        >
          最高
        </Button>
      </div>

      <div className="flex justify-center">
        <Button
          className={`w-1/2 text-white py-2 rounded-lg ${
            !isPendingDeposit && !isConfirmingDeposit
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleDeposit}
          disabled={isPendingDeposit || isConfirmingDeposit}
        >
          {isPendingDeposit || isConfirmingDeposit ? '兑换中...' : isConfirmedDeposit ? '兑换成功' : '兑换'}
        </Button>
      </div>
      {errBalance && <div className="text-red-500">{errBalance.message}</div>}
      {errDeposit && <div className="text-red-500">{errDeposit.message}</div>}
    </div>
  );
};

export default Deposit;
