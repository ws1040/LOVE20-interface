// src/errors/Love20TokenErrorsMap.ts

/** LOVE20Token 合约自定义错误 -> 前端展示文案
 */
export const LOVE20TokenErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化',
  InvalidAddress: '无效的地址',
  NotEligibleToMint: '不符合铸造代币的条件',
  ExceedsMaxSupply: '超过最大供应量',
  InsufficientBalance: '余额不足',
  TransferFailed: '转账失败，请稍后重试',
  InvalidSupply: '无效的供应量',
};
