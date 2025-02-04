'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';

// ui components
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';

// my hooks
import { checkWalletConnection } from '@/src/lib/web3';
import { formatTokenAmount, parseUnits } from '@/src/lib/format';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useApprove, useBalanceOf, useAllowance } from '@/src/hooks/contracts/useLOVE20Token';
import { useJoin } from '@/src/hooks/contracts/useLOVE20Join';

// contexts / types / etc
import { ActionInfo } from '@/src/types/life20types';
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

// ------------------------------
//  这里开始：定义表单校验
// ------------------------------

interface FormValues {
  additionalStakeAmount: string; // 参与数量
  rounds: string; // 轮数
  verificationInfos: string[]; // 多项验证信息
}

interface SubmitJoinProps {
  actionInfo: ActionInfo;
  stakedAmount: bigint | undefined;
}

const SubmitJoin: React.FC<SubmitJoinProps> = ({ actionInfo, stakedAmount }) => {
  const router = useRouter();
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress, chain: accountChain } = useAccount();

  // 获取代币余额
  const { balance: tokenBalance, error: errorTokenBalance } = useBalanceOf(
    token?.address as `0x${string}`,
    accountAddress as `0x${string}`,
  );

  // 获取已授权数量
  const {
    allowance: allowanceToken,
    isPending: isPendingAllowanceToken,
    error: errAllowanceToken,
  } = useAllowance(
    token?.address as `0x${string}`,
    accountAddress as `0x${string}`,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_JOIN as `0x${string}`,
  );

  // 定义授权状态变量：是否已完成代币授权
  const [isTokenApproved, setIsTokenApproved] = useState(false);

  // 计算剩余可质押
  const maxStake = BigInt(actionInfo.body.maxStake) - (stakedAmount || 0n);

  // 这里构造 “verificationInfos” 字段的默认值；长度与 verificationKeys 一致
  const defaultVerificationInfos = actionInfo.body.verificationKeys.map(() => '');

  // 动态构造 zod schema
  const formSchema = z.object({
    // 参与数量
    additionalStakeAmount: z
      .string()
      .transform((val) => (val.trim() === '' ? '0' : val.trim()))
      .refine(
        (val) => {
          // 如果 stakedAmount = 0，那么 val 不能为 "0"
          if ((stakedAmount ?? 0n) === 0n && val === '0') {
            return false;
          }
          return true;
        },
        { message: '参与代币数不能为 0' },
      )
      .refine(
        (val) => {
          const inputVal = parseUnits(val);
          return inputVal !== null && inputVal <= maxStake;
        },
        { message: '参与代币数不能超过活动最大限制' },
      )
      .refine(
        (val) => {
          const inputVal = parseUnits(val);
          return inputVal !== null && tokenBalance ? inputVal <= tokenBalance : true;
        },
        { message: '参与代币数不能超过持有代币数' },
      ),

    // 多项验证信息
    verificationInfos: z.array(z.string().min(1, { message: '验证信息不能为空' })),
    // 如果想强制要求长度必须与 verificationKeys.length 一致，可使用：
    // verificationInfos: z
    //   .array(z.string().min(1, { message: '验证信息不能为空' }))
    //   .length(actionInfo.body.verificationKeys.length, '必须填写完所有验证信息'),
  });

  // ------------------------------
  //  表单实例
  // ------------------------------
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      additionalStakeAmount: '',
      verificationInfos: defaultVerificationInfos,
    },
    mode: 'onChange',
  });

  // ------------------------------
  //  授权(approve)
  // ------------------------------
  const {
    approve: approveToken,
    isWriting: isPendingApprove,
    isConfirming: isConfirmingApprove,
    isConfirmed: isConfirmedApprove,
    writeError: errApprove,
  } = useApprove(token?.address as `0x${string}`);

  async function handleApprove(values: FormValues) {
    if (!checkWalletConnection(accountChain)) {
      return;
    }

    // 确保 newStake 始终为 bigint，避免 null
    const newStake = parseUnits(values.additionalStakeAmount) ?? 0n;
    if (newStake === 0n && stakedAmount && stakedAmount > 0n) {
      toast.error('当前无需授权。');
      return;
    }

    try {
      await approveToken(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_JOIN as `0x${string}`, newStake);
    } catch (error) {
      console.error('Approve failed', error);
    }
  }

  // 监听授权交易确认后更新状态
  useEffect(() => {
    if (isConfirmedApprove) {
      setIsTokenApproved(true);
      toast.success(`授权${token?.symbol}成功`);
    }
  }, [isConfirmedApprove, token?.symbol]);

  // 监听用户输入的质押数量及链上返回的授权额度判断是否已授权
  const additionalStakeAmount = form.watch('additionalStakeAmount');
  const parsedStakeAmount = parseUnits(additionalStakeAmount || '0') ?? 0n;
  useEffect(() => {
    if (parsedStakeAmount > 0n && allowanceToken && allowanceToken > 0n && allowanceToken >= parsedStakeAmount) {
      setIsTokenApproved(true);
    } else {
      setIsTokenApproved(false);
    }
  }, [parsedStakeAmount, isPendingAllowanceToken, allowanceToken]);

  // ------------------------------
  //  加入提交
  // ------------------------------
  const {
    join,
    isPending: isPendingJoin,
    isConfirming: isConfirmingJoin,
    isConfirmed: isConfirmedJoin,
    error: errorJoin,
  } = useJoin();

  async function handleJoin(values: FormValues) {
    if (!checkWalletConnection(accountChain)) {
      return;
    }

    try {
      await join(
        token?.address as `0x${string}`,
        BigInt(actionInfo.head.id),
        parseUnits(values.additionalStakeAmount) ?? 0n,
        values.verificationInfos,
        accountAddress as `0x${string}`,
      );
    } catch (error) {
      console.error('Join failed', error);
    }
  }

  // ------------------------------
  //  加入成功后的处理
  // ------------------------------
  useEffect(() => {
    if (isConfirmedJoin) {
      toast.success('加入成功');
      // 重置表单
      form.reset();
      // 2秒后返回
      setTimeout(() => {
        router.push(`/action/${actionInfo.head.id}?type=join&symbol=${token?.symbol}`);
      }, 2000);
    }
  }, [isConfirmedJoin]);

  // ------------------------------
  //  错误处理
  // ------------------------------
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorTokenBalance) {
      handleContractError(errorTokenBalance, 'token');
    }
    if (errApprove) {
      handleContractError(errApprove, 'token');
    }
    if (errorJoin) {
      handleContractError(errorJoin, 'join');
    }
    if (errAllowanceToken) {
      handleContractError(errAllowanceToken, 'token');
    }
  }, [errorTokenBalance, errApprove, errorJoin, errAllowanceToken]);

  // ------------------------------
  //  组件渲染
  // ------------------------------
  const needsApproval = parsedStakeAmount > 0n;

  return (
    <>
      <div className="px-6 pt-0 pb-2">
        <LeftTitle title="加入行动" />
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {/* 参与代币数 */}
            <FormField
              control={form.control}
              name="additionalStakeAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-greyscale-500 font-normal">
                    {stakedAmount ? '增加参与代币数：' : '参与代币数：'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        maxStake > 0n
                          ? stakedAmount
                            ? `可填 0 不追加。最大可追加：${formatTokenAmount(maxStake)}`
                            : `最大 ${formatTokenAmount(maxStake)}`
                          : `已到最大${formatTokenAmount(BigInt(actionInfo.body.maxStake))}，不能再追加`
                      }
                      disabled={maxStake <= 0n}
                      className="!ring-secondary-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    当前持有：<span className="text-secondary">{formatTokenAmount(tokenBalance || 0n)}</span>{' '}
                    {token?.symbol}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 多项验证信息：根据 verificationKeys 动态生成输入框 */}
            {actionInfo.body.verificationKeys.map((key, index) => (
              <FormField
                key={key + index}
                control={form.control}
                // 注意这里的 name，需要用 `verificationInfos.${index}`
                name={`verificationInfos.${index}`}
                render={({ field }) => (
                  <FormItem>
                    {/* label 显示对应的 key */}
                    <FormLabel className="text-greyscale-500 font-normal">{key}</FormLabel>
                    <FormControl>
                      {/* placeholder 显示对应的 verificationInfoGuides[index] */}
                      <Textarea
                        placeholder={actionInfo.body.verificationInfoGuides[index] || ''}
                        className="!ring-secondary-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/* 操作按钮 */}
            <div className="flex justify-center space-x-4 pt-2">
              {needsApproval && !isTokenApproved && (
                <Button
                  className="w-1/2"
                  disabled={isPendingAllowanceToken || isPendingApprove || isConfirmingApprove || isTokenApproved}
                  type="button"
                  onClick={() => {
                    form.handleSubmit((values) => handleApprove(values))();
                  }}
                >
                  {isPendingAllowanceToken ? (
                    <Loader2 className="animate-spin" />
                  ) : isPendingApprove ? (
                    '1.提交中...'
                  ) : isConfirmingApprove ? (
                    '1.确认中...'
                  ) : isTokenApproved ? (
                    `1.${token?.symbol}已授权`
                  ) : (
                    `1.授权${token?.symbol}`
                  )}
                </Button>
              )}

              <Button
                className="w-1/2"
                disabled={
                  needsApproval
                    ? (!isTokenApproved && parsedStakeAmount !== 0n) ||
                      isPendingJoin ||
                      isConfirmingJoin ||
                      isConfirmedJoin
                    : isPendingJoin || isConfirmingJoin || isConfirmedJoin
                }
                type="button"
                onClick={() => {
                  form.handleSubmit((values) => handleJoin(values))();
                }}
              >
                {isPendingJoin
                  ? needsApproval
                    ? '2.加入中...'
                    : '加入中...'
                  : isConfirmingJoin
                  ? needsApproval
                    ? '2.确认中...'
                    : '确认中...'
                  : isConfirmedJoin
                  ? needsApproval
                    ? '2.已加入'
                    : '已加入'
                  : needsApproval
                  ? '2.加入'
                  : '加入'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <LoadingOverlay
        isLoading={isPendingApprove || isConfirmingApprove || isPendingJoin || isConfirmingJoin}
        text={isPendingApprove || isPendingJoin ? '提交交易...' : '确认交易...'}
      />
    </>
  );
};

export default SubmitJoin;
