import React, { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// my funcs
import { formatTokenAmount } from '@/src/lib/format';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useValidGovVotes } from '@/src/hooks/contracts/useLOVE20Stake';
import { useVotesNumByAccount } from '@/src/hooks/contracts/useLOVE20Vote';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LeftTitle from '@/src/components/Common/LeftTitle';

interface MyVotingPanelProps {
  currentRound: bigint;
}

const MyVotingPanel: React.FC<MyVotingPanelProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  // 我的治理票&总有效票数
  const {
    validGovVotes,
    isPending: isPendingValidGovVotes,
    error: errorValidGovVotes,
  } = useValidGovVotes((token?.address as `0x${string}`) || '', (accountAddress as `0x${string}`) || '');

  // 我的投票数
  const {
    votesNumByAccount,
    isPending: isPendingVotesNumByAccount,
    error: errorVotesNumByAccount,
  } = useVotesNumByAccount(
    (token?.address as `0x${string}`) || '',
    currentRound,
    (accountAddress as `0x${string}`) || '',
  );

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorVotesNumByAccount) {
      handleContractError(errorVotesNumByAccount, 'vote');
    }
    if (errorValidGovVotes) {
      handleContractError(errorValidGovVotes, 'stake');
    }
  }, [errorVotesNumByAccount, errorValidGovVotes]);

  if (!token) {
    return '';
  }
  if (!accountAddress) {
    return (
      <>
        <div className="flex-col items-center px-4 py-2">
          <LeftTitle title="行动投票" />
          <div className="text-sm mt-4 text-greyscale-500 text-center">请先连接钱包</div>
        </div>
      </>
    );
  }

  return (
    <div className="flex-col items-center px-4 py-2">
      <LeftTitle title="行动投票" />
      <div className="stats w-full grid grid-cols-2 mt-2 divide-x-0">
        <div className="stat place-items-center pt-1 pb-2">
          <div className="stat-title text-sm">我的已投票数</div>
          <div className="stat-value text-xl">
            {isPendingVotesNumByAccount ? <LoadingIcon /> : formatTokenAmount(votesNumByAccount || BigInt(0), 2)}
          </div>
        </div>
        <div className="stat place-items-center pt-1 pb-2">
          <div className="stat-title text-sm">我的剩余票数</div>
          <div className="stat-value text-xl">
            {isPendingValidGovVotes || isPendingVotesNumByAccount ? (
              <LoadingIcon />
            ) : validGovVotes ? (
              formatTokenAmount(validGovVotes - votesNumByAccount || BigInt(0), 2)
            ) : (
              '0'
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        {isPendingValidGovVotes || isPendingVotesNumByAccount ? (
          <LoadingIcon />
        ) : validGovVotes > votesNumByAccount + 2n ? (
          <Button className="w-1/2" asChild>
            <Link href={`/vote?symbol=${token.symbol}`}>去投票</Link>
          </Button>
        ) : (
          <Button disabled className="w-1/2">
            {validGovVotes > 0 ? '已投票' : '无治理票，不能投票'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MyVotingPanel;
