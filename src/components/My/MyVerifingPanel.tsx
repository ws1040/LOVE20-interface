import React, { useContext } from 'react';
import { useAccount } from 'wagmi';

import { useVotesNumByAccount } from '../../hooks/contracts/useLOVE20Vote';
import { useScoreByVerifier } from '../../hooks/contracts/useLOVE20Verify';

import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/strings';
import Loading from '../Common/Loading';
import { Link } from '@mui/icons-material';

interface MyVerifingPanelProps {
  currentRound: bigint;
}

const MyVerifingPanel: React.FC<MyVerifingPanelProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  const { votesNumByAccount, isPending: isPendingVotesNumByAccount } = useVotesNumByAccount(
    token?.address as `0x${string}`,
    currentRound,
    (accountAddress as `0x${string}`) || '',
  );
  const { scoreByVerifier, isPending: isPendingScoreByVerifier } = useScoreByVerifier(
    token?.address as `0x${string}`,
    currentRound,
    (accountAddress as `0x${string}`) || '',
  );

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-base-100 mt-4">
      <h1 className="text-base text-center">
        验证轮（第 <span className="text-red-500">{Number(currentRound)}</span> 轮）
      </h1>

      <div className="flex w-full justify-center space-x-20">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">我的已投验证票</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingScoreByVerifier ? <Loading /> : formatTokenAmount(scoreByVerifier || BigInt(0))}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">我的剩余验证票</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingVotesNumByAccount || isPendingScoreByVerifier ? (
              <Loading />
            ) : (
              formatTokenAmount(votesNumByAccount - scoreByVerifier || BigInt(0))
            )}
          </span>
        </div>
      </div>
      {isPendingVotesNumByAccount || isPendingScoreByVerifier ? (
        <Loading />
      ) : votesNumByAccount > scoreByVerifier ? (
        <Link href="/verify" className="btn-primary btn w-1/2">
          去验证
        </Link>
      ) : (
        <span className="text-gray-500 text-sm">无剩余验证票</span>
      )}
    </div>
  );
};

export default MyVerifingPanel;
