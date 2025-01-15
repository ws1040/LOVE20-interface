'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';

// UI & shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// my hooks
import { checkWalletConnection } from '@/src/lib/web3';
import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { LaunchInfo } from '@/src/types/life20types';
import { useContribute, useContributed } from '@/src/hooks/contracts/useLOVE20Launch';
import { useBalanceOf, useApprove } from '@/src/hooks/contracts/useLOVE20Token';

// my context
import { Token } from '@/src/contexts/TokenContext';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

// 1. 定义带有动态验证的 FormSchema
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
          const amount = parseUnits(val);
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

  // 读取信息 hooks
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

  // 2. 初始化 React Hook Form，传入动态的 FormSchema
  const form = useForm<z.infer<ReturnType<typeof getFormSchema>>>({
    resolver: zodResolver(getFormSchema(balanceOfParentToken || 0n)),
    defaultValues: {
      contributeAmount: '',
    },
  });

  // 表单内点击“最高”时，设置最大值
  const setMaxAmount = () => {
    form.setValue('contributeAmount', formatUnits(balanceOfParentToken || 0n));
  };

  // 3. “授权”相关逻辑
  const {
    approve: approveParentToken,
    isWriting: isPendingApproveParentToken,
    isConfirming: isConfirmingApproveParentToken,
    isConfirmed: isConfirmedApproveParentToken,
    writeError: errApproveParentToken,
  } = useApprove(token?.parentTokenAddress as `0x${string}`);

  const onApprove = async (data: z.infer<ReturnType<typeof getFormSchema>>) => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    try {
      // parseUnits 用于将 string 转换为 BigInt
      const amountBigInt = parseUnits(data.contributeAmount);
      await approveParentToken(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_LAUNCH as `0x${string}`, amountBigInt);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isConfirmedApproveParentToken) {
      toast.success('授权成功');
    }
  }, [isConfirmedApproveParentToken]);

  // 4. “申购”相关逻辑
  const {
    contribute,
    isPending: isPendingContributeToken,
    isConfirming: isConfirmingContributeToken,
    isConfirmed: isConfirmedContributeToken,
    writeError: errContributeToken,
  } = useContribute();

  const onContribute = async (data: z.infer<ReturnType<typeof getFormSchema>>) => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    try {
      const amountBigInt = parseUnits(data.contributeAmount);
      await contribute(token?.address as `0x${string}`, amountBigInt, account as `0x${string}`);
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

  // 5. 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errContributeToken) {
      handleContractError(errContributeToken, 'launch');
    }
    if (contributedError) {
      handleContractError(contributedError, 'launch');
    }
    if (errApproveParentToken) {
      handleContractError(errApproveParentToken, 'token');
    }
    if (errorBalanceOfParentToken) {
      handleContractError(errorBalanceOfParentToken, 'token');
    }
  }, [errApproveParentToken, errContributeToken, errorBalanceOfParentToken, contributedError, handleContractError]);

  // 控制按钮文案
  const hasStartedApproving =
    isPendingApproveParentToken || isConfirmingApproveParentToken || isConfirmedApproveParentToken;

  if (!token) {
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
              <span className="text-greyscale-500 font-normal text-sm ml-2">{token.parentTokenSymbol}</span>
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
                      placeholder={`请填写${token.parentTokenSymbol}数量`}
                      disabled={hasStartedApproving || (balanceOfParentToken || 0n) <= 0n}
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
                {formatTokenAmount(balanceOfParentToken || 0n)} {token.parentTokenSymbol}
              </span>
              <Button
                variant="link"
                size="sm"
                onClick={setMaxAmount}
                disabled={hasStartedApproving || (balanceOfParentToken || 0n) <= 0n}
                className="text-secondary"
              >
                最高
              </Button>
              <Link href={`/launch/deposit?symbol=${token.symbol}`}>
                <Button variant="link" size="sm" className="text-secondary">
                  获取{token.parentTokenSymbol}
                </Button>
              </Link>
            </div>

            <div className="flex justify-center space-x-4">
              {/* 先授权 */}
              <Button className="w-1/2" onClick={form.handleSubmit(onApprove)} disabled={hasStartedApproving}>
                {isPendingApproveParentToken
                  ? '1.授权中...'
                  : isConfirmingApproveParentToken
                  ? '1.确认中...'
                  : isConfirmedApproveParentToken
                  ? '1.已授权'
                  : '1.授权'}
              </Button>

              {/* 再申购，需要先完成授权 */}
              <Button
                className="w-1/2 text-white py-2 rounded-lg"
                onClick={form.handleSubmit(onContribute)}
                disabled={
                  !isConfirmedApproveParentToken ||
                  isPendingContributeToken ||
                  isConfirmingContributeToken ||
                  isConfirmedContributeToken
                }
              >
                {isPendingContributeToken
                  ? '2.申购中...'
                  : isConfirmingContributeToken
                  ? '2.确认中...'
                  : isConfirmedContributeToken
                  ? '2.申购成功'
                  : '2.申购'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <LoadingOverlay
        isLoading={
          isPendingApproveParentToken ||
          isConfirmingApproveParentToken ||
          isPendingContributeToken ||
          isConfirmingContributeToken
        }
        text={isPendingApproveParentToken || isPendingContributeToken ? '提交交易...' : '确认交易...'}
      />
    </>
  );
};

export default Contribute;
