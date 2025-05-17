import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react';

// my types & funcs
import { checkWalletConnection } from '@/src/lib/web3';
import { ActionInfo } from '@/src/types/love20types';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useVerificationInfosByAction } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useVerify } from '@/src/hooks/contracts/useLOVE20Verify';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

interface VerifyAddressesProps {
  currentRound: bigint;
  actionId: bigint;
  actionInfo: ActionInfo | undefined;
  remainingVotes: bigint;
}

const VerifyAddresses: React.FC<VerifyAddressesProps> = ({ currentRound, actionId, actionInfo, remainingVotes }) => {
  const { token } = useContext(TokenContext) || {};
  const { chain: accountChain } = useAccount();
  const router = useRouter();
  // const { auto: autoQuery } = router.query;

  // 获取参与验证的地址
  const {
    verificationInfos,
    isPending: isPendingVerificationInfosByAction,
    error: errorVerificationInfosByAction,
  } = useVerificationInfosByAction(token?.address as `0x${string}`, currentRound, actionId);

  // 表单状态
  const [scores, setScores] = useState<{ [address: string]: string }>({});
  const [abstainScore, setAbstainScore] = useState<string>('0');

  // 初始化打分值
  useEffect(() => {
    if (verificationInfos && verificationInfos.length > 0) {
      const initialScores: { [address: string]: string } = {};
      verificationInfos.forEach((info) => {
        initialScores[info.account] = '3';
      });
      setScores(initialScores);
      setAbstainScore('0');
    }
  }, [verificationInfos]);

  // 计算百分比
  const calculatePercentages = () => {
    const addressScores = Object.values(scores).map((val) => parseInt(val) || 0);
    const abstainScoreValue = parseInt(abstainScore) || 0;
    const totalScore = addressScores.reduce((sum, val) => sum + val, 0) + abstainScoreValue;

    if (totalScore === 0) return { addressPercentages: {}, abstainPercentage: 0 };

    const addressPercentages: { [address: string]: number } = {};
    Object.keys(scores).forEach((address) => {
      const score = parseInt(scores[address]) || 0;
      addressPercentages[address] = (score / totalScore) * 100;
    });
    const abstainPercentage = (abstainScoreValue / totalScore) * 100;

    return { addressPercentages, abstainPercentage };
  };

  const { addressPercentages, abstainPercentage } = calculatePercentages();

  // 处理分数变化
  const handleScoreChange = (address: string, value: string) => {
    // 只允许整数或0
    if (value === '' || /^[0-9]+$/.test(value)) {
      setScores({ ...scores, [address]: value });
    }
  };

  // 处理弃权分数变化
  const handleAbstainScoreChange = (value: string) => {
    // 只允许整数或0
    if (value === '' || /^[0-9]+$/.test(value)) {
      setAbstainScore(value);
    }
  };

  // 提交验证
  const { verify, isWriting, isConfirming, isConfirmed, writeError: submitError } = useVerify();
  const checkInput = () => {
    if (!checkWalletConnection(accountChain)) {
      return false;
    }
    if (remainingVotes <= 2n) {
      toast.error('剩余票数不足，无法验证');
      return false;
    }
    const allScoresZero =
      Object.values(scores).every((score) => parseInt(score) === 0 || score === '') &&
      (parseInt(abstainScore) === 0 || abstainScore === '');

    if (allScoresZero) {
      toast.error('请至少给一个地址或弃权投票打分');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!checkInput()) {
      return;
    }

    // 获取打分总和
    const scoreSum =
      Object.values(scores).reduce((sum, score) => sum + (parseInt(score) || 0), 0) + (parseInt(abstainScore) || 0);

    console.log('-------handleSubmit()-------');
    console.log('scoreSum', scoreSum);

    // 计算每个地址的票数（整数部分）
    const scoresArrayForSubmit: bigint[] = [];
    let allocatedVotes = 0n;

    // 计算每个地址的票数（整数部分）
    verificationInfos.forEach((info, index) => {
      const score = parseInt(scores[info.account]) || 0;
      const ratio = score / scoreSum;
      const exactVotes = Number(remainingVotes) * ratio;
      const votes = BigInt(Math.floor(exactVotes));

      // 误差处理，避免验证票数超过剩余票数
      allocatedVotes += votes;
      if (allocatedVotes > remainingVotes) {
        const leftoverVotes = allocatedVotes - remainingVotes;
        allocatedVotes -= leftoverVotes;
        scoresArrayForSubmit.push(votes - leftoverVotes);
      } else {
        scoresArrayForSubmit.push(votes);
      }
    });

    // 计算弃权票数
    console.log('remainingVotes', remainingVotes);
    console.log('scoresArrayForSubmit', scoresArrayForSubmit);

    const scoresArrayTotal = scoresArrayForSubmit.reduce((sum, votes) => sum + votes, 0n);
    console.log('scoresArrayTotal', scoresArrayTotal);

    const abstainVotes =
      parseInt(abstainScore) > 0 && remainingVotes > scoresArrayTotal ? remainingVotes - scoresArrayTotal : 0n;
    console.log('abstainVotes', abstainVotes);

    verify(token?.address as `0x${string}`, actionId, abstainVotes, scoresArrayForSubmit);
  };

  // 提交成功
  useEffect(() => {
    if (isConfirmed && !submitError) {
      toast.success('提交成功', {
        duration: 2000, // 2秒
      });
      setTimeout(() => {
        router.push(`/verify/actions/?symbol=${token?.symbol}`);
      }, 2000);
    }
  }, [isConfirmed, submitError]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (submitError) {
      handleContractError(submitError, 'verify');
    }
    if (errorVerificationInfosByAction) {
      handleContractError(errorVerificationInfosByAction, 'dataViewer');
    }
  }, [submitError, errorVerificationInfosByAction]);

  if (remainingVotes <= 0) {
    return <></>;
  }

  // 渲染
  return (
    <>
      <div className="w-full max-w-2xl">
        <ul className="space-y-4">
          {isPendingVerificationInfosByAction && <LoadingIcon />}
          {verificationInfos && verificationInfos.length > 0 ? (
            verificationInfos.map((info, index) => (
              <li key={info.account} className="flex justify-between items-center p-4 border-b border-gray-100">
                <div className="text-left">
                  <div className="font-mono">
                    <AddressWithCopyButton address={info.account} />
                  </div>
                  {actionInfo && (
                    <div className="text-sm text-greyscale-800">
                      {actionInfo.body.verificationKeys.map((key, i) => (
                        <div key={i}>
                          {key}: {info.infos[i]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      value={scores[info.account] || ''}
                      onChange={(e) => handleScoreChange(info.account, e.target.value)}
                      className="w-10 px-1 py-1 border rounded"
                      disabled={isWriting || isConfirmed}
                    />
                    <span className="ml-1 text-greyscale-500">分:</span>
                  </div>
                  <div className="w-10 text-right text-greyscale-500">
                    {(addressPercentages[info.account] || 0).toFixed(2)}%
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className="text-center text-greyscale-500">没有人参与活动</div>
          )}
          {verificationInfos && (
            <li className="flex justify-between items-center p-4 border-b border-gray-100">
              <div className="text-left">
                <div className="text-sm text-greyscale-800">
                  <span>弃权票数：</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    value={abstainScore}
                    onChange={(e) => handleAbstainScoreChange(e.target.value)}
                    className="w-10 px-1 py-1 border rounded"
                    disabled={isWriting || isConfirmed}
                  />
                  <span className="ml-1 text-greyscale-500">分:</span>
                </div>
                <div className="w-10 text-right text-greyscale-500">{abstainPercentage.toFixed(2)}%</div>
              </div>
            </li>
          )}
        </ul>
      </div>

      {remainingVotes > 0 && (
        <Button onClick={handleSubmit} disabled={isWriting || isConfirming || isConfirmed} className="mt-6 w-1/2">
          {!isWriting && !isConfirming && !isConfirmed && '提交验证'}
          {isWriting && '提交中...'}
          {isConfirming && '确认中...'}
          {isConfirmed && '已验证'}
        </Button>
      )}
      {!remainingVotes && (
        <Button disabled className="mt-6 w-1/2">
          已验证
        </Button>
      )}
      <LoadingOverlay isLoading={isWriting || isConfirming} text={isWriting ? '提交交易...' : '确认交易...'} />
    </>
  );
};

export default VerifyAddresses;
