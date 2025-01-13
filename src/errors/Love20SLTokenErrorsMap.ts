// src/errors/Love20SLTokenErrorsMap.ts

/** LOVE20SLToken 合约自定义错误 -> 前端展示文案
 */
export const LOVE20SLTokenErrorsMap: Record<string, string> = {
  NotEligibleToMint: '不符合铸造代币的条件',
  InvalidAddress: '无效的地址',
  NoTokensToBurn: '没有代币可销毁',
  InsufficientLiquidity: '流动性不足',
  TotalLpExceedsBalance: '总LP数量超过余额',
  TransferFailed: '转账失败，请稍后重试',
};
