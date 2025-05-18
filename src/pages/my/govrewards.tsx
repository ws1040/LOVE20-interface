'use client';

import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';

// my functions & types
import { checkWalletConnection } from '@/src/lib/web3';
import { formatTokenAmount, formatRoundForDisplay } from '@/src/lib/format';
import { RewardInfo } from '@/src/types/love20types';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useGovRewardsByAccountByRounds } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useMintGovReward, useCurrentRound } from '@/src/hooks/contracts/useLOVE20Mint';

// my components
import Header from '@/src/components/Header';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

const REWARDS_PER_PAGE = 20n;

const GovRewardsPage: React.FC = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress, chain: accountChain } = useAccount();
  const { currentRound, error: errorCurrentRound } = useCurrentRound();
  const [startRound, setStartRound] = useState<bigint>(0n);
  const [endRound, setEndRound] = useState<bigint>(0n);
  const [hasMoreRewards, setHasMoreRewards] = useState(true);

  // 引入参考元素，用于无限滚动加载
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentRound && token) {
      if (currentRound - BigInt(token.initialStakeRound) >= 0n) {
        setEndRound(currentRound);
      } else {
        setEndRound(BigInt(token.initialStakeRound));
      }
    }
  }, [currentRound, token]);

  useEffect(() => {
    if (endRound && token) {
      // 初始加载20个轮次数据，如果可加载数量超过20，则初始显示最近20轮，否则显示全部
      if (endRound - BigInt(token.initialStakeRound) >= REWARDS_PER_PAGE) {
        setStartRound(endRound - REWARDS_PER_PAGE);
      } else {
        setStartRound(BigInt(token.initialStakeRound));
      }
    }
  }, [endRound, token]);

  // 获取治理奖励数据
  const {
    rewards,
    isPending: isLoadingRewards,
    error: errorLoadingRewards,
  } = useGovRewardsByAccountByRounds(
    token?.address as `0x${string}`,
    accountAddress as `0x${string}`,
    startRound,
    endRound,
  );

  const [rewardList, setRewardList] = useState<RewardInfo[]>([]);
  useEffect(() => {
    if (rewards) {
      const sortedRewards = [...rewards].sort((a, b) => (a.round > b.round ? -1 : 1)); // 按 round 倒序排列
      setRewardList(sortedRewards);

      // Check if there are more rewards to load
      setHasMoreRewards(
        endRound - startRound > REWARDS_PER_PAGE && rewards.length >= endRound - startRound - REWARDS_PER_PAGE,
      );
    }
  }, [rewards]);

  // 铸造治理奖励
  const { mintGovReward, isWriting, isConfirming, isConfirmed, writeError: errorMintGovReward } = useMintGovReward();
  const [mintingRound, setMintingRound] = useState<bigint | null>(null);
  useEffect(() => {
    if (isConfirmed) {
      setRewardList((prev) =>
        prev.map((item) => (item.round === mintingRound ? { ...item, unminted: 0n, minted: item.unminted } : item)),
      );
    }
  }, [isConfirmed, mintingRound]);

  const handleClaim = async (round: bigint) => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    if (token?.address && accountAddress) {
      setMintingRound(round);
      await mintGovReward(token.address, round);
    }
  };

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorLoadingRewards) {
      handleContractError(errorLoadingRewards, 'dataViewer');
    }
    if (errorCurrentRound) {
      handleContractError(errorCurrentRound, 'mint');
    }
    if (errorMintGovReward) {
      handleContractError(errorMintGovReward, 'mint');
    }
  }, [errorLoadingRewards, errorCurrentRound, errorMintGovReward, handleContractError]);

  // 无限滚动加载更多奖励：当滚动到底部时更新 startRound
  const loadMoreRewards = useCallback(() => {
    if (!token) return;
    const initialStake = BigInt(token.initialStakeRound);
    // 使用函数式更新，确保拿到最新的 startRound
    setStartRound((prev) => {
      if (prev > initialStake) {
        const newStart = prev - REWARDS_PER_PAGE >= initialStake ? prev - REWARDS_PER_PAGE : initialStake;
        return newStart;
      }
      return prev;
    });
  }, [token]);

  // 使用 IntersectionObserver 监控底部 sentinel 元素
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMoreRewards();
        }
      });
    });
    observer.observe(loadMoreRef.current);
    return () => {
      observer.disconnect();
    };
  }, [loadMoreRewards]);

  return (
    <>
      <Header title="治理激励" />
      <main className="flex-grow">
        {!token ? (
          <LoadingIcon />
        ) : (
          <div className="flex flex-col space-y-6 p-4">
            <LeftTitle title="铸造治理奖励" />

            {/* 如果 rewardList 为空，则判断是否处于加载状态 */}
            {rewardList.length === 0 ? (
              <div className="flex justify-center items-center">
                {isLoadingRewards ? '' : <span className="text-sm text-gray-500">暂无数据</span>}
              </div>
            ) : (
              // 当已有部分数据时，始终展示表格
              <table className="table w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th>轮次</th>
                    <th className="text-center">激励</th>
                    <th className="text-center">结果</th>
                  </tr>
                </thead>
                <tbody>
                  {rewardList.map((item) => (
                    <tr key={item.round.toString()} className="border-b border-gray-100">
                      <td>{token ? formatRoundForDisplay(item.round, token).toString() : '-'}</td>
                      <td className="text-center">{formatTokenAmount(item.unminted || item.minted || 0n)}</td>
                      <td className="text-center">
                        {item.unminted > 0n ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-secondary border-secondary"
                            onClick={() => handleClaim(item.round)}
                            disabled={isWriting || isConfirming}
                          >
                            铸造
                          </Button>
                        ) : item.minted > 0n ? (
                          <span className="text-greyscale-500">已铸造</span>
                        ) : (
                          <span className="text-greyscale-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 始终渲染 sentinel 元素 */}
            <div ref={loadMoreRef} className="h-12 flex justify-center items-center">
              {isLoadingRewards ? (
                <LoadingIcon />
              ) : hasMoreRewards ? (
                <span className="text-sm text-gray-500">加载更多...</span>
              ) : startRound > token.initialStakeRound ? (
                <span className="text-sm text-gray-500">没有更多奖励</span>
              ) : (
                ''
              )}
            </div>
          </div>
        )}
        <LoadingOverlay isLoading={isWriting || isConfirming} text={isWriting ? '提交交易...' : '确认交易...'} />
      </main>
    </>
  );
};

export default GovRewardsPage;
