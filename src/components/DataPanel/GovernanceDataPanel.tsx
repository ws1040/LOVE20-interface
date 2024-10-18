import React, { useContext } from 'react';

import { useGovVotesNum } from '../../hooks/contracts/useLOVE20Stake';
import { useTotalSupply } from '../../hooks/contracts/useLOVE20STToken';
import { useTokenAmounts } from '../../hooks/contracts/useLOVE20SLToken';

import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/strings';
import TokenLabel from '../Token/TokenLabel';
import Loading from '../Common/Loading';


const GovernanceDataPanel: React.FC = () => {
    const { token } = useContext(TokenContext) || {};

    const { govVotesNum, isPending:isPendingGovVotesNum } = useGovVotesNum(token?.address as `0x${string}`);
    const { tokenAmount:slTokenAmount, parentTokenAmount, feeTokenAmount, feeParentTokenAmount, isPending: isPendingTokenAmount } = useTokenAmounts(token?.slTokenAddress as `0x${string}`);
    const { totalSupply: stTokenAmount, isPending: isPendingStTokenAmount } = useTotalSupply(token?.stTokenAddress as `0x${string}`);

    return (
      <div className="p-6 bg-base-100 border-t border-gray-100">
        
        <TokenLabel />

        <div className="flex w-full justify-center space-x-20">
            <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500">总治理票</span>
                <span className="text-2xl font-bold text-orange-400">
                    {isPendingGovVotesNum ? 'Loading...' : formatTokenAmount(govVotesNum || BigInt(0))}
                </span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500">代币质押量</span>
                <span className="text-2xl font-bold text-orange-400">
                    {isPendingStTokenAmount ? 'Loading...' : formatTokenAmount(stTokenAmount || BigInt(0))}
                </span>
            </div>
        </div>
        <div className="w-full flex flex-col items-center space-y-4 bg-base-200 rounded p-4">
            
            {isPendingTokenAmount ? (
                <Loading /> 
            ) : (
                <>
                <div className="text-base text-gray-500">流动性质押</div>
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
                <div className="text-base text-gray-500">手续费待分配收益</div>
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
        </div>
      </div>
    );
};

export default GovernanceDataPanel;
