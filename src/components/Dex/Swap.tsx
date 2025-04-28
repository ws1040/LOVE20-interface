'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAccount } from 'wagmi';
import { useForm } from 'react-hook-form';

// UI components
import { ArrowDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

// my hooks & funcs
import { checkWalletConnection } from '@/src/lib/web3';
import { formatIntegerStringWithCommas, formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useBalanceOf, useApprove } from '@/src/hooks/contracts/useLOVE20Token';
import { useGetAmountsOut, useSwapExactTokensForTokens } from '@/src/hooks/contracts/useUniswapV2Router';

// my context
import useTokenContext from '@/src/hooks/context/useTokenContext';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

// -------------------------------------
// 1. 定义 zod Schema
// -------------------------------------
const getSwapFormSchema = (balance: bigint) =>
  z.object({
    fromTokenAmount: z
      .string()
      .nonempty('请输入兑换数量')
      .refine(
        (val) => {
          // 如果输入以 '.' 结尾，则视为用户仍在输入中，不触发报错
          if (val.endsWith('.')) return true;
          // 如果输入仅为 "0"，也允许中间状态（或可根据需求调整为不允许）
          if (val === '0') return true;
          try {
            const amount = parseUnits(val);
            return amount > 0n && amount <= balance;
          } catch (e) {
            return false;
          }
        },
        { message: '输入数量必须大于0且不超过您的可用余额' },
      ),
    fromTokenAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, '无效合约地址'),
    toTokenAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, '无效合约地址'),
  });

type SwapFormValues = z.infer<ReturnType<typeof getSwapFormSchema>>;

// -------------------------------------
// 主组件
// -------------------------------------
export interface TokenInfo {
  symbol: string;
  address: `0x${string}`;
  amount: bigint;
  amountShow: string;
  balance: bigint;
}

