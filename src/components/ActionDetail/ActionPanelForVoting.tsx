'use client';
import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

// my hooks
import { useValidGovVotes } from '@/src/hooks/contracts/useLOVE20Stake';
import { useCurrentRound, useVotesNumByAccountByActionId, useVote } from '@/src/hooks/contracts/useLOVE20Vote';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '../Common/LoadingOverlay';

interface ActionPanelForVoteProps {
  actionId: bigint;
  onRoundChange: (currentRound: bigint) => void;
}

const ActionPanelForVote: React.FC<ActionPanelForVoteProps> = ({ actionId, onRoundChange }) => {
  const { address: account } = useAccount();
  const { token } = useContext(TokenContext) || {};
  const router = useRouter();

  // 获取当前轮次, 并设置状态给父组件
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();
  useEffect(() => {
    if (onRoundChange && typeof onRoundChange === 'function') {
      onRoundChange(currentRound);
    }
  }, [currentRound, onRoundChange]);

  // 我的治理票&总有效票数
  const {
    validGovVotes,
    isPending: isPendingValidGovVotes,
    error: errValidGovVotes,
  } = useValidGovVotes(token?.address as `0x${string}`, account as `0x${string}`);

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
  const handleVote = () => {
    if (isWritingVote || isConfirmingVote) {
      return;
    }
    vote(token?.address as `0x${string}`, [actionId], [validGovVotes]);
  };

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorVote) {
      handleContractError(errorVote, 'vote');
    }
    if (errCurrentRound) {
      handleContractError(errCurrentRound, 'vote');
    }
    if (errVotesNumByAccountByActionId) {
      handleContractError(errVotesNumByAccountByActionId, 'vote');
    }
    if (errValidGovVotes) {
      handleContractError(errValidGovVotes, 'stake');
    }
  }, [errorVote, errCurrentRound, errVotesNumByAccountByActionId, errValidGovVotes]);

  // 提交成功
  useEffect(() => {
    if (isConfirmedVote && !errorVote) {
      toast.success('提交成功', {
        duration: 2000, // 2秒
      });
      setTimeout(() => {
        router.push(`/vote/actions/?symbol=${token?.symbol}`);
      }, 2000);
    }
  }, [isConfirmedVote, errorVote]);

  return (
    <>
      <div className="flex flex-col items-center space-y-6 p-4 mb-4">
        <div className="stats w-full border grid grid-cols-2 divide-x-0">
          <div className="stat place-items-center">
            <div className="stat-title">我的已投票数</div>
            <div className="stat-value text-2xl">
              {isPendingVotesNumByAccountByActionId ? <LoadingIcon /> : formatTokenAmount(votesNumByAccountByActionId)}
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
          <Button className="w-1/2" onClick={handleVote} disabled={isWritingVote || isConfirmingVote}>
            {isWritingVote || isConfirmingVote ? <LoadingIcon /> : '将100%票投给此行动'}
          </Button>
        ) : (
          <Button className="w-1/2" disabled>
            您已投票
          </Button>
        )}
      </div>
      <LoadingOverlay
        isLoading={isWritingVote || isConfirmingVote}
        text={isWritingVote ? '提交交易...' : '确认交易...'}
      />
    </>
  );
};

export default ActionPanelForVote;
