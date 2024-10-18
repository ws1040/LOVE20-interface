import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOVE20StakeAbi } from '../../abis/LOVE20Stake';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`;

// =======================
// ===== 读取 Hooks ======
// =======================

/**
 * 获取 PROMISED_WAITING_ROUNDS_MAX 的值
 */
export const usePromisedWaitingRoundsMax = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'PROMISED_WAITING_ROUNDS_MAX',
    args: [],
  });

  return { promisedWaitingRoundsMax: data as bigint | undefined, isPending, error };
};

/**
 * 获取 PROMISED_WAITING_ROUNDS_MIN 的值
 */
export const usePromisedWaitingRoundsMin = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'PROMISED_WAITING_ROUNDS_MIN',
    args: [],
  });

  return { promisedWaitingRoundsMin: data as bigint | undefined, isPending, error };
};

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
  });

  return {
    slAmount: data?.[0] as bigint | undefined,
    stAmount: data?.[1] as bigint | undefined,
    promisedWaitingRounds: data?.[2] as bigint | undefined,
    requestedUnstakeRound: data?.[3] as bigint | undefined,
    govVotes: data?.[4] as bigint | undefined,
    isPending,
    error,
  };
};

/**
 * 计算治理投票数
 * @param lpAmount LP代币数量
 * @param promisedWaitingRounds 预期等待轮数
 */
export const useCaculateGovVotes = (lpAmount: bigint, promisedWaitingRounds: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'caculateGovVotes',
    args: [lpAmount, promisedWaitingRounds],
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
  accountAddress: `0x${string}`
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'cumulatedTokenAmountByAccount',
    args: [tokenAddress, round, accountAddress],
  });

  return { tokenAmount: data as bigint | undefined, isPending, error };
};

/**
 * 获取当前轮次
 */
export const useCurrentRound = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'currentRound',
    args: [],
  });

  return { currentRound: data as bigint | undefined, isPending, error };
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
 * 获取 roundBlocks 的值
 */
export const useRoundBlocks = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'roundBlocks',
    args: [],
  });

  return { roundBlocks: data as bigint | undefined, isPending, error };
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
 * 获取轮次范围
 * @param round 轮次
 */
export const useRoundRange = (round: bigint) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'roundRange',
    args: [round],
  });

  return {
    start: data?.[0] as bigint | undefined,
    end: data?.[1] as bigint | undefined,
    isPending,
    error,
  };
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
  reverse: boolean
) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'stakeUpdateRoundsByPage',
    args: [tokenAddress, start, end, reverse],
  });

  return { rounds: data as bigint[] | undefined, isPending, error };
};

/**
 * 获取质押的流动性地址
 * @param account 账户地址
 */
export const useStakedLiquidityAddress = (account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'stakedLiquidityAddress',
    args: [account],
  });

  return { stakedLiquidityAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * 获取质押的代币地址
 * @param account 账户地址
 */
export const useStakedTokenAddress = (account: `0x${string}`) => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'stakedTokenAddress',
    args: [account],
  });

  return { stakedTokenAddress: data as `0x${string}` | undefined, isPending, error };
};

/**
 * 获取 Uniswap V2 工厂地址
 */
export const useUniswapV2Factory = () => {
  const { data, isPending, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOVE20StakeAbi,
    functionName: 'uniswapV2Factory',
    args: [],
  });

  return { uniswapV2Factory: data as `0x${string}` | undefined, isPending, error };
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
 * 初始化代币
 */
export const useInitToken = () => {
  const {
    writeContract,
    isPending: isWriting,
    data: writeData,
    error: writeError,
  } = useWriteContract();

  /**
   * 调用合约的 initToken 函数
   * @param tokenAddress 代币地址
   */
  const initToken = async (tokenAddress: `0x${string}`) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20StakeAbi,
        functionName: 'initToken',
        args: [tokenAddress],
      });
    } catch (err) {
      console.error('InitToken failed:', err);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { initToken, writeData, isWriting, writeError, isConfirming, isConfirmed };
};

/**
 * 质押流动性
 */
export const useStakeLiquidity = () => {
  const {
    writeContract,
    isPending: isWriting,
    data: writeData,
    error: writeError,
  } = useWriteContract();

  /**
   * 调用合约的 stakeLiquidity 函数
   * @param tokenAddress 代币地址
   * @param tokenAmountForLP LP代币数量
   * @param parentTokenAmountForLP 父代币LP数量
   * @param promisedWaitingRounds 预期等待轮数
   * @param to 接收地址
   */
  const stakeLiquidity = async (
    tokenAddress: `0x${string}`,
    tokenAmountForLP: bigint,
    parentTokenAmountForLP: bigint,
    promisedWaitingRounds: bigint,
    to: `0x${string}`
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20StakeAbi,
        functionName: 'stakeLiquidity',
        args: [tokenAddress, tokenAmountForLP, parentTokenAmountForLP, promisedWaitingRounds, to],
      });
    } catch (err) {
      console.error('StakeLiquidity failed:', err);
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
  const {
    writeContract,
    isPending: isWriting,
    data: writeData,
    error: writeError,
  } = useWriteContract();

  /**
   * 调用合约的 stakeToken 函数
   * @param tokenAddress 代币地址
   * @param tokenAmount 代币数量
   * @param promisedWaitingRounds 预期等待轮数
   * @param to 接收地址
   */
  const stakeToken = async (
    tokenAddress: `0x${string}`,
    tokenAmount: bigint,
    promisedWaitingRounds: bigint,
    to: `0x${string}`
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOVE20StakeAbi,
        functionName: 'stakeToken',
        args: [tokenAddress, tokenAmount, promisedWaitingRounds, to],
      });
    } catch (err) {
      console.error('StakeToken failed:', err);
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
  const {
    writeContract,
    isPending: isWriting,
    data: writeData,
    error: writeError,
  } = useWriteContract();

  /**
   * 调用合约的 unstake 函数
   * @param tokenAddress 代币地址
   */
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
  const {
    writeContract,
    isPending: isWriting,
    data: writeData,
    error: writeError,
  } = useWriteContract();

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
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return { withdraw, writeData, isWriting, writeError, isConfirming, isConfirmed };
};