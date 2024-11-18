import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ArrowDownIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import useTokenContext from '@/src/hooks/context/useTokenContext';
import { useBalanceOf, useApprove } from '@/src/hooks/contracts/useLOVE20Token';
import { formatTokenAmount, formatUnits, parseUnits } from '@/src/lib/format';
import {
  useGetAmountsIn,
  useGetAmountsOut,
  useSwapExactTokensForTokens,
} from '@/src/hooks/contracts/useUniswapV2Router';

export interface TokenInfo {
  symbol: string;
  address: `0x${string}`;
  amount: bigint;
  amountShow: string;
  balance: bigint;
}

const SwapPanel = () => {
  const { address: account } = useAccount();
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
  const {
    approve: approveToken,
    isWriting: isPendingApproveToken,
    isConfirmed: isConfirmedApproveToken,
    writeError: errApproveToken,
  } = useApprove(token?.address as `0x${string}`);
  const {
    approve: approveParentToken,
    isWriting: isPendingApproveParentToken,
    isConfirmed: isConfirmedApproveParentToken,
    writeError: errApproveParentToken,
  } = useApprove(token?.parentTokenAddress as `0x${string}`);
  const {
    swap,
    isWriting: isSwapping,
    writeError: swapError,
    isConfirming: isConfirmingSwap,
    isConfirmed: isConfirmedSwap,
  } = useSwapExactTokensForTokens();

  // 状态：是否已授权
  const [isApproved, setIsApproved] = useState(false);

  // 初始化当前代币信息
  useEffect(() => {
    if (token) {
      setFromTokenInfo({
        address: token.parentTokenAddress,
        amount: 0n,
        amountShow: '0',
        balance: 0n,
        symbol: token.parentTokenSymbol,
      });
      setToTokenInfo({
        address: token.address,
        amount: 0n,
        amountShow: '0',
        balance: 0n,
        symbol: token.symbol,
      });
    }
  }, [token]);

  // 获取并设置代币余额
  const {
    balance: balanceOfToken,
    isPending: isPendingBalanceOfToken,
    error: errorBalanceOfToken,
  } = useBalanceOf(fromTokenInfo.address as `0x${string}`, account as `0x${string}`);
  const {
    balance: balanceOfParentToken,
    isPending: isPendingBalanceOfParentToken,
    error: errorBalanceOfParentToken,
  } = useBalanceOf(toTokenInfo.address as `0x${string}`, account as `0x${string}`);

  useEffect(() => {
    if (balanceOfToken) {
      setFromTokenInfo((prev) => ({ ...prev, balance: balanceOfToken }));
    }
    if (balanceOfParentToken) {
      setToTokenInfo((prev) => ({ ...prev, balance: balanceOfParentToken }));
    }
  }, [balanceOfToken, balanceOfParentToken]);

  // 计算兑换数量
  const {
    data: amountsOut,
    error: amountsOutError,
    isLoading: isAmountsOutLoading,
  } = useGetAmountsOut(fromTokenInfo.amount, [fromTokenInfo.address, toTokenInfo.address]);
  // const {
  //   data: amountsIn,
  //   error: amountsInError,
  //   isLoading: isAmountsInLoading,
  // } = useGetAmountsIn(toTokenInfo.amount, [fromTokenInfo.address, toTokenInfo.address]);
  console.log('--------------------------------');
  console.log('fromTokenInfo.amount', fromTokenInfo.amount);
  console.log('amountsOutError', amountsOutError);
  console.log('amountsOut', amountsOut);
  console.log('isAmountsOutLoading', isAmountsOutLoading);

  // 监听授权交易
  useEffect(() => {
    if (errorBalanceOfToken || errorBalanceOfParentToken) {
      toast.error('授权失败');
    }
  }, [errorBalanceOfToken, errorBalanceOfParentToken]);

  // 设置 ToToken 的金额
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

  // 设置 FromToken 的金额
  const handleFromTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setFromTokenInfo({
      ...fromTokenInfo,
      amountShow: input,
    });
    const floatValue = input === '' ? 0 : parseFloat(input);
    if (!input.endsWith('.')) {
      setFromTokenInfo({
        ...fromTokenInfo,
        amount: parseUnits(input),
        amountShow: input,
      });
    }
  };

  // 设置最大金额
  const setMaxAmount = () => {
    setFromTokenInfo((prev) => ({
      ...prev,
      amount: prev.balance,
      amountShow: formatUnits(prev.balance),
    }));
  };

  // 交换代币（界面上交换）
  const handleSwapUI = () => {
    const tempFromTokenInfo = toTokenInfo;
    const tempToTokenInfo = fromTokenInfo;
    tempFromTokenInfo.amount = fromTokenInfo.amount;
    tempFromTokenInfo.amountShow = fromTokenInfo.amountShow;
    tempToTokenInfo.amount = 0n;
    tempToTokenInfo.amountShow = '0';

    setFromTokenInfo(tempFromTokenInfo);
    setToTokenInfo(tempToTokenInfo);
  };

  // handleApprove 函数实现
  const handleApprove = async () => {
    try {
      const tx = token?.symbol === fromTokenInfo.symbol ? approveToken : approveParentToken;
      await tx(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_UNISWAP_V2_ROUTER as `0x${string}`, fromTokenInfo.amount);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || '授权失败');
    }
  };
  useEffect(() => {
    if (isConfirmedApproveToken || isConfirmedApproveParentToken) {
      toast.success('授权成功');
      setIsApproved(true);
    }
  }, [isConfirmedApproveToken, isConfirmedApproveParentToken]);

  // handleSwap 函数实现
  const handleSwap = async () => {
    try {
      // 定义 deadline为当前时间后20分钟
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 20 * 60);
      const tx = await swap(
        fromTokenInfo.amount,
        (fromTokenInfo.amount / 1055n) * 1000n,
        [fromTokenInfo.address, toTokenInfo.address],
        account as `0x${string}`,
        deadline,
      );
      // 兑换后可以根据需要重置状态
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || '兑换失败');
    }
  };
  useEffect(() => {
    if (isConfirmedSwap) {
      toast.success('兑换成功');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [isConfirmedSwap]);

  // 计算手续费
  const feePercentage = 0.3;
  const [fee, setFee] = useState<string>('0');

  useEffect(() => {
    if (fromTokenInfo.amountShow) {
      const calculatedFee = (parseFloat(fromTokenInfo.amountShow) * feePercentage) / 100;
      setFee(calculatedFee.toFixed(4)); // 保留4位小数
    } else {
      setFee('0');
    }
  }, [fromTokenInfo.amountShow]);

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white ">
        <h1 className="text-xl font-bold mb-6">兑换</h1>

        {/* From Token Block */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Input
              type="number"
              placeholder="0.0"
              className="flex-grow"
              value={fromTokenInfo.amountShow}
              onChange={handleFromTokenAmountChange}
              disabled={
                isPendingBalanceOfToken ||
                isPendingBalanceOfParentToken ||
                isPendingApproveToken ||
                isPendingApproveParentToken ||
                isApproved ||
                isSwapping
              }
            />
            <Select
              value={fromTokenInfo.address}
              onValueChange={(value) => setFromTokenInfo({ ...fromTokenInfo, address: value as `0x${string}` })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="选择代币" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={fromTokenInfo.address}>{fromTokenInfo.symbol}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center text-sm gap-2">
            <span className="text-gray-400">
              {formatTokenAmount(fromTokenInfo.balance || 0n)} {fromTokenInfo.symbol}
            </span>
            <Button variant="outline" size="sm" onClick={setMaxAmount}>
              最高
            </Button>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100" onClick={handleSwapUI}>
            <ArrowDownIcon className="h-6 w-6" />
          </Button>
        </div>

        {/* To Token Block */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Input
              type="text"
              disabled
              placeholder="0.0"
              className="flex-grow"
              value={toTokenInfo.amountShow}
              readOnly
            />
            <Select
              value={toTokenInfo.address}
              onValueChange={(value) => setToTokenInfo({ ...toTokenInfo, address: value as `0x${string}` })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="选择代币" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={toTokenInfo.address}>{toTokenInfo.symbol}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">
              {formatTokenAmount(toTokenInfo.balance || 0n)} {toTokenInfo.symbol}
            </span>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <Button
            className={`w-1/2 text-white ${
              !isApproved ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleApprove}
            disabled={isPendingApproveToken || isPendingApproveParentToken || isApproved}
          >
            {(isPendingApproveToken || isPendingApproveParentToken) && <Loader2 className="animate-spin" />}
            {isApproved ? '已授权' : '授权'}
          </Button>
          <Button
            className={`w-1/2 text-white ${
              isApproved ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleSwap}
            disabled={!isApproved || isPendingApproveToken || isPendingApproveParentToken || isSwapping}
          >
            {isSwapping && <Loader2 className="animate-spin" />}
            {'兑换'}
          </Button>
        </div>
        {amountsOutError && <div className="text-red-500">{amountsOutError.message}</div>}
        {swapError && <div className="text-red-500">{swapError.message}</div>}
        {errApproveToken && <div className="text-red-500">{errApproveToken.message}</div>}
        {errApproveParentToken && <div className="text-red-500">{errApproveParentToken.message}</div>}

        {/* 新增的手续费和滑点提示 */}
        {fromTokenInfo.amount > 0n && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">手续费 (0.3%)：</span>
              <span>
                {fee} {fromTokenInfo.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">滑点上限 (自动)：</span>
              <span>5.5%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapPanel;
