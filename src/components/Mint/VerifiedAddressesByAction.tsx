import React, { useEffect, useState, useContext } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

// my hooks
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useMintActionReward } from '@/src/hooks/contracts/useLOVE20Mint';
import { useVerificationInfosByAction, useVerifiedAddressesByAction } from '@/src/hooks/contracts/useLOVE20DataViewer';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my types
import { ActionInfo, VerifiedAddress } from '@/src/types/love20types';

// my components
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import ChangeRound from '@/src/components/Common/ChangeRound';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

// my funcs
import { checkWalletConnection } from '@/src/lib/web3';
import { formatTokenAmount, formatRoundForDisplay } from '@/src/lib/format';
import { LinkIfUrl } from '@/src/lib/stringUtils';

const VerifiedAddressesByAction: React.FC<{
  currentJoinRound: bigint;
  actionId: bigint;
  actionInfo: ActionInfo;
}> = ({ currentJoinRound, actionId, actionInfo }) => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress, chain: accountChain } = useAccount();
  const [selectedRound, setSelectedRound] = useState(0n);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (token && currentJoinRound - BigInt(token.initialStakeRound) >= 2n) {
      setSelectedRound(currentJoinRound - BigInt(token.initialStakeRound) - 1n);
    }
  }, [currentJoinRound, token]);

  // 读取验证地址的奖励
  const {
    verifiedAddresses,
    isPending: isPendingVerifiedAddresses,
    error: errorVerifiedAddresses,
  } = useVerifiedAddressesByAction(
    token?.address as `0x${string}`,
    token && selectedRound ? selectedRound + BigInt(token.initialStakeRound) - 1n : 0n,
    actionId,
  );

  // 获取验证地址的验证信息
  const {
    verificationInfos,
    isPending: isPendingVerificationInfosByAction,
    error: errorVerificationInfosByAction,
  } = useVerificationInfosByAction(
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
      setAddresses((prev) =>
        prev.map((addr) => (addr.account === accountAddress ? { ...addr, minted: addr.unminted, unminted: 0n } : addr)),
      );
    }
  }, [isConfirmedMint, accountAddress]);

  const handleChangedRound = (round: number) => {
    setSelectedRound(BigInt(round));
  };

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorVerifiedAddresses) {
      handleContractError(errorVerifiedAddresses, 'dataViewer');
    }
    if (errorVerificationInfosByAction) {
      handleContractError(errorVerificationInfosByAction, 'dataViewer');
    }
    if (mintError) {
      handleContractError(mintError, 'mint');
    }
  }, [errorVerifiedAddresses, errorVerificationInfosByAction, mintError]);

  // 当地址数据加载完成后，展开获得验证票最多的地址
  useEffect(() => {
    if (addresses.length > 0 && expandedRows.size === 0) {
      const sortedAddresses = [...addresses].sort((a, b) => {
        if (a.score > b.score) return -1;
        if (a.score < b.score) return 1;
        return 0;
      });

      setExpandedRows(new Set([sortedAddresses[0].account]));
    }
  }, [addresses]);

  const toggleRow = (address: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(address)) {
      newExpanded.delete(address);
    } else {
      newExpanded.add(address);
    }
    setExpandedRows(newExpanded);
  };

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
      {isPendingVerifiedAddresses || isPendingVerificationInfosByAction ? (
        <div className="flex justify-center items-center h-full">
          <LoadingIcon />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center text-sm text-greyscale-400 p-4">没有地址参与行动</div>
      ) : (
        <table className="table w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th></th>
              <th>被抽中地址</th>
              <th className="px-1">获得验证票</th>
              <th className="px-1">可铸造激励</th>
              <th className="text-center"></th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((item) => {
              const verificationInfo = verificationInfos?.find((info) => info.account === item.account);
              const isExpanded = expandedRows.has(item.account);

              return (
                <React.Fragment key={item.account}>
                  <tr className={`border-b border-gray-100 ${item.account === accountAddress ? 'text-secondary' : ''}`}>
                    <td className="px-1 w-8">
                      {verificationInfo && (
                        <button
                          onClick={() => toggleRow(item.account)}
                          className="text-greyscale-400 hover:text-greyscale-600"
                        >
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      )}
                    </td>
                    <td className="px-1">
                      <AddressWithCopyButton
                        address={item.account}
                        showCopyButton={true}
                        word={item.account === accountAddress ? '(我)' : ''}
                      />
                    </td>
                    <td className="px-1">{formatTokenAmount(item.score, 0)}</td>
                    <td className="px-1">{formatTokenAmount(item.minted || item.unminted || 0n, 0)}</td>
                    <td className="px-1 text-center">
                      {item.account === accountAddress &&
                        (item.unminted > 0 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-secondary border-secondary"
                            onClick={() => handleClaim(item)}
                            disabled={isMinting || isConfirmingMint}
                          >
                            铸造
                          </Button>
                        ) : item.score > 0 ? (
                          <span className="text-greyscale-500">已铸造</span>
                        ) : null)}
                    </td>
                  </tr>

                  {verificationInfo && actionInfo && isExpanded && (
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td></td>
                      <td colSpan={4} className="px-1 py-3">
                        <div className="text-sm text-greyscale-600">
                          <div className="text-xs text-greyscale-400 mb-2">验证信息:</div>
                          {actionInfo.body.verificationKeys.map((key, i) => (
                            <div key={i} className="mb-1">
                              <span className="text-greyscale-500">{key}:</span>{' '}
                              <LinkIfUrl text={verificationInfo.infos[i]} />
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      <LoadingOverlay isLoading={isMinting || isConfirmingMint} text={isMinting ? '提交交易...' : '确认交易...'} />
    </div>
  );
};

export default VerifiedAddressesByAction;
