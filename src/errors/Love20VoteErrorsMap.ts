// src/errors/Love20VoteErrorsMap.ts

/** LOVE20Vote 合约自定义错误 -> 前端展示文案
 */
export const LOVE20VoteErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化，无需再次初始化',
  InvalidActionIds: '无效的提案ID',
  CannotVote: '没有权限投票',
  NotEnoughVotesLeft: '投票数量不足',
  VotesMustBeGreaterThanZero: '投票数量必须大于0',
};
