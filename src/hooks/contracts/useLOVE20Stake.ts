import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
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
 * @param accountAddress 账户地址
 */
export const useCumulatedTokenAmountByAccount = (
  tokenAddress: `0x${string}`,
  round: bigint,
  accountAddress: `0x${string}`,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'cumulatedTokenAmountByAccount',
    args: [tokenAddress, round, accountAddress],
    query: {
      enabled: !!tokenAddress && !!accountAddress,
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
 * 分页获取更新的轮次
 * @param tokenAddress 代币地址
 * @param start 起始轮次
 * @param end 结束轮次
 * @param reverse 是否逆序
 */
export const useStakeUpdateRoundsByPage = (
  tokenAddress: `0x${string}`,
  start: bigint,
  end: bigint,
  reverse: boolean,
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'stakeUpdateRoundsByPage',
    args: [tokenAddress, start, end, reverse],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return { rounds: data as bigint[] | undefined, isPending, error };
};

/**
 * 获取有效的治理投票数
 * @param tokenAddress 代币地址
 * @param accountAddress 账户地址
 */
export const useValidGovVotes = (tokenAddress: `0x${string}`, accountAddress: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'validGovVotes',
    args: [tokenAddress, accountAddress],
    query: {
      enabled: !!tokenAddress && !!accountAddress,
    },
  });

  return { validGovVotes: data as bigint, isPending, error };
};

// =======================
// ===== 写入 Hooks ======
// =======================

/**
 * 质押流动性
 */
export const useStakeLiquidity = () => {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const stakeLiquidity = async (
    tokenAddress: `0x${string}`,
    tokenAmountForLP: bigint,
    parentTokenAmountForLP: bigint,
    promisedWaitingPhases: bigint,
    to: `0x${string}`,
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20StakeAbi,
        functionName: 'stakeLiquidity',
        args: [tokenAddress, tokenAmountForLP, parentTokenAmountForLP, promisedWaitingPhases, to],
      });
    } catch (err) {
      console.error('StakeLiquidity failed:', err);
      // 重新抛出错误，让组件能够捕获
      throw err;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return {
    stakeLiquidity,
    writeData,
    isWriting,
    writeError,
    isConfirming,
    isConfirmed,
  };
};

/**
 * 质押代币
 */
export const useStakeToken = () => {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

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
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20StakeAbi,
        functionName: 'stakeToken',
        args: [tokenAddress, tokenAmount, promisedWaitingPhases, to],
      });
    } catch (err) {
      console.error('StakeToken failed:', err);
      // 重新抛出错误，让组件能够捕获
      throw err;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return {
    stakeToken,
    writeData,
    isWriting,
    writeError,
    isConfirming,
    isConfirmed,
  };
};

/**
 * 取消质押
 */
export const useUnstake = () => {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  const unstake = async (tokenAddress: `0x${string}`) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20StakeAbi,
        functionName: 'unstake',
        args: [tokenAddress],
      });
    } catch (err) {
      console.error('Unstake failed:', err);
      // 重新抛出错误，让组件能够捕获
      throw err;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { unstake, writeData, isWriting, writeError, isConfirming, isConfirmed };
};

/**
 * 提款
 */
export const useWithdraw = () => {
  const { writeContract, isPending: isWriting, data: writeData, error: writeError } = useWriteContract();

  /**
   * 调用合约的 withdraw 函数
   * @param tokenAddress 代币地址
   */
  const withdraw = async (tokenAddress: `0x${string}`) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20StakeAbi,
        functionName: 'withdraw',
        args: [tokenAddress],
      });
    } catch (err) {
      console.error('Withdraw failed:', err);
      // 重新抛出错误，让组件能够捕获
      throw err;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { withdraw, writeData, isWriting, writeError, isConfirming, isConfirmed };
};
