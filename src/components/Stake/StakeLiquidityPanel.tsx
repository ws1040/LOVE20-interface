'use client';

import { useContext, useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

// my utils
import { checkWalletConnection } from '@/src/lib/web3';
import { extractErrorMessage } from '@/src/lib/utils';
import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';

// my contexts
import { TokenContext, Token } from '@/src/contexts/TokenContext';
import { useError } from '@/src/contexts/ErrorContext';

// my hooks
import { useAllowance, useApprove, useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
import { useGetAmountsIn, useGetAmountsOut } from '@/src/components/Stake/getAmountHooks';
import { useAccountStakeStatus, useStakeLiquidity, useInitialStakeRound } from '@/src/hooks/contracts/useLOVE20Stake';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

// --------------------------------------------------
// 1. 定义校验规则 (zod schema)
// --------------------------------------------------
/**
 * 注意：
 *  - 使用 regex 校验输入格式必须是数值，且小数位数 <= 12
 *  - 使用 refine 分别校验不能为 0，不能大于对应余额
 */
function buildFormSchema(parentTokenBalance: bigint, tokenBalance: bigint) {
  return z.object({
    parentToken: z.preprocess(
      (val) => {
        if (typeof val !== 'string') return val;
        let sanitized = val.replace(/。/g, '.');
        if (sanitized.startsWith('.')) {
          sanitized = '0' + sanitized;
        }
        return sanitized;
      },
      z
        .string()
        .regex(/^\d+(\.\d{1,12})?$/, '请输入合法数值，最多支持12位小数')
        .refine((val) => {
          const parsed = parseUnits(val);
          return parsed !== null && parsed > 0n;
        }, '质押父币数不能为 0')
        .refine((val) => {
          const parsed = parseUnits(val);
          return parsed !== null && parsed <= parentTokenBalance;
        }, '质押父币数不能超过当前持有'),
    ),

    stakeToken: z.preprocess(
      (val) => {
        if (typeof val !== 'string') return val;
        let sanitized = val.replace(/。/g, '.');
        if (sanitized.startsWith('.')) {
          sanitized = '0' + sanitized;
        }
        return sanitized;
      },
      z
        .string()
        .regex(/^\d+(\.\d{1,12})?$/, '请输入合法数值，最多支持12位小数')
        .refine((val) => {
          const parsed = parseUnits(val);
          return parsed !== null && parsed > 0n;
        }, '质押 token 数不能为 0')
        .refine((val) => {
          const parsed = parseUnits(val);
          return parsed !== null && parsed <= tokenBalance;
        }, '质押 token 数不能超过当前持有'),
    ),

    // 释放期可直接用 string，也可用 z.coerce.number() 转 number
    releasePeriod: z.string(),
  });
}

// --------------------------------------------------
// 2. 组件主体
// --------------------------------------------------
interface StakeLiquidityPanelProps {
  stakedTokenAmountOfLP: bigint;
}

const StakeLiquidityPanel: React.FC<StakeLiquidityPanelProps> = ({ stakedTokenAmountOfLP }) => {
  const { address: accountAddress, chain: accountChain } = useAccount();
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('TokenContext 必须在 TokenProvider 内使用');
  }
  const { token, setToken } = context;
  const { setError } = useError();
  const { first: isFirstTimeStake } = useRouter().query;
  const {
    balance: tokenBalance,
    isPending: isPendingTokenBalance,
    error: errorTokenBalance,
  } = useBalanceOf(token?.address as `0x${string}`, accountAddress as `0x${string}`);
  const {
    balance: parentTokenBalance,
    isPending: isPendingParentTokenBalance,
    error: errorParentTokenBalance,
  } = useBalanceOf(token?.parentTokenAddress as `0x${string}`, accountAddress as `0x${string}`);

  // 是否是首次质押
  const [updateInitialStakeRound, setUpdateInitialStakeRound] = useState(false);
  const {
    initialStakeRound,
    isPending: isPendingInitialStakeRound,
    error: errInitialStakeRound,
  } = useInitialStakeRound(token?.address as `0x${string}`, updateInitialStakeRound);

  // --------------------------------------------------
  // 2.0 使用 React Hook Form
  // --------------------------------------------------
  const form = useForm<z.infer<ReturnType<typeof buildFormSchema>>>({
    resolver: zodResolver(buildFormSchema(parentTokenBalance || 0n, tokenBalance || 0n)),
    defaultValues: {
      parentToken: '',
      stakeToken: '',
      releasePeriod: '4',
    },
    mode: 'onChange',
  });

  // --------------------------------------------------
  // 2.1 获取质押状态
  // --------------------------------------------------
  const {
    slAmount,
    stAmount,
    promisedWaitingRounds,
    requestedUnstakeRound,
    govVotes,
    isPending: isPendingAccountStakeStatus,
    error: errAccountStakeStatus,
  } = useAccountStakeStatus(token?.address as `0x${string}`, accountAddress as `0x${string}`);

  // --------------------------------------------------
  // 2.2 授权逻辑
  // --------------------------------------------------
  const [isTokenApproved, setIsTokenApproved] = useState(false);
  const [isParentTokenApproved, setIsParentTokenApproved] = useState(false);

  const {
    allowance: allowanceToken,
    isPending: isPendingAllowanceToken,
    error: errAllowanceToken,
  } = useAllowance(
    token?.address as `0x${string}`,
    accountAddress as `0x${string}`,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`,
  );

  const {
    allowance: allowanceParentToken,
    isPending: isPendingAllowanceParentToken,
    error: errAllowanceParentToken,
  } = useAllowance(
    token?.parentTokenAddress as `0x${string}`,
    accountAddress as `0x${string}`,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`,
  );

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

  async function onApproveToken(data: z.infer<ReturnType<typeof buildFormSchema>>) {
    if (!checkWalletConnection(accountChain)) return;
    try {
      const stakeAmount = parseUnits(data.stakeToken);
      if (stakeAmount === null) throw new Error('无效的输入格式');
      await approveToken(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`, stakeAmount);
    } catch (error) {
      console.error('Token 授权失败', error);
      toast.error('token 授权失败，请检查输入格式');
    }
  }

  async function onApproveParentToken(data: z.infer<ReturnType<typeof buildFormSchema>>) {
    if (!checkWalletConnection(accountChain)) return;
    try {
      const parentAmount = parseUnits(data.parentToken);
      if (parentAmount === null) throw new Error('无效的输入格式');
      await approveParentToken(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`, parentAmount);
    } catch (error) {
      console.error('父币授权失败', error);
      toast.error('父币授权失败，请检查输入格式');
    }
  }

  useEffect(() => {
    if (isConfirmedApproveToken) {
      setIsTokenApproved(true);
      toast.success(`授权${token?.symbol}成功`);
    }
    if (isConfirmedApproveParentToken) {
      setIsParentTokenApproved(true);
      toast.success(`授权${token?.parentTokenSymbol}成功`);
    }
  }, [isConfirmedApproveToken, isConfirmedApproveParentToken]);

  // --------------------------------------------------
  // 2.3 自动计算兑换数量
  // --------------------------------------------------
  // 为了兼容"自动计算"逻辑，保留以下两个标记
  const [isParentTokenChangedByUser, setIsParentTokenChangedByUser] = useState(false);
  const [isTokenChangedByUser, setIsTokenChangedByUser] = useState(false);

  const pairExists = stakedTokenAmountOfLP > 0n;
  const parentTokenValue = form.watch('parentToken');
  const stakeTokenValue = form.watch('stakeToken');
  const parsedParentToken = parseUnits(parentTokenValue);
  const parsedStakeToken = parseUnits(stakeTokenValue);

  const {
    data: amountsOut,
    error: errAmountsOut,
    isLoading: isAmountsOutLoading,
  } = useGetAmountsOut(
    parsedParentToken !== null ? parsedParentToken : 0n,
    [token?.parentTokenAddress as `0x${string}`, token?.address as `0x${string}`],
    token as Token,
    pairExists,
    isParentTokenChangedByUser,
  );

  const {
    data: amountsIn,
    error: errAmountsIn,
    isLoading: isAmountsInLoading,
  } = useGetAmountsIn(
    parsedStakeToken !== null ? parsedStakeToken : 0n,
    [token?.parentTokenAddress as `0x${string}`, token?.address as `0x${string}`],
    token as Token,
    pairExists,
    isTokenChangedByUser,
  );

  // 如果输入了 parentToken，就自动计算 stakeToken
  useEffect(() => {
    if (amountsOut && amountsOut.length > 1) {
      const amountOut = formatUnits(BigInt(amountsOut[1]));
      const amountOutShow = Number(amountOut)
        .toFixed(12)
        .replace(/\.?0+$/, '');
      form.setValue('stakeToken', amountOutShow);
      setIsParentTokenChangedByUser(false);
      setIsTokenChangedByUser(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountsOut]);

  // 如果输入了 stakeToken，就自动计算 parentToken
  useEffect(() => {
    if (amountsIn && amountsIn.length > 1) {
      const amountIn = formatUnits(BigInt(amountsIn[0]));
      const amountInShow = Number(amountIn)
        .toFixed(12)
        .replace(/\.?0+$/, '');
      form.setValue('parentToken', amountInShow);
      setIsParentTokenChangedByUser(false);
      setIsTokenChangedByUser(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountsIn]);

  useEffect(() => {
    if (
      parsedParentToken > 0n &&
      allowanceParentToken &&
      allowanceParentToken > 0n &&
      allowanceParentToken >= parsedParentToken
    ) {
      setIsParentTokenApproved(true);
    } else {
      setIsParentTokenApproved(false);
    }
  }, [parsedParentToken, isPendingAllowanceParentToken]);

  useEffect(() => {
    if (parsedStakeToken > 0n && allowanceToken && allowanceToken > 0n && allowanceToken >= parsedStakeToken) {
      setIsTokenApproved(true);
    } else {
      setIsTokenApproved(false);
    }
  }, [parsedStakeToken, isPendingAllowanceToken]);

  // --------------------------------------------------
  // 2.4 质押逻辑
  // --------------------------------------------------
  const {
    stakeLiquidity,
    isWriting: isPendingStakeLiquidity,
    isConfirming: isConfirmingStakeLiquidity,
    isConfirmed: isConfirmedStakeLiquidity,
    writeError: errStakeLiquidity,
  } = useStakeLiquidity();

  async function onStake(data: z.infer<ReturnType<typeof buildFormSchema>>) {
    // 先检查钱包
    if (!checkWalletConnection(accountChain)) {
      return;
    }

    // 必须已完成授权
    const bothApproved = isTokenApproved && isParentTokenApproved;
    if (!bothApproved) {
      toast.error('请先完成授权');
      return;
    }

    const stakeAmount = parseUnits(data.stakeToken);
    const parentAmount = parseUnits(data.parentToken);
    if (stakeAmount === null || parentAmount === null) {
      toast.error('转换金额时出错，请检查输入格式');
      return;
    }

    stakeLiquidity(
      token?.address as `0x${string}`,
      stakeAmount,
      parentAmount,
      BigInt(data.releasePeriod), // releasePeriod 是 string
      accountAddress as `0x${string}`,
    ).catch((error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage || '质押失败，请重试');
      console.error('Stake failed', error);
    });
  }

  // 质押成功后，可能需要更新首次质押轮数
  function handleStakeSuccess() {
    toast.success('质押成功');
    setTimeout(() => {
      // 跳转到治理首页
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/gov/?symbol=${token?.symbol}`;
    }, 2000);
  }

  useEffect(() => {
    if (isConfirmedStakeLiquidity) {
      if (token?.initialStakeRound && token.initialStakeRound > 0) {
        // 本次质押非首次
        handleStakeSuccess();
      } else {
        // 本次质押是首次，则更新 token 的 initialStakeRound
        setUpdateInitialStakeRound(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedStakeLiquidity]);

  // 如果是首次质押，需要在拿到新的 initialStakeRound 后再次跳转
  useEffect(() => {
    if (updateInitialStakeRound && !isPendingInitialStakeRound && initialStakeRound && initialStakeRound > 0) {
      setToken({ ...token, initialStakeRound: Number(initialStakeRound) } as Token);
      handleStakeSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateInitialStakeRound, isPendingInitialStakeRound, initialStakeRound]);

  // --------------------------------------------------
  // 2.5 错误处理
  // --------------------------------------------------
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorParentTokenBalance) {
      handleContractError(errorParentTokenBalance, 'token');
    }
    if (errorTokenBalance) {
      handleContractError(errorTokenBalance, 'token');
    }
    if (errAllowanceParentToken) {
      handleContractError(errAllowanceParentToken, 'token');
    }
    if (errAllowanceToken) {
      handleContractError(errAllowanceToken, 'token');
    }
    if (errApproveToken) {
      handleContractError(errApproveToken, 'stake');
    }
    if (errApproveParentToken) {
      handleContractError(errApproveParentToken, 'stake');
    }
    if (errStakeLiquidity) {
      handleContractError(errStakeLiquidity, 'stake');
    }
    if (errInitialStakeRound) {
      handleContractError(errInitialStakeRound, 'stake');
    }
    if (errAmountsOut) {
      handleContractError(errAmountsOut, 'uniswap');
    }
    if (errAmountsIn) {
      handleContractError(errAmountsIn, 'uniswap');
    }
    if (errAccountStakeStatus) {
      handleContractError(errAccountStakeStatus, 'stake');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    errorParentTokenBalance,
    errorTokenBalance,
    errAllowanceParentToken,
    errAllowanceToken,
    errApproveToken,
    errApproveParentToken,
    errStakeLiquidity,
    errInitialStakeRound,
    errAmountsOut,
    errAmountsIn,
    errAccountStakeStatus,
  ]);

  // --------------------------------------------------
  // 2.6 其它状态与提示
  // --------------------------------------------------
  const isApproving = isPendingApproveToken || isPendingApproveParentToken;
  const isApproveConfirming = isConfirmingApproveToken || isConfirmingApproveParentToken;
  const hadStartedApprove = isApproving || isApproveConfirming || (isTokenApproved && isParentTokenApproved);

  useEffect(() => {
    if (isFirstTimeStake === 'true' && !hadStartedApprove) {
      setError({
        name: '提示：',
        message: '新部署的代币，需先质押获取治理票，才能后续操作',
      });
    }
  }, [isFirstTimeStake, hadStartedApprove, setError]);
  // 检查token数量
  useEffect(() => {
    if (!isPendingTokenBalance && !tokenBalance && !hadStartedApprove && token && token.symbol) {
      setError({
        name: '余额不足',
        message: `您当前${token.symbol}数量为0，请先获取${token.symbol}`,
      });
    }
    if (!isPendingParentTokenBalance && !parentTokenBalance && !hadStartedApprove && token && token.parentTokenSymbol) {
      setError({
        name: '余额不足',
        message: `您当前${token.parentTokenSymbol}数量为0，请先获取${token.parentTokenSymbol}`,
      });
    }
  }, [tokenBalance, parentTokenBalance, token]);

  // --------------------------------------------------
  // 2.7 渲染
  // --------------------------------------------------
  useEffect(() => {
    // 确保 promisedWaitingRounds 有效，再设置初始值（注意转换为 string）
    if (promisedWaitingRounds !== undefined && promisedWaitingRounds > 0) {
      form.setValue('releasePeriod', String(promisedWaitingRounds));
    }
  }, [promisedWaitingRounds]);

  // 针对授权 token 按钮，添加 ref 及其状态保存，用于检测 isPendingAllowanceToken 的状态变化
  const approveTokenButtonRef = useRef<HTMLButtonElement>(null);
  const prevIsPendingAllowanceToken = useRef<boolean>(isPendingAllowanceToken);

  useEffect(() => {
    // 当上一次的状态为 true，而当前为 false，则执行 blur()
    if (prevIsPendingAllowanceToken.current && !isPendingAllowanceToken) {
      approveTokenButtonRef.current?.blur();
    }
    prevIsPendingAllowanceToken.current = isPendingAllowanceToken;
  }, [isPendingAllowanceToken]);

  // 如果质押状态正在加载，则显示 loading
  if (isPendingAccountStakeStatus) {
    return <LoadingIcon />;
  }

  return (
    <div className="w-full flex-col items-center p-6 mt-1">
      <div className="w-full flex justify-between items-center">
        <LeftTitle title="质押获取治理票" />
      </div>

      {/* 
        用 Form 包裹，然后在 <form> 上使用 form.handleSubmit(...) 
        本例中，因为"授权"和"质押"是两步，所以我们分别对按钮做 handleSubmit 
      */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onStake)} // 如果想把"质押"改成 <button type="submit">
          className="w-full max-w-md mt-4 space-y-4"
        >
          {/* 质押父币数 */}
          <FormField
            control={form.control}
            name="parentToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  质押父币数 (当前持有：
                  <span className="text-secondary-400 mr-2">{formatTokenAmount(parentTokenBalance || 0n)}</span>
                  {token?.parentTokenSymbol})
                  <Link href="/launch/deposit/" className="text-secondary-400 ml-2">
                    去获取{token?.parentTokenSymbol}
                  </Link>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`输入 ${token?.parentTokenSymbol} 数量`}
                    {...field}
                    disabled={hadStartedApprove}
                    onChange={(e) => {
                      // 同时触发 React Hook Form 的更新 & 原先逻辑
                      field.onChange(e);
                      setIsParentTokenChangedByUser(true);
                    }}
                    className="!ring-secondary-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 质押 token 数 */}
          <FormField
            control={form.control}
            name="stakeToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  质押 token 数 (当前持有：
                  <span className="text-secondary-400 mr-2">{formatTokenAmount(tokenBalance || 0n)}</span>
                  {token?.symbol})
                  {!!tokenBalance && tokenBalance <= 10n && (
                    <Link href="/dex/swap/" className="text-secondary-400 ml-2">
                      去获取{token?.symbol}
                    </Link>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`输入 ${token?.symbol} 数量`}
                    {...field}
                    disabled={hadStartedApprove}
                    onChange={(e) => {
                      field.onChange(e);
                      setIsTokenChangedByUser(true);
                    }}
                    className="!ring-secondary-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 释放期 */}
          <FormField
            control={form.control}
            name="releasePeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>释放期</FormLabel>
                <FormControl>
                  <Select
                    disabled={hadStartedApprove}
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full !ring-secondary-foreground">
                      <SelectValue placeholder="选择释放期" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 9 }, (_, i) => i + 4)
                        .filter((item) => item >= promisedWaitingRounds)
                        .map((item) => (
                          <SelectItem key={item} value={String(item)}>
                            {item}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>释放期：申请解锁后，几轮之后可以领取。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 两个按钮：授权 + 质押 */}
          <div className="flex justify-center space-x-2 mt-4">
            {/* 修改后的授权 token 按钮 */}
            <Button
              type="button"
              className="w-1/3"
              ref={approveTokenButtonRef}
              disabled={isPendingAllowanceToken || isPendingApproveToken || isConfirmingApproveToken || isTokenApproved}
              onClick={form.handleSubmit(onApproveToken)}
            >
              {isPendingAllowanceToken ? (
                <Loader2 className="animate-spin" />
              ) : isPendingApproveToken ? (
                `1.提交中...`
              ) : isConfirmingApproveToken ? (
                `1.确认中...`
              ) : isTokenApproved ? (
                `1.${token?.symbol}已授权`
              ) : (
                `1.授权${token?.symbol}`
              )}
            </Button>

            {/* 授权 父币 的按钮 */}
            <Button
              type="button"
              className="w-1/3"
              disabled={
                !isTokenApproved ||
                isPendingAllowanceParentToken ||
                isPendingApproveParentToken ||
                isConfirmingApproveParentToken ||
                isParentTokenApproved
              }
              onClick={form.handleSubmit(onApproveParentToken)}
            >
              {isPendingAllowanceParentToken ? (
                <Loader2 className="animate-spin" />
              ) : isPendingApproveParentToken ? (
                `2.提交中...`
              ) : isConfirmingApproveParentToken ? (
                `2.确认中...`
              ) : isParentTokenApproved ? (
                `2.${token?.parentTokenSymbol}已授权`
              ) : (
                `2.授权${token?.parentTokenSymbol}`
              )}
            </Button>

            <Button
              type="submit"
              className="w-1/3"
              disabled={
                !isTokenApproved ||
                !isParentTokenApproved ||
                isPendingStakeLiquidity ||
                isConfirmingStakeLiquidity ||
                isConfirmedStakeLiquidity
              }
            >
              {isPendingStakeLiquidity
                ? '3.质押中...'
                : isConfirmingStakeLiquidity
                ? '3.确认中...'
                : isConfirmedStakeLiquidity
                ? '3.已质押'
                : '3.质押'}
            </Button>
          </div>
        </form>
      </Form>

      {/* 全局 Loading */}
      <LoadingOverlay
        isLoading={
          isApproving ||
          isApproveConfirming ||
          isPendingStakeLiquidity ||
          isConfirmingStakeLiquidity ||
          (isPendingInitialStakeRound && updateInitialStakeRound)
        }
        text={isApproving || isPendingStakeLiquidity ? '提交交易...' : '确认交易...'}
      />
    </div>
  );
};

export default StakeLiquidityPanel;
