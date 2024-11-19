import React, { useEffect, useState, useContext } from 'react';
import { useAccount } from 'wagmi';

import { GovReward } from '@/src/types/life20types';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useGovRewardsByAccountByRounds } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useMintGovReward, useCurrentRound } from '@/src/hooks/contracts/useLOVE20Mint';
import { formatTokenAmount } from '@/src/lib/format';
import Header from '@/src/components/Header';
import Loading from '@/src/components/Common/Loading';

const GovRewardsPage: React.FC = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  const { currentRound } = useCurrentRound();
  const startRound = currentRound ? currentRound - 1n : 0n;
  const endRound = startRound > 20n ? startRound - 20n : 0n;

  // 获取治理奖励
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

  const [rewardList, setRewardList] = useState<GovReward[]>([]);
  useEffect(() => {
    if (rewards) {
      setRewardList([...rewards].sort((a, b) => (a.round > b.round ? -1 : 1))); // 按round倒序排列
    }
  }, [rewards]);

  // 铸造治理奖励
  const { mintGovReward, isWriting, isConfirming, isConfirmed, writeError } = useMintGovReward();

  useEffect(() => {
    if (isConfirmed) {
      setRewardList((prev) => prev.map((item) => (item.unminted > 0n ? { ...item, unminted: 0n } : item)));
    }
  }, [isConfirmed]);

  const handleClaim = async (round: bigint) => {
    if (token?.address && accountAddress) {
      await mintGovReward(token.address, round);
    }
  };

  if (isLoadingRewards) return <Loading />;
  if (errorLoadingRewards) return <div className="text-red-500">发生错误: {errorLoadingRewards.message}</div>;

  return (
    <>
      <Header title="行动详情" />
      <main className="flex-grow">
        <div className="flex flex-col space-y-6 p-4 bg-white border-t border-gray-100">
          <h2 className="relative pl-4 text-gray-700 text-base font-medium before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-500">
            铸造治理奖励
          </h2>
          <table className="table w-full table-auto">
            <thead>
              <tr className="border-b border-gray-100">
                <th>轮次</th>
                <th>奖励</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rewardList.map((item) => (
                <tr key={item.round.toString()} className="border-b border-gray-100">
                  <td>{item.round.toString()}</td>
                  <td>{formatTokenAmount(item.unminted)}</td>
                  <td>
                    {item.unminted > 0n ? (
                      <button
                        className={`btn btn-sm ${isWriting || isConfirming ? 'btn-disabled' : 'btn-primary'}`}
                        onClick={() => handleClaim(item.round)}
                        disabled={isWriting || isConfirming}
                      >
                        {isWriting || isConfirming ? '领取中...' : '领取'}
                      </button>
                    ) : item.minted > 0n ? (
                      <span className="text-green-500">已领取</span>
                    ) : (
                      <span className="text-gray-500">无奖励</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {writeError && <div className="text-red-500 mt-2">领取失败: {writeError.message}</div>}
        </div>
      </main>
    </>
  );
};

export default GovRewardsPage;
