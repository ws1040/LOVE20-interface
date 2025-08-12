// src/errors/Love20STTokenErrorsMap.ts

/** LOVE20STToken 合约自定义错误 -> 前端展示文案
 */
export const LOVE20STTokenErrorsMap: Record<string, string> = {
  NotMinter: '不是铸造者，无法执行此操作',
  InvalidAddress: '无效地址',
  AmountIsGreaterThanReserve: '数量超过储备金',
};
