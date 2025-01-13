import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

// my funcs
import { checkWalletConnection } from '@/src/lib/web3';
import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';

// my hooks
import { useDeposit } from '@/src/hooks/contracts/useWETH';
import { useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '../Common/LoadingOverlay';
import LeftTitle from '../Common/LeftTitle';

const Deposit: React.FC = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const { address: account, chain: accountChain } = useAccount();
  const router = useRouter();

  // 读取余额
  const {
    data: balance,
    error: errBalance,
    isLoading: isLoadingBalance,
  } = useBalance({
    address: account,
  });

  // 读取我的代币余额
  const {
    balance: balanceOfERC20Token,
    isPending: isPendingBalanceOfERC20Token,
    error: errorBalanceOfERC20Token,
  } = useBalanceOf(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ROOT_PARENT_TOKEN as `0x${string}`,
    account as `0x${string}`,
  );

  // 检查输入
  const checkInput = () => {
    if (!checkWalletConnection(accountChain)) {
      return false;
    }
    if (parseUnits(depositAmount) <= 0n) {
      toast.error('兑换数量不能为0');
      return false;
    }
    return true;
  };

  // 兑换
  const {
    deposit,
    isPending: isPendingDeposit,
    isConfirming: isConfirmingDeposit,
    isConfirmed: isConfirmedDeposit,
    error: errDeposit,
  } = useDeposit();
  const handleDeposit = async () => {
    if (!checkInput()) {
      return;
    }
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

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errBalance) {
      handleContractError(errBalance, 'token');
    }
    if (errorBalanceOfERC20Token) {
      handleContractError(errorBalanceOfERC20Token, 'token');
    }
    if (errDeposit) {
      handleContractError(errDeposit, 'token');
    }
  }, [errBalance, errorBalanceOfERC20Token, errDeposit]);

  return (
    <>
      <div className="p-4 shadow-sm">
        <LeftTitle title={`换得 ${process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL}`} />
        <div className="stats w-full">
          <div className="stat place-items-center">
            <div className="stat-title text-sm">我的{process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL}</div>
            <div className="stat-value text-secondary mt-2">{formatTokenAmount(balanceOfERC20Token || 0n)}</div>
            <div className="stat-desc text-sm mt-2"></div>
          </div>
        </div>
        <div className="flex items-center mb-2">
          <span className="text-sm">用 {balance?.symbol} 兑换</span>
          <span className="text-secondary text-sm ml-2">
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
          <span className="text-greyscale-400">
            {isLoadingBalance ? <LoadingIcon /> : formatTokenAmount(balance?.value || 0n)} {balance?.symbol}
          </span>
          <Button
            variant="link"
            size="sm"
            onClick={setMaxAmount}
            className="text-secondary"
            disabled={isLoadingBalance || isPendingDeposit || isConfirmingDeposit}
          >
            最高
          </Button>
        </div>

        <div className="flex justify-center">
          <Button
            className={`w-1/2 text-white py-2 rounded-lg`}
            onClick={handleDeposit}
            disabled={isPendingDeposit || isConfirmingDeposit || isConfirmedDeposit}
          >
            {isPendingDeposit
              ? '兑换中...'
              : isConfirmingDeposit
              ? '确认中...'
              : isConfirmedDeposit
              ? '兑换成功'
              : '兑换'}
          </Button>
        </div>
      </div>
      <LoadingOverlay
        isLoading={isPendingDeposit || isConfirmingDeposit}
        text={isPendingDeposit ? '提交交易...' : '确认交易...'}
      />
    </>
  );
};

export default Deposit;
