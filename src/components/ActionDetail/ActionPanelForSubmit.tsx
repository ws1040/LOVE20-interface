import React, { useEffect, useContext } from 'react';
import { BaseError } from 'viem/_types/errors/base';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

import { useCurrentRound, useSubmit } from '@/src/hooks/contracts/useLOVE20Submit';
import { TokenContext } from '@/src/contexts/TokenContext';
import Loading from '@/src/components/Common/Loading';
import Round from '@/src/components/Common/Round';

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
        router.push(`/${token?.symbol}/vote`);
      }, 2000);
    }
  }, [isConfirmed, errSubmit]);

  return (
    <div className="flex flex-col items-center space-y-4 p-8 bg-white mb-4 ">
      {isPendingCurrentRound ? <Loading /> : <Round currentRound={currentRound} roundName="投票轮" />}

      {submitted || isConfirmed ? (
        <Button className="w-1/2 bg-gray-400 cursor-not-allowed">已推举</Button>
      ) : (
        <Button onClick={handleSubmit} className="w-1/2 bg-blue-600 hover:bg-blue-700">
          {isWriting || isConfirming ? <Loading /> : '推举'}
        </Button>
      )}

      {errSubmit ? (
        <p className="text-red-500">Error: {(errSubmit as BaseError).shortMessage || errSubmit.message}</p>
      ) : null}
    </div>
  );
};

export default ActionPanelForSubmit;
