import React, { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// my funcs
import { formatTokenAmount } from '@/src/lib/format';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useVotesNumByAccount } from '@/src/hooks/contracts/useLOVE20Vote';
import { useScoreByVerifier } from '@/src/hooks/contracts/useLOVE20Verify';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
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

  if (!token) {
    return <LoadingIcon />;
  }
  if (!accountAddress) {
    return (
      <>
        <div className="flex-col items-center px-4 pt-6 pb-2">
          <LeftTitle title="行动验证" />
          <div className="text-sm mt-4 text-greyscale-500 text-center">请先连接钱包</div>
        </div>
      </>
    );
  }

  return (
    <div className="flex-col items-center px-4 pt-3 pb-2">
      <LeftTitle title="行动验证" />
      <div className="stats w-full grid grid-cols-2 divide-x-0 mt-2">
        <div className="stat place-items-center pt-1 pb-2">
          <div className="stat-title text-sm">已验证票数</div>
          <div className={`stat-value text-xl ${!showBtn ? 'text-secondary' : ''}`}>
            {isPendingScoreByVerifier ? <LoadingIcon /> : formatTokenAmount(scoreByVerifier || BigInt(0), 2)}
          </div>
        </div>
        <div className="stat place-items-center pt-1 pb-2">
          <div className="stat-title text-sm">未验证票数</div>
          <div className={`stat-value text-xl ${!showBtn ? 'text-secondary' : ''}`}>
            {isPendingVotesNumByAccount || isPendingScoreByVerifier ? (
              <LoadingIcon />
            ) : (
              formatTokenAmount(remainingVotes, 2)
            )}
          </div>
        </div>
      </div>
      {showBtn && (
        <div className="flex justify-center">
          {isPendingVotesNumByAccount || isPendingScoreByVerifier ? (
            <LoadingIcon />
          ) : remainingVotes > 5n && votesNumByAccount > scoreByVerifier ? (
            <Button className="w-1/2" asChild>
              <Link href={`/verify?symbol=${token.symbol}`}>去验证</Link>
            </Button>
          ) : (
            <Button disabled className="w-1/2">
              {scoreByVerifier > 0 ? '已验证' : '未投票，无需验证'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyVerifingPanel;
