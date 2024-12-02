import React, { useEffect, useState, useContext } from 'react';
import { useAccount } from 'wagmi';

import { VerifiedAddress } from '@/src/types/life20types';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useVerifiedAddressesByAction } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useMintActionReward } from '@/src/hooks/contracts/useLOVE20Mint';
import { formatTokenAmount } from '@/src/lib/format';

import LoadingIcon from '@/src/components/Common/LoadingIcon';
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import LeftTitle from '../Common/LeftTitle';

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

  if (isPendingVerifiedAddresses) return <LoadingIcon />;
  if (errorVerifiedAddresses) return <div>发生错误: {errorVerifiedAddresses.message}</div>;

  return (
    <div className="p-6 bg-base-100">
      <LeftTitle title="验证地址结果" />
      <div className="mt-4">
        {addresses.length === 0 ? (
          <div className="text-center text-sm text-greyscale-500">没有验证地址</div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th>地址</th>
                <th>得分</th>
                <th className="text-center">待领取奖励</th>
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
                  <td className="text-center">{formatTokenAmount(item.reward)}</td>
                  <td className="text-center">
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
                        <span className="text-greyscale-500">已领取</span>
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
      </div>
      {mintError && <div className="text-red-500">{mintError.message}</div>}
    </div>
  );
};

export default VerifiedAddressesByAction;
