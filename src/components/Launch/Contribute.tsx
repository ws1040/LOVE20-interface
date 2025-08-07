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
import { useContribute, useContributed } from '@/src/hooks/contracts/useLOVE20Launch';
import { useContributeFirstTokenWithETH } from '@/src/hooks/contracts/useLOVE20Hub';
import { useAllowance, useBalanceOf, useApprove } from '@/src/hooks/contracts/useLOVE20Token';
import { useError } from '@/src/contexts/ErrorContext';

// my context
import { Token } from '@/src/contexts/TokenContext';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';
import { Loader2 } from 'lucide-react';

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
  const { address: account, chain: accountChain, isConnected } = useAccount();
  const router = useRouter();

  // 判断是否使用native代币申购
  const isNativeContribute = token?.parentTokenSymbol == process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL;
  const parentTokenSymbol = isNativeContribute
    ? process.env.NEXT_PUBLIC_NATIVE_TOKEN_SYMBOL
    : token?.parentTokenSymbol || '';

  // 1. 读取余额 - 根据类型选择不同的hook
  const {
    data: ethBalance,
    isLoading: isPendingETHBalance,
    error: errorETHBalance,
  } = useBalance({
    address: account,
    query: { enabled: isNativeContribute },
  });

  const {
    balance: balanceOfParentToken,
    isPending: isPendingBalanceOfParentToken,
    error: errorBalanceOfParentToken,
  } = useBalanceOf(token?.parentTokenAddress as `0x${string}`, account as `0x${string}`, !isNativeContribute);

  // 获取余额值
  const balance = isNativeContribute ? ethBalance?.value || 0n : balanceOfParentToken || 0n;
  const isPendingBalance = isNativeContribute ? isPendingETHBalance : isPendingBalanceOfParentToken;

  // 获取已申购数量
  const {
    contributed,
    isPending: isContributedPending,
    error: contributedError,
  } = useContributed(token?.address as `0x${string}`, account as `0x${string}`);

  // 2. 初始化 React Hook Form，传入动态的 FormSchema
  const form = useForm<z.infer<ReturnType<typeof getFormSchema>>>({
    resolver: zodResolver(getFormSchema(balance)),
    defaultValues: {
      contributeAmount: '',
    },
  });

  // 表单内点击"最高"时，设置最大值
  const setMaxAmount = () => {
    form.setValue('contributeAmount', formatUnits(balance));
  };

  // 3. ERC20代币授权相关逻辑（仅在非native代币时使用）
  const {
    approve: approveParentToken,
    isPending: isPendingApproveParentToken,
    isConfirming: isConfirmingApproveParentToken,
    isConfirmed: isConfirmedApproveParentToken,
    writeError: errApproveParentToken,
  } = useApprove(token?.parentTokenAddress as `0x${string}`);

  // 新增状态变量，判断是否已授权足够额度（包括之前已授权）
  const [isTokenApproved, setIsTokenApproved] = useState(false);

  // 获取已授权额度（仅在非native代币时才读取）
  const {
    allowance: allowanceParentTokenApproved,
    isPending: isPendingAllowanceParentToken,
    error: errAllowanceParentToken,
  } = useAllowance(
    token?.parentTokenAddress as `0x${string}`,
    account as `0x${string}`,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_LAUNCH as `0x${string}`,
    !isNativeContribute, // 只有在非native代币时才读取授权额度
  );

  // 授权交易确认后，设置状态
  useEffect(() => {
    if (isConfirmedApproveParentToken && !isNativeContribute) {
      setIsTokenApproved(true);
      toast.success(`授权${token?.parentTokenSymbol}成功`);
    }
  }, [isConfirmedApproveParentToken, token?.parentTokenSymbol, isNativeContribute]);

  // 根据用户输入和已授权额度，判断是否满足当前申购数额的授权
  const contributeAmount = form.watch('contributeAmount');
  useEffect(() => {
    if (isNativeContribute) {
      setIsTokenApproved(true); // native代币不需要授权
      return;
    }

    const parsedContributeToken = parseUnits(contributeAmount) ?? 0n;
    if (
      parsedContributeToken > 0n &&
      allowanceParentTokenApproved &&
      allowanceParentTokenApproved > 0n &&
      allowanceParentTokenApproved >= parsedContributeToken
    ) {
      setIsTokenApproved(true);
    } else {
      setIsTokenApproved(false);
    }
  }, [contributeAmount, allowanceParentTokenApproved, isNativeContribute]);

  const onApprove = async (data: z.infer<ReturnType<typeof getFormSchema>>) => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    try {
      // parseUnits 用于将 string 转换为 BigInt
      const amountBigInt = parseUnits(data.contributeAmount) ?? 0n;
      await approveParentToken(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_LAUNCH as `0x${string}`, amountBigInt);
    } catch (error) {
      console.error(error);
    }
  };

  // 4. "申购"相关逻辑 - 根据类型选择不同的hook
  const {
    contribute: contributeFirstTokenWithETH,
    isPending: isPendingContributeETH,
    isConfirming: isConfirmingContributeETH,
    isConfirmed: isConfirmedContributeETH,
    writeError: errContributeETH,
  } = useContributeFirstTokenWithETH();

  const {
    contribute: contributeWithToken,
    isPending: isPendingContributeToken,
    isConfirming: isConfirmingContributeToken,
    isConfirmed: isConfirmedContributeToken,
    writeError: errContributeToken,
  } = useContribute();

  // 统一的申购状态
  const isPendingContribute = isNativeContribute ? isPendingContributeETH : isPendingContributeToken;
  const isConfirmingContribute = isNativeContribute ? isConfirmingContributeETH : isConfirmingContributeToken;
  const isConfirmedContribute = isNativeContribute ? isConfirmedContributeETH : isConfirmedContributeToken;

  const onContribute = async (data: z.infer<ReturnType<typeof getFormSchema>>) => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    if (!isNativeContribute && !isTokenApproved) {
      toast.error('请先授权');
      return;
    }
    try {
      const amountBigInt = parseUnits(data.contributeAmount) ?? 0n;
      if (isNativeContribute) {
        await contributeFirstTokenWithETH(token?.address as `0x${string}`, account as `0x${string}`, amountBigInt);
      } else {
        await contributeWithToken(token?.address as `0x${string}`, amountBigInt, account as `0x${string}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isConfirmedContribute) {
      toast.success('申购成功');
      // 2秒后跳转到发射页面
      setTimeout(() => {
        router.push(`/launch?symbol=${token?.symbol}`);
      }, 2000);
    }
  }, [isConfirmedContribute, router, token?.symbol]);

  // 5. 如果余额为 0，则提示用户获取
  const { setError } = useError();
  useEffect(() => {
    if (isConnected && !isPendingBalance && balance !== undefined && balance <= 0n) {
      setError({
        name: '余额不足',
        message: `请先获取 ${parentTokenSymbol}，再来申购`,
      });
    }
  }, [balance, setError, isConnected, isPendingBalance, parentTokenSymbol]);

  // 6. 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    const contractError = isNativeContribute ? errContributeETH : errContributeToken;
    const balanceError = isNativeContribute ? errorETHBalance : errorBalanceOfParentToken;

    if (contractError) {
      handleContractError(contractError, 'launch');
    }
    if (contributedError) {
      handleContractError(contributedError, 'launch');
    }
    if (balanceError) {
      handleContractError(balanceError, isNativeContribute ? 'balance' : 'token');
    }
    if (!isNativeContribute) {
      if (errApproveParentToken) {
        handleContractError(errApproveParentToken, 'token');
      }
      if (errAllowanceParentToken) {
        handleContractError(errAllowanceParentToken, 'token');
      }
    }
  }, [
    errContributeETH,
    errContributeToken,
    contributedError,
    errorETHBalance,
    errorBalanceOfParentToken,
    errApproveParentToken,
    errAllowanceParentToken,
    handleContractError,
    isNativeContribute,
  ]);

  // 控制按钮文案，已启动授权状态
  const hasStartedApproving = isPendingApproveParentToken || isConfirmingApproveParentToken;

  // 为按钮添加 ref
  const approveButtonRef = useRef<HTMLButtonElement>(null);

  // 监听 isPendingAllowanceParentToken 变化
  useEffect(() => {
    if (!isPendingAllowanceParentToken && approveButtonRef.current) {
      approveButtonRef.current.blur();
    }
  }, [isPendingAllowanceParentToken]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center p-4 mt-4">
        <div className="text-center mb-4 text-greyscale-500">没有链接钱包，请先连接钱包</div>
      </div>
    );
  }

  if (!token || isPendingBalance || isContributedPending) {
    return <LoadingIcon />;
  }

  return (
    <>
      <div className="px-4 mt-2">
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
                      disabled={(!isNativeContribute && hasStartedApproving) || balance <= 0n}
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
                {formatTokenAmount(balance)} {parentTokenSymbol}
              </span>
              <Button
                variant="link"
                size="sm"
                onClick={setMaxAmount}
                disabled={(!isNativeContribute && hasStartedApproving) || balance <= 0n}
                className="text-secondary"
              >
                全部
              </Button>
              {!isNativeContribute &&
                token?.parentTokenSymbol === process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL && (
                  <Link href={`/dex/deposit?symbol=${token.symbol}`}>
                    <Button variant="link" size="sm" className="text-secondary">
                      获取{token.parentTokenSymbol}
                    </Button>
                  </Link>
                )}
            </div>

            <div className="flex justify-center">
              {isNativeContribute ? (
                // Native代币申购，只需要一个按钮
                <Button
                  className="w-full text-white py-2 rounded-lg"
                  onClick={form.handleSubmit(onContribute)}
                  disabled={isPendingContribute || isConfirmingContribute || isConfirmedContribute || balance <= 0n}
                >
                  {isPendingContribute
                    ? '申购中...'
                    : isConfirmingContribute
                    ? '确认中...'
                    : isConfirmedContribute
                    ? '申购成功'
                    : '申购'}
                </Button>
              ) : (
                // ERC20代币申购，需要授权和申购两个按钮
                <div className="flex space-x-4 w-full">
                  <Button
                    ref={approveButtonRef}
                    className="w-1/2"
                    onClick={form.handleSubmit(onApprove)}
                    disabled={
                      isPendingAllowanceParentToken ||
                      isPendingApproveParentToken ||
                      isConfirmingApproveParentToken ||
                      isTokenApproved
                    }
                  >
                    {isPendingAllowanceParentToken ? (
                      <Loader2 className="animate-spin" />
                    ) : isPendingApproveParentToken ? (
                      '1.提交中...'
                    ) : isConfirmingApproveParentToken ? (
                      '1.确认中...'
                    ) : isTokenApproved ? (
                      `1.${token?.parentTokenSymbol}已授权`
                    ) : (
                      `1.授权${token?.parentTokenSymbol}`
                    )}
                  </Button>

                  <Button
                    className="w-1/2 text-white py-2 rounded-lg"
                    onClick={form.handleSubmit(onContribute)}
                    disabled={
                      !isTokenApproved || isPendingContribute || isConfirmingContribute || isConfirmedContribute
                    }
                  >
                    {isPendingContribute
                      ? '2.申购中...'
                      : isConfirmingContribute
                      ? '2.确认中...'
                      : isConfirmedContribute
                      ? '2.申购成功'
                      : '2.申购'}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>

      <LoadingOverlay
        isLoading={
          isPendingContribute ||
          isConfirmingContribute ||
          (!isNativeContribute && (isPendingApproveParentToken || isConfirmingApproveParentToken))
        }
        text={
          isPendingContribute || (!isNativeContribute && isPendingApproveParentToken) ? '提交交易...' : '确认交易...'
        }
      />
    </>
  );
};

export default Contribute;
