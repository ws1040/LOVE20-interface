// src/errors/Love20VerifyErrorsMap.ts

/** LOVE20Verify 合约自定义错误 -> 前端展示文案
 */
export const LOVE20VerifyErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化，无需再次初始化',
  ScoresAndAccountsLengthMismatch: '分数和地址数量不匹配',
  ScoresExceedVotesNum: '验证得分超过投票数量',
  ScoresMustIncrease: '验证得分必须增加',
};
