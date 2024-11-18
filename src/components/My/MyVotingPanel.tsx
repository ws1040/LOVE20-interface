import React, { useContext } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

import { useValidGovVotes } from '@/src/hooks/contracts/useLOVE20Stake';
import { useVotesNumByAccount } from '@/src/hooks/contracts/useLOVE20Vote';
import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';
import Loading from '@/src/components/Common/Loading';

interface MyVotingPanelProps {
  currentRound: bigint;
}

const MyVotingPanel: React.FC<MyVotingPanelProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  // 我的治理票&总有效票数
  const { validGovVotes, isPending: isPendingValidGovVotes } = useValidGovVotes(
    (token?.address as `0x${string}`) || '',
    (accountAddress as `0x${string}`) || '',
  );

  // 我的投票数
  const { votesNumByAccount, isPending: isPendingVotesNumByAccount } = useVotesNumByAccount(
    (token?.address as `0x${string}`) || '',
    currentRound,
    (accountAddress as `0x${string}`) || '',
  );

  console.log('validGovVotes', validGovVotes);
  console.log('votesNumByAccount', votesNumByAccount);

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-base-100 mt-4 mb-4">
      <h1 className="text-base text-center">
        投票轮（第
        <span className="text-red-500">{currentRound === undefined ? <Loading /> : Number(currentRound)}</span>
        轮）
      </h1>

      <div className="flex w-full justify-center space-x-20">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">我的已投票数</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingVotesNumByAccount ? <Loading /> : formatTokenAmount(votesNumByAccount || BigInt(0))}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">我的剩余票数</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingValidGovVotes || isPendingVotesNumByAccount ? (
              <Loading />
            ) : (
              formatTokenAmount(validGovVotes - votesNumByAccount || BigInt(0))
            )}
          </span>
        </div>
      </div>
      {isPendingValidGovVotes || isPendingVotesNumByAccount ? (
        <Loading />
      ) : validGovVotes > votesNumByAccount ? (
        <div className="flex justify-center space-x-6">
          <Link href="/vote/actions4submit" className="btn-primary btn w-1/2">
            去推举
          </Link>
          <Link href="/vote" className="btn-primary btn w-1/2">
            去投票
          </Link>
        </div>
      ) : (
        <div className="flex justify-center space-x-6">
          <Link href="/vote/actions4submit" className="btn-primary btn w-1/2">
            去推举
          </Link>
          <button className="btn btn-disabled w-1/2">去投票</button>
        </div>
      )}
    </div>
  );
};

export default MyVotingPanel;
