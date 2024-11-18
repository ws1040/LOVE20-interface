import React, { useEffect, useContext } from 'react';
import { BaseError } from 'viem/_types/errors/base';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

import { useCurrentRound, useSubmit } from '@/src/hooks/contracts/useLOVE20Submit';
import { TokenContext } from '@/src/contexts/TokenContext';
import Loading from '@/src/components/Common/Loading';

interface ActionPanelForJoinProps {
  actionId: bigint;
  submitted: boolean;
  onRoundChange: (currentRound: bigint) => void;
}

const ActionPanelForSubmit: React.FC<ActionPanelForJoinProps> = ({ actionId, submitted, onRoundChange }) => {
  const { token } = useContext(TokenContext) || {};
  const router = useRouter();

  // 获取当前轮次, 并设置状态给父组件
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();
  useEffect(() => {
    if (onRoundChange && typeof onRoundChange === 'function') {
      onRoundChange(currentRound);
    }
  }, [currentRound, onRoundChange]);

  // 提交
  const { submit, isWriting, isConfirming, isConfirmed, writeError: errSubmit } = useSubmit();
  const handleSubmit = () => {
    if (isWriting || isConfirming) {
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
        router.push('/vote');
      }, 2000);
    }
  }, [isConfirmed, errSubmit]);

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-base-100 mb-4 border-t border-gray-100">
      <h1 className="text-base text-center">
        投票轮 (第 <span className="text-red-500">{isPendingCurrentRound ? <Loading /> : Number(currentRound)}</span>轮)
      </h1>

      {submitted || isConfirmed ? (
        <button className="btn w-1/2">已推举</button>
      ) : (
        <button onClick={handleSubmit} className="btn-primary btn w-1/2">
          {isWriting || isConfirming ? <Loading /> : '推举'}
        </button>
      )}

      {errSubmit ? (
        <p className="text-red-500">Error: {(errSubmit as BaseError).shortMessage || errSubmit.message}</p>
      ) : null}
    </div>
  );
};

export default ActionPanelForSubmit;
