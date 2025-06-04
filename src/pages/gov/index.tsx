import React, { useEffect, useContext } from 'react';
// import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// 导入context
import { TokenContext } from '@/src/contexts/TokenContext';

// 导入hooks
import { useValidGovVotes, useCurrentRound } from '@/src/hooks/contracts/useLOVE20Stake';
import { useHandleContractError } from '@/src/lib/errorUtils';

// 导入组件
import Header from '@/src/components/Header';
import TokenTab from '@/src/components/Token/TokenTab';
import GovernanceDataPanel from '@/src/components/DataPanel/GovernanceDataPanel';
import MyVotingPanel from '@/src/components/My/MyVotingPanel';
import MyVerifingPanel from '@/src/components/My/MyVerifingPanel';
import Todeploy from '@/src/components/Launch/Todeploy';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

const GovPage = () => {
  // const router = useRouter();

  // 当前token
  const { token: currentToken } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  // 获取当前轮次
  const {
    currentRound: currentVoteRound,
    error: errorCurrentRound,
    isPending: isPendingCurrentRound,
  } = useCurrentRound();

  // 获取用户的治理票数
  const {
    validGovVotes,
    isPending: isPendingValidGovVotes,
    error: errorValidGovVotes,
  } = useValidGovVotes((currentToken?.address as `0x${string}`) || '', (accountAddress as `0x${string}`) || '');

  // useEffect(() => {
  //   if (currentToken && !currentToken.hasEnded) {
  //     // 如果发射未结束，跳转到发射页面
  //     router.push(`/launch?symbol=${currentToken.symbol}`);
  //   } else if (currentToken && !currentToken.initialStakeRound) {
  //     // 如果还没有人质押，跳转到质押页面
  //     router.push(`/gov/stakelp/?symbol=${currentToken.symbol}&first=true`);
  //   }
  // }, [currentToken]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  React.useEffect(() => {
    if (errorValidGovVotes) {
      handleContractError(errorValidGovVotes, 'stake');
    }
    if (errorCurrentRound) {
      handleContractError(errorCurrentRound, 'vote');
    }
  }, [errorValidGovVotes, errorCurrentRound]);

  // 判断是否需要显示治理组件
  const shouldShowGovComponents = validGovVotes > 0n;

  if (isPendingCurrentRound || isPendingValidGovVotes) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <>
      <Header title="治理首页" />
      <main className="flex-grow">
        {!currentToken ? (
          <LoadingIcon />
        ) : (
          <>
            <TokenTab />
            <GovernanceDataPanel currentRound={currentVoteRound ? currentVoteRound : 0n} />

            {isPendingValidGovVotes ? (
              <div className="flex justify-center p-4">
                <LoadingIcon />
              </div>
            ) : shouldShowGovComponents ? (
              // 有治理票时显示三个治理组件
              <>
                <MyVotingPanel
                  currentRound={currentVoteRound ? currentVoteRound : 0n}
                  validGovVotes={validGovVotes}
                  isPendingValidGovVotes={isPendingValidGovVotes}
                />
                <MyVerifingPanel currentRound={currentVoteRound > 2 ? currentVoteRound - 2n : 0n} />
                <Todeploy token={currentToken} />
              </>
            ) : (
              // 无治理票时显示质押按钮
              <div className="flex flex-col items-center p-4 mt-4">
                <div className="text-center mb-4 text-greyscale-500">您当前没有治理票，获取治理票后才能治理</div>
                <Button className="w-1/2" asChild>
                  <Link href={`/gov/stakelp/?symbol=${currentToken?.symbol}`}>质押获取治理票</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default GovPage;
