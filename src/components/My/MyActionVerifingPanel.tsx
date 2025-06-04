import React, { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';

// my hooks
import { useVotesNumByAccountByActionId } from '@/src/hooks/contracts/useLOVE20Vote';
import { useScoreByVerifierByActionId } from '@/src/hooks/contracts/useLOVE20Verify';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my funcs
import { formatTokenAmount } from '@/src/lib/format';

// my components
import LoadingIcon from '@/src/components/Common/LoadingIcon';

interface MyActionVerifingPanelProps {
  currentRound: bigint;
  actionId: bigint;
  onRemainingVotesChange?: (votes: bigint) => void;
}

const MyActionVerifingPanel: React.FC<MyActionVerifingPanelProps> = ({
  currentRound,
  actionId,
  onRemainingVotesChange,
}) => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  // 获取我的投票数(即最大验证票数)
  const {
    votesNumByAccountByActionId,
    isPending: isPendingVotesNumByAccount,
    error: isVotesNumByAccountError,
  } = useVotesNumByAccountByActionId(
    token?.address as `0x${string}`,
    currentRound,
    (accountAddress as `0x${string}`) || '',
    actionId,
  );

  // 获取我的已验证票数
  const {
    scoreByVerifierByActionId,
    isPending: isPendingScoreByVerifier,
    error: isScoreByVerifierError,
  } = useScoreByVerifierByActionId(
    token?.address as `0x${string}`,
    currentRound,
    (accountAddress as `0x${string}`) || '',
    actionId,
  );

  // 计算剩余验证票数,并传递给上层组件
  const remainingVotes =
    !isPendingVotesNumByAccount && !isPendingScoreByVerifier
      ? votesNumByAccountByActionId - scoreByVerifierByActionId
      : BigInt(0);
  useEffect(() => {
    if (!isPendingVotesNumByAccount && !isPendingScoreByVerifier) {
      onRemainingVotesChange?.(remainingVotes);
    }
  }, [remainingVotes]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (isVotesNumByAccountError) {
      handleContractError(isVotesNumByAccountError, 'vote');
    }
    if (isScoreByVerifierError) {
      handleContractError(isScoreByVerifierError, 'verify');
    }
  }, [isVotesNumByAccountError, isScoreByVerifierError]);

  return (
    <div className="mb-4 text-center">
      <span className="font-semibold">
        我的剩余验证票数：
        {isPendingVotesNumByAccount || isPendingScoreByVerifier ? (
          <LoadingIcon />
        ) : (
          <span className="text-secondary">{formatTokenAmount(remainingVotes)}</span>
        )}
      </span>
      <div className="mt-2 text-sm text-greyscale-500 text-center">
        提示: 最大可验证票数，等于您本轮对该行动的投票数
      </div>
    </div>
  );
};

export default MyActionVerifingPanel;
