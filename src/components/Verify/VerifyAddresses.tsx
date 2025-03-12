import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react';

// my types & funcs
import { checkWalletConnection } from '@/src/lib/web3';
import { ActionInfo } from '@/src/types/life20types';

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
  const { auto: autoQuery } = router.query;

  // 获取参与验证的地址
  const {
    verificationInfos,
    isPending: isPendingVerificationInfosByAction,
    error: errorVerificationInfosByAction,
  } = useVerificationInfosByAction(token?.address as `0x${string}`, currentRound, actionId);

  // 初始化百分比
  useEffect(() => {
    if (verificationInfos && verificationInfos.length > 0) {
      const equalPercentage = Math.floor(100 / verificationInfos.length).toString();
      const initialScores: { [address: string]: string } = {};
      verificationInfos.forEach((info) => {
        initialScores[info.account] = equalPercentage;
      });
      setScores(initialScores);
    }
  }, [verificationInfos]);

  // 表单 & 计算票数
  const [scores, setScores] = useState<{ [address: string]: string }>({});
  const totalPercentage = Object.values(scores).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  const abstainPercentage = 100 - totalPercentage;

  const handleScoreChange = (address: string, value: string) => {
    setScores({ ...scores, [address]: value });
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
    return true;
  };
  const handleSubmit = () => {
    if (!checkInput()) {
      return;
    }
    const scoresArray = verificationInfos.map((info) => {
      const percentage = parseFloat(scores[info.account] || '0');
      return (BigInt(Math.round(percentage * 100)) * remainingVotes) / 10000n;
    });

    const abstainVotes = (BigInt(Math.round(abstainPercentage * 100)) * remainingVotes) / 10000n;
    verify(token?.address as `0x${string}`, actionId, abstainVotes, scoresArray);
  };

  // 提交成功
  useEffect(() => {
    if (isConfirmed && !submitError) {
      toast.success('提交成功', {
        duration: 2000, // 2秒
      });
      setTimeout(() => {
        if (!autoQuery) {
          router.push(`/verify?symbol=${token?.symbol}`);
        } else {
          router.push(`/gov?symbol=${token?.symbol}`); //仅有1个行动需要验证时，自动跳转到gov页面
        }
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
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={scores[info.account] || ''}
                    onChange={(e) => handleScoreChange(info.account, e.target.value)}
                    className="w-13 px-1 py-1 border rounded"
                    disabled={isWriting || isConfirmed}
                  />
                  %
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
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={abstainPercentage.toFixed(2)}
                  className="w-13 px-1 py-1 border rounded"
                  disabled={true}
                />
                %
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
