// src/errors/index.ts
import { LOVE20LaunchErrorsMap } from './Love20LaunchErrorsMap';
import { LOVE20JoinErrorsMap } from './Love20JoinErrorsMap';
import { LOVE20MintErrorsMap } from './Love20MintErrorsMap';
import { LOVE20SubmitErrorsMap } from './Love20SubmitErrorsMap';
import { LOVE20StakeErrorsMap } from './Love20StakeErrorsMap';
import { LOVE20TokenErrorsMap } from './Love20TokenErrorsMap';
import { LOVE20SLTokenErrorsMap } from './Love20SLTokenErrorsMap';
import { LOVE20STTokenErrorsMap } from './Love20STTokenErrorsMap';
import { LOVE20VerifyErrorsMap } from './Love20VerifyErrorsMap';
import { LOVE20VoteErrorsMap } from './Love20VoteErrorsMap';
import { UniswapV2RouterErrorsMap } from './UniswapV2RouterErrorsMap';

/**
 * 全部合约错误映射的"总汇"。
 */
export const ContractErrorsMaps: Record<string, Record<string, string>> = {
  launch: LOVE20LaunchErrorsMap,
  join: LOVE20JoinErrorsMap,
  mint: LOVE20MintErrorsMap,
  stake: LOVE20StakeErrorsMap,
  submit: LOVE20SubmitErrorsMap,
  token: LOVE20TokenErrorsMap,
  slToken: LOVE20SLTokenErrorsMap,
  stToken: LOVE20STTokenErrorsMap,
  verify: LOVE20VerifyErrorsMap,
  vote: LOVE20VoteErrorsMap,
  uniswapV2Router: UniswapV2RouterErrorsMap,
};

/**
 * 错误选择器（4字节十六进制）到错误名称的映射
 * 用于处理区块链节点直接返回十六进制错误签名的情况
 */
