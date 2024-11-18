import { useMemo } from 'react';
import {
  useGetAmountsOut as useRouterGetAmountsOut,
  useGetAmountsIn as useRouterGetAmountsIn,
} from '@/src/hooks/contracts/useUniswapV2Router';
import { Token } from '@/src/contexts/TokenContext';

export const useGetAmountsOut = (
  amountIn: bigint,
  path: `0x${string}`[],
  token: Token | undefined,
  pairExists: boolean,
  isEnabled = true,
) => {
  // 调用 router 的 useGetAmountsOut Hook
  const {
    data: _data,
    error: _error,
    isLoading: _isLoading,
  } = useRouterGetAmountsOut(amountIn, path, isEnabled && pairExists);

  // 使用 useMemo 进行计算
  const { data, error, isLoading } = useMemo(() => {
    console.log('------------useGetAmountsOut-------------');
    console.log('amountIn', amountIn);
    console.log('path', path);
    console.log('token', token);
    console.log('pairExists', pairExists);
    console.log('isEnabled', isEnabled);
    console.log('_data', _data);

    if (!isEnabled || pairExists) {
      return { data: _data, error: _error, isLoading: _isLoading };
    } else {
      // 计算父币和子币的质押比例
      let parentToChildRate = 0n;

      if (token?.address === process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_FIRST_TOKEN) {
        parentToChildRate =
          BigInt(process.env.NEXT_PUBLIC_LAUNCH_AMOUNT || '0') /
          BigInt(process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_FUNDRAISING_GOAL || '1');
      } else {
        parentToChildRate =
          BigInt(process.env.NEXT_PUBLIC_LAUNCH_AMOUNT || '0') /
          BigInt(process.env.NEXT_PUBLIC_PARENT_TOKEN_FUNDRAISING_GOAL || '1');
      }

      // 计算父币或子币的数量
      let calculatedAmountOut: bigint;
      if (path && path.length >= 1 && path[0]?.toLowerCase() === token?.address?.toLowerCase()) {
        // 从子币数量计算父币数量
        calculatedAmountOut = amountIn / parentToChildRate;
      } else {
        // 从父币数量计算子币数量
        calculatedAmountOut = amountIn * parentToChildRate;
      }

      return { data: [amountIn, calculatedAmountOut], error: null, isLoading: false };
    }
  }, [pairExists, _data, _error, _isLoading, amountIn, path, token?.address]);

  return { data, error, isLoading };
};

export const useGetAmountsIn = (
  amountOut: bigint,
  path: `0x${string}`[],
  token: Token | undefined,
  pairExists: boolean,
  isEnabled = true,
) => {
  // 调用 router 的 useGetAmountsIn Hook
  const {
    data: _data,
    error: _error,
    isLoading: _isLoading,
  } = useRouterGetAmountsIn(amountOut, path, isEnabled && pairExists);

  // 使用 useMemo 进行计算
  const { data, error, isLoading } = useMemo(() => {
    console.log('------------useGetAmountsIn-------------');
    console.log('amountOut', amountOut);
    console.log('path', path);
    console.log('token', token);
    console.log('pairExists', pairExists);
    console.log('isEnabled', isEnabled);
    console.log('_data', _data);

    if (!isEnabled || pairExists) {
      return { data: _data, error: _error, isLoading: _isLoading };
    } else {
      // 计算父币和子币的质押比例
      let parentToChildRate = 0n;

      if (token?.address === process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_FIRST_TOKEN) {
        parentToChildRate =
          BigInt(process.env.NEXT_PUBLIC_LAUNCH_AMOUNT || '0') /
          BigInt(process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_FUNDRAISING_GOAL || '1');
      } else {
        parentToChildRate =
          BigInt(process.env.NEXT_PUBLIC_LAUNCH_AMOUNT || '0') /
          BigInt(process.env.NEXT_PUBLIC_PARENT_TOKEN_FUNDRAISING_GOAL || '1');
      }

      // 计算父币或子币的数量
      let calculatedAmountIn: bigint;
      if (path && path.length >= 1 && path[0]?.toLowerCase() === token?.address?.toLowerCase()) {
        // 从子币数量计算父币数量
        calculatedAmountIn = amountOut * parentToChildRate;
      } else {
        // 从父币数量计算子币数量
        calculatedAmountIn = amountOut / parentToChildRate;
      }
      return { data: [calculatedAmountIn, amountOut], error: null, isLoading: false };
    }
  }, [pairExists, _data, _error, _isLoading, amountOut, path, token?.address]);

  return { data, error, isLoading };
};
