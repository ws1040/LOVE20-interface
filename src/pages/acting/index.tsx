import { useEffect, useState, useContext } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { formatEther } from 'viem';
import { toast } from 'react-hot-toast';

import { useTotalSupply } from '../../hooks/contracts/useLOVE20Token';
import { useVotesNums } from '../../hooks/contracts/useLOVE20Vote';
import { useCurrentRound, useJoinedAmount, useJoinedAmountByActionId } from '../../hooks/contracts/useLOVE20Join';
import { useRewardAvailable } from '../../hooks/contracts/useLOVE20Mint';
import { useActionInfosByIds } from '../../hooks/contracts/useLOVE20Submit';

import { TokenContext } from '../../contexts/TokenContext';
import { abbreviateAddress } from '../../utils/strings';

import TokenTab from '../../components/Token/TokenTab';
import ActionRoundList from '../../components/ActionList/ActionRoundList';


const tokenAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_FIRST_TOKEN as `0x${string}`;

const ActingPage = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  const { totalSupply, isPending: isPendingTotalSupply, error: errorTotalSupply } = useTotalSupply(tokenAddress);
  const { currentRound, isPending: isPendingCurrentRound, error: errorCurrentRound } = useCurrentRound();
  const { rewardAvailable, isPending: isPendingRewardAvailable, error: errorRewardAvailable } = useRewardAvailable(tokenAddress);
  // const { joinedAmountByActionId, isPending: isPendingJoinedAmountByActionId, error: errorJoinedAmountByActionId } = useJoinedAmountByActionId(tokenAddress, currentRound, 0n);

  const { actionIds, votes, isPending: isPendingVotesNums, error: errorVotesNums } = useVotesNums(tokenAddress, currentRound || BigInt(0));
  const { joinedAmount, isPending: isPendingJoinedAmount, error: errorJoinedAmount } = useJoinedAmount(tokenAddress, currentRound || BigInt(0));
  // const { actionInfosByIds, isPending: isPendingActionInfosByIds, error: errorActionInfosByIds } = useActionInfosByIds(tokenAddress, actionIds || []);

  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('TokenSwitcher must be used within a TokenProvider');
  }
  const { token, setToken } = context;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token?.address || '');
    alert('合约地址已复制到剪贴板');
  };


  return (
    <main className="flex-grow">
      <TokenTab />
      <div className="flex-grow container mx-auto p-4">
      
        {/* 统计区域 */}
        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">统计</h2>
          <div className="flex items-center mt-2">
            <span>合约地址: {abbreviateAddress(token?.address || '')}</span>
            <button className="btn btn-xs btn-primary ml-2" onClick={copyToClipboard}>
              复制地址
            </button>
          </div>
          <div className="mt-2">
            <span>已铸币量: {totalSupply}</span>
            <span className="tooltip" data-tip="铸币上限">
              <button className="btn btn-ghost btn-circle ml-2">
                ?
              </button>
            </span>
          </div>
        </div>
      
        {/* 参与行动区域 */}
        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">参与行动</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>轮次（行动轮）: {currentRound}</p>
              <p>预计新增铸币: {rewardAvailable}</p>
            </div>
            <div>
              <p>参与行动代币: {joinedAmount}</p>
              <a href="/rewards" className="link">查看以往轮次奖励</a>
            </div>
          </div>
          <ActionRoundList currentRound={Number(currentRound)} />
        </div>
      
        {/* 参与治理区域 */}
        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-4">参与治理</h2>
          <div className="flex flex-col space-y-4">
            <a href="/governance" className="btn btn-primary w-full">参与治理</a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ActingPage;

