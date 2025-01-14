'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useAccount, useBalance } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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

// 1. 修改为函数，接收 balance 作为参数
const getDepositFormSchema = (balance: bigint) =>
  z.object({
    depositAmount: z
      .string()
      .nonempty('请输入兑换数量')
      .refine(
        (val) => {
          try {
            const amount = parseUnits(val);
            return amount > 0n && amount <= balance;
          } catch (e) {
            return false;
          }
        },
        {
          message: '兑换数量必须大于0且不超过您的余额',
        },
      ),
  });

type DepositFormValues = z.infer<ReturnType<typeof getDepositFormSchema>>;

const Deposit: React.FC = () => {
  const router = useRouter();
  const { address: account, chain: accountChain } = useAccount();

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

  // 兑换
  const {
    deposit,
    isPending: isPendingDeposit,
    isConfirming: isConfirmingDeposit,
    isConfirmed: isConfirmedDeposit,
    error: errDeposit,
  } = useDeposit();

  // 2. 创建 hook form 实例，并传入当前余额
  const form = useForm<DepositFormValues>({
    resolver: zodResolver(getDepositFormSchema(balanceOfERC20Token || 0n)),
    defaultValues: {
      depositAmount: '',
    },
    mode: 'onChange',
  });

  // 3. 提交时调用 deposit
  async function onSubmit(data: DepositFormValues) {
    // 也可在这里检测是否连接正确网络
    if (!checkWalletConnection(accountChain)) {
      toast.error('请切换到正确的网络');
      return;
    }

    try {
      await deposit(parseUnits(data.depositAmount));
    } catch (error) {
      console.error(error);
    }
  }

  // 兑换成功后回调
  useEffect(() => {
    if (isConfirmedDeposit) {
      toast.success('兑换成功');
      // 2秒后刷新/返回
      setTimeout(() => {
        router.back();
      }, 2000);
    }
  }, [isConfirmedDeposit, router]);

  // 设置最大金额
  const setMaxAmount = () => {
    // 注意这里需要先将 balance?.value 转字符串
    // 再用 formatUnits 转成人类可读
    form.setValue('depositAmount', formatUnits(balance?.value || 0n));
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
  }, [errBalance, errorBalanceOfERC20Token, errDeposit, handleContractError]);

  return (
    <>
      <div className="p-6">
        <LeftTitle title={`换得 ${process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL}`} />
        <div className="stats w-full">
          <div className="stat place-items-center">
            <div className="stat-title text-sm">我的{process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL}</div>
            <div className="stat-value text-secondary mt-2">{formatTokenAmount(balanceOfERC20Token || 0n)}</div>
            <div className="stat-desc text-sm mt-2"></div>
          </div>
        </div>

        {/* 4. 使用 Form 组件包裹并渲染  */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="depositAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>兑换数量：</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`填写 ${balance?.symbol} 数量`}
                      type="text"
                      disabled={isPendingDeposit || isConfirmingDeposit}
                      className="!ring-secondary-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="flex items-center justify-between">
                    <span>
                      你拥有 {isLoadingBalance ? <LoadingIcon /> : formatTokenAmount(balance?.value || 0n)}{' '}
                      {balance?.symbol}
                    </span>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={setMaxAmount}
                      className="text-secondary p-0 ml-2"
                      disabled={isLoadingBalance || isPendingDeposit || isConfirmingDeposit}
                    >
                      最高
                    </Button>
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* 提交按钮 */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-1/2 text-white py-2 rounded-lg"
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
            <div className="flex justify-center mb-2">
              <span className="text-sm">兑换比例：</span>
              <span className="text-secondary text-sm">
                1{balance?.symbol} = 1{process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL}
              </span>
            </div>
          </form>
        </Form>
      </div>

      <LoadingOverlay
        isLoading={isPendingDeposit || isConfirmingDeposit}
        text={isPendingDeposit ? '提交交易...' : '确认交易...'}
      />
    </>
  );
};

export default Deposit;
