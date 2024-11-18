import React, { useEffect, useState, useContext } from 'react';
import { useAccount } from 'wagmi';

import { VerifiedAddress } from '@/src/types/life20types';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useVerifiedAddressesByAction } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useMintActionReward } from '@/src/hooks/contracts/useLOVE20Mint';
import { formatTokenAmount } from '@/src/lib/format';

import Loading from '@/src/components/Common/Loading';
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';

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

  console.log('================begin====================');
  // console.log('token?.address', token?.address);
  // console.log('round', round);
  // console.log('actionId', actionId);
  console.log('isPendingVerifiedAddresses', isPendingVerifiedAddresses);
  console.log('errorVerifiedAddresses', errorVerifiedAddresses);
  console.log('verifiedAddresses', verifiedAddresses);
  console.log('====================================');

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
    <div className="p-4 bg-base-100 mb-4">
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
    </div>
  );
};

export default VerifiedAddressesByAction;
