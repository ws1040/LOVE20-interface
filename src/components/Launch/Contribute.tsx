'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

import { useAccount, useBalance } from 'wagmi';
import { toast } from 'react-hot-toast';

// UI & shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// my hooks
import { checkWalletConnection } from '@/src/lib/web3';
import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { LaunchInfo } from '@/src/types/love20types';
import { useContributed } from '@/src/hooks/contracts/useLOVE20Launch';
import { useContributeWithETH } from '@/src/hooks/contracts/useLOVE20Hub';
import { useError } from '@/src/contexts/ErrorContext';

// my context
import { Token } from '@/src/contexts/TokenContext';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

// 定义带有动态验证的 FormSchema
const getFormSchema = (balance: bigint) =>
  z.object({
    contributeAmount: z
      .string()
      .nonempty({ message: '请输入申购数量' })
      .refine((val) => Number(val) > 0, {
        message: '申购数量不能为 0',
      })
      .refine(
        (val) => {
          const amount = parseUnits(val) ?? 0n;
          return amount <= balance;
        },
        {
          message: `申购数量不能超过余额 (${formatUnits(balance)})`,
        },
      ),
  });

const Contribute: React.FC<{ token: Token | null | undefined; launchInfo: LaunchInfo }> = ({ token, launchInfo }) => {
  const { address: account, chain: accountChain } = useAccount();
  const router = useRouter();

  // 1. 读取ETH余额
  const {
    data: ethBalance,
    isLoading: isPendingETHBalance,
    error: errorETHBalance,
  } = useBalance({
    address: account,
  });

  const parentTokenSymbol =
    token?.parentTokenSymbol == process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL
      ? process.env.NEXT_PUBLIC_NATIVE_TOKEN_SYMBOL
      : token?.parentTokenSymbol || '';

  const {
    contributed,
    isPending: isContributedPending,
    error: contributedError,
  } = useContributed(token?.address as `0x${string}`, account as `0x${string}`);

  // 2. 初始化 React Hook Form，传入动态的 FormSchema
  const ethBalanceValue = ethBalance?.value || 0n;
  const form = useForm<z.infer<ReturnType<typeof getFormSchema>>>({
    resolver: zodResolver(getFormSchema(ethBalanceValue)),
    defaultValues: {
      contributeAmount: '',
    },
  });
  // 表单内点击"最高"时，设置最大值
  const setMaxAmount = () => {
    form.setValue('contributeAmount', formatUnits(ethBalanceValue));
  };

  // 3. "申购"相关逻辑
  const {
    contribute,
    isWriting: isPendingContributeToken,
    isConfirming: isConfirmingContributeToken,
    isConfirmed: isConfirmedContributeToken,
    writeError: errContributeToken,
  } = useContributeWithETH();

  const onContribute = async (data: z.infer<ReturnType<typeof getFormSchema>>) => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    try {
      const amountBigInt = parseUnits(data.contributeAmount) ?? 0n;
      await contribute(token?.address as `0x${string}`, account as `0x${string}`, amountBigInt);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isConfirmedContributeToken) {
      toast.success('申购成功');
      // 2秒后跳转到发射页面
      setTimeout(() => {
        router.push(`/launch?symbol=${token?.symbol}`);
      }, 2000);
    }
  }, [isConfirmedContributeToken, router, token?.symbol]);

  // 4. 如果 ETH 余额为 0，则提示用户获取
  const { setError } = useError();
  useEffect(() => {
    if (!isPendingETHBalance && ethBalanceValue !== undefined && ethBalanceValue <= 0n) {
      setError({
        name: '余额不足',
        message: `请先获取 ${parentTokenSymbol}，再来申购`,
      });
    }
  }, [ethBalanceValue, setError]);

  // 5. 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errContributeToken) {
      handleContractError(errContributeToken, 'launch');
    }
    if (contributedError) {
      handleContractError(contributedError, 'launch');
    }
    if (errorETHBalance) {
      handleContractError(errorETHBalance, 'balance');
    }
  }, [errContributeToken, contributedError, errorETHBalance, handleContractError]);

  if (!token || isPendingETHBalance || isContributedPending) {
    return <LoadingIcon />;
  }

  return (
    <>
      <div className="p-6">
        <LeftTitle title="参与申购" />
        <div className="stats w-full">
          <div className="stat place-items-center">
            <div className="stat-title text-sm mr-6">我已申购质押</div>
            <div className="stat-value text-secondary">
              {formatTokenAmount(contributed || 0n)}
              <span className="text-greyscale-500 font-normal text-sm ml-2">{parentTokenSymbol}</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <FormField
              control={form.control}
              name="contributeAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>申购数量：</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`请填写${parentTokenSymbol}数量`}
                      disabled={ethBalanceValue <= 0n}
                      className="!ring-secondary-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center text-sm mb-4">
              <span className="text-greyscale-400">
                {formatTokenAmount(ethBalanceValue)} {parentTokenSymbol}
              </span>
              <Button
                variant="link"
                size="sm"
                onClick={setMaxAmount}
                disabled={ethBalanceValue <= 0n}
                className="text-secondary"
              >
                全部
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                className="w-full text-white py-2 rounded-lg"
                onClick={form.handleSubmit(onContribute)}
                disabled={
                  isPendingContributeToken ||
                  isConfirmingContributeToken ||
                  isConfirmedContributeToken ||
                  ethBalanceValue <= 0n
                }
              >
                {isPendingContributeToken
                  ? '申购中...'
                  : isConfirmingContributeToken
                  ? '确认中...'
                  : isConfirmedContributeToken
                  ? '申购成功'
                  : '申购'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <LoadingOverlay
        isLoading={isPendingContributeToken || isConfirmingContributeToken}
        text={isPendingContributeToken ? '提交交易...' : '确认交易...'}
      />
    </>
  );
};

export default Contribute;
