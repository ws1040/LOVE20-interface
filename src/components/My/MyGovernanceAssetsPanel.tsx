import { useContext } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

import { TokenContext } from '../../contexts/TokenContext';
import { useAccountStakeStatus } from '../../hooks/contracts/useLOVE20Stake';
import { formatTokenAmount } from '../../utils/strings';
import Loading from '../Common/Loading';

const MyGovernanceAssetsPanel = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();
  const {
    slAmount,
    stAmount,
    promisedWaitingRounds,
    requestedUnstakeRound,
    govVotes,
    isPending: isPendingAccountStakeStatus,
    error: errorAccountStakeStatus,
  } = useAccountStakeStatus(token?.address as `0x${string}`, accountAddress as `0x${string}`);

  return (
    <>
      <div className="w-full flex flex-col items-center rounded p-4 bg-base-100 mt-1">
        <div className="w-full text-left mb-4">
          <h2 className="relative pl-4 text-gray-700 text-base font-medium before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-500">
            我参与治理的资产
          </h2>
        </div>
        <div className="flex w-full justify-center">
          <div className="flex flex-col items-center flex-1">
            <span className="text-sm text-gray-500">流动性质押</span>
            <span className="text-2xl font-bold text-orange-400">
              {isPendingAccountStakeStatus ? <Loading /> : formatTokenAmount(slAmount || BigInt(0))}
            </span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-sm text-gray-500">质押代币</span>
            <span className="text-2xl font-bold text-orange-400">
              {isPendingAccountStakeStatus ? <Loading /> : formatTokenAmount(stAmount || BigInt(0))}
            </span>
          </div>
        </div>
        <div className="flex w-full justify-center mt-2">
          <div className="flex flex-col items-center flex-1">
            <span className="text-sm text-gray-500">承诺释放间隔轮次</span>
            <span>
              <span className="text-2xl font-bold text-orange-400">
                {isPendingAccountStakeStatus ? <Loading /> : `${promisedWaitingRounds || BigInt(0)}`}
              </span>
              <span className="text-sm text-gray-500"> 轮</span>
            </span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-sm text-gray-500">治理票数</span>
            <span className="text-2xl font-bold text-orange-400">
              {isPendingAccountStakeStatus ? <Loading /> : formatTokenAmount(govVotes || BigInt(0))}
            </span>
          </div>
        </div>
        <div className="flex w-full justify-center mt-2">
          <Link href="/my/govrewards" className="btn-primary btn w-1/2">
            查看治理奖励
          </Link>
        </div>
      </div>
    </>
  );
};

export default MyGovernanceAssetsPanel;
