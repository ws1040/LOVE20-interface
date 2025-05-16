export interface ActionHead {
  id: number;
  author: string;
  createAtBlock: number;
}

export interface ActionBody {
  minStake: number;
  maxRandomAccounts: number;
  whiteList: string[];
  action: string;
  consensus: string;
  verificationRule: string;
  verificationKeys: string[];
  verificationInfoGuides: string[];
}

export interface ActionInfo {
  head: ActionHead;
  body: ActionBody;
}

export interface ActionSubmit {
  submitter: string;
  actionId: number;
}

export interface JoinableAction {
  actionId: bigint;
  votesNum: bigint;
  joinedAmount: bigint;
}

export interface JoinableActionDetail {
  action: ActionInfo;
  votesNum: bigint;
  joinedAmount: bigint;
}
export interface JoinedAction {
  action: ActionInfo;
  stakedAmount: bigint;
  votesNum: bigint;
  votePercent: bigint;
}

export interface VerifyingAction {
  action: ActionInfo;
  votesNum: bigint;
  verificationScore: bigint;
  myVotesNum: bigint;
}

export interface MyVerifyingAction {
  action: ActionInfo;
  myVotesNum: bigint;
  totalVotesNum: bigint;
}

export interface VerifiedAddress {
  account: `0x${string}`;
  score: bigint;
  minted: bigint;
  unminted: bigint;
}

export interface RewardInfo {
  round: bigint;
  minted: bigint;
  unminted: bigint;
}

export interface GovData {
  govVotes: bigint;
  slAmount: bigint;
  stAmount: bigint;
  tokenAmountForSl: bigint;
  parentTokenAmountForSl: bigint;
  rewardAvailable: bigint;
}

export interface TokenInfo {
  tokenAddress: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  parentTokenSymbol: string;
  slAddress: `0x${string}`;
  stAddress: `0x${string}`;
  initialStakeRound: number;
}

export interface LaunchInfo {
  parentTokenAddress: `0x${string}`;
  parentTokenFundraisingGoal: bigint;
  secondHalfMinBlocks: bigint;
  launchAmount: bigint;
  startBlock: bigint;
  secondHalfStartBlock: bigint;
  hasEnded: boolean;
  participantCount: bigint;
  totalContributed: bigint;
  totalExtraRefunded: bigint;
}

export interface PairInfo {
  pairAddress: `0x${string}`;
  balanceOfToken: bigint;
  balanceOfParentToken: bigint;
  allowanceOfToken: bigint;
  allowanceOfParentToken: bigint;
  pairReserveToken: bigint;
  pairReserveParentToken: bigint;
}

export interface VerificationInfo {
  account: `0x${string}`;
  infos: string[];
}
