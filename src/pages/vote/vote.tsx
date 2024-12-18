import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { BaseError, useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { ActionInfo } from '@/src/types/life20types';
import { checkWalletConnection } from '@/src/utils/web3';
import { formatTokenAmount } from '@/src/lib/format';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useActionInfosByIds } from '@/src/hooks/contracts/useLOVE20Submit';
import { useValidGovVotes } from '@/src/hooks/contracts/useLOVE20Stake';
import { useCurrentRound, useVotesNumByAccount, useVote } from '@/src/hooks/contracts/useLOVE20Vote';

import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

const VotingSubmitPage = () => {
  const { token } = useContext(TokenContext) || {};
  const [percentages, setPercentages] = useState<{ [key: number]: number }>({});
  const { address: accountAddress, chain: accountChain } = useAccount();
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();

  const router = useRouter();
  const { ids } = router.query as { ids: string };
  const [idList, setIdList] = useState<number[]>([]);

  useEffect(() => {
    if (ids) {
      setIdList(ids.split(',').map((id: string) => parseInt(id, 10)));
    }
  }, [ids]);

  useEffect(() => {
    if (idList.length === 1) {
      setPercentages({ [idList[0]]: 100 });
    } else {
      const initialPercentages: { [key: number]: number } = {};
      const equalPercentage = Math.floor(100 / idList.length);
      idList.forEach((id, index) => {
        if (index === idList.length - 1) {
          initialPercentages[id] = 100 - equalPercentage * (idList.length - 1);
        } else {
          initialPercentages[id] = equalPercentage;
        }
      });
      setPercentages(initialPercentages);
    }
  }, [idList]);

  const handlePercentageChange = (actionId: number, value: number) => {
    if (idList.length === 1) return;

    const updatedPercentages = { ...percentages, [actionId]: value };
    const otherIds = idList.slice(0, -1);
    const total = otherIds.reduce((sum, id) => sum + (updatedPercentages[id] || 0), 0);

    if (total > 100) {
      toast.error('投票百分比之和不能超过100%');
      return;
    }

    const lastId = idList[idList.length - 1];
    updatedPercentages[lastId] = 100 - total;

    setPercentages(updatedPercentages);
  };

  // 获取剩余票数
  const { validGovVotes, isPending: isPendingValidGovVotes } = useValidGovVotes(
    token?.address as `0x${string}`,
    accountAddress as `0x${string}`,
  );
  const { votesNumByAccount, isPending: isPendingVotesNumByAccount } = useVotesNumByAccount(
    token?.address as `0x${string}`,
    currentRound,
    accountAddress as `0x${string}`,
  );

  // 获取行动列表
  const actionIds = idList?.map((id: number) => BigInt(id)) || [];
  const {
    actionInfos,
    isPending: isPendingActionInfosByIds,
    error: errorActionInfosByIds,
  } = useActionInfosByIds(token?.address as `0x${string}`, actionIds);

  // 提交投票
  const { vote, isWriting, isConfirming, isConfirmed, writeError: submitError } = useVote();

  // 检查输入
  const checkInput = () => {
    if (!checkWalletConnection(accountChain)) {
      return false;
    }
    // percentages 百分比之和必须为100
    const totalPercentage = Object.values(percentages).reduce((sum, percentage) => sum + percentage, 0);
    if (totalPercentage !== 100) {
      toast.error('百分比之和必须为100');
      return false;
    }
    return true;
  };

  // 提交投票
  const handleSubmit = async () => {
    if (!checkInput()) {
      return;
    }
    // 计算每个action的投票数
    const actionIds = idList.map((id) => BigInt(id));
    const votes = idList.map((id) => {
      const percentage = percentages[id] || 0;
      return (BigInt(percentage) * validGovVotes) / 100n;
    });

    // 提交投票
    try {
      await vote(token?.address as `0x${string}`, actionIds, votes);
    } catch (error) {
      console.error('投票提交失败:', error);
      toast.error('提交失败，请重试');
    }
  };
  useEffect(() => {
    if (isConfirmed && !submitError) {
      toast.success('提交成功', {
        duration: 2000, // 2秒
      });
      setTimeout(() => {
        router.push(`/gov?symbol=${token?.symbol}`);
      }, 2000);
    }
  }, [isConfirmed, submitError]);

  if (!token) {
    return '';
  }

  return (
    <>
      <Header title="投票" />
      <main className="flex-grow">
        <div className="flex flex-col items-center space-y-4 p-6">
          <div className="text-base text-greyscale-500">
            <span>我的剩余票数：</span>
            <span className="text-secondary">
              {isPendingValidGovVotes || isPendingVotesNumByAccount ? (
                <LoadingIcon />
              ) : (
                formatTokenAmount(validGovVotes - votesNumByAccount || BigInt(0))
              )}
            </span>
          </div>
        </div>

        {/* 行动列表 */}
        <div className="px-4">
          <div className="space-y-4">
            {actionInfos?.map((action: ActionInfo, index: number) => {
              const isLast = index === actionInfos.length - 1;
              const otherIds = idList.slice(0, -1);
              const total = otherIds.reduce((sum, id) => sum + (percentages[id] || 0), 0);
              const lastValue = 100 - total;

              return (
                <div key={action.head.id} className="p-4 rounded-lg mb-4 flex justify-between items-center">
                  <Link
                    href={`/action/${action.head.id}?type=vote&symbol=${token.symbol}`}
                    key={action.head.id}
                    className="flex-grow"
                  >
                    <div className="font-semibold mb-2">
                      <span className="text-greyscale-400 text-sm mr-1">{`No.${action.head.id}`}</span>
                      <span className="text-greyscale-900">{`${action.body.action}`}</span>
                    </div>
                    <p className="text-greyscale-500">{action.body.consensus}</p>
                  </Link>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min={isLast ? lastValue : 1}
                      max="100"
                      value={isLast ? lastValue : percentages[action.head.id] || ''}
                      onChange={(e) => handlePercentageChange(action.head.id, Number(e.target.value))}
                      className="p-2 border rounded w-16"
                      disabled={idList.length === 1 || isLast}
                      placeholder=""
                    />
                    %
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-4">
            <Button className="w-1/2" onClick={handleSubmit} disabled={isWriting || isConfirming || isConfirmed}>
              {isWriting ? '提交中...' : isConfirming ? '确认中...' : isConfirmed ? '已提交' : '提交投票'}
            </Button>
          </div>
          {submitError ? (
            <div className="text-red-500">Error: {(submitError as BaseError).shortMessage || submitError.message}</div>
          ) : null}
        </div>
        <LoadingOverlay isLoading={isWriting || isConfirming} text={isWriting ? '提交交易...' : '确认交易...'} />
      </main>
    </>
  );
};

export default VotingSubmitPage;
