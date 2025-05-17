'use client';
import React, { useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// my hooks
import {
  useCurrentRound,
  useJoinedAmountByActionIdByAccount,
  useJoinedAmountByActionId,
} from '@/src/hooks/contracts/useLOVE20Join';
import { useVerificationInfosByAccount } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

// my utils
import { LinkIfUrl } from '@/src/lib/stringUtils';

interface ActionPanelForJoinProps {
  actionId: bigint;
  onRoundChange: (currentRound: bigint) => void;
}

const ActionPanelForJoin: React.FC<ActionPanelForJoinProps> = ({ actionId, onRoundChange }) => {
  const { address: account } = useAccount();
  const { token } = useContext(TokenContext) || {};

  // 获取当前轮次, 并设置状态给父组件
  const { currentRound, error: errCurrentRound } = useCurrentRound();
  useEffect(() => {
    if (onRoundChange && typeof onRoundChange === 'function') {
      onRoundChange(currentRound);
    }
  }, [currentRound, onRoundChange]);

  // 获取我的行动代币数
  const {
    joinedAmountByActionIdByAccount,
    isPending: isPendingJoinedAmountByAccount,
    error: errorJoinedAmountByAccount,
  } = useJoinedAmountByActionIdByAccount(
    (token?.address as `0x${string}`) || '',
    actionId,
    (account as `0x${string}`) || '',
  );

  // 获取所有用户代币数，计算参与比例
  const {
    joinedAmountByActionId,
    isPending: isPendingJoinedAmount,
    error: errorJoinedAmount,
  } = useJoinedAmountByActionId((token?.address as `0x${string}`) || '', actionId);
  const isJoined =
    joinedAmountByActionIdByAccount &&
    joinedAmountByActionIdByAccount > 0 &&
    joinedAmountByActionId &&
    joinedAmountByActionId > 0;
  const participationRatio = isJoined
    ? `${parseFloat(((Number(joinedAmountByActionIdByAccount) / Number(joinedAmountByActionId)) * 100).toFixed(3))}%`
    : '0%';

  // 获取验证信息
  const {
    verificationKeys,
    verificationInfos,
    isPending: isPendingVerificationInfo,
    error: errorVerificationInfo,
  } = useVerificationInfosByAccount(
    (token?.address as `0x${string}`) || '',
    actionId,
    (account as `0x${string}`) || '',
  );

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorJoinedAmountByAccount) {
      handleContractError(errorJoinedAmountByAccount, 'join');
    }
    if (errorJoinedAmount) {
      handleContractError(errorJoinedAmount, 'join');
    }
    if (errorVerificationInfo) {
      handleContractError(errorVerificationInfo, 'join');
    }
    if (errCurrentRound) {
      handleContractError(errCurrentRound, 'join');
    }
  }, [errorJoinedAmountByAccount, errorJoinedAmount, errorVerificationInfo, errCurrentRound]);

  if (isPendingJoinedAmountByAccount || isPendingJoinedAmount) {
    return '';
  }

  return (
    <div className="flex flex-col items-center px-4 pt-1 pb-4">
      {isJoined && (
        <div className="stats w-full grid grid-cols-2 divide-x-0">
          <div className="stat place-items-center">
            <div className="stat-title">我的参与</div>
            <div className="stat-value text-2xl text-secondary">
              {isPendingJoinedAmount ? (
                <LoadingIcon />
              ) : (
                formatTokenAmount(joinedAmountByActionIdByAccount || BigInt(0))
              )}
            </div>
            <div className="stat-desc text-sm mt-2">参与本行动的代币</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">我的占比</div>
            <div className="stat-value text-2xl text-secondary">{participationRatio}</div>
            <div className="stat-desc text-sm mt-2">占本行动总代币的比例</div>
          </div>
        </div>
      )}

      {!isJoined ? (
        <Button variant="outline" className="w-1/2 text-secondary border-secondary" asChild>
          <Link href={`/acting/join?id=${actionId}&symbol=${token?.symbol}`}>参与行动</Link>
        </Button>
      ) : (
        <>
          <Button type="button" className="w" disabled={true}>
            第1次内测体验, 暂时关闭增加代币
          </Button>
          {/* <Button variant="outline" className="w-1/2 text-secondary border-secondary" asChild>
            <Link href={`/acting/join?id=${actionId}&symbol=${token?.symbol}`}>增加参与代币</Link>
          </Button> */}
          <div className="flex flex-col items-center mt-2">
            <div className="text-sm text-greyscale-600">
              {isPendingVerificationInfo && '加载中...'}
              {verificationKeys && verificationKeys.length > 0 && (
                <div>
                  {verificationKeys.map((key, index) => (
                    <div key={index}>
                      {key}: <LinkIfUrl text={verificationInfos[index]} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActionPanelForJoin;