export const ErrorSelectorsMap: Record<string, Record<string, string>> = {
  // 通用错误（多个合约共享）
  common: {
    '0x0dc149f0': 'AlreadyInitialized',
    '0xe622e040': 'AddressCannotBeZero',
    '0x8aa3a72f': 'InvalidToAddress',
    '0xf55a5f82': 'NotEnoughWaitingBlocks',
    '0x54331660': 'NotEligibleToMint',
    '0xe6c4247b': 'InvalidAddress',
  },

  // IPhase 相关错误
  phase: {
    '0x8e9c6e1c': 'RoundNotStarted',
  },

  // ILOVE20TokenFactory 相关错误
  tokenFactory: {
    '0x0dc149f0': 'AlreadyInitialized',
    '0xeac0d389': 'ZeroAddress',
    '0x62a65aec': 'EmptyString',
    '0x2c5211c6': 'InvalidAmount',
    '0x5c427cd9': 'UnauthorizedCaller',
  },

  // ILOVE20STToken 相关错误
  stToken: {
    '0x54331660': 'NotEligibleToMint',
    '0xe6c4247b': 'InvalidAddress',
    '0x8fe0a65f': 'AmountIsGreaterThanReserve',
  },

  // ILOVE20Verify 相关错误
  verify: {
    '0x0dc149f0': 'AlreadyInitialized',
    '0x118fd7b8': 'AlreadyVerified',
    '0xe622e040': 'AddressCannotBeZero',
    '0xd6616002': 'ScoresAndAccountsLengthMismatch',
    '0x99b9530a': 'ScoresExceedVotesNum',
    '0x64d9b4d8': 'ScoresMustIncrease',
  },

  // ILOVE20Submit 相关错误
  submit: {
    '0x0dc149f0': 'AlreadyInitialized',
    '0xaec0699e': 'CannotSubmitAction',
    '0x0bc2eb6a': 'ActionIdNotExist',
    '0x7bb17d5a': 'StartGreaterThanEnd',
    '0x077294b9': 'MinStakeZero',
    '0x8ed5f448': 'MaxRandomAccountsZero',
    '0x9fbfc589': 'AlreadySubmitted',
    '0x9fb13b87': 'OnlyOneSubmitPerRound',
  },

  // ILOVE20Stake 相关错误
  stake: {
    '0x0dc149f0': 'AlreadyInitialized',
    '0xbe9cd064': 'NotAllowedToStakeAtRoundZero',
    '0x8aa3a72f': 'InvalidToAddress',
    '0xa748da06': 'StakeAmountMustBeSet',
    '0xd6e1a062': 'ReleaseAlreadyRequested',
    '0xf3acff1d': 'ReleaseNotRequested',
    '0x50cd778e': 'PromisedWaitingRoundsOutOfRange',
    '0x268e8b5e': 'PromisedWaitingRoundsMustBeGreaterOrEqualThanBefore',
    '0x745dc627': 'NoStakedLiquidity',
    '0x8b520315': 'NoStakedLiquidityOrToken',
    '0xd8315312': 'AlreadyUnstaked',
    '0xf55a5f82': 'NotEnoughWaitingBlocks',
    '0x6e0f544a': 'RoundHasNotStartedYet',
  },

  // ILOVE20Launch 相关错误
  launch: {
    '0x0dc149f0': 'AlreadyInitialized',
    '0x220839c9': 'InvalidTokenSymbol',
    '0xd567cb6d': 'TokenSymbolExists',
    '0xdb3a599a': 'NotEligibleToDeployToken',
    '0x6a25ec6f': 'LaunchAlreadyEnded',
    '0x34ad25cc': 'LaunchNotEnded',
    '0x65c7efcc': 'NoContribution',
    '0xf55a5f82': 'NotEnoughWaitingBlocks',
    '0xa4f81929': 'TokensAlreadyClaimed',
    '0xf09762b6': 'LaunchAlreadyExists',
    '0xbeea6d6c': 'ParentTokenNotSet',
    '0xab82a248': 'ZeroContribution',
    '0x670ff944': 'InvalidParentToken',
    '0xf1266c59': 'NotEnoughChildTokenWaitingBlocks',
  },

  // ILOVE20Token 相关错误
  token: {
    '0x0dc149f0': 'AlreadyInitialized',
    '0xe6c4247b': 'InvalidAddress',
    '0x54331660': 'NotEligibleToMint',
    '0xc30436e9': 'ExceedsMaxSupply',
    '0xf4d678b8': 'InsufficientBalance',
    '0x15ae6727': 'InvalidSupply',
  },

  // ILOVE20Random 相关错误
  random: {
    '0x0dc149f0': 'AlreadyInitialized',
    '0x20068f59': 'NotEligible2UpdateRandomSeed',
    '0xf790fcc7': 'ModifierAddressCannotBeZero',
  },

  // ILOVE20Mint 相关错误
  mint: {
    '0x0dc149f0': 'AlreadyInitialized',
    '0x6d363c45': 'NoRewardAvailable',
    '0x7b9893a6': 'RoundStartMustBeLessOrEqualToRoundEnd',
    '0xc9d2c178': 'NotEnoughReward',
    '0xce0a57ff': 'NotEnoughRewardToBurn',
  },

  // ILOVE20Vote 相关错误
  vote: {
    '0x0dc149f0': 'AlreadyInitialized',
    '0x3a2ac8fc': 'InvalidActionIds',
    '0xc527094f': 'CannotVote',
    '0xcc1f40e6': 'NotEnoughVotesLeft',
    '0xc94f8246': 'VotesMustBeGreaterThanZero',
  },

  // ILOVE20SLToken 相关错误
  slToken: {
    '0x54331660': 'NotEligibleToMint',
    '0xe6c4247b': 'InvalidAddress',
    '0xb951d9d6': 'NoTokensToBurn',
    '0xbb55fd27': 'InsufficientLiquidity',
    '0xe98204b2': 'TotalLpExceedsBalance',
    '0x648564d3': 'InvalidRatio',
  },

  // ILOVE20Join 相关错误
  join: {
    '0x0dc149f0': 'AlreadyInitialized',
    '0xe622e040': 'AddressCannotBeZero',
    '0x6be4d17c': 'CannotGenerateAtCurrentRound',
    '0x074d7a6b': 'LastBlocksOfPhaseCannotJoin',
    '0x17793beb': 'ActionNotVoted',
    '0x8aa3a72f': 'InvalidToAddress',
    '0x43ad20fc': 'AmountIsZero',
    '0x1ba68870': 'JoinedAmountIsZero',
    '0x9ad59b97': 'NotInWhiteList',
    '0xf33b2011': 'JoinAmountLessThanMinStake',
  },
};

/**
 * 根据错误选择器和合约上下文获取错误名称
 * @param selector 4字节十六进制错误选择器 (如 '0xa748da06')
 * @param contractKey 合约上下文标识
 * @returns 错误名称，如果找不到则返回空字符串
 */
export function getErrorNameFromSelector(selector: string, contractKey: string): string {
  // 先在对应合约中查找
  const contractSelectors = ErrorSelectorsMap[contractKey];
  if (contractSelectors && contractSelectors[selector]) {
    return contractSelectors[selector];
  }

  // 再在通用错误中查找
  const commonSelectors = ErrorSelectorsMap.common;
  if (commonSelectors && commonSelectors[selector]) {
    return commonSelectors[selector];
  }

  return '';
}
