import React, { useContext } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

import { useValidGovVotes } from '@/src/hooks/contracts/useLOVE20Stake';
import { useVotesNumByAccount } from '@/src/hooks/contracts/useLOVE20Vote';
import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';
import Loading from '@/src/components/Common/Loading';
import { Button } from '@/components/ui/button';
import Round from '@/src/components/Common/Round';

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

  if (!token) {
    return '';
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white mt-4 mb-4">
      <Round currentRound={currentRound} roundName="投票轮" />

      <div className="flex w-full justify-center space-x-20 my-4">
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
          <Link href={`/${token.symbol}/vote/actions4submit`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">去推举</Button>
          </Link>
          <Link href={`/${token.symbol}/vote`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">去投票</Button>
          </Link>
        </div>
      ) : (
        <div className="flex justify-center space-x-6">
          <Link href={`/${token.symbol}/vote/actions4submit`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">去推举</Button>
          </Link>
          <Button className="w-1/2 bg-gray-400 cursor-not-allowed">去投票</Button>
        </div>
      )}
    </div>
  );
};

export default MyVotingPanel;
