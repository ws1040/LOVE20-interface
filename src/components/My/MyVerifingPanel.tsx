import React, { useContext } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { formatTokenAmount } from '@/src/lib/format';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useVotesNumByAccount } from '@/src/hooks/contracts/useLOVE20Vote';
import { useScoreByVerifier } from '@/src/hooks/contracts/useLOVE20Verify';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LeftTitle from '@/src/components/Common/LeftTitle';

interface MyVerifingPanelProps {
  currentRound: bigint;
  showBtn?: boolean;
}

const MyVerifingPanel: React.FC<MyVerifingPanelProps> = ({ currentRound, showBtn = true }) => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  // 获取我的投票数(即最大验证票数)
  const {
    votesNumByAccount,
    isPending: isPendingVotesNumByAccount,
    error: isVotesNumByAccountError,
  } = useVotesNumByAccount(token?.address as `0x${string}`, currentRound, (accountAddress as `0x${string}`) || '');

  // 获取我的已验证票数
  const {
    scoreByVerifier,
    isPending: isPendingScoreByVerifier,
    error: isScoreByVerifierError,
  } = useScoreByVerifier(token?.address as `0x${string}`, currentRound, (accountAddress as `0x${string}`) || '');

  // 计算剩余验证票数
  const remainingVotes =
    !isPendingVotesNumByAccount && !isPendingScoreByVerifier ? votesNumByAccount - scoreByVerifier : BigInt(0);

  if (!token) {
    return '';
  }

  return (
    <div className="flex-col items-center px-6 pt-6 pb-2">
      <LeftTitle title="我的验证" />
      <div className="stats w-full mt-4 border grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center">
          <div className="stat-title text-sm">已验证票数</div>
          <div className="stat-value text-xl">
            {isPendingVotesNumByAccount ? <LoadingIcon /> : formatTokenAmount(scoreByVerifier || BigInt(0))}
          </div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title text-sm">未验证票数</div>
          <div className="stat-value text-xl">
            {isPendingVotesNumByAccount || isPendingScoreByVerifier ? (
              <LoadingIcon />
            ) : (
              formatTokenAmount(remainingVotes)
            )}
          </div>
        </div>
      </div>
      {showBtn &&
        (isPendingVotesNumByAccount || isPendingScoreByVerifier ? (
          <LoadingIcon />
        ) : votesNumByAccount > scoreByVerifier ? (
          <div className="flex justify-center mt-4">
            <Button className="w-1/2">
              <Link href={`/verify?symbol=${token.symbol}`}>去验证</Link>
            </Button>
          </div>
        ) : (
          <div className="flex justify-center mt-4">
            <Button disabled className="w-1/2">
              {scoreByVerifier > 0 ? '已验证' : '未投票，无需验证'}
            </Button>
          </div>
        ))}
    </div>
  );
};

export default MyVerifingPanel;
