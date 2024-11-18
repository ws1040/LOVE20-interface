import { useReadContract } from 'wagmi';
import { LOVE20STTokenAbi } from '@/src/abis/LOVE20STToken';

/**
 * Hook for allowance
 */
export const useAllowance = (address: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'allowance',
    args: [owner, spender],
    query: {
      enabled: !!owner && !!spender,
    },
  });

  return {
    allowance: data as bigint | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for balanceOf
 */
export const useBalanceOf = (address: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'balanceOf',
    args: [account],
  });

  return {
    balance: data as bigint | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for decimals
 */
export const useDecimals = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'decimals',
    args: [],
  });

  return {
    decimals: data as number | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for mintableAddress
 */
export const useMintableAddress = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'mintableAddress',
    args: [],
  });

  return {
    mintableAddress: data as `0x${string}` | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for name
 */
export const useName = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'name',
    args: [],
  });

  return {
    name: data as string | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for reserve
 */
export const useReserve = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'reserve',
    args: [],
  });

  return {
    reserve: data as bigint | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for symbol
 */
export const useSymbol = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'symbol',
    args: [],
  });

  return {
    symbol: data as string | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for tokenAddress
 */
export const useTokenAddress = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'tokenAddress',
    args: [],
  });

  return {
    tokenAddress: data as `0x${string}` | undefined,
    isPending,
    error,
  };
};

/**
 * Hook for totalSupply
 */
export const useTotalSupply = (address: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address,
    abi: LOVE20STTokenAbi,
    functionName: 'totalSupply',
    args: [],
  });

  return {
    totalSupply: data as bigint | undefined,
    isPending,
    error,
  };
};
