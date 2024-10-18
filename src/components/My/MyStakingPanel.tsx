import React, { useContext } from 'react';
import { useAccount } from 'wagmi';
import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/strings';
import Loading from '../Common/Loading';

import { useAccountStakeStatus } from '../../hooks/contracts/useLOVE20Stake';
import Link from 'next/link';

interface MyStakingPanelProps {
  currentRound: bigint;
}

const MyStakingPanel: React.FC<MyStakingPanelProps> = ({ currentRound }) => {
    const { token } = useContext(TokenContext) || {};
    const { address } = useAccount();

    
    const { govVotes, stAmount, isPending: isPendingAccountStakeStatus, error: errorAccountStakeStatus } = useAccountStakeStatus(token?.address as `0x${string}` || '', address as `0x${string}` || '');
    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-base-100">
      
        <div className="flex w-full justify-center space-x-20">
            <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">我的治理票数</span>
            <span className="text-2xl font-bold text-orange-400">
            {
                isPendingAccountStakeStatus ? 
                    <Loading /> : 
                    formatTokenAmount(govVotes || BigInt(0))
            }
            </span>
            </div>
            <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">我的质押数</span>
            <span className="text-2xl font-bold text-orange-400">
                {isPendingAccountStakeStatus ? <Loading /> : formatTokenAmount(stAmount || BigInt(0))}
            </span>
            </div>
        </div>

        <Link href="/stake" className="btn-primary btn w-1/2">
            去质押
        </Link>
      </div>
    );
};

export default MyStakingPanel;