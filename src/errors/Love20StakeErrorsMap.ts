// src/errors/Love20StakeErrorsMap.ts

/** LOVE20Stake 合约自定义错误 -> 前端展示文案
 */
export const LOVE20StakeErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化，无需再次初始化',
  NotAllowedToStakeAtRoundZero: '不允许在第0轮进行质押',
  InvalidToAddress: '无效的接收地址',
  StakeAmountMustBeSet: '质押数量必须大于0',
  UnstakeAlreadyRequested: '已申请解除质押，还未过解锁期或未取走资产，不能再次质押',
  UnstakeNotRequested: '未申请解除质押',
  PromisedWaitingPhasesOutOfRange: '承诺等待的阶段数超出许可范围',
  PromisedWaitingPhasesMustBeGreaterOrEqualThanBefore: '承诺等待的阶段数必须大于或等于之前的阶段数',
  NoStakedLiquidity: '没有质押获取治理票，不能质押token获取加速激励',
  AlreadyUnstaked: '已解除质押，无需再次解除',
  NotEnoughWaitingBlocks: '等待区块数量不足',
  RoundHasNotStartedYet: '轮次尚未开始',
};
