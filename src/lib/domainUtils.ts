/**
 * 业务逻辑相关的计算工具函数
 */

/**
 * 计算治理质押的预计年化收益率(APY)
 * @param rewardAvailable 可用奖励总量
 * @param tokenAmountForSl 流动性质押的代币数量
 * @param stAmount 代币质押的数量
 * @returns 格式化后的APY字符串，如"12.5%"
 */
export const calculateAPY = (
  rewardAvailable: bigint | undefined,
  tokenAmountForSl: bigint | undefined,
  stAmount: bigint | undefined,
): string => {
  if (!rewardAvailable || !tokenAmountForSl) return '0%';

  // 年区块数 = 365天 * 86400秒/天 / 每个区块的秒数
  const blocksPerYear = (365 * 86400) / Number(process.env.NEXT_PUBLIC_BLOCK_TIME || 0);
  // 一个阶段的区块数
  const phaseBlocks = BigInt(process.env.NEXT_PUBLIC_PHASE_BLOCKS || 0);
  if (blocksPerYear === 0 || phaseBlocks === 0n) {
    console.error('配置错误: NEXT_PUBLIC_BLOCK_TIME 或 NEXT_PUBLIC_PHASE_BLOCKS 未设置');
    return '0%';
  }

  // 本轮治理激励
  const rewardForPhase = rewardAvailable ? (rewardAvailable * 99n * 99n) / 2000000n : BigInt(0);
  // 所有质押资产总和
  const totalStaked = (tokenAmountForSl * 2n || BigInt(0)) + (stAmount || BigInt(0));
  // 避免除以零
  if (totalStaked === BigInt(0)) {
    return '0%';
  }

  // 计算APY: (reward / totalStaked) / (phaseBlocks / blocksPerYear) * 100%
  const apy = (Number(rewardForPhase) / Number(totalStaked) / (Number(phaseBlocks) / blocksPerYear)) * 100;

  // 格式化APY，显示整数加2位小数，如果小数最后是0，则去掉
  return `${apy.toFixed(2).replace(/\.?0+$/, '')}%`;
};

/**
 * 计算行动奖励的年化收益率(APY)
 * @param expectedReward 当轮行动激励
 * @param joinedAmount 参与行动代币
 * @returns 格式化后的APY百分比字符串
 */
export const calculateActionAPY = (expectedReward?: bigint, joinedAmount?: bigint): string => {
  // 如果没有数据，返回0%
  if (!expectedReward || !joinedAmount || joinedAmount === 0n) return '0%';

  // 年区块数 = 365天 * 86400秒/天 / 每个区块的秒数
  const blocksPerYear = (365 * 86400) / Number(process.env.NEXT_PUBLIC_BLOCK_TIME || 0);
  // 一个阶段的区块数
  const phaseBlocks = BigInt(process.env.NEXT_PUBLIC_PHASE_BLOCKS || 0);

  if (blocksPerYear === 0 || phaseBlocks === 0n) {
    console.error('配置错误: BLOCK_TIME 或 PHASE_BLOCKS 未设置或为0');
    return '0%';
  }

  // 计算APY: 当轮行动激励 / 参与行动代币 / (一个阶段区块数/年区块数) * 100%
  const apy = (Number(expectedReward) / Number(joinedAmount) / (Number(phaseBlocks) / blocksPerYear)) * 100;

  // 格式化APY，显示整数加2位小数，如果小数最后是0，则去掉
  return `${apy.toFixed(2).replace(/\.?0+$/, '')}%`;
};
