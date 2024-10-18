import React, { useContext } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

import { useValidGovVotes } from '../../hooks/contracts/useLOVE20Stake';
import { useVotesNumByAccount } from '../../hooks/contracts/useLOVE20Vote';
import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/strings';
import Loading from '../Common/Loading';

interface MyVotingPanelProps {
  currentRound: bigint;
}

const MyVotingPanel: React.FC<MyVotingPanelProps> = ({ currentRound }) => {
    const { token } = useContext(TokenContext) || {};
    const { address: accountAddress } = useAccount();
    const { validGovVotes, isPending: isPendingValidGovVotes } = useValidGovVotes(token?.address as `0x${string}` || '', accountAddress as `0x${string}` || '');
    const { votesNumByAccount, isPending: isPendingVotesNumByAccount } = useVotesNumByAccount(token?.address as `0x${string}` || '', currentRound, accountAddress as `0x${string}` || '');

    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-base-100 mt-4">
        
        <h1 className="text-base text-center">
            投票轮（第 <span className="text-red-500">{Number(currentRound || BigInt(0))}</span> 轮）
        </h1>

        <div className="flex w-full justify-center space-x-20">
            <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">我的已投票数</span>
            <span className="text-2xl font-bold text-orange-400">
            {
              isPendingVotesNumByAccount ? 
                <Loading /> : 
                formatTokenAmount(votesNumByAccount || BigInt(0))
            }
            </span>
            </div>
            <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">我的剩余票数</span>
            <span className="text-2xl font-bold text-orange-400">
            {
              isPendingValidGovVotes || isPendingVotesNumByAccount ? 
                <Loading /> : 
                formatTokenAmount(validGovVotes - votesNumByAccount || BigInt(0))
            }
            </span>
            </div>
        </div>
        {
          isPendingValidGovVotes || isPendingVotesNumByAccount ? 
            <Loading /> : 
            validGovVotes > votesNumByAccount ?
            <Link href="/governance" className="btn-primary btn w-1/2">
              去投票
            </Link> :
            <span className="text-gray-500 text-sm">无剩余票数</span>
        }
      </div>
    );
};

export default MyVotingPanel;