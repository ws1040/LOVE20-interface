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

/**
 * 全部合约错误映射的“总汇”。
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
};
