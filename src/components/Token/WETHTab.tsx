import React, { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';
// my funcs
import { formatTokenAmount } from '@/src/lib/format';

// my hooks
import { useBalanceOf } from '@/src/hooks/contracts/useWETH';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import AddToMetamask from '@/src/components/Common/AddToMetamask';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

export default function WETHTab() {
  const { address } = useAccount();
  // 获取已铸币量
  const {
    balance,
    isPending: isBalancePending,
    error: balanceError,
  } = useBalanceOf(
    (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ROOT_PARENT_TOKEN as `0x${string}`) || '',
    address || '0x0',
  );

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (balanceError) {
      handleContractError(balanceError, 'token');
    }
  }, [balanceError]);

  return (
    <div className="px-4 pt-0 pb-6">
      <div className="bg-gray-100 rounded-lg p-4 text-sm mt-4">
        <div className="flex items-center">
          <div className="mr-2">
            <div className="flex items-center">
              <span className="font-bold text-2xl mr-2">{process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL}</span>
              <AddressWithCopyButton
                address={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ROOT_PARENT_TOKEN as `0x${string}`}
              />
              <AddToMetamask
                tokenAddress={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ROOT_PARENT_TOKEN as `0x${string}`}
                tokenSymbol={process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL || ''}
                tokenDecimals={Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS) || 0}
              />
            </div>
          </div>
        </div>
        <div className="mt-1 flex items-center">
          <span className="text-sm text-greyscale-500 mr-1">我持有:</span>
          <span className="text-sm text-secondary">
            {isBalancePending ? <LoadingIcon /> : formatTokenAmount(balance || 0n)}
          </span>
        </div>
      </div>
    </div>
  );
}
