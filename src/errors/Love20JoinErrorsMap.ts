// src/errors/Love20JoinErrorsMap.ts

/** LOVE20Join 合约自定义错误 -> 前端展示文案
 */
export const LOVE20JoinErrorsMap: Record<string, string> = {
  RoundsIsZero: '轮次为0',
  LastBlocksOfRoundCannotJoin: '每轮最后一些区块不能加入',
  ActionNotVoted: '该行动本轮没有投票',
  TransferFailed: '转账失败',
  StakedAmountIsZero: '质押数量为0',
  ActionAlreadyJoined: '您已加入该行动，请勿重复加入',
  JoinedRoundIsNotFinished: '加入的轮次未结束',
  VerificationInfoIsEmpty: '验证信息为空',
  RoundNotFinished: '轮次未结束',
  NotInWhiteList: '该地址不在白名单',
  StakedAmountExceedsMaxStake: '质押数量超过最大质押数量',
};
