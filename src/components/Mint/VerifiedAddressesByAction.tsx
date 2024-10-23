import React, { useEffect, useState, useContext } from 'react';
import { useAccount } from 'wagmi';

import { VerifiedAddress } from '../../types/life20types';
import { TokenContext } from '../../contexts/TokenContext';
import { useVerifiedAddressesByAction } from '../../hooks/contracts/useLOVE20DataViewer';
import { useMintActionReward } from '../../hooks/contracts/useLOVE20Mint';
import { formatTokenAmount } from '../../utils/format';

import Loading from '../Common/Loading';
import AddressWithCopyButton from '../Common/AddressWithCopyButton';

const VerifiedAddressesByAction: React.FC<{ round: bigint; actionId: bigint }> = ({ round, actionId }) => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  // 读取验证地址
  const {
    verifiedAddresses,
    isPending: isPendingVerifiedAddresses,
    error: errorVerifiedAddresses,
  } = useVerifiedAddressesByAction(token?.address as `0x${string}`, round, actionId);
  const [addresses, setAddresses] = useState<VerifiedAddress[]>([]);
  useEffect(() => {
    if (verifiedAddresses) {
      setAddresses(verifiedAddresses);
    }
  }, [verifiedAddresses]);

  // 领取奖励
  const {
    mintActionReward,
    isWriting: isMinting,
    isConfirming: isConfirmingMint,
    isConfirmed: isConfirmedMint,
    writeError: mintError,
  } = useMintActionReward();

  const handleClaim = async (item: VerifiedAddress) => {
    if (accountAddress && item.reward > 0) {
      await mintActionReward(token?.address as `0x${string}`, round, actionId);
      if (isConfirmedMint) {
        setAddresses((prev) => prev.map((addr) => (addr.account === item.account ? { ...addr, reward: 0n } : addr)));
      }
    }
  };

  if (isPendingVerifiedAddresses) return <Loading />;
  if (errorVerifiedAddresses) return <div>发生错误: {errorVerifiedAddresses.message}</div>;

  return (
    <div className="relative pt-4 pl-4 bg-base-100 mb-4">
      <h2 className="relative pl-4 text-gray-700 text-base font-medium before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-500">
        验证地址结果
      </h2>
      {addresses.length === 0 ? (
        <div className="text-center text-sm text-gray-500">没有验证地址</div>
      ) : (
        <table className="table w-full">
          <thead>
            <tr>
              <th>地址</th>
              <th>得分</th>
              <th>奖励</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((item) => (
              <tr key={item.account}>
                <td>
                  <AddressWithCopyButton address={item.account} showCopyButton={false} />
                </td>
                <td>{formatTokenAmount(item.score)}</td>
                <td>{formatTokenAmount(item.reward)}</td>
                <td>
                  {item.account === accountAddress ? (
                    item.reward > 0 ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleClaim(item)}
                        disabled={isMinting || isConfirmingMint}
                      >
                        领取
                      </button>
                    ) : item.score > 0 ? (
                      <span className="text-gray-500">已领取</span>
                    ) : (
                      ''
                    )
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {mintError && <div className="text-red-500">{mintError.message}</div>}

      {/* 遮罩层 */}
      {(isMinting || isConfirmingMint) && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-20">
          <div className="text-white text-lg flex items-center">
            <svg
              className="animate-spin mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            正在提交中...
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifiedAddressesByAction;
