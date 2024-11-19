import { useContext } from 'react';
import { useAccount } from 'wagmi';

import { useStakedAmountByAccount } from '@/src/hooks/contracts/useLOVE20Join';
import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';
import Loading from '@/src/components/Common/Loading';

const MyActAssetsPanel = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  // 获取行动锁定代币总量
  const {
    stakedAmount,
    isPending: isPendingStakedAmount,
    error: errorStakedAmount,
  } = useStakedAmountByAccount(token?.address as `0x${string}`, accountAddress as `0x${string}`);

  return (
    <>
      <div className="w-full flex flex-col items-center rounded p-4 bg-white mt-4">
        <div className="w-full text-left mb-4">
          <h2 className="relative pl-4 text-gray-700 text-base font-medium before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-500">
            我参与行动的资产
          </h2>
        </div>
        {isPendingStakedAmount ? (
          <Loading />
        ) : (
          <div>
            <span className="text-sm text-gray-500 mr-4">行动锁定代币总量</span>
            <span className="text-2xl font-bold text-orange-400 mr-1">
              {formatTokenAmount(stakedAmount || BigInt(0))}
            </span>
            <span className="text-sm text-gray-500">{token?.symbol}</span>
          </div>
        )}
        {errorStakedAmount && <div className="text-red-500">{errorStakedAmount.message}</div>}
      </div>
    </>
  );
};

export default MyActAssetsPanel;
