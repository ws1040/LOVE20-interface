import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';

import { useVotesNumByAccountByActionId } from '../../hooks/contracts/useLOVE20Vote';
import {
  useCurrentRound,
  useScoreByVerifierByActionId,
  useAccountsForVerify,
  useVerify,
} from '../../hooks/contracts/useLOVE20Verify';

import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/strings';
import Header from '../../components/Header';
import ActionDetail from '../../components/ActionDetail/ActionDetail';
import AddressWithCopyButton from '../../components/Common/AddressWithCopyButton';
import Loading from '../../components/Common/Loading';

const VerifyPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const actionId = BigInt((id as string) || '0');

  // hooks
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();
  const { currentRound } = useCurrentRound();

  const {
    votesNumByAccountByActionId,
    isPending: isVotesNumByAccountByActionIdPending,
    error: isVotesNumByAccountByActionIdError,
  } = useVotesNumByAccountByActionId(
    token?.address as `0x${string}`,
    currentRound,
    accountAddress as `0x${string}`,
    actionId,
  );

  const {
    scoreByVerifierByActionId,
    isPending: isScoreByVerifierByActionIdPending,
    error: isScoreByVerifierByActionIdError,
  } = useScoreByVerifierByActionId(
    token?.address as `0x${string}`,
    currentRound,
    accountAddress as `0x${string}`,
    actionId,
  );

  const {
    accountsForVerify,
    isPending: isAccountsForVerifyPending,
    error: isAccountsForVerifyError,
  } = useAccountsForVerify(token?.address as `0x${string}`, currentRound, actionId);

  // 表单 & 计算票数
  const [scores, setScores] = useState<{ [address: string]: string }>({});
  const remainingVotes = votesNumByAccountByActionId - scoreByVerifierByActionId;
  const totalPercentage = Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  const abstainPercentage = 100 - totalPercentage;
  console.log('votesNumByAccountByActionId', votesNumByAccountByActionId);
  console.log('scoreByVerifierByActionId', scoreByVerifierByActionId);
  console.log('remainingVotes', remainingVotes);

  const handleScoreChange = (address: string, value: string) => {
    setScores({ ...scores, [address]: value });
  };

  // 提交验证
  const { verify, isWriting, isConfirmed, writeError: submitError } = useVerify();
  const handleSubmit = () => {
    const scoresArray = accountsForVerify.map((addr) => {
      const percentage = parseInt(scores[addr] || '0');
      return (BigInt(percentage) * remainingVotes) / 100n;
    });

    const abstainVotes = (BigInt(abstainPercentage) * remainingVotes) / 100n;

    console.log('token?.address', token?.address);
    console.log('actionId', actionId);
    console.log('abstainVotes', abstainVotes);
    console.log('scoresArray', scoresArray);

    verify(token?.address as `0x${string}`, actionId, abstainVotes, scoresArray);
  };

  useEffect(() => {
    if (isConfirmed && !submitError) {
      toast.success('提交成功', {
        duration: 2000, // 2秒
      });
      setTimeout(() => {
        router.push('/verify');
      }, 2000);
    }
  }, [isConfirmed, submitError]);

  return (
    <>
      <Header title="验证页面" />
      <main className="flex-grow">
        <div className="flex flex-col items-center p-4 border-t border-gray-200 bg-base-100 mb-4">
          <div className="mb-4 text-center">
            <span className="font-semibold">
              我的剩余验证票数：
              {isVotesNumByAccountByActionIdPending || isScoreByVerifierByActionIdPending ? (
                <Loading />
              ) : (
                <span className="text-orange-500">{formatTokenAmount(remainingVotes)}</span>
              )}
            </span>
          </div>

          <div className="w-full max-w-2xl">
            <ul className="space-y-4">
              {isVotesNumByAccountByActionIdPending && <Loading />}
              {accountsForVerify && accountsForVerify.length > 0 ? (
                accountsForVerify.map((address) => (
                  <li key={address} className="flex justify-between items-center p-4 border-b border-gray-100">
                    <div className="text-left">
                      <div className="font-mono">
                        <AddressWithCopyButton address={address} />
                      </div>
                      <div className="text-sm text-gray-800">todo: 显示验证信息</div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scores[address] || ''}
                        onChange={(e) => handleScoreChange(address, e.target.value)}
                        className="w-13 px-1 py-1 border rounded"
                        disabled={isWriting || isConfirmed}
                      />
                      %
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-center text-gray-500">没有人参与活动</div>
              )}
              {accountsForVerify && (
                <li className="flex justify-between items-center p-4 border-b border-gray-100">
                  <div className="text-left">
                    <div className="text-sm text-gray-800">
                      <span>弃权票数：</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={abstainPercentage}
                      className="w-13 px-1 py-1 border rounded"
                      disabled={true}
                    />
                    %
                  </div>
                </li>
              )}
            </ul>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isWriting || isConfirmed}
            className={`mt-6 px-6 py-2 rounded ${
              isConfirmed ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isConfirmed ? '已提交' : '提交'}
          </button>
          {isVotesNumByAccountByActionIdError && (
            <div className="text-red-500 text-center">{isVotesNumByAccountByActionIdError.message}</div>
          )}
          {isScoreByVerifierByActionIdError && (
            <div className="text-red-500 text-center">{isScoreByVerifierByActionIdError.message}</div>
          )}
          {submitError && <div className="text-red-500 text-center">{submitError.message}</div>}
        </div>

        <ActionDetail actionId={actionId} round={BigInt(currentRound || 0)} showSubmitter={true} />
      </main>
    </>
  );
};

export default VerifyPage;
