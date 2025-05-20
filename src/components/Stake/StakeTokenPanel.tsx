'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// shadcn/ui
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
// my funcs
import { checkWalletConnection } from '@/src/lib/web3';
import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';

// my hooks
import { useAccountStakeStatus, useStakeToken } from '@/src/hooks/contracts/useLOVE20Stake';
import { useApprove, useAllowance } from '@/src/hooks/contracts/useLOVE20Token';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

interface StakeTokenPanelProps {
  tokenBalance: bigint;
}

// 1. 定义 Zod 校验规则
//   - 质押代币数不能为0
//   - 质押代币数不能大于持有代币数
//   - releasePeriod 默认 "4"
function stakeSchemaFactory(tokenBalance: bigint) {
  return z.object({
    stakeTokenAmount: z
      .string()
      .refine((val) => val.trim() !== '', {
        message: '请输入质押数量',
      })
      .refine((val) => Number(val) > 0, {
        message: '质押代币数不能为0',
      })
      .refine((val) => parseUnits(val) <= tokenBalance, {
        message: '质押代币数不能大于持有代币数',
      }),
    releasePeriod: z.string().default('4'),
  });
}

const StakeTokenPanel: React.FC<StakeTokenPanelProps> = ({ tokenBalance }) => {
  const { address: accountAddress, chain: accountChain } = useAccount();
  const { token } = useContext(TokenContext) || {};

  // 状态变量：是否完成授权的
  const [isTokenApproved, setIsTokenApproved] = useState(false);

  const {
    approve: approveToken,
    isWriting: isPendingApproveToken,
    isConfirming: isConfirmingApproveToken,
    isConfirmed: isConfirmedApproveToken,
    writeError: errApproveToken,
  } = useApprove(token?.address as `0x${string}`);

  const {
    stakeToken,
    isWriting: isPendingStakeToken,
    isConfirming: isConfirmingStakeToken,
    isConfirmed: isConfirmedStakeToken,
    writeError: errStakeToken,
  } = useStakeToken();

  // 0. 获取质押状态(释放轮次)
  const {
    promisedWaitingPhases,
    isPending: isPendingAccountStakeStatus,
    error: errAccountStakeStatus,
  } = useAccountStakeStatus(token?.address as `0x${string}`, accountAddress as `0x${string}`);

  // 1. 获取已授权数量
  const {
    allowance: allowanceToken,
    isPending: isPendingAllowanceToken,
    error: errAllowanceToken,
  } = useAllowance(
    token?.address as `0x${string}`,
    accountAddress as `0x${string}`,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`,
  );

  // 新增：为授权按钮创建 ref
  const approveButtonRef = useRef<HTMLButtonElement>(null);
  // 保存 isPendingAllowanceToken 的上一个值
  const prevIsPendingAllowance = useRef(isPendingAllowanceToken);

  // 当 isPendingAllowanceToken 从 true 变为 false 时，调用按钮的 blur() 方法
  useEffect(() => {
    if (prevIsPendingAllowance.current && !isPendingAllowanceToken) {
      approveButtonRef.current?.blur();
    }
    prevIsPendingAllowance.current = isPendingAllowanceToken;
  }, [isPendingAllowanceToken]);

  // 2. 初始化表单
  const form = useForm<z.infer<ReturnType<typeof stakeSchemaFactory>>>({
    resolver: zodResolver(stakeSchemaFactory(tokenBalance)),
    defaultValues: {
      stakeTokenAmount: '',
      releasePeriod: '4',
    },
    mode: 'onChange',
  });

  // 3. 授权按钮点击
  const handleApprove = async (data: z.infer<ReturnType<typeof stakeSchemaFactory>>) => {
    // 先检查钱包 & 链
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    try {
      await approveToken(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`,
        parseUnits(data.stakeTokenAmount),
      );
    } catch (error: any) {
      toast.error(error?.message || '授权失败');
      console.error('Approve failed', error);
    }
  };

  // 监听授权成功
  useEffect(() => {
    if (isConfirmedApproveToken) {
      setIsTokenApproved(true);
      toast.success(`授权${token?.symbol}成功`);
    }
  }, [isConfirmedApproveToken, token?.symbol]);

  // 4. 质押按钮点击
  const handleStake = async (data: z.infer<ReturnType<typeof stakeSchemaFactory>>) => {
    // 先检查钱包 & 链
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    try {
      await stakeToken(
        token?.address as `0x${string}`,
        parseUnits(data.stakeTokenAmount),
        BigInt(data.releasePeriod),
        accountAddress as `0x${string}`,
      );
    } catch (error) {
      console.error('Stake failed', error);
    }
  };

  // 监听质押成功
  useEffect(() => {
    if (isConfirmedStakeToken) {
      toast.success('质押成功');
      // 重置表单
      form.reset();
      // 2秒后刷新页面，跳转到治理首页
      setTimeout(() => {
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/gov?symbol=${token?.symbol}`;
      }, 2000);
    }
  }, [isConfirmedStakeToken, form, token?.symbol]);

  useEffect(() => {
    // 确保 promisedWaitingPhases 有效，再设置初始值（注意转换为 string）
    if (promisedWaitingPhases !== undefined && promisedWaitingPhases > 0) {
      form.setValue('releasePeriod', String(promisedWaitingPhases));
    }
  }, [promisedWaitingPhases]);

  // 监听用户输入的质押数量以及 allowance 值，动态判断是否已授权
  const stakeTokenAmountValue = form.watch('stakeTokenAmount');
  useEffect(() => {
    let parsedStakeToken = 0n;
    try {
      parsedStakeToken = parseUnits(stakeTokenAmountValue || '0');
    } catch {
      parsedStakeToken = 0n;
    }

    if (parsedStakeToken > 0n && allowanceToken && allowanceToken > 0n && allowanceToken >= parsedStakeToken) {
      setIsTokenApproved(true);
    } else {
      setIsTokenApproved(false);
    }
  }, [stakeTokenAmountValue, allowanceToken, isPendingAllowanceToken]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errStakeToken) {
      handleContractError(errStakeToken, 'stake');
    }
    if (errApproveToken) {
      handleContractError(errApproveToken, 'token');
    }
    if (errAllowanceToken) {
      handleContractError(errAllowanceToken, 'token');
    }
  }, [errStakeToken, errApproveToken, errAllowanceToken]);

  return (
    <div className="w-full flex flex-col items-center pt-0 p-6">
      <div className="w-full text-left mb-4">
        <LeftTitle title="质押增加治理收益" />
      </div>

      {/* 5. 使用 shadcn/ui 的 Form 组件，结合 react-hook-form */}
      <Form {...form}>
        {/* 用于阻止默认提交，这里手动分别处理"授权""质押" */}
        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md space-y-4">
          {/* 质押数量 */}
          <FormField
            control={form.control}
            name="stakeTokenAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">质押数：</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`输入 ${token?.symbol} 数量`}
                    className="!ring-secondary-foreground"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="flex justify-between items-center">
                  <span>
                    持有 <span className="text-secondary-400 mr-2">{formatTokenAmount(tokenBalance)}</span>
                    {token?.symbol}
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    type="button"
                    onClick={() => {
                      form.setValue('stakeTokenAmount', formatUnits(tokenBalance || 0n));
                    }}
                    disabled={tokenBalance <= 0n}
                    className="text-secondary mr-2"
                  >
                    全部
                  </Button>
                </FormDescription>
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
                <FormLabel>释放等待阶段：</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
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

          {/* 按钮组：1.授权；2.质押 */}
          <div className="flex justify-center space-x-4">
            {/* <Button type="button" className="w" disabled={true}>
              第1次内测体验, 暂时关闭加速质押
            </Button> */}
            <Button
              // 为授权按钮添加 ref
              ref={approveButtonRef}
              className="w-1/2"
              disabled={isPendingAllowanceToken || isPendingApproveToken || isConfirmingApproveToken || isTokenApproved}
              onClick={() => form.handleSubmit(handleApprove)()}
            >
              {isPendingAllowanceToken ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : isPendingApproveToken ? (
                '1.授权中...'
              ) : isConfirmingApproveToken ? (
                '1.确认中...'
              ) : isTokenApproved ? (
                `1.${token?.symbol}已授权`
              ) : (
                `1.授权${token?.symbol}`
              )}
            </Button>
            <Button
              className="w-1/2"
              disabled={!isTokenApproved || isPendingStakeToken || isConfirmingStakeToken || isConfirmedStakeToken}
              onClick={() => form.handleSubmit(handleStake)()}
            >
              {isPendingStakeToken
                ? '2.质押中...'
                : isConfirmingStakeToken
                ? '2.确认中...'
                : isConfirmedStakeToken
                ? '2.已质押'
                : '2.质押'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Loading遮罩 */}
      <LoadingOverlay
        isLoading={isPendingApproveToken || isConfirmingApproveToken || isPendingStakeToken || isConfirmingStakeToken}
        text={isPendingApproveToken || isPendingStakeToken ? '提交交易...' : '确认交易...'}
      />
    </div>
  );
};

export default StakeTokenPanel;
