// src/errors/Love20VerifyErrorsMap.ts

/** LOVE20Verify 合约自定义错误 -> 前端展示文案
 */
export const LOVE20VerifyErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化',
  AddressCannotBeZero: '地址不能为空',
  FirstTokenAddressCannotBeZero: '第一个代币地址不能为空',
  RandomAddressCannotBeZero: '随机地址不能为空',
  ScoresAndAccountsLengthMismatch: '分数和地址数量不匹配',
  ScoresExceedVotesNum: '分数超过投票数量',
  RoundNotStarted: '轮次还没有开始，请耐心等待',
};