const SwapPanel = () => {
  const router = useRouter();
  const { address: account, chain: accountChain } = useAccount();
  const { token } = useTokenContext();

  const [fromTokenInfo, setFromTokenInfo] = useState<TokenInfo>({
    symbol: '',
    address: '0x0',
    amount: 0n,
    amountShow: '0',
    balance: 0n,
  });
  const [toTokenInfo, setToTokenInfo] = useState<TokenInfo>({
    symbol: '',
    address: '0x0',
    amount: 0n,
    amountShow: '0',
    balance: 0n,
  });

  // -------------------------------------
  // 2. 初始化/更新token信息
  // -------------------------------------
  useEffect(() => {
    if (token) {
      setFromTokenInfo((prev) => ({
        ...prev,
        address: token.parentTokenAddress,
        symbol: token.parentTokenSymbol,
      }));
      setToTokenInfo((prev) => ({
        ...prev,
        address: token.address,
        symbol: token.symbol,
      }));
    }
  }, [token]);

  // -------------------------------------
  // 3. 创建表单
  //    注意：defaultValues要与State保持同步
  // -------------------------------------
  const form = useForm<SwapFormValues>({
    resolver: zodResolver(getSwapFormSchema(fromTokenInfo.balance)),
    defaultValues: {
      fromTokenAddress: token?.parentTokenAddress || '0x0',
      toTokenAddress: token?.address || '0x0',
      fromTokenAmount: '',
    },
    mode: 'onChange',
  });

  // 当 fromTokenInfo 或 toTokenInfo 的地址发生变化后
  // 可以通过 setValue 来同步给表单
  useEffect(() => {
    form.setValue('fromTokenAddress', fromTokenInfo.address);
    form.setValue('toTokenAddress', toTokenInfo.address);
  }, [fromTokenInfo.address, toTokenInfo.address, form]);

  // -------------------------------------
  // 4. 监听 fromTokenAmount
  //    以便更新 fromTokenInfo.amountShow & .amount
  // -------------------------------------
  const watchFromAmount = form.watch('fromTokenAmount');
  useEffect(() => {
    // 更新 state，用于后续 计算 amountsOut / 手续费 / ...
    setFromTokenInfo((prev) => {
      let amountBigInt = 0n;
      try {
        amountBigInt = parseUnits(watchFromAmount || '0') ?? 0n;
      } catch {}
      return {
        ...prev,
        amount: amountBigInt,
        amountShow: watchFromAmount || '0',
      };
    });
  }, [watchFromAmount]);

  // -------------------------------------
  // 5. 读取余额
  // -------------------------------------
  const {
    balance: balanceOfFromToken,
    error: errorBalanceOfToken,
    isPending: isPendingBalanceOfToken,
  } = useBalanceOf(fromTokenInfo.address as `0x${string}`, account as `0x${string}`);
  const {
    balance: balanceOfToToken,
    error: errorBalanceOfParentToken,
    isPending: isPendingBalanceOfParentToken,
  } = useBalanceOf(toTokenInfo.address as `0x${string}`, account as `0x${string}`);

  // 更新各自余额
  useEffect(() => {
    if (balanceOfFromToken) {
      setFromTokenInfo((prev) => ({ ...prev, balance: balanceOfFromToken }));
    }
    if (balanceOfToToken) {
      setToTokenInfo((prev) => ({ ...prev, balance: balanceOfToToken }));
    }
  }, [balanceOfFromToken, balanceOfToToken]);

  // -------------------------------------
  // 6. 获取兑换结果 amountsOut
  //    并更新 toTokenInfo.amount & amountShow
  // -------------------------------------
  const {
    data: amountsOut,
    error: amountsOutError,
    isLoading: isAmountsOutLoading,
  } = useGetAmountsOut(fromTokenInfo.amount, [fromTokenInfo.address, toTokenInfo.address]);

  useEffect(() => {
    if (amountsOut && amountsOut.length > 1) {
      const amountOut = BigInt(amountsOut[1]);
      setToTokenInfo((prev) => ({
        ...prev,
        amount: amountOut,
        amountShow: formatUnits(amountOut),
      }));
    }
  }, [amountsOut]);

  // -------------------------------------
  // 7. Max 按钮：设置最大数量
  // -------------------------------------
  const setMaxAmount = () => {
    const maxStr = formatUnits(fromTokenInfo.balance);
    form.setValue('fromTokenAmount', maxStr);
  };

  // -------------------------------------
  // 8. 切换 fromToken 和 toToken
  // -------------------------------------
  const handleSwapUI = () => {
    // 先保存当前值
    const tempFrom = { ...fromTokenInfo };
    const tempTo = { ...toTokenInfo };

    // 确保两个地址都有效再进行切换
    if (tempFrom.address !== '0x0' && tempTo.address !== '0x0') {
      // 将 fromToken, toToken 互换
      setFromTokenInfo(tempTo);
      setToTokenInfo(tempFrom);
      form.setValue('fromTokenAmount', '0');
    }
  };

  // -------------------------------------
  // 授权 & 兑换逻辑
  // -------------------------------------
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

  const {
    swap,
    isWriting: isSwapping,
    isConfirming: isConfirmingSwap,
    isConfirmed: isConfirmedSwap,
    writeError: swapError,
  } = useSwapExactTokensForTokens();

  // 是否处于 Approve 流程中
  const isApproving =
    isPendingApproveToken || isPendingApproveParentToken || isConfirmingApproveToken || isConfirmingApproveParentToken;

  // 是否 Approve 完成
  const isApproved = isConfirmedApproveToken || isConfirmedApproveParentToken;

  // 处理授权
  const handleApprove = form.handleSubmit(async (data) => {
    // 在这里再次做网络连接检查
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    // data.fromTokenAddress / data.fromTokenAmount 都已通过 zod 校验
    try {
      const tx = token?.symbol === fromTokenInfo.symbol ? approveToken : approveParentToken;
      // 将 fromTokenInfo.amount 作为授权额度
      await tx(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_UNISWAP_V2_ROUTER as `0x${string}`, fromTokenInfo.amount);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || '授权失败');
    }
  });

  // 处理兑换
  const handleSwap = form.handleSubmit(async (data) => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    try {
      // 定义 deadline为当前时间后20分钟
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 20 * 60);
      await swap(
        fromTokenInfo.amount,
        (toTokenInfo.amount / 1000n) * 995n,
        [fromTokenInfo.address, toTokenInfo.address],
        account as `0x${string}`,
        deadline,
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || '兑换失败');
    }
  });

  // 兑换确认后
  useEffect(() => {
    if (isConfirmedSwap) {
      toast.success('兑换成功');
      setTimeout(() => {
        router.push(`/my/?symbol=${token?.symbol}`);
      }, 2000);
    }
  }, [isConfirmedSwap, router, token?.symbol]);

  // 手续费计算 (示例：0.3%)
  const feePercentage = 0.3;
  const [fee, setFee] = useState<string>('0');
  useEffect(() => {
    if (fromTokenInfo.amountShow) {
      const val = parseFloat(fromTokenInfo.amountShow) || 0;
      const calculatedFee = (val * feePercentage) / 100;
      const feeValue = calculatedFee < 0.0001 ? calculatedFee.toExponential(2) : calculatedFee.toFixed(6);
      setFee(feeValue);
    } else {
      setFee('0');
    }
  }, [fromTokenInfo.amountShow]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errApproveToken) {
      handleContractError(errApproveToken, 'token');
    }
    if (errApproveParentToken) {
      handleContractError(errApproveParentToken, 'token');
    }
    if (amountsOutError) {
      handleContractError(amountsOutError, 'uniswapV2Router');
    }
    if (swapError) {
      handleContractError(swapError, 'uniswapV2Router');
    }
    if (errorBalanceOfParentToken) {
      handleContractError(errorBalanceOfParentToken, 'token');
    }
    if (errorBalanceOfToken) {
      handleContractError(errorBalanceOfToken, 'token');
    }
  }, [
    errApproveToken,
    errApproveParentToken,
    amountsOutError,
    swapError,
    errorBalanceOfParentToken,
    errorBalanceOfToken,
  ]);

  // 如果还没有 token 信息
  if (!token) {
    return <LoadingIcon />;
  }

  // 加载状态
  const isLoadingOverlay = isApproving || isSwapping || isConfirmingSwap;

  // 转换率的计算逻辑
  const conversionRate =
    fromTokenInfo.amount > 0n && amountsOut && amountsOut.length > 1
      ? formatIntegerStringWithCommas(formatUnits((amountsOut[1] * 10n ** 18n) / fromTokenInfo.amount), 2, 4)
      : '0';

  return (
    <div className="p-6">
      <LeftTitle title="兑换" />
      <div className="w-full max-w-md mt-4">
        <Form {...form}>
          <form>
            <div className="mb-4 flex flex-col">
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="fromTokenAmount"
                  render={({ field }) => (
                    <FormItem className="w-2/3">
                      <FormControl>
                        <Input
                          placeholder="请填写数量"
                          type="number"
                          className="w-full !ring-secondary-foreground"
                          disabled={isPendingBalanceOfToken || isPendingBalanceOfParentToken || isApproved}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fromTokenAddress"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            // 同步到 state
                            setFromTokenInfo((prev) => ({
                              ...prev,
                              address: val as `0x${string}`,
                            }));
                          }}
                          disabled={isPendingBalanceOfToken || isPendingBalanceOfParentToken || isApproved}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="选择代币" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={fromTokenInfo.address}>{fromTokenInfo.symbol}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center text-sm mt-2">
                <span className="text-greyscale-400">
                  {formatTokenAmount(fromTokenInfo.balance || 0n)} {fromTokenInfo.symbol}
                </span>
                <Button
                  variant="link"
                  type="button"
                  size="sm"
                  className="text-secondary ml-2"
                  onClick={setMaxAmount}
                  disabled={isPendingBalanceOfToken || isPendingBalanceOfParentToken || isApproved}
                >
                  最高
                </Button>
              </div>
            </div>

            <div className="flex justify-center my-4">
              <Button
                variant="ghost"
                type="button"
                size="icon"
                className="rounded-full hover:bg-gray-100"
                onClick={handleSwapUI}
                disabled={isPendingBalanceOfToken || isPendingBalanceOfParentToken || isApproved}
              >
                <ArrowDownIcon className="h-6 w-6" />
              </Button>
            </div>

            <div className="mb-6">
              <div className="flex space-x-4">
                <Input
                  type="number"
                  disabled
                  placeholder="0.0"
                  className="flex-grow w-2/3 !ring-secondary-foreground"
                  value={toTokenInfo.amountShow}
                  readOnly
                />
                <FormField
                  control={form.control}
                  name="toTokenAddress"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            setToTokenInfo((prev) => ({
                              ...prev,
                              address: val as `0x${string}`,
                            }));
                          }}
                          disabled={isPendingBalanceOfToken || isPendingBalanceOfParentToken || isApproved}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="选择代币" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={toTokenInfo.address}>{toTokenInfo.symbol}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-greyscale-400">
                  {formatTokenAmount(toTokenInfo.balance || 0n)} {toTokenInfo.symbol}
                </span>
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <Button className="w-1/2" onClick={handleApprove} disabled={isApproving || isApproved}>
                {isPendingApproveToken || isPendingApproveParentToken
                  ? '1.授权中...'
                  : isConfirmingApproveToken || isConfirmingApproveParentToken
                  ? '1.确认中...'
                  : isApproved
                  ? '1.已授权'
                  : '1.授权'}
              </Button>
              <Button
                className="w-1/2"
                onClick={handleSwap}
                disabled={!isApproved || isApproving || isSwapping || isConfirmingSwap || isConfirmedSwap}
              >
                {isSwapping
                  ? '2.兑换中...'
                  : isConfirmingSwap
                  ? '2.确认中...'
                  : isConfirmedSwap
                  ? '2.已兑换'
                  : '2.兑换'}
              </Button>
            </div>
          </form>
        </Form>

        {/* 手续费和滑点提示 */}
        {fromTokenInfo.amount > 0n && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between text-sm">
              <span className="text-greyscale-400">兑换率: </span>
              <span>
                1 {fromTokenInfo.symbol} = {conversionRate} {toTokenInfo.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-greyscale-400">手续费 (0.3%)：</span>
              <span>
                {fee} {fromTokenInfo.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-greyscale-400">滑点上限 (自动)：</span>
              <span>0.5%</span>
            </div>
          </div>
        )}
      </div>

      <LoadingOverlay
        isLoading={isLoadingOverlay}
        text={isPendingApproveToken || isPendingApproveParentToken || isSwapping ? '提交交易...' : '确认交易...'}
      />
    </div>
  );
};

export default SwapPanel;
