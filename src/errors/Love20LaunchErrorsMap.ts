// src/errors/Love20LaunchErrorsMap.ts

/** LOVE20Launch 合约自定义错误 -> 前端展示文案
 */
export const LOVE20LaunchErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化，无需再次初始化',
  InvalidTokenSymbol: '无效的代币符号',
  TokenSymbolExists: '代币符号已存在',
  NotEligibleToLaunchToken: '不符合启动代币的条件',
  LaunchAlreadyEnded: '启动已结束',
  LaunchNotEnded: '启动尚未结束',
  ClaimDelayNotPassed: '认领延迟期未过，请稍后再试',
  NoContribution: '没有贡献记录',
  NotEnoughWaitingBlocks: '等待区块数不足',
  TokensAlreadyClaimed: '代币已经认领',
  LaunchAlreadyExists: '启动已存在',
  ParentTokenNotSet: '父代币未设置',
  ZeroContribution: '贡献数量为零',
  InvalidTokenAddress: '无效的代币地址',
  InvalidToAddress: '无效的目标地址',
  InvalidParentToken: '无效的父代币',
};
