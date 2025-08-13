// src/errors/Love20SLTokenErrorsMap.ts

/** LOVE20SLToken 合约自定义错误 -> 前端展示文案
 */
export const LOVE20SLTokenErrorsMap: Record<string, string> = {
  NotMinter: '不是铸造者，无法执行此操作',
  InvalidAddress: '无效地址',
  NoTokensToBurn: '没有代币可以销毁',
  InsufficientLiquidity: '流动性不足',
  UniswapLpMintedIsZero: 'Uniswap LP铸造数量为零',
  TotalLpExceedsBalance: '总LP数量超过余额',
};
