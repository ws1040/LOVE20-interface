// src/errors/Love20JoinErrorsMap.ts

/** LOVE20Join 合约自定义错误 -> 前端展示文案
 */
export const LOVE20JoinErrorsMap: Record<string, string> = {
  AlreadyInitialized: '已初始化',
  AmountIsZero: '数量不能为0',
  AddressCannotBeZero: '地址不能为空',
  LastBlocksOfPhaseCannotJoin: `每轮最后${process.env.NEXT_PUBLIC_JOIN_END_PHASE_BLOCKS}个区块不能加入`,

  ActionNotVoted: '该行动本轮没有投票',
  InvalidToAddress: '目标地址无效',
  JoinedAmountIsZero: '加入数量为0',
  NotInWhiteList: '该地址不在白名单',
  JoinAmountLessThanMinStake: '加入数量小于最小参与代币数',
};
