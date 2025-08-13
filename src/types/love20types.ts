export interface ActionHead {
  id: number;
  author: string;
  createAtBlock: number;
}

export interface ActionBody {
  minStake: number;
  maxRandomAccounts: number;
  whiteListAddress: `0x${string}`;
  title: string;
  verificationRule: string;
  verificationKeys: string[];
  verificationInfoGuides: string[];
}

export interface ActionInfo {
  head: ActionHead;
  body: ActionBody;
}

export interface ActionSubmitInfo {
  submitter: string;
  actionId: number;
}

export interface VotingAction {
  action: ActionInfo;
  submitter: string;
  votesNum: bigint;
  myVotesNum: bigint;
}

export interface JoinableAction {
  action: ActionInfo;
  votesNum: bigint;
  hasReward: boolean;
  joinedAmount: bigint;
  joinedAmountOfAccount: bigint;
}

export interface JoinedAction {
  action: ActionInfo;
  votesNum: bigint;
  votePercentPerTenThousand: bigint;
  hasReward: boolean;
  joinedAmountOfAccount: bigint;
}

export interface VerifyingAction {
  action: ActionInfo;
  votesNum: bigint;
  verificationScore: bigint;
  myVotesNum: bigint;
  myVerificationScore: bigint;
}

export interface MyVerifyingAction {
  action: ActionInfo;
  totalVotesNum: bigint;
  myVotesNum: bigint;
  myVerificationScore: bigint;
}

export interface VerifiedAddress {
  account: `0x${string}`;
  score: bigint;
  reward: bigint;
  isMinted: boolean;
}

export interface RewardInfo {
  round: bigint;
  reward: bigint;
  isMinted: boolean;
}

export interface ActionReward {
  actionId: bigint;
  round: bigint;
  reward: bigint;
  isMinted: boolean;
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
  parentTokenAddress: `0x${string}`;
  parentTokenSymbol: string;
  parentTokenName: string;
  slAddress: `0x${string}`;
  stAddress: `0x${string}`;
  uniswapV2PairAddress: `0x${string}`;
  initialStakeRound: number;
}

export interface LaunchInfo {
  parentTokenAddress: `0x${string}`;
  parentTokenFundraisingGoal: bigint;
  secondHalfMinBlocks: bigint;
  launchAmount: bigint;
  startBlock: bigint;
  secondHalfStartBlock: bigint;
  endBlock: bigint;
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

export interface TokenStats {
  maxSupply: bigint;
  totalSupply: bigint;
  reservedAvailable: bigint;
  rewardAvailable: bigint;
  pairReserveParentToken: bigint;
  pairReserveToken: bigint;
  totalLpSupply: bigint;
  stakedTokenAmountForSt: bigint;
  joinedTokenAmount: bigint;
  totalSLSupply: bigint;
  totalSTSupply: bigint;
  parentTokenAmountForSl: bigint;
  tokenAmountForSl: bigint;
  parentPool: bigint;
  finishedRounds: bigint;
  actionsCount: bigint;
  joiningActionsCount: bigint;
}
