// src/errors/Love20LaunchErrorsMap.ts

/** LOVE20Launch 合约自定义错误 -> 前端展示文案
 */
export const LOVE20LaunchErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化，无需再次初始化',
  InvalidTokenSymbol: '无效的代币符号',
  TokenSymbolExists: '代币符号已存在',
  NotEligibleToLaunchToken: '当前地址治理票不足，不能开启子币',
  LaunchAlreadyEnded: '公平发射已结束，无法进行操作',
  LaunchNotEnded: '公平发射未结束，无法进行操作',
  ClaimDelayNotPassed: '领取延迟期未到，请稍后再试',
  NoContribution: '没有申购，无法操作',
  NotEnoughWaitingBlocks: '等待区块数不足',
  TokensAlreadyClaimed: '代币已领取，请勿重复领取',
  LaunchAlreadyExists: '公平发射已存在',
  ParentTokenNotSet: '父代币未设置',
  ZeroContribution: '申购数量不能为0',
  InvalidTokenAddress: '无效的代币地址',
  InvalidToAddress: '无效的接收地址',
  InvalidParentToken: '无效的父代币',
  NotEnoughChildTokenWaitingBlocks: '子代币等待区块数不足',
};
