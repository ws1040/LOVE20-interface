import React, { useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

// my hooks
import { checkWalletConnection } from '@/src/lib/web3';
import { useCurrentRound, useSubmit } from '@/src/hooks/contracts/useLOVE20Submit';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
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

  // 提交
  const { submit, isWriting, isConfirming, isConfirmed, writeError: errSubmit } = useSubmit();
  const handleSubmit = () => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
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
        router.push(`/vote?symbol=${token?.symbol}`);
      }, 2000);
    }
  }, [isConfirmed, errSubmit]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errSubmit) {
      handleContractError(errSubmit, 'submit');
    }
    if (errCurrentRound) {
      handleContractError(errCurrentRound, 'submit');
    }
  }, [errSubmit, errCurrentRound]);

  return (
    <>
      <div className="flex flex-col items-center my-4">
        {submitted || isConfirmed ? (
          <Button className="w-1/2" disabled>
            已推举
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="w-1/2" disabled={isWriting || isConfirming}>
            {isWriting && '提交中...'}
            {isConfirming && '确认中...'}
            {!isWriting && !isConfirming && '推举本行动'}
          </Button>
        )}
      </div>
      <LoadingOverlay isLoading={isWriting || isConfirming} text={isWriting ? '提交交易...' : '确认交易...'} />
    </>
  );
};

export default ActionPanelForSubmit;
