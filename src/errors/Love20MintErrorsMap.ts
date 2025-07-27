// src/errors/Love20MintErrorsMap.ts

/** LOVE20Mint 合约自定义错误 -> 前端展示文案
 */
export const LOVE20MintErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化，无需再次初始化',
  NoRewardAvailable: '没有奖励可用',
  AlreadyMinted: '激励已经铸造，不能重复铸造',
  RoundNotReadyToMint: '该轮次还不能铸造奖励',
  NotEnoughReward: '奖励不足，无法铸造',
  NotEnoughRewardToBurn: '奖励不足，无法销毁',
};
