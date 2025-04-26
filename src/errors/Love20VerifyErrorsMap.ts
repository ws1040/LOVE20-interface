// src/errors/Love20VerifyErrorsMap.ts

/** LOVE20Verify 合约自定义错误 -> 前端展示文案
 */
export const LOVE20VerifyErrorsMap: Record<string, string> = {
  AddressCannotBeZero: '地址不能为空',
  ScoresAndAccountsLengthMismatch: '分数和地址数量不匹配',
  ScoresExceedVotesNum: '验证得分超过投票数量',
  ScoresMustIncrease: '验证得分必须增加',
};
