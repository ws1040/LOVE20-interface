import { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

import { formatTokenAmount } from '@/src/lib/format';
import { TOKEN_CONFIG } from '@/src/config/tokenConfig';
import { Token, TokenContext } from '@/src/contexts/TokenContext';
import { LaunchInfo } from '@/src/types/life20types';
import { useContributed, useClaimed, useExtraRefunded, useClaim } from '@/src/hooks/contracts/useLOVE20Launch';
import Loading from '@/src/components/Common/Loading';

const Claim: React.FC<{ token: Token; launchInfo: LaunchInfo }> = ({ token, launchInfo }) => {
  const { address: account } = useAccount();
  const context = useContext(TokenContext);
  const { setToken } = context || {};

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
  const pendingTokens = launchInfo.totalContributed
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

      // 将token 的hasEnded 设置为true
      setToken?.({ ...token, hasEnded: true } as Token);

      // 2秒后刷新
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (claimError) {
      toast.error(`领取失败`);
    }
  }, [isClaimConfirmed, claimError]);

  if (isClaimedPending) {
    return <Loading />;
  }

  return (
    <div className="bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-base font-medium mb-2">领取代币</h3>
        <div className="flex justify-center mb-2">
          <p>
            <span className="text-2xl font-bold text-orange-400 mr-1">{formatTokenAmount(pendingTokens)}</span>
            <span className="text-sm text-gray-500">{token?.symbol}</span>
          </p>
        </div>
      </div>

      <div>
        <div className="mb-6 flex space-x-8">
          <p>
            <span className="text-sm text-gray-500">我的申购：</span>
            {formatTokenAmount(contributed || 0n)}
            {isContributedPending ? (
              <Loading />
            ) : (
              <span className="text-sm text-gray-500 ml-1">{token?.parentTokenSymbol}</span>
            )}
          </p>
          <p>
            <span className="text-sm text-gray-500">退回父币：</span>
            {formatTokenAmount(extraRefunded || 0n)}
            {isExtraRefundedPending ? (
              <Loading />
            ) : (
              <span className="text-sm text-gray-500 ml-1">{token?.parentTokenSymbol}</span>
            )}
          </p>
        </div>
        <div className="flex justify-center">
          {Number(contributed) <= 0 && (
            <Button className="w-1/2 bg-gray-500 text-white px-4 py-2 rounded" disabled>
              未申购
            </Button>
          )}
          {Number(contributed) > 0 && !claimed && (
            <Button
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={handleClaim}
              disabled={isClaiming || isClaimConfirming}
            >
              {isClaiming || isClaimConfirming ? '领取中...' : '领取'}
            </Button>
          )}
          {Number(contributed) > 0 && claimed && (
            <Button className="w-1/2 bg-gray-400 text-white px-4 py-2 rounded" disabled>
              已领取
            </Button>
          )}
        </div>
        {claimError && <div className="text-red-500">{claimError.message}</div>}
        {contributedError && <div className="text-red-500">{contributedError.message}</div>}
        {extraRefundedError && <div className="text-red-500">{extraRefundedError.message}</div>}
        {claimedError && <div className="text-red-500">{claimedError.message}</div>}
      </div>
    </div>
  );
};

export default Claim;
