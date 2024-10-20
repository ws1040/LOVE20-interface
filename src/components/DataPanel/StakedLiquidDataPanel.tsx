import React, { useContext, useEffect } from 'react';

import { useTokenAmounts } from '../../hooks/contracts/useLOVE20SLToken';
import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/strings';

import Loading from '../Common/Loading';

interface StakedLiquidDataPanelProps {
  showStakeToken?: boolean;
}

const StakedLiquidDataPanel: React.FC<StakedLiquidDataPanelProps> = ({ showStakeToken = true }) => {
  const { token } = useContext(TokenContext) || {};

  const {
    tokenAmount: slTokenAmount,
    parentTokenAmount,
    feeTokenAmount,
    feeParentTokenAmount,
    isPending: isPendingTokenAmount,
    // refreshData,
  } = useTokenAmounts(token?.slTokenAddress as `0x${string}`);

  // useEffect(() => {
  //   if (reloadKey) {
  //     refreshData();
  //   }
  // }, [reloadKey, refreshData]);

  return (
    <>
      {isPendingTokenAmount ? (
        <Loading />
      ) : (
        <>
          <div className="text-sm text-gray-500">流动性质押总量</div>
          <div className="flex w-full justify-center space-x-20">
            <span>
              <span className="text-sm text-gray-500 mr-2">${token?.symbol}</span>
              <span className="text-2xl font-bold text-orange-400">
                {formatTokenAmount(slTokenAmount || BigInt(0))}
              </span>
            </span>
            <span>
              <span className="text-sm text-gray-500 mr-2">${token?.parentTokenSymbol}</span>
              <span className="text-2xl font-bold text-orange-400">
                {formatTokenAmount(parentTokenAmount || BigInt(0))}
              </span>
            </span>
          </div>
          {showStakeToken && (
            <>
              <div className="text-sm text-gray-500">手续费待分配收益</div>
              <div className="flex w-full justify-center space-x-20">
                <span>
                  <span className="text-sm text-gray-500 mr-2">${token?.symbol}</span>
                  <span className="text-2xl font-bold text-orange-400">
                    {formatTokenAmount(feeTokenAmount || BigInt(0))}
                  </span>
                </span>
                <span>
                  <span className="text-sm text-gray-500 mr-2">${token?.parentTokenSymbol}</span>
                  <span className="text-2xl font-bold text-orange-400">
                    {formatTokenAmount(feeParentTokenAmount || BigInt(0))}
                  </span>
                </span>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default StakedLiquidDataPanel;
