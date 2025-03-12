// src/errors/Love20StakeErrorsMap.ts

/** LOVE20Stake 合约自定义错误 -> 前端展示文案
 */
export const LOVE20StakeErrorsMap: Record<string, string> = {
  NotAllowedToStakeAtRoundZero: '不允许在0轮进行质押',
  InvalidToAddress: '无效的接收地址',
  StakeAmountMustBeSet: '质押数量必须大于0',
  ReleaseAlreadyRequested: '已请求释放',
  ReleaseNotRequested: '未请求释放',
  PromisedWaitingRoundsOutOfRange: '承诺等待的轮次超出范围',
  PromisedWaitingRoundsMustBeGreaterOrEqualThanBefore: '承诺等待的轮次必须大于或等于之前的轮次',
  NoStakedLiquidity: '无质押的流动性',
  NoStakedLiquidityOrToken: '没有质押的流动性或代币',
  AlreadyUnstaked: '已解除质押，无需再次解除',
  UnableToUnstakeAtRoundZero: '无法在第0轮解除质押',
  NotEnoughWaitingPhases: '等待阶段数量不足',
  RoundHasNotStartedYet: '轮次尚未开始',
  TokenAmountNotEnough: '代币数量不足',
  'transfer amount exceeds balance': '转账数量超过余额',
};
