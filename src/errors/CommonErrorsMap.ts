/** 通用错误映射（多个合约共享的错误）
 */
export const CommonErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化，无需再次初始化',
  InvalidToAddress: '无效的目标地址',
  NotEnoughWaitingBlocks: '等待区块数不足',
  InvalidAddress: '无效地址',
  RoundNotStarted: '本轮尚未开始，请等待轮次开始后再试',
};
