import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { BaseError, useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

import { useActionInfosByIds } from '../../hooks/contracts/useLOVE20Submit';
import { useValidGovVotes } from '../../hooks/contracts/useLOVE20Stake';
import { useCurrentRound, useVotesNumByAccount, useVote } from '../../hooks/contracts/useLOVE20Vote';

import Header from '../../components/Header';
import Loading from '../../components/Common/Loading';
import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/strings';
import { ActionInfo } from '../../types/life20types';

const VotingSubmitPage = () => {
  const { token } = useContext(TokenContext) || {};
  const [percentages, setPercentages] = useState<{ [key: number]: number }>({});
  const { address: accountAddress } = useAccount();
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();

  const router = useRouter();
  const { ids } = router.query as { ids: string };
  const [idList, setIdList] = useState<number[]>([]);

  useEffect(() => {
    if (ids) {
      setIdList(ids.split(',').map((id: string) => parseInt(id, 10)));
    }
  }, [ids]);

  // 剩余票数hook：
  const { validGovVotes, isPending: isPendingValidGovVotes } = useValidGovVotes(
    token?.address as `0x${string}`,
    accountAddress as `0x${string}`,
  );
  const { votesNumByAccount, isPending: isPendingVotesNumByAccount } = useVotesNumByAccount(
    token?.address as `0x${string}`,
    currentRound,
    accountAddress as `0x${string}`,
  );
  console.log('validGovVotes', validGovVotes);
  console.log('votesNumByAccount', votesNumByAccount);

  // 行动列表hook：
  const actionIds = idList?.map((id: number) => BigInt(id)) || [];
  const {
    actionInfos,
    isPending: isPendingActionInfosByIds,
    error: errorActionInfosByIds,
  } = useActionInfosByIds(token?.address as `0x${string}`, actionIds);

  // 投票hook：
  const { vote, isWriting, isConfirming, isConfirmed, writeError: submitError } = useVote();

  // 百分比变化：
  const handlePercentageChange = (actionId: number, value: number) => {
    setPercentages((prev) => ({
      ...prev,
      [actionId]: value,
    }));
  };

  // 提交投票：注意，百分比之和必须是100，否则toast报错“百分比之和必须为100”
  const handleSubmit = async () => {
    // percentages 百分比之和必须为100
    const totalPercentage = Object.values(percentages).reduce((sum, percentage) => sum + percentage, 0);
    if (totalPercentage !== 100) {
      toast.error('百分比之和必须为100');
      return;
    }
    // 计算每个action的投票数
    const actionIds = idList.map((id) => BigInt(id));
    const votes = idList.map((id) => {
      const percentage = percentages[id] || 0;
      return BigInt(Math.floor((percentage * Number(validGovVotes)) / 100));
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
        router.push('/gov');
      }, 2000);
    }
  }, [isConfirmed, submitError]);

  return (
    <>
      <Header title="投票首页" />
      <main className="flex-grow">
        <div className="flex flex-col items-center space-y-4 p-6 bg-base-100">
          <h1 className="text-base text-center">
            投票轮 （第
            <span className="text-red-500">{isPendingCurrentRound ? <Loading /> : Number(currentRound)}</span>
            轮）
          </h1>
          <div className="text-base text-gray-500">
            <span>我的剩余票数：</span>
            {isPendingValidGovVotes || isPendingVotesNumByAccount ? (
              <Loading />
            ) : (
              formatTokenAmount(validGovVotes - votesNumByAccount || BigInt(0))
            )}
          </div>
        </div>

        {/* 行动列表 */}
        <div className="p-4">
          <h2 className="text-sm font-bold mb-4 text-gray-600">行动列表 (行动轮)</h2>
          <div className="space-y-4">
            {actionInfos?.map((action: ActionInfo, index: number) => (
              <div key={action.head.id} className="bg-white p-4 rounded-lg mb-4 flex justify-between items-center">
                <Link href={`/action/${action.head.id}?type=vote`} key={action.head.id} className="flex-grow">
                  <div className="font-semibold mb-2">
                    <span className="text-gray-400 text-base mr-1">{`No.${action.head.id}`}</span>
                    <span className="text-gray-800 text-lg">{`${action.body.action}`}</span>
                  </div>
                  <p className="leading-tight">{action.body.consensus}</p>
                </Link>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={percentages[action.head.id] || ''}
                    onChange={(e) => handlePercentageChange(action.head.id, Number(e.target.value))}
                    className="p-2 border rounded w-16"
                    placeholder=""
                  />
                  %
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button className="btn btn-primary w-1/2" onClick={handleSubmit} disabled={isWriting || isConfirming}>
              {isWriting || isConfirming ? '提交中...' : '提交投票'}
            </button>
          </div>
          {submitError ? (
            <div className="text-red-500">Error: {(submitError as BaseError).shortMessage || submitError.message}</div>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default VotingSubmitPage;
