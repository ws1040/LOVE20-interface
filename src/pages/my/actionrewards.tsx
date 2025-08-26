'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useChainId } from 'wagmi';
import { useRouter } from 'next/router';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useActionRewardsByAccountOfLastRounds } from '@/src/hooks/contracts/useLOVE20RoundViewer';
import { useMintActionReward } from '@/src/hooks/contracts/useLOVE20Mint';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import Header from '@/src/components/Header';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';
import { Button } from '@/components/ui/button';

// utils
import { formatTokenAmount, formatRoundForDisplay } from '@/src/lib/format';
import { setActionRewardNeedMinted } from '@/src/lib/actionRewardNotice';

// types
import { ActionInfo, ActionReward } from '@/src/types/love20types';

const LAST_ROUNDS = 30n;

type ActionRewardsGroup = {
  action: ActionInfo;
  rewards: ActionReward[];
};

const ActRewardsPage: React.FC = () => {
  const router = useRouter();
  const { token } = useContext(TokenContext) || {};
  const { address: account } = useAccount();
  const chainId = useChainId();

  // 获取最近 N 轮的行动激励
  const {
    actions,
    rewards,
    isPending: isLoadingRewards,
    error: errorLoadingRewards,
  } = useActionRewardsByAccountOfLastRounds(token?.address as `0x${string}`, account as `0x${string}`, LAST_ROUNDS);

  // 将激励按行动分组（显示所有行动，没有激励的显示提示）
  const grouped = useMemo<ActionRewardsGroup[]>(() => {
    if (!actions || !rewards) return [];

    // 创建激励映射
    const rewardsByAction = new Map<string, ActionReward[]>();
    for (const r of rewards) {
      if (r.reward <= 0n) continue;
      const key = r.actionId.toString();
      if (!rewardsByAction.has(key)) rewardsByAction.set(key, []);
      rewardsByAction.get(key)!.push(r);
    }

    // 为所有行动创建分组，包括没有激励的行动
    const list: ActionRewardsGroup[] = [];
    for (const act of actions) {
      const actionIdStr = String(act.head.id);
      const actionRewards = rewardsByAction.get(actionIdStr) || [];

      // 如果有激励，按轮次倒序排序
      if (actionRewards.length > 0) {
        actionRewards.sort((a, b) => (a.round > b.round ? -1 : 1));
      }

      list.push({ action: act, rewards: actionRewards });
    }

    // 按行动 id 倒序
    list.sort((a, b) => (BigInt(a.action.head.id) > BigInt(b.action.head.id) ? -1 : 1));
    return list;
  }, [actions, rewards]);

  // 铸造行动激励
  const { mintActionReward, isPending, isConfirming, isConfirmed, writeError } = useMintActionReward();
  const [mintingTarget, setMintingTarget] = useState<{ actionId: bigint; round: bigint } | null>(null);
  const [locallyMinted, setLocallyMinted] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isConfirmed) {
      toast.success('铸造成功');
      if (mintingTarget) {
        const key = `${mintingTarget.actionId.toString()}-${mintingTarget.round.toString()}`;
        setLocallyMinted((prev) => {
          const next = new Set(prev);
          next.add(key);
          return next;
        });
      }
      if (typeof window !== 'undefined' && token?.address && account) {
        setActionRewardNeedMinted(account, token.address, false);
      }
    }
  }, [isConfirmed, mintingTarget, token?.address, account]);

  // 账号或 Token 切换时重置本地已铸造集合
  useEffect(() => {
    setLocallyMinted(new Set());
  }, [token?.address, account]);

  const handleClaim = async (round: bigint, actionId: bigint) => {
    if (token?.address && account) {
      setMintingTarget({ actionId, round });
      await mintActionReward(token.address, round, actionId);
    }
  };

  // 结合本地已铸造集合覆盖 UI 展示
  const displayedGroups = useMemo(() => {
    if (!grouped) return [];
    return grouped.map((g) => ({
      ...g,
      rewards: g.rewards.map((r) => {
        const key = `${BigInt(g.action.head.id).toString()}-${r.round.toString()}`;
        return locallyMinted.has(key) || r.isMinted ? { ...r, isMinted: true } : r;
      }),
    }));
  }, [grouped, locallyMinted]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorLoadingRewards) handleContractError(errorLoadingRewards, 'dataViewer');
    if (writeError) handleContractError(writeError, 'mint');
  }, [errorLoadingRewards, writeError, handleContractError]);

  return (
    <>
      <Header title="行动激励" showBackButton={true} />
      <main className="flex-grow">
        {!token ? (
          <LoadingIcon />
        ) : (
          <div className="flex flex-col space-y-6 p-4">
            <LeftTitle title="铸造行动激励" />

            {isLoadingRewards ? (
              <LoadingIcon />
            ) : (
              displayedGroups.map((group) => (
                <div key={group.action.head.id} className="border border-gray-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="flex items-baseline  mr-2">
                      <span className="text-greyscale-500">No.</span>
                      <span className="text-secondary text-xl font-bold mr-2">{String(group.action.head.id)}</span>
                      <span className="font-bold text-greyscale-800">{`${group.action.body.title}`}</span>
                    </div>
                  </div>

                  {group.rewards.length > 0 ? (
                    <>
                      <table className="table w-full table-auto">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th>轮次</th>
                            <th className="text-center">可铸造激励</th>
                            <th className="text-center">结果</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.rewards.map((item, index) => (
                            <tr
                              key={`${group.action.head.id}-${item.round.toString()}`}
                              className={
                                index === group.rewards.length - 1 ? 'border-none' : 'border-b border-gray-100'
                              }
                            >
                              <td>{formatRoundForDisplay(item.round, token).toString()}</td>
                              <td className="text-center">{formatTokenAmount(item.reward || 0n)}</td>
                              <td className="text-center">
                                {item.reward > 0n && !item.isMinted ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-secondary border-secondary"
                                    onClick={() => handleClaim(item.round, BigInt(group.action.head.id))}
                                    disabled={isPending || isConfirming}
                                  >
                                    铸造
                                  </Button>
                                ) : item.isMinted ? (
                                  <span className="text-greyscale-500">已铸造</span>
                                ) : (
                                  <span className="text-greyscale-500">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <div className="text-center text-greyscale-500 py-4">
                      该行动最近 {LAST_ROUNDS.toString()} 轮没有获得激励
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      onClick={() => router.push(`/my/rewardsofaction?id=${group.action.head.id}`)}
                      className="text-secondary hover:text-secondary/80 underline text-sm bg-transparent border-none cursor-pointer"
                    >
                      查看更多激励 &gt;&gt;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <LoadingOverlay isLoading={isPending || isConfirming} text={isPending ? '提交交易...' : '确认交易...'} />
      </main>
    </>
  );
};

export default ActRewardsPage;
