import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react';

// my funcs
import { checkWalletConnection } from '@/src/lib/web3';

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
  remainingVotes: bigint;
}

const VerifyAddresses: React.FC<VerifyAddressesProps> = ({ currentRound, actionId, remainingVotes }) => {
  const { token } = useContext(TokenContext) || {};
  const { chain: accountChain } = useAccount();
  const router = useRouter();
  const { auto: autoQuery } = router.query;

  // 获取参与验证的地址
  const {
    accounts: accountsForVerify,
    infos: verificationInfos,
    isPending: isPendingVerificationInfosByAction,
    error: errorVerificationInfosByAction,
  } = useVerificationInfosByAction(token?.address as `0x${string}`, currentRound, actionId);

  // 初始化百分比
  useEffect(() => {
    if (accountsForVerify && accountsForVerify.length > 0) {
      const equalPercentage = Math.floor(100 / accountsForVerify.length).toString();
      const initialScores: { [address: string]: string } = {};
      accountsForVerify.forEach((address) => {
        initialScores[address] = equalPercentage;
      });
      setScores(initialScores);
    }
  }, [accountsForVerify]);

  // 表单 & 计算票数
  const [scores, setScores] = useState<{ [address: string]: string }>({});
  const totalPercentage = Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
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
    const scoresArray = accountsForVerify.map((addr) => {
      const percentage = parseInt(scores[addr] || '0');
      return (BigInt(percentage) * remainingVotes) / 100n;
    });

    const abstainVotes = (BigInt(abstainPercentage) * remainingVotes) / 100n;
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

  return (
    <>
      <div className="w-full max-w-2xl">
        <ul className="space-y-4">
          {isPendingVerificationInfosByAction && <LoadingIcon />}
          {accountsForVerify && accountsForVerify.length > 0 ? (
            accountsForVerify.map((address, index) => (
              <li key={address} className="flex justify-between items-center p-4 border-b border-gray-100">
                <div className="text-left">
                  <div className="font-mono">
                    <AddressWithCopyButton address={address} />
                  </div>
                  <div className="text-sm text-greyscale-800">{verificationInfos[index]}</div>
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
            <div className="text-center text-greyscale-500">没有人参与活动</div>
          )}
          {accountsForVerify && (
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
