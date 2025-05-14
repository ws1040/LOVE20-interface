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
import Link from 'next/link';

// my utils
import { checkWalletConnection } from '@/src/lib/web3';
import { extractErrorMessage } from '@/src/lib/utils';
import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';

// my contexts
import { TokenContext, Token } from '@/src/contexts/TokenContext';
import { useError } from '@/src/contexts/ErrorContext';

// my hooks
import { useApprove } from '@/src/hooks/contracts/useLOVE20Token';
import { useTokenPairInfoWithAccount } from '@/src/hooks/contracts/useLOVE20DataViewer';
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
interface StakeLiquidityPanelProps {}

const StakeLiquidityPanel: React.FC<StakeLiquidityPanelProps> = ({}) => {
  const { address: accountAddress, chain: accountChain } = useAccount();
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('TokenContext 必须在 TokenProvider 内使用');
  }
  const { token, setToken, clearToken } = context;
  const { setError } = useError();
  const { first: isFirstTimeStake } = useRouter().query;

  // 获取 pairInfo
  const {
    pairInfo,
    isPending: isPendingPair,
    error: errorPair,
  } = useTokenPairInfoWithAccount(
    accountAddress as `0x${string}`,
    token?.address as `0x${string}`,
    token?.parentTokenAddress as `0x${string}`,
  );

  // 从 pairInfo 中读取余额及授权额度
  const tokenBalance = pairInfo?.balanceOfToken ?? 0n;
  const parentTokenBalance = pairInfo?.balanceOfParentToken ?? 0n;
  const allowanceToken = pairInfo?.allowanceOfToken ?? 0n;
  const allowanceParentToken = pairInfo?.allowanceOfParentToken ?? 0n;

  // 判断 pairReserve 是否有效
  const pairExists = pairInfo && pairInfo.pairReserveToken > 0n && pairInfo.pairReserveParentToken > 0n;

  // 是否是首次质押
  const [updatedInitialStakeRound, setUpdatedInitialStakeRound] = useState(false);

  // 获取首次质押轮数
  const {
    initialStakeRound,
    isPending: isPendingInitialStakeRound,
    error: errInitialStakeRound,
  } = useInitialStakeRound(token?.address as `0x${string}`);

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
    govVotes,
    promisedWaitingPhases,
    isPending: isPendingAccountStakeStatus,
    error: errAccountStakeStatus,
  } = useAccountStakeStatus(token?.address as `0x${string}`, accountAddress as `0x${string}`);

  // --------------------------------------------------
  // 2.2 授权逻辑，使用 useApprove 保持不变
  // --------------------------------------------------
  const [isTokenApproved, setIsTokenApproved] = useState(false);
  const [isParentTokenApproved, setIsParentTokenApproved] = useState(false);

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
  }, [isConfirmedApproveToken]);

  useEffect(() => {
    if (isConfirmedApproveParentToken) {
      setIsParentTokenApproved(true);
      toast.success(`授权${token?.parentTokenSymbol}成功`);
    }
  }, [isConfirmedApproveParentToken]);

  // --------------------------------------------------
  // 2.3 自动计算兑换数量，利用 pairReserve 进行计算
  // --------------------------------------------------
  // 标记是否由用户手动输入，目的是区分"自动计算"与手动输入
  const [isParentTokenChangedByUser, setIsParentTokenChangedByUser] = useState(false);
  const [isTokenChangedByUser, setIsTokenChangedByUser] = useState(false);

  const parentTokenValue = form.watch('parentToken');
  const stakeTokenValue = form.watch('stakeToken');
  const parsedParentToken = parseUnits(parentTokenValue);
  const parsedStakeToken = parseUnits(stakeTokenValue);

  // 当用户修改父币时，根据 pairReserve 计算 token 数量
  useEffect(() => {
    if (pairExists && isParentTokenChangedByUser) {
      if (parsedParentToken !== null && parsedParentToken > 0n) {
        const computedStakeToken = (parsedParentToken * pairInfo!.pairReserveToken) / pairInfo!.pairReserveParentToken;
        const computedStakeTokenStr = Number(formatUnits(computedStakeToken))
          .toFixed(12)
          .replace(/\.?0+$/, '');
        form.setValue('stakeToken', computedStakeTokenStr);
        setIsParentTokenChangedByUser(false);
        setIsTokenChangedByUser(false);
      }
    }
  }, [pairExists, isParentTokenChangedByUser, parsedParentToken, pairInfo, form]);

  // 当用户修改 token 时，根据 pairReserve 计算父币数量
  useEffect(() => {
    if (pairExists && isTokenChangedByUser) {
      if (parsedStakeToken !== null && parsedStakeToken > 0n) {
        const computedParentToken = (parsedStakeToken * pairInfo!.pairReserveParentToken) / pairInfo!.pairReserveToken;
        const computedParentTokenStr = Number(formatUnits(computedParentToken))
          .toFixed(12)
          .replace(/\.?0+$/, '');
        form.setValue('parentToken', computedParentTokenStr);
        setIsParentTokenChangedByUser(false);
        setIsTokenChangedByUser(false);
      }
    }
  }, [pairExists, isTokenChangedByUser, parsedStakeToken, pairInfo, form]);

  // 根据 pairInfo 中的授权额度判断授权状态
  useEffect(() => {
    if (parsedParentToken > 0n && allowanceParentToken >= parsedParentToken) {
      setIsParentTokenApproved(true);
    } else {
      setIsParentTokenApproved(false);
    }
  }, [parsedParentToken, allowanceParentToken]);

  useEffect(() => {
    if (parsedStakeToken > 0n && allowanceToken >= parsedStakeToken) {
      setIsTokenApproved(true);
    } else {
      setIsTokenApproved(false);
    }
  }, [parsedStakeToken, allowanceToken]);

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
      BigInt(data.releasePeriod),
      accountAddress as `0x${string}`,
    ).catch((error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage || '质押失败，请重试');
      console.error('Stake failed', error);
    });
  }

  function handleStakeSuccess() {
    toast.success('质押成功');
    setTimeout(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/my/?symbol=${token?.symbol}`;
    }, 2000);
  }

  useEffect(() => {
    if (isConfirmedStakeLiquidity) {
      if (token?.initialStakeRound && token.initialStakeRound > 0) {
        handleStakeSuccess();
      } else {
        setUpdatedInitialStakeRound(true);
      }
    }
  }, [isConfirmedStakeLiquidity]);

  useEffect(() => {
    if (updatedInitialStakeRound && !isPendingInitialStakeRound) {
      if (!initialStakeRound) {
        clearToken(); // 清除token缓存，下一页重新加载
      }
      handleStakeSuccess();
    }
  }, [updatedInitialStakeRound, isPendingInitialStakeRound]);

  // 更新token缓存：已经有人质押了，所以要更新 token.initialStakeRound
  useEffect(() => {
    if (token && token.initialStakeRound == 0 && initialStakeRound && initialStakeRound > 0) {
      setToken({ ...token, initialStakeRound: Number(initialStakeRound) });
    }
  }, [token, initialStakeRound]);

  // --------------------------------------------------
  // 2.5 错误处理
  // --------------------------------------------------
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorPair) {
      handleContractError(errorPair, 'token');
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
    if (errAccountStakeStatus) {
      handleContractError(errAccountStakeStatus, 'stake');
    }
  }, [
    errorPair,
    errApproveToken,
    errApproveParentToken,
    errStakeLiquidity,
    errInitialStakeRound,
    errAccountStakeStatus,
  ]);

  // --------------------------------------------------
  // 2.6 其它状态与提示
  // --------------------------------------------------
  const isApproving = isPendingApproveToken || isPendingApproveParentToken;
  const isApproveConfirming = isConfirmingApproveToken || isConfirmingApproveParentToken;
  const hadStartedApprove = isApproving || isApproveConfirming || (isTokenApproved && isParentTokenApproved);

  useEffect(() => {
    if (token && isFirstTimeStake === 'true' && !isPendingInitialStakeRound && !initialStakeRound) {
      setError({
        name: '提示：',
        message: '新部署的代币，需先质押获取治理票，才能后续操作',
      });
    }
  }, [token, isFirstTimeStake, isPendingInitialStakeRound, initialStakeRound]);

  useEffect(() => {
    if (!isPendingPair && !tokenBalance && !hadStartedApprove && token && token.symbol) {
      setError({
        name: '余额不足',
        message: `您当前${token.symbol}数量为0，请先获取${token.symbol}`,
      });
    }
    if (!isPendingPair && !parentTokenBalance && !hadStartedApprove && token && token.parentTokenSymbol) {
      setError({
        name: '余额不足',
        message: `您当前${token.parentTokenSymbol}数量为0，请先获取${token.parentTokenSymbol}`,
      });
    }
  }, [tokenBalance, parentTokenBalance, token, isPendingPair]);

  useEffect(() => {
    if (promisedWaitingPhases !== undefined && promisedWaitingPhases > 0) {
      form.setValue('releasePeriod', String(promisedWaitingPhases));
    }
  }, [promisedWaitingPhases]);

  const approveTokenButtonRef = useRef<HTMLButtonElement>(null);
  const prevIsPendingApproveToken = useRef<boolean>(isPendingApproveToken);

  useEffect(() => {
    if (prevIsPendingApproveToken.current && !isPendingApproveToken) {
      approveTokenButtonRef.current?.blur();
    }
    prevIsPendingApproveToken.current = isPendingApproveToken;
  }, [isPendingApproveToken]);

  if (!token || isPendingAccountStakeStatus || isPendingInitialStakeRound) {
    return <LoadingIcon />;
  }

  return (
    <div className="w-full flex-col items-center p-6 pt-2">
      <div className="w-full flex justify-between items-center">
        <LeftTitle title="质押获取治理票" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onStake)} className="w-full max-w-md mt-4 space-y-4">
          <FormField
            control={form.control}
            name="parentToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>质押父币数</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`输入 ${token?.parentTokenSymbol} 数量`}
                    {...field}
                    disabled={hadStartedApprove}
                    onChange={(e) => {
                      field.onChange(e);
                      setIsParentTokenChangedByUser(true);
                    }}
                    className="!ring-secondary-foreground"
                  />
                </FormControl>
                <FormMessage />
                <FormDescription className="flex justify-between items-center">
                  <span>
                    持有 <span className="text-secondary-400 mr-2">{formatTokenAmount(parentTokenBalance)}</span>
                    {token?.parentTokenSymbol}
                  </span>

                  {token.parentTokenSymbol === process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL && (
                    <Link href="/dex/deposit/" className="text-secondary-400 ml-2">
                      去获取 {token?.parentTokenSymbol}
                    </Link>
                  )}
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stakeToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>质押 token 数</FormLabel>
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
                <FormDescription className="flex justify-between items-center">
                  <span>
                    持有 <span className="text-secondary-400 mr-2">{formatTokenAmount(tokenBalance)}</span>
                    {token?.symbol}
                  </span>
                  {!isFirstTimeStake && (
                    <Link href={`/dex/swap/?symbol=${token?.symbol}`} className="text-secondary-400">
                      去获取{token?.symbol}
                    </Link>
                  )}
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="releasePeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>释放等待阶段</FormLabel>
                <FormControl>
                  <Select
                    disabled={hadStartedApprove}
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full !ring-secondary-foreground">
                      <SelectValue placeholder="选择释放等待阶段" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* {Array.from({ length: 9 }, (_, i) => i + 4) */}
                      {Array.from({ length: 1 }, (_, i) => i + 4)
                        .filter((item) => item >= promisedWaitingPhases)
                        .map((item) => (
                          <SelectItem key={item} value={String(item)}>
                            {item}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>含义：申请解除质押后，几个阶段之后可以取回代币</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {govVotes && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button type="button" className="w" disabled={true}>
                第1次内测体验, 暂时关闭追加治理票
              </Button>
            </div>
          )}
          {!govVotes && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                type="button"
                className="w-1/3"
                ref={approveTokenButtonRef}
                disabled={isPendingApproveToken || isConfirmingApproveToken || isTokenApproved}
                onClick={form.handleSubmit(onApproveToken)}
              >
                {isPendingApproveToken
                  ? `1.提交中...`
                  : isConfirmingApproveToken
                  ? `1.确认中...`
                  : isTokenApproved
                  ? `1.${token?.symbol}已授权`
                  : `1.授权${token?.symbol}`}
              </Button>

              <Button
                type="button"
                className="w-1/3"
                disabled={
                  !isTokenApproved ||
                  isPendingApproveParentToken ||
                  isConfirmingApproveParentToken ||
                  isParentTokenApproved
                }
                onClick={form.handleSubmit(onApproveParentToken)}
              >
                {isPendingApproveParentToken
                  ? `2.提交中...`
                  : isConfirmingApproveParentToken
                  ? `2.确认中...`
                  : isParentTokenApproved
                  ? `2.${token?.parentTokenSymbol}已授权`
                  : `2.授权${token?.parentTokenSymbol}`}
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
          )}
        </form>
      </Form>

      <LoadingOverlay
        isLoading={
          isApproving ||
          isApproveConfirming ||
          isPendingStakeLiquidity ||
          isConfirmingStakeLiquidity ||
          (isPendingInitialStakeRound && updatedInitialStakeRound)
        }
        text={isApproving || isPendingStakeLiquidity ? '提交交易...' : '确认交易...'}
      />
    </div>
  );
};

export default StakeLiquidityPanel;
