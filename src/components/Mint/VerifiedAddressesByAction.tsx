import React, { useEffect, useState, useContext } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';

// my hooks
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useMintActionReward } from '@/src/hooks/contracts/useLOVE20Mint';
import { useVerifiedAddressesByAction } from '@/src/hooks/contracts/useLOVE20DataViewer';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my types
import { VerifiedAddress } from '@/src/types/life20types';

// my components
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import ChangeRound from '@/src/components/Common/ChangeRound';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

// my funcs
import { checkWalletConnection } from '@/src/lib/web3';
import { formatTokenAmount, formatRoundForDisplay } from '@/src/lib/format';

const VerifiedAddressesByAction: React.FC<{ currentJoinRound: bigint; actionId: bigint }> = ({
  currentJoinRound,
  actionId,
}) => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress, chain: accountChain } = useAccount();
  const [selectedRound, setSelectedRound] = useState(0n);

  useEffect(() => {
    if (token && currentJoinRound - BigInt(token.initialStakeRound) >= 2n) {
      setSelectedRound(currentJoinRound - BigInt(token.initialStakeRound) - 1n);
    }
  }, [currentJoinRound, token]);

  // 读取验证地址
  const {
    verifiedAddresses,
    isPending: isPendingVerifiedAddresses,
    error: errorVerifiedAddresses,
  } = useVerifiedAddressesByAction(
    token?.address as `0x${string}`,
    token && selectedRound ? selectedRound + BigInt(token.initialStakeRound) - 1n : 0n,
    actionId,
  );

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
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    if (accountAddress && item.unminted > 0 && token) {
      await mintActionReward(
        token?.address as `0x${string}`,
        selectedRound + BigInt(token.initialStakeRound) - 1n,
        actionId,
      );
    }
  };
  useEffect(() => {
    if (isConfirmedMint) {
      setAddresses((prev) => prev.map((addr) => (addr.account === accountAddress ? { ...addr, unminted: 0n } : addr)));
    }
  }, [isConfirmedMint]);

  const handleChangedRound = (round: number) => {
    setSelectedRound(BigInt(round));
  };

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorVerifiedAddresses) {
      handleContractError(errorVerifiedAddresses, 'dataViewer');
    }
    if (mintError) {
      handleContractError(mintError, 'mint');
    }
  }, [errorVerifiedAddresses, mintError]);

  return (
    <div className="relative px-4 py-4">
      <div className="flex items-center">
        <LeftTitle title="验证结果" />
        <span className="text-sm text-greyscale-500 ml-2">行动轮第</span>
        <span className="text-sm text-secondary ml-1">{selectedRound.toString()}</span>
        <span className="text-sm text-greyscale-500 ml-1">轮</span>
        {selectedRound > 0 && (
          <ChangeRound
            currentRound={token && currentJoinRound ? formatRoundForDisplay(currentJoinRound - 2n, token) : 0n}
            handleChangedRound={handleChangedRound}
          />
        )}
      </div>
      {isPendingVerifiedAddresses ? (
        ''
      ) : addresses.length === 0 ? (
        <div className="text-center text-sm text-greyscale-400 p-4">没有地址参与行动</div>
      ) : (
        <table className="table w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th>地址</th>
              <th>得分</th>
              <th>待领取奖励</th>
              <th className="text-center">结果</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((item) => (
              <tr key={item.account} className="border-b border-gray-100">
                <td>
                  <AddressWithCopyButton address={item.account} showCopyButton={false} />
                </td>
                <td>{formatTokenAmount(item.score)}</td>
                <td>{formatTokenAmount(item.minted || item.unminted || 0n)}</td>
                <td className="text-center">
                  {item.account === accountAddress ? (
                    item.unminted > 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-secondary border-secondary"
                        onClick={() => handleClaim(item)}
                        disabled={isMinting || isConfirmingMint}
                      >
                        领取
                      </Button>
                    ) : item.score > 0 ? (
                      <span className="text-greyscale-500">已领</span>
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

      <LoadingOverlay isLoading={isMinting || isConfirmingMint} text={isMinting ? '提交交易...' : '确认交易...'} />
    </div>
  );
};

export default VerifiedAddressesByAction;
