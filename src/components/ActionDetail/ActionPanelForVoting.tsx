import React, { useEffect, useContext } from 'react';
import { BaseError, useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';

import { useValidGovVotes } from '@/src/hooks/contracts/useLOVE20Stake';
import { useCurrentRound, useVotesNumByAccountByActionId, useVote } from '@/src/hooks/contracts/useLOVE20Vote';

import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import Round from '@/src/components/Common/Round';
import LoadingOverlay from '../Common/LoadingOverlay';

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
    isWriting: isWritingVote,
    isConfirming: isConfirmingVote,
    isConfirmed: isConfirmedVote,
    writeError: errorVote,
  } = useVote();
  const handleSubmit = () => {
    if (isWritingVote || isConfirmingVote) {
      return;
    }
    vote(token?.address as `0x${string}`, [actionId], [validGovVotes]);
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-6 p-6 mb-4">
        <div className="stats w-full border grid grid-cols-2 divide-x-0">
          <div className="stat place-items-center">
            <div className="stat-title">我的已投票数</div>
            <div className="stat-value text-2xl">
              {isPendingVotesNumByAccountByActionId ? (
                <LoadingIcon />
              ) : (
                formatTokenAmount(votesNumByAccountByActionId / 10000n)
              )}
            </div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">我的剩余票数</div>
            <div className="stat-value text-2xl">
              {isPendingValidGovVotes || isPendingVotesNumByAccountByActionId ? (
                <LoadingIcon />
              ) : (
                formatTokenAmount(validGovVotes - votesNumByAccountByActionId)
              )}
            </div>
          </div>
        </div>

        {!isPendingVotesNumByAccountByActionId && !votesNumByAccountByActionId ? (
          <Button className="w-1/2" onClick={handleSubmit} disabled={isWritingVote || isConfirmingVote}>
            {isWritingVote || isConfirmingVote ? <LoadingIcon /> : '将100%票投给此行动'}
          </Button>
        ) : (
          <Button className="w-1/2" disabled>
            您已投票
          </Button>
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
      <LoadingOverlay
        isLoading={isWritingVote || isConfirmingVote}
        text={isWritingVote ? '提交交易...' : '确认交易...'}
      />
    </>
  );
};

export default ActionPanelForVote;
