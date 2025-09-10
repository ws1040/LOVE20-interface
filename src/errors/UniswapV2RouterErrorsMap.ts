// src/errors/UniswapV2RouterErrorsMap.ts

/** UniswapV2Router 合约自定义错误 -> 前端展示文案
 */
export const UniswapV2RouterErrorsMap: Record<string, string> = {
  EXPIRED: '交易已过期，请重新交易',
  INSUFFICIENT_A_AMOUNT: 'A代币数量不足，请调整输入数量',
  INSUFFICIENT_B_AMOUNT: 'B代币数量不足，请调整输入数量',
  INSUFFICIENT_OUTPUT_AMOUNT: '最新价格变动超过滑点，交易失败，请调整输入数量',
  EXCESSIVE_INPUT_AMOUNT: '输入数量过多，请调整输入数量',
  INVALID_PATH: '无效的兑换路径',
};
