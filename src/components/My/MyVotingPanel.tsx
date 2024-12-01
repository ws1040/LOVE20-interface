import React, { useContext } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { formatTokenAmount } from '@/src/lib/format';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useValidGovVotes } from '@/src/hooks/contracts/useLOVE20Stake';
import { useVotesNumByAccount } from '@/src/hooks/contracts/useLOVE20Vote';
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

  if (!token) {
    return '';
  }

  if (errorValidGovVotes) {
    console.log('errorValidGovVotes', errorValidGovVotes);
  }
  if (errorVotesNumByAccount) {
    console.log('errorVotesNumByAccount', errorVotesNumByAccount);
  }

  return (
    <div className="flex-col items-center px-6 py-2">
      <LeftTitle title="我的投票" />
      <div className="stats w-full grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center">
          <div className="stat-title text-sm">我的已投票数</div>
          <div className="stat-value text-xl">
            {isPendingVotesNumByAccount ? <LoadingIcon /> : formatTokenAmount(votesNumByAccount || BigInt(0))}
          </div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title text-sm">我的剩余票数</div>
          <div className="stat-value text-xl">
            {isPendingValidGovVotes || isPendingVotesNumByAccount ? (
              <LoadingIcon />
            ) : (
              formatTokenAmount(validGovVotes - votesNumByAccount || BigInt(0))
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        {isPendingValidGovVotes || isPendingVotesNumByAccount ? (
          <LoadingIcon />
        ) : validGovVotes > votesNumByAccount ? (
          <Button className="w-1/2">
            <Link href={`/${token.symbol}/vote`}>去投票</Link>
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
