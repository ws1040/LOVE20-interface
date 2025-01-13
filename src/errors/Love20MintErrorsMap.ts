// src/errors/Love20MintErrorsMap.ts

/** LOVE20Mint 合约自定义错误 -> 前端展示文案
 */
export const LOVE20MintErrorsMap: Record<string, string> = {
  RoundNotFinished: '轮次未结束，无法铸造代币奖励',
  NoRewardAvailable: '没有奖励可用',
  RoundStartMustBeLessOrEqualToRoundEnd: '轮次开始必须小于或等于轮次结束',
  NotEnoughReward: '奖励不足，无法铸造',
  NotEnoughRewardToBurn: '奖励不足，无法销毁',
};
