import React, { useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { BaseError } from 'viem/_types/errors/base';

import { useCurrentRound, useScoreByVerifierByActionId } from '../../hooks/contracts/useLOVE20Verify';
import { TokenContext } from '../../contexts/TokenContext';

import Loading from '../Common/Loading';
import Link from 'next/link';

interface ActionPanelForVerifingProps {
  actionId: bigint;
  onRoundChange: (currentRound: bigint) => void;
}

const ActionPanelForVerifing: React.FC<ActionPanelForVerifingProps> = ({ actionId, onRoundChange }) => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();
  // 获取当前轮次, 并设置状态给父组件
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();
  useEffect(() => {
    if (onRoundChange && typeof onRoundChange === 'function') {
      onRoundChange(currentRound);
    }
  }, [currentRound, onRoundChange]);

  // 获取是否已验证
  const {
    scoreByVerifierByActionId,
    isPending: isPendingScoreByVerifierByActionId,
    error: errorScoreByVerifierByActionId,
  } = useScoreByVerifierByActionId(
    token?.address as `0x${string}`,
    currentRound,
    accountAddress as `0x${string}`,
    actionId,
  );

  return (
    <>
      <div className="flex flex-col items-center space-y-6 p-8 bg-base-100 mb-4 border-t border-gray-100">
        <h1 className="text-base text-center">
          验证轮 (第 <span className="text-red-500">{isPendingCurrentRound ? <Loading /> : Number(currentRound)}</span>
          轮)
        </h1>

        {isPendingScoreByVerifierByActionId ? (
          <Loading />
        ) : scoreByVerifierByActionId ? (
          <button className="btn-default btn w-1/2">已验证</button>
        ) : (
          <Link href={`/verify/${actionId}`} className="btn-primary btn w-1/2">
            去验证
          </Link>
        )}

        {errCurrentRound && (
          <p className="text-red-500">
            Error: {(errCurrentRound as BaseError).shortMessage || errCurrentRound.message}
          </p>
        )}
        {errorScoreByVerifierByActionId && (
          <p className="text-red-500">
            Error:{' '}
            {(errorScoreByVerifierByActionId as BaseError).shortMessage || errorScoreByVerifierByActionId.message}
          </p>
        )}
      </div>
    </>
  );
};

export default ActionPanelForVerifing;
