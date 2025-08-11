// src/errors/Love20VoteErrorsMap.ts

/** LOVE20Vote 合约自定义错误 -> 前端展示文案
 */
export const LOVE20VoteErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化，无需再次初始化',
  ActionNotSubmitted: '提案未提交，无法投票',
  CannotVote: '没有剩余治理票，无法投票',
  NotEnoughVotesLeft: '投票数量不足',
  VotesMustBeGreaterThanZero: '投票数量必须大于0',
};
