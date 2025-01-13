import React, { useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// my hooks
import {
  useCurrentRound,
  useJoinedAmountByActionIdByAccount,
  useJoinedAmountByActionId,
  useVerificationInfo,
} from '@/src/hooks/contracts/useLOVE20Join';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

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
    currentRound,
    actionId,
    (account as `0x${string}`) || '',
  );

  // 获取所有用户代币数，计算参与比例
  const {
    joinedAmountByActionId,
    isPending: isPendingJoinedAmount,
    error: errorJoinedAmount,
  } = useJoinedAmountByActionId((token?.address as `0x${string}`) || '', currentRound, actionId);
  const isJoined =
    joinedAmountByActionIdByAccount &&
    joinedAmountByActionIdByAccount > 0 &&
    joinedAmountByActionId &&
    joinedAmountByActionId > 0;
  const participationRatio = isJoined
    ? Number(joinedAmountByActionIdByAccount / joinedAmountByActionId) * 100 + '%'
    : '0%';

  // 获取验证信息
  const {
    verificationInfo,
    isPending: isPendingVerificationInfo,
    error: errorVerificationInfo,
  } = useVerificationInfo(
    (token?.address as `0x${string}`) || '',
    currentRound,
    actionId,
    (account as `0x${string}`) || '',
    isJoined as boolean,
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
            <div className="stat-title">我参与本行动的代币</div>
            <div className="stat-value text-2xl">
              {isPendingJoinedAmount ? (
                <LoadingIcon />
              ) : (
                formatTokenAmount(joinedAmountByActionIdByAccount || BigInt(0))
              )}
            </div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">所占比例</div>
            <div className="stat-value text-2xl">{participationRatio}</div>
          </div>
        </div>
      )}

      {!isJoined ? (
        <Button variant="outline" className="w-1/2 text-secondary border-secondary" asChild>
          <Link href={`/acting/join?id=${actionId}&symbol=${token?.symbol}`}>参与行动</Link>
        </Button>
      ) : (
        <>
          <Button variant="outline" className="w-1/2 text-secondary border-secondary py-0" disabled>
            您已加入
          </Button>
          <div className="flex flex-col items-center mt-2">
            <div className="text-sm text-greyscale-600">
              {isPendingVerificationInfo ? '加载中...' : `我的信息：${verificationInfo}`}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActionPanelForJoin;
