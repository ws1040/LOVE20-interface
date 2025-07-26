import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { useState } from 'react';
import { config } from '@/src/wagmi';
import { LOVE20StakeAbi } from '@/src/abis/LOVE20Stake';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`;

// =======================
// ===== 读取 Hooks ======
// =======================

/**
 * 获取账户的质押状态
 * @param token 代币地址
 * @param account 账户地址
 */
export const useAccountStakeStatus = (token: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'accountStakeStatus',
    args: [token, account],
    query: {
      enabled: !!token && !!account,
    },
  });

  return {
    slAmount: data?.slAmount as bigint | undefined,
    stAmount: data?.stAmount as bigint | undefined,
    promisedWaitingPhases: data?.promisedWaitingPhases as bigint | 0,
    requestedUnstakeRound: data?.requestedUnstakeRound as bigint | undefined,
    govVotes: data?.govVotes as bigint | undefined,
    isPending,
    error,
  };
};

/**
 * 计算治理投票数
 * @param lpAmount LP代币数量
 * @param promisedWaitingPhases 预期等待轮数
 */
export const useCaculateGovVotes = (lpAmount: bigint, promisedWaitingPhases: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'caculateGovVotes',
    args: [lpAmount, promisedWaitingPhases],
  });

  return { govVotes: data as bigint | undefined, isPending, error };
};

/**
 * 获取累积的代币数量
 * @param tokenAddress 代币地址
 * @param round 轮次
 */
export const useCumulatedTokenAmount = (tokenAddress: `0x${string}`, round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'cumulatedTokenAmount',
    args: [tokenAddress, round],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return { tokenAmount: data as bigint | undefined, isPending, error };
};

/**
 * 按账户获取累积的代币数量
 * @param tokenAddress 代币地址
 * @param round 轮次
 * @param account 账户地址
 */
export const useCumulatedTokenAmountByAccount = (
  tokenAddress: `0x${string}`,
  round: bigint,
  account: `0x${string}`,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'cumulatedTokenAmountByAccount',
    args: [tokenAddress, round, account],
    query: {
      enabled: !!tokenAddress && !!account,
    },
  });

  return { tokenAmount: data as bigint | undefined, isPending, error };
};

/**
 * 获取当前轮次
 */
export const useCurrentRound = (enabled: boolean = true) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'currentRound',
    args: [],
    query: {
      enabled,
    },
  });

  return { currentRound: data as bigint, isPending, error };
};

/**
 * 获取代币的初始质押轮次
 * @param token 代币地址
 */
export const useInitialStakeRound = (tokenAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'initialStakeRound',
    args: [tokenAddress],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return { initialStakeRound: data as bigint | undefined, isPending, error };
};

/**
 * 获取token的总治理票数
 * @param token 代币地址
 */
export const useGovVotesNum = (token: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'govVotesNum',
    args: [token],
    query: {
      enabled: !!token,
    },
  });

  return { govVotesNum: data as bigint | undefined, isPending, error };
};

/**
 * 获取 originBlocks 的值
 */
export const useOriginBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'originBlocks',
    args: [],
  });

  return { originBlocks: data as bigint | undefined, isPending, error };
};

/**
 * 获取 phaseBlocks 的值
 */
export const useRoundBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'phaseBlocks',
    args: [],
  });

  return { phaseBlocks: data as bigint | undefined, isPending, error };
};

/**
 * 根据区块号获取对应的轮次
 * @param blockNumber 区块号
 */
export const useRoundByBlockNumber = (blockNumber: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'roundByBlockNumber',
    args: [blockNumber],
  });

  return { round: data as bigint | undefined, isPending, error };
};

/**
 * 获取有效的治理投票数
 * @param tokenAddress 代币地址
 * @param account 账户地址
 */
export const useValidGovVotes = (tokenAddress: `0x${string}`, account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'validGovVotes',
    args: [tokenAddress, account],
    query: {
      enabled: !!tokenAddress && !!account,
    },
  });

  return { validGovVotes: data as bigint, isPending, error };
};

// =======================
// ===== Write Hooks =====
// =======================

/**
 * 质押流动性
 */
export const useStakeLiquidity = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const stakeLiquidity = async (
    tokenAddress: `0x${string}`,
    tokenAmountForLP: bigint,
    parentTokenAmountForLP: bigint,
    promisedWaitingPhases: bigint,
    to: `0x${string}`,
  ) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        abi: LOVE20StakeAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'stakeLiquidity',
        args: [tokenAddress, tokenAmountForLP, parentTokenAmountForLP, promisedWaitingPhases, to],
      });
      const txHash = await writeContract(config, {
        abi: LOVE20StakeAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'stakeLiquidity',
        args: [tokenAddress, tokenAmountForLP, parentTokenAmountForLP, promisedWaitingPhases, to],
      });
      setHash(txHash);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return {
    stakeLiquidity,
    writeData: hash,
    isWriting: isPending,
    writeError: error,
    isConfirming,
    isConfirmed,
  };
};

/**
 * 质押代币
 */
export const useStakeToken = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  /**
   * 调用合约的 stakeToken 函数
   * @param tokenAddress 代币地址
   * @param tokenAmount 代币数量
   * @param promisedWaitingPhases 预期等待轮数
   * @param to 接收地址
   */
  const stakeToken = async (
    tokenAddress: `0x${string}`,
    tokenAmount: bigint,
    promisedWaitingPhases: bigint,
    to: `0x${string}`,
  ) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        abi: LOVE20StakeAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'stakeToken',
        args: [tokenAddress, tokenAmount, promisedWaitingPhases, to],
      });
      const txHash = await writeContract(config, {
        abi: LOVE20StakeAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'stakeToken',
        args: [tokenAddress, tokenAmount, promisedWaitingPhases, to],
      });
      setHash(txHash);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return {
    stakeToken,
    writeData: hash,
    writeError: error,
    isPending,
    isConfirming,
    isConfirmed,
  };
};

/**
 * 取消质押
 */
export const useUnstake = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const unstake = async (tokenAddress: `0x${string}`) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        abi: LOVE20StakeAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'unstake',
        args: [tokenAddress],
      });
      const txHash = await writeContract(config, {
        abi: LOVE20StakeAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'unstake',
        args: [tokenAddress],
      });
      setHash(txHash);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return {
    unstake,
    writeData: hash,
    isWriting: isPending,
    writeError: error,
    isConfirming,
    isConfirmed,
  };
};

/**
 * 提款
 */
export const useWithdraw = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  /**
   * 调用合约的 withdraw 函数
   * @param tokenAddress 代币地址
   */
  const withdraw = async (tokenAddress: `0x${string}`) => {
    setIsPending(true);
    setError(null);
    try {
      await simulateContract(config, {
        abi: LOVE20StakeAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'withdraw',
        args: [tokenAddress],
      });
      const txHash = await writeContract(config, {
        abi: LOVE20StakeAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'withdraw',
        args: [tokenAddress],
      });
      setHash(txHash);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  return {
    withdraw,
    writeData: hash,
    isWriting: isPending,
    writeError: error,
    isConfirming,
    isConfirmed,
  };
};
