'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';

// ui components
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// my hooks
import { checkWalletConnection } from '@/src/lib/web3';
import { formatTokenAmount, parseUnits } from '@/src/lib/format';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useApprove, useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
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
  additionalStakeAmount: string; // 输入框里是 string
  rounds: string; // 输入框里是 string
  verificationInfo: string;
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

  // 计算剩余可质押
  const maxStake = BigInt(actionInfo.body.maxStake) - (stakedAmount || 0n);
  // 如果 stakedAmount = 0，newStake 不可为 0；如果 stakedAmount > 0，newStake 可为 0。
  // 其他：newStake <= maxStake && newStake <= tokenBalance.

  // 动态构造 zod schema
  const formSchema = z.object({
    additionalStakeAmount: z
      .string()
      // 如果前端输入为空字符串或不是数字，需要先转成 '0' 再做数值比较，避免 NaN
      .transform((val) => (val.trim() === '' ? '0' : val.trim()))
      .refine(
        (val) => {
          // 如果 stakedAmount = 0，那么 val 不能为 "0"
          if ((stakedAmount ?? 0n) === 0n && val === '0') {
            return false;
          }
          return true;
        },
        {
          message: '参与代币数不能为 0',
        },
      )
      .refine(
        (val) => {
          const inputVal = parseUnits(val);
          // 不允许超过剩余可参与数
          return inputVal <= maxStake;
        },
        {
          message: '参与代币数不能超过活动最大限制',
        },
      )
      .refine(
        (val) => {
          const inputVal = parseUnits(val);
          // 不允许超过当前持有代币数
          return tokenBalance ? inputVal <= tokenBalance : true;
        },
        {
          message: '参与代币数不能超过持有代币数',
        },
      ),
    rounds: z
      .string()
      .trim()
      .nonempty({ message: '参与轮数不能为空' })
      .refine((val) => Number(val) > 0, { message: '参与轮数必须大于 0' }),
    verificationInfo: z.string().min(1, { message: '验证信息不能为空' }),
  });

  // ------------------------------
  //  表单实例
  // ------------------------------
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      additionalStakeAmount: '',
      rounds: '',
      verificationInfo: '',
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

    const newStake = parseUnits(values.additionalStakeAmount);
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
        parseUnits(values.additionalStakeAmount),
        values.verificationInfo,
        BigInt(values.rounds),
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
  }, [errorTokenBalance, errApprove, errorJoin]);

  // ------------------------------
  //  组件渲染
  // ------------------------------
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
                    {stakedAmount ? '增加参与代币数：' : '参与代币数：：'}
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
                    当前持有：{formatTokenAmount(tokenBalance || 0n)} {token?.symbol}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 参与轮数 */}
            <FormField
              control={form.control}
              name="rounds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-greyscale-500 font-normal">参与轮数：</FormLabel>
                  <FormControl>
                    <Input placeholder="输入参与轮数" className="!ring-secondary-foreground" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 验证信息 */}
            <FormField
              control={form.control}
              name="verificationInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-greyscale-500 font-normal">验证信息：</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={actionInfo?.body.verificationInfoGuide || ''}
                      className="!ring-secondary-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 操作按钮 */}
            <div className="flex justify-center space-x-4 pt-2">
              <Button
                className="w-1/2"
                disabled={
                  maxStake <= 0n || isPendingApprove || isConfirmingApprove || isConfirmedApprove || isConfirmedJoin
                }
                type="button"
                onClick={() => {
                  form.handleSubmit((values) => handleApprove(values))();
                }}
              >
                {isPendingApprove
                  ? '1.授权中...'
                  : isConfirmingApprove
                  ? '1.确认中...'
                  : isConfirmedApprove
                  ? '1.已授权'
                  : '1.授权'}
              </Button>

              <Button
                className="w-1/2"
                // 将“加入”按钮的禁用逻辑基于 needsAuthorization
                disabled={
                  maxStake > 0n
                    ? (!isConfirmedApprove && stakedAmount !== 0n) ||
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
                  ? '2.加入中...'
                  : isConfirmingJoin
                  ? '2.确认中...'
                  : isConfirmedJoin
                  ? '2.已加入'
                  : '2.加入'}
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
