'use client';
import React, { useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

// my hooks
import { checkWalletConnection } from '@/src/lib/web3';
import { useCurrentRound, useSubmit } from '@/src/hooks/contracts/useLOVE20Submit';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useCanSubmit } from '@/src/hooks/util/useCanSubmit';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import AlertBox from '@/src/components/Common/AlertBox';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

interface ActionPanelForJoinProps {
  actionId: bigint;
  submitted: boolean;
  onRoundChange: (currentRound: bigint) => void;
}

const ActionPanelForSubmit: React.FC<ActionPanelForJoinProps> = ({ actionId, submitted, onRoundChange }) => {
  const { token } = useContext(TokenContext) || {};
  const { chain: accountChain } = useAccount();
  const router = useRouter();

  // 获取当前轮次, 并设置状态给父组件
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();
  useEffect(() => {
    if (onRoundChange && typeof onRoundChange === 'function') {
      onRoundChange(currentRound);
    }
  }, [currentRound, onRoundChange]);

  // 检查是否可以提交
  const {
    hasEnoughVotes,
    validGovVotes,
    govData,
    SUBMIT_MIN_PERCENTAGE,
    isPending: isPendingCanSubmit,
    error: errCanSubmit,
  } = useCanSubmit();

  // 提交
  const { submit, isWriting, isConfirming, isConfirmed, writeError: errSubmit } = useSubmit();
  const handleSubmit = () => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    if (isWriting || isConfirming) {
      return;
    }
    if (!hasEnoughVotes) {
      return;
    }
    submit(token?.address as `0x${string}`, actionId);
  };
  useEffect(() => {
    if (isConfirmed && !errSubmit) {
      toast.success('推举成功', {
        duration: 2000, // 2秒
      });
      setTimeout(() => {
        router.push(`/vote/?symbol=${token?.symbol}`);
      }, 2000);
    }
  }, [isConfirmed, errSubmit]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errCurrentRound) {
      handleContractError(errCurrentRound, 'submit');
    }
    if (errCanSubmit) {
      handleContractError(errCanSubmit, 'submit');
    }
    if (errSubmit) {
      handleContractError(errSubmit, 'submit');
    }
  }, [errCurrentRound, errCanSubmit, errSubmit]);

  if (isPendingCanSubmit || isPendingCurrentRound) {
    return <LoadingIcon />;
  }

  return (
    <div>
      <div className="flex flex-col m-4">
        {!hasEnoughVotes && validGovVotes !== undefined && govData?.govVotes && (
          <AlertBox
            type="error"
            message={`有效治理票，须达到总治理票的${(SUBMIT_MIN_PERCENTAGE * 100).toFixed(
              1,
            )}%，才能新建、推举行动（您当前有效治理票为${validGovVotes.toString()}）`}
            className="mb-4"
          />
        )}
        <div className="flex justify-center">
          {submitted || isConfirmed ? (
            <Button className="w-1/2" disabled>
              已推举
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="w-1/2" disabled={isWriting || isConfirming || !hasEnoughVotes}>
              {isWriting && '提交中...'}
              {isConfirming && '确认中...'}
              {!isWriting && !isConfirming && '推举本行动'}
            </Button>
          )}
        </div>
        <div className="bg-gray-100 text-greyscale-500 rounded-lg p-4 text-sm mt-4 w-full">
          <p className="mb-1">说明：</p>
          <p>1. 有效治理票数 ≥ 总治理票的0.5%，才能推举；</p>
          <p>2. 每轮次，1个地址最多可 创建/推举 1 个行动；</p>
        </div>
      </div>
      <LoadingOverlay isLoading={isWriting || isConfirming} text={isWriting ? '提交交易...' : '确认交易...'} />
    </div>
  );
};

export default ActionPanelForSubmit;
