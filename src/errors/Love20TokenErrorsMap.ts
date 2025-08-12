// src/errors/Love20TokenErrorsMap.ts

/** LOVE20Token 合约自定义错误 -> 前端展示文案
 */
export const LOVE20TokenErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化，无需再次初始化',
  InvalidAddress: '无效地址',
  NotMinter: '不是铸造者，无法执行此操作',
  ExceedsMaxSupply: '超过最大供应量',
  InsufficientBalance: '余额不足',
  InvalidSupply: '无效的供应量',
};
