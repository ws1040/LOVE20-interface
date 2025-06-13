import { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import toast from 'react-hot-toast';

// my hooks
import { formatTokenAmount } from '@/src/lib/format';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { LaunchInfo } from '@/src/types/love20types';
import { TOKEN_CONFIG } from '@/src/config/tokenConfig';
import { useContributed, useClaimed, useExtraRefunded, useClaim } from '@/src/hooks/contracts/useLOVE20Launch';

// my context
import { Token, TokenContext } from '@/src/contexts/TokenContext';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

const Claim: React.FC<{ token: Token; launchInfo: LaunchInfo }> = ({ token, launchInfo }) => {
  const { address: account } = useAccount();
  const { clearToken } = useContext(TokenContext) || {};

  // 读取数据的hooks
  const {
    contributed,
    isPending: isContributedPending,
    error: contributedError,
  } = useContributed(token?.address as `0x${string}`, account as `0x${string}`);
  const {
    claimed,
    isPending: isClaimedPending,
    error: claimedError,
  } = useClaimed(token?.address as `0x${string}`, account as `0x${string}`);
  const {
    extraRefunded,
    isPending: isExtraRefundedPending,
    error: extraRefundedError,
  } = useExtraRefunded(token?.address as `0x${string}`, account as `0x${string}`);

  // 计算待领取代币数量
  const gotTokens = launchInfo.totalContributed
    ? (BigInt(TOKEN_CONFIG.fairLaunch) * (contributed || 0n)) / BigInt(launchInfo.totalContributed)
    : 0n;

  // 领取代币hook
  const {
    claim,
    isWriting: isClaiming,
    writeError: claimError,
    isConfirming: isClaimConfirming,
    isConfirmed: isClaimConfirmed,
  } = useClaim();

  // 领取代币
  const handleClaim = async () => {
    try {
      await claim(token?.address as `0x${string}`);
    } catch (error) {
      console.error('领取失败:', error);
    }
  };

  // 领取成功
  useEffect(() => {
    if (isClaimConfirmed) {
      toast.success(`领取成功`);
      clearToken?.();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (claimError) {
      toast.error(`领取失败`);
    }
  }, [isClaimConfirmed, claimError]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (claimError) {
      handleContractError(claimError, 'launch');
    }
    if (claimedError) {
      handleContractError(claimedError, 'launch');
    }
    if (extraRefundedError) {
      handleContractError(extraRefundedError, 'launch');
    }
    if (contributedError) {
      handleContractError(contributedError, 'launch');
    }
  }, [claimError, claimedError, extraRefundedError, contributedError]);

  if (!account) {
    return '';
  }
  if (isClaimedPending) {
    return <LoadingIcon />;
  }
  if (!token) {
    return <LoadingIcon />;
  }

  const parentTokenSymbol =
    token.parentTokenSymbol == process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL
      ? process.env.NEXT_PUBLIC_NATIVE_TOKEN_SYMBOL
      : token.parentTokenSymbol;

  return (
    <div className="px-4 mt-2">
      <LeftTitle title="我的申购" />

      <div className="stats w-full">
        <div className="stat place-items-center">
          <div className="stat-title text-sm mr-6">共获得</div>
          <div className="stat-value text-3xl text-secondary">
            {formatTokenAmount(gotTokens)}
            <span className="text-greyscale-500 font-normal text-sm ml-2">{token.symbol}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {Number(contributed) <= 0 && (
          <>
            <Button className="w-1/2" disabled>
              未申购
            </Button>
            <Button className="w-1/2" asChild>
              <Link href={`/launch/burn?symbol=${token?.symbol}`}>底池销毁</Link>
            </Button>
          </>
        )}
        {Number(contributed) > 0 && !claimed && (
          <Button
            className="w-1/2"
            onClick={handleClaim}
            disabled={isClaiming || isClaimConfirming || isClaimConfirmed}
          >
            {isClaiming ? '领取中...' : isClaimConfirming ? '确认中...' : isClaimConfirmed ? '已领取' : '领取'}
          </Button>
        )}
        {Number(contributed) > 0 && claimed && (
          <>
            <Button className="w-1/2" disabled>
              已领取
            </Button>
            <Button className="w-1/2" asChild>
              <Link href={`/launch/burn?symbol=${token?.symbol}`}>底池销毁</Link>
            </Button>
          </>
        )}
      </div>
      {Number(contributed) > 0 && claimed && (
        <div className="text-center text-sm my-2 text-greyscale-400">
          我共申购了 <span className="text-secondary">{formatTokenAmount(contributed ?? 0n)} </span>
          {parentTokenSymbol}，申购返还了{' '}
          <span className="text-secondary">{formatTokenAmount(extraRefunded ?? 0n)}</span> {parentTokenSymbol}
        </div>
      )}
      <div className="border-t border-gray-200 mx-4 mt-4 mb-6"></div>

      <LoadingOverlay isLoading={isClaiming || isClaimConfirming} text={isClaiming ? '提交交易...' : '确认交易...'} />
    </div>
  );
};

export default Claim;
