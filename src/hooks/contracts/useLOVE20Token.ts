// hooks/useLove20Token.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20TokenAbi } from '@/src/abis/LOVE20Token';

/* =======================
   ===== Read Hooks ======
   ======================= */

/**
 * useAllowance Hook
 * @param owner - Address of the owner
 * @param spender - Address of the spender
 */
export const useAllowance = (token: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'allowance',
    args: [owner, spender],
    query: {
      enabled: !!token && !!owner && !!spender,
    },
  });

  return { allowance: data as bigint | undefined, isPending, error };
};

/**
 * useBalanceOf Hook
 * @param account - Address of the account
 */
export const useBalanceOf = (token: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'balanceOf',
    args: [account],
    query: {
      enabled: !!token && !!account,
    },
  });

  return { balance: data as bigint | undefined, isPending, error };
};

/**
 * useDecimals Hook
 */
export const useDecimals = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'decimals',
    args: [],
  });

  return { decimals: data as number | undefined, isPending, error };
};

/**
 * useInitialized Hook
 */
export const useInitialized = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'initialized',
    args: [],
  });

  return { initialized: data as boolean | undefined, isPending, error };
};

/**
 * useMaxSupply Hook
 */
export const useMaxSupply = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'maxSupply',
    args: [],
  });

  return { maxSupply: data as bigint | undefined, isPending, error };
};

/**
 * useMintableAddress Hook
 */
export const useMintableAddress = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'mintableAddress',
    args: [],
  });

  return { mintableAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * useName Hook
 */
export const useName = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'name',
    args: [],
  });

  return { name: data as string | undefined, isPending, error };
};

/**
 * useParentPool Hook
 */
export const useParentPool = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'parentPool',
    args: [],
  });

  return { parentPool: data as bigint | undefined, isPending, error };
};

/**
 * useParentTokenAddress Hook
 */
export const useParentTokenAddress = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'parentTokenAddress',
    args: [],
  });

  return { parentTokenAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * useReentrant Hook
 */
export const useReentrant = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'reentrant',
    args: [],
  });

  return { reentrant: data as boolean | undefined, isPending, error };
};

/**
 * useSymbol Hook
 */
export const useSymbol = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'symbol',
    args: [],
  });

  return { symbol: data as string | undefined, isPending, error };
};

/**
 * useTotalSupply Hook
 */
export const useTotalSupply = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: token,
    abi: LOVE20TokenAbi,
    functionName: 'totalSupply',
    args: [],
    query: {
      enabled: !!token,
    },
  });

  return { totalSupply: data as bigint | undefined, isPending, error };
};

/* =======================
   ===== Write Hooks =====
   ======================= */
/**
 * useApprove Hook
 */
export function useApprove(token: `0x${string}`) {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  const approve = async (spender: `0x${string}`, value: bigint) => {
    try {
      await writeContract({
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'approve',
        args: [spender, value],
      });
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  return { approve, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/**
 * useBurn Hook
 */
export function useBurn(token: `0x${string}`) {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  const burn = async (amount: bigint) => {
    try {
      await writeContract({
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'burn',
        args: [amount],
      });
    } catch (err) {
      console.error('Burn failed:', err);
    }
  };

  return { burn, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/**
 * useBurnForParentToken Hook
 */
export function useBurnForParentToken(token: `0x${string}`) {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  const burnForParentToken = async (amount: bigint) => {
    try {
      await writeContract({
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'burnForParentToken',
        args: [amount],
      });
    } catch (err) {
      console.error('Burn for Parent Token failed:', err);
    }
  };

  return { burnForParentToken, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/**
 * useInitialize Hook
 */
export function useInitialize(token: `0x${string}`) {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  const initialize = async (
    mintableAddress: `0x${string}`,
    parentTokenAddress: `0x${string}`,
    slAddress: `0x${string}`,
    stAddress: `0x${string}`,
  ) => {
    try {
      await writeContract({
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'initialize',
        args: [mintableAddress, parentTokenAddress, slAddress, stAddress],
      });
    } catch (err) {
      console.error('Initialize failed:', err);
    }
  };

  return { initialize, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/**
 * useMint Hook
 */
export function useMint(token: `0x${string}`) {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  const mint = async (to: `0x${string}`, amount: bigint) => {
    try {
      await writeContract({
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'mint',
        args: [to, amount],
      });
    } catch (err) {
      console.error('Mint failed:', err);
    }
  };

  return { mint, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/**
 * useTransfer Hook
 */
export function useTransfer(token: `0x${string}`) {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  const transfer = async (to: `0x${string}`, value: bigint) => {
    try {
      await writeContract({
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'transfer',
        args: [to, value],
      });
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  return { transfer, writeData, isWriting, writeError, isConfirming, isConfirmed };
}

/**
 * useTransferFrom Hook
 */
export function useTransferFrom(token: `0x${string}`) {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  const transferFrom = async (from: `0x${string}`, to: `0x${string}`, value: bigint) => {
    try {
      await writeContract({
        address: token,
        abi: LOVE20TokenAbi,
        functionName: 'transferFrom',
        args: [from, to, value],
      });
    } catch (err) {
      console.error('Transfer From failed:', err);
    }
  };

  return { transferFrom, writeData, isWriting, writeError, isConfirming, isConfirmed };
}
