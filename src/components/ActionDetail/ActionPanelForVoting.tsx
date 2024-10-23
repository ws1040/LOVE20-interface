import React, { useEffect, useContext } from 'react';
import { BaseError, useAccount } from 'wagmi';

import { useValidGovVotes } from '../../hooks/contracts/useLOVE20Stake';
import { useCurrentRound, useVotesNumByAccountByActionId, useVote } from '../../hooks/contracts/useLOVE20Vote';

import { TokenContext } from '../../contexts/TokenContext';
import Loading from '../Common/Loading';
import { formatTokenAmount } from '../../utils/format';

interface ActionPanelForVoteProps {
  actionId: bigint;
  onRoundChange: (currentRound: bigint) => void;
}

const ActionPanelForVote: React.FC<ActionPanelForVoteProps> = ({ actionId, onRoundChange }) => {
  const { address: account } = useAccount();
  const { token } = useContext(TokenContext) || {};

  // 获取当前轮次, 并设置状态给父组件
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();
  useEffect(() => {
    if (onRoundChange && typeof onRoundChange === 'function') {
      onRoundChange(currentRound);
    }
  }, [currentRound, onRoundChange]);

  // 我的治理票&总有效票数
  const { validGovVotes, isPending: isPendingValidGovVotes } = useValidGovVotes(
    token?.address as `0x${string}`,
    account as `0x${string}`,
  );

  // 获取我对actionId的投票数
  const {
    votesNumByAccountByActionId,
    isPending: isPendingVotesNumByAccountByActionId,
    error: errVotesNumByAccountByActionId,
  } = useVotesNumByAccountByActionId(token?.address as `0x${string}`, currentRound, account as `0x${string}`, actionId);

  // 投票
  const {
    vote,
    isWriting,
    isConfirming: isConfirmingVote,
    isConfirmed: isConfirmedVote,
    writeError: errorVote,
  } = useVote();
  const handleSubmit = () => {
    if (isWriting || isConfirmingVote) {
      return;
    }
    vote(token?.address as `0x${string}`, [actionId], [validGovVotes]);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-base-100 mb-4 border-t border-gray-100 ">
      <h1 className="text-base text-center">
        投票轮 (第
        <span className="text-red-500">{isPendingCurrentRound ? <Loading /> : Number(currentRound)}</span>
        轮)
      </h1>
      <div className="flex w-full justify-center space-x-20">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">我的已投票数</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingVotesNumByAccountByActionId ? (
              <Loading />
            ) : (
              formatTokenAmount(votesNumByAccountByActionId || BigInt(0))
            )}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">我的剩余票数</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingValidGovVotes || isPendingVotesNumByAccountByActionId ? (
              <Loading />
            ) : (
              formatTokenAmount(validGovVotes - votesNumByAccountByActionId)
            )}
          </span>
        </div>
      </div>

      {!isPendingVotesNumByAccountByActionId && !votesNumByAccountByActionId ? (
        <button className="btn-primary btn w-1/2" onClick={handleSubmit} disabled={isWriting || isConfirmingVote}>
          {isWriting || isConfirmingVote ? <Loading /> : '投100%票'}
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <button disabled className="btn-disabled">
            您已投票
          </button>
        </div>
      )}

      {errVotesNumByAccountByActionId ? (
        <p className="text-red-500">
          Error:
          {(errVotesNumByAccountByActionId as unknown as BaseError).shortMessage ||
            errVotesNumByAccountByActionId.message}
        </p>
      ) : null}
      {errorVote ? (
        <p className="text-red-500">Error: {(errorVote as BaseError).shortMessage || errorVote.message}</p>
      ) : null}
    </div>
  );
};

export default ActionPanelForVote;
