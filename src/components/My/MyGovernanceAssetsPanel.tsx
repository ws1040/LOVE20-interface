import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// my funcs
import { checkWalletConnection } from '@/src/lib/web3';
import { formatTokenAmount, formatRoundForDisplay } from '@/src/lib/format';

// my hooks
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useAccountStakeStatus, useUnstake, useWithdraw, useCurrentRound } from '@/src/hooks/contracts/useLOVE20Stake';
import { useApprove as useApproveST } from '@/src/hooks/contracts/useLOVE20STToken';
import { useApprove as useApproveSL } from '@/src/hooks/contracts/useLOVE20SLToken';
import { useAllowance } from '@/src/hooks/contracts/useLOVE20Token';

// my contexts
import { Token } from '@/src/contexts/TokenContext';

// my components
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import AddToMetamask from '@/src/components/Common/AddToMetamask';
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';

interface MyGovernanceAssetsPanelProps {
  token: Token | null | undefined;
  enableWithdraw?: boolean;
}

const MyGovernanceAssetsPanel: React.FC<MyGovernanceAssetsPanelProps> = ({ token, enableWithdraw = false }) => {
  const { address: accountAddress, chain: accountChain } = useAccount();

  // Hook: 获取当前轮次
  const { currentRound, isPending: isPendingCurrentRound, error: errorCurrentRound } = useCurrentRound(enableWithdraw);

  // Hook: 获取质押状态
  const {
    slAmount,
    stAmount,
    promisedWaitingRounds,
    requestedUnstakeRound,
    govVotes,
    isPending: isPendingAccountStakeStatus,
    error: errorAccountStakeStatus,
  } = useAccountStakeStatus(token?.address as `0x${string}`, accountAddress as `0x${string}`);

  // 检查输入条件
  const checkInput = () => {
    if (!checkWalletConnection(accountChain)) {
      return false;
    }
    if (!slAmount || slAmount <= 0n) {
      toast.error('流动性质押数量为0，不用取消质押');
      return false;
    }
    return true;
  };

  // 使用 useAllowance 检查授权状态（流动性质押 & 质押代币分别检查）
  const {
    allowance: allowanceSL,
    isPending: isPendingAllowanceSL,
    error: errAllowanceSL,
  } = useAllowance(
    token?.slTokenAddress as `0x${string}`,
    accountAddress as `0x${string}`,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`,
  );

  const {
    allowance: allowanceST,
    isPending: isPendingAllowanceST,
    error: errAllowanceST,
  } = useAllowance(
    token?.stTokenAddress as `0x${string}`,
    accountAddress as `0x${string}`,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`,
  );

  // 状态变量：判断各 token 是否已授权
  const [isSlTokenApproved, setIsSlTokenApproved] = useState(false);
  const [isStTokenApproved, setIsStTokenApproved] = useState(false);

  // 根据 slAmount 与 allowanceSL 判断流动性质押代币是否已授权
  useEffect(() => {
    if (slAmount && slAmount > 0n && allowanceSL && allowanceSL >= slAmount) {
      setIsSlTokenApproved(true);
    } else {
      setIsSlTokenApproved(false);
    }
  }, [slAmount, allowanceSL, isPendingAllowanceSL]);

  // 根据 stAmount 与 allowanceST 判断质押代币是否已授权
  useEffect(() => {
    if (stAmount && stAmount > 0n && allowanceST && allowanceST >= stAmount) {
      setIsStTokenApproved(true);
    } else {
      setIsStTokenApproved(false);
    }
  }, [stAmount, allowanceST, isPendingAllowanceST]);

  // 组合是否完成授权，若没有质押stToken，则只需检查流动性质押的授权情况
  const isApproved = isSlTokenApproved && (stAmount && stAmount > 0n ? isStTokenApproved : true);

  // 授权相关 hook（保留原有逻辑）
  const {
    isPending: isPendingApproveST,
    isConfirming: isConfirmingApproveST,
    isConfirmed: isConfirmedApproveST,
    error: approveSTWriteError,
    approve: approveST,
  } = useApproveST(token?.stTokenAddress as `0x${string}`);
  const {
    isPending: isPendingApproveSL,
    isConfirming: isConfirmingApproveSL,
    isConfirmed: isConfirmedApproveSL,
    error: approveSLWriteError,
    approve: approveSL,
  } = useApproveSL(token?.slTokenAddress as `0x${string}`);

  // 授权流程：如果相应代币尚未授权，则进行授权
  const handleApprove = async () => {
    if (!checkInput()) {
      return;
    }
    try {
      if (slAmount && slAmount > 0n && !isSlTokenApproved) {
        await approveSL(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`, slAmount);
      }
      if (stAmount && stAmount > 0n && !isStTokenApproved) {
        await approveST(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE as `0x${string}`, stAmount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 取消质押
  const {
    isWriting: isPendingUnstake,
    isConfirming: isConfirmingUnstake,
    isConfirmed: isConfirmedUnstake,
    writeError: unstakeWriteError,
    unstake,
  } = useUnstake();
  const handleUnstake = async () => {
    try {
      await unstake(token?.address as `0x${string}`);
    } catch (error) {
      console.error(error);
    }
  };

  // 如果取消质押成功
  useEffect(() => {
    if (isConfirmedUnstake) {
      toast.success('取消质押成功');
      // 2秒后刷新页面
      setTimeout(() => {
        // 跳转到我的首页
        window.location.href = `/my?symbol=${token?.symbol}`;
      }, 2000);
    }
  }, [isConfirmedUnstake]);

  // 取回代币
  const {
    isWriting: isPendingWithdraw,
    isConfirming: isConfirmingWithdraw,
    isConfirmed: isConfirmedWithdraw,
    writeError: withdrawWriteError,
    withdraw,
  } = useWithdraw();
  const handleWithdraw = async () => {
    try {
      await withdraw(token?.address as `0x${string}`);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isConfirmedWithdraw) {
      toast.success('取回代币成功');
      // 2秒后刷新页面
      setTimeout(() => {
        // 跳转到我的首页
        window.location.href = `/my?symbol=${token?.symbol}`;
      }, 2000);
    }
  }, [isConfirmedWithdraw]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorAccountStakeStatus) {
      handleContractError(errorAccountStakeStatus, 'stake');
    }
    if (approveSTWriteError) {
      handleContractError(approveSTWriteError, 'stToken');
    }
    if (approveSLWriteError) {
      handleContractError(approveSLWriteError, 'slToken');
    }
    if (unstakeWriteError) {
      handleContractError(unstakeWriteError, 'stake');
    }
    if (withdrawWriteError) {
      handleContractError(withdrawWriteError, 'stake');
    }
    if (errorCurrentRound) {
      handleContractError(errorCurrentRound, 'stake');
    }
    if (errAllowanceSL) {
      handleContractError(errAllowanceSL, 'slToken');
    }
    if (errAllowanceST) {
      handleContractError(errAllowanceST, 'stToken');
    }
  }, [
    errorAccountStakeStatus,
    approveSTWriteError,
    approveSLWriteError,
    unstakeWriteError,
    withdrawWriteError,
    errorCurrentRound,
    errAllowanceSL,
    errAllowanceST,
  ]);

  if (!accountAddress) {
    return <div className="text-sm mt-4 text-greyscale-500 text-center">请先连接钱包</div>;
  }
  if (!token || (enableWithdraw && isPendingCurrentRound) || isPendingAccountStakeStatus) {
    return <LoadingIcon />;
  }
  if (!isPendingAccountStakeStatus && !slAmount) {
    return <div className="text-sm mt-4 text-greyscale-500 text-center">您没有质押</div>;
  }

  // 中间状态：原先的确认状态替换为 isApproved 状态
  const isApproving = isPendingApproveSL || isPendingApproveST;
  const isApproveConfirming = isConfirmingApproveSL || isConfirmingApproveST;
  const hadStartedApprove = isApproving || isApproveConfirming || isApproved;

  // 是否可以取回代币
  const canWithdraw =
    enableWithdraw &&
    requestedUnstakeRound &&
    currentRound > requestedUnstakeRound + (promisedWaitingRounds || BigInt(0));

  return (
    <>
      <div className="stats w-full grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center pt-2">
          <div className="stat-title text-sm flex items-center">
            流动性质押
            <AddressWithCopyButton address={token.slTokenAddress as `0x${string}`} showAddress={false} />
            <AddToMetamask
              tokenAddress={token.slTokenAddress as `0x${string}`}
              tokenSymbol={'sl' + token.symbol}
              tokenDecimals={token.decimals}
            />
          </div>
          <div className="stat-value text-xl">
            {isPendingAccountStakeStatus ? <LoadingIcon /> : formatTokenAmount(slAmount || BigInt(0), 0)}
          </div>
        </div>
        <div className="stat place-items-center pt-2">
          <div className="stat-title text-sm flex items-center">
            质押代币
            <AddressWithCopyButton address={token.stTokenAddress as `0x${string}`} showAddress={false} />
            <AddToMetamask
              tokenAddress={token.stTokenAddress as `0x${string}`}
              tokenSymbol={'st' + token.symbol}
              tokenDecimals={token.decimals}
            />
          </div>
          <div className="stat-value text-xl">
            {isPendingAccountStakeStatus ? <LoadingIcon /> : formatTokenAmount(stAmount || BigInt(0), 0)}
          </div>
        </div>
      </div>
      <div className="stats w-full grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center pt-0">
          <div className="stat-title text-sm">承诺释放间隔轮数</div>
          <div className="stat-value text-xl">
            {isPendingAccountStakeStatus ? <LoadingIcon /> : `${promisedWaitingRounds || BigInt(0)}`}
          </div>
        </div>
        <div className="stat place-items-center pt-0">
          <div className="stat-title text-sm">治理票数</div>
          <div className="stat-value text-xl">
            {isPendingAccountStakeStatus ? <LoadingIcon /> : formatTokenAmount(govVotes || BigInt(0), 0)}
          </div>
        </div>
      </div>
      {enableWithdraw && (
        <>
          {!requestedUnstakeRound && (
            <>
              <div className="flex justify-center space-x-4 mt-2">
                <Button className="w-1/2" onClick={handleApprove} disabled={hadStartedApprove}>
                  {isApproving
                    ? '1.授权中...'
                    : isApproveConfirming
                    ? '1.确认中...'
                    : isApproved
                    ? `1.已授权`
                    : 'Step1. 授权'}
                </Button>
                <Button
                  className="w-1/2"
                  onClick={handleUnstake}
                  disabled={!isApproved || isPendingUnstake || isConfirmingUnstake || isConfirmedUnstake}
                >
                  {isPendingUnstake
                    ? '2.提交中'
                    : isConfirmingUnstake
                    ? '2.确认中'
                    : isConfirmedUnstake
                    ? '2.已取消质押'
                    : 'Step2. 取消质押'}
                </Button>
              </div>
              <div className="text-center mt-2 text-sm text-greyscale-600">
                取消质押后，投票轮第
                <span className="text-secondary mx-1">{`${
                  formatRoundForDisplay(currentRound, token) + (promisedWaitingRounds || BigInt(0)) + 1n
                } `}</span>
                轮才能取回代币
              </div>
            </>
          )}
          {requestedUnstakeRound && (
            <>
              <div className="flex w-full justify-center mt-2">
                <Button
                  className="w-1/2"
                  onClick={handleWithdraw}
                  disabled={!canWithdraw || isPendingWithdraw || isConfirmingWithdraw || isConfirmedWithdraw}
                >
                  {!canWithdraw
                    ? '第' + (currentRound + (promisedWaitingRounds || BigInt(0)) + 1n) + '轮后可取回'
                    : isPendingWithdraw
                    ? '提交中'
                    : isConfirmingWithdraw
                    ? '确认中'
                    : isConfirmedWithdraw
                    ? '已取回'
                    : '取回代币'}
                </Button>
              </div>
            </>
          )}
        </>
      )}
      {!enableWithdraw && (
        <div className="flex justify-center">
          <Button variant="outline" className="w-1/2 text-secondary border-secondary" asChild>
            <Link href={`/my/govrewards?symbol=${token.symbol}`}>查看奖励</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default MyGovernanceAssetsPanel;
