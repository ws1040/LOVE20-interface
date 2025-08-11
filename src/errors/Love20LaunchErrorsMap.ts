// src/errors/Love20LaunchErrorsMap.ts

/** LOVE20Launch 合约自定义错误 -> 前端展示文案
 */
export const LOVE20LaunchErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化，无需再次初始化',
  InvalidTokenSymbol: '无效的代币符号',
  TokenSymbolExists: '代币符号已存在',
  NotEligibleToLaunchToken: '不符合启动代币的条件',
  LaunchAlreadyEnded: '公平发射已结束',
  LaunchNotEnded: '公平发射尚未结束',
  ClaimDelayNotPassed: '当前还不能领取，请下一区块再来领取',
  NoContribution: '没有申购记录',
  NotEnoughWaitingBlocks: '等待区块数不足',
  TokensAlreadyClaimed: '代币已经领取',
  LaunchAlreadyExists: '公平发射已存在',
  ParentTokenNotSet: '父代币未设置',
  ZeroContribution: '申购数量为零',
  InvalidTokenAddress: '无效的代币地址',
  InvalidToAddress: '无效的目标地址',
  InvalidParentToken: '无效的父代币',
};
