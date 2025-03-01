import { Button } from '@/components/ui/button';
import { useAccount, useBlockNumber } from 'wagmi';
import { useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// my hooks
import { useContributed, useLastContributedBlock } from '@/src/hooks/contracts/useLOVE20Launch';
import { useWithdraw } from '@/src/hooks/contracts/useLOVE20Launch';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my types & funcs
import { formatTokenAmount } from '@/src/lib/format';
import { LaunchInfo } from '@/src/types/life20types';

// my contexts
import { Token } from '@/src/contexts/TokenContext';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

const ContributeInfo: React.FC<{ token: Token | null; launchInfo: LaunchInfo }> = ({ token, launchInfo }) => {
  const { address: account } = useAccount();
  const { data: blockNumber } = useBlockNumber();

  const {
    contributed,
    isPending: isContributedPending,
    error: contributedError,
    refetch: refetchContributed,
  } = useContributed(token?.address as `0x${string}`, account as `0x${string}`);

  // 获取最后一次申购的区块
  const {
    lastContributedBlock,
    isPending: isLastContributedBlockPending,
    error: lastContributedBlockError,
  } = useLastContributedBlock(token?.address as `0x${string}`, account as `0x${string}`);

  // 计算还剩余几个区块可以撤回
  const WITHDRAW_WAITING_BLOCKS = BigInt(process.env.NEXT_PUBLIC_WITHDRAW_WAITING_BLOCKS || '0');
  const lastContributedBlockNumber = lastContributedBlock ? lastContributedBlock : 0n;
  const currentBlockNumber = blockNumber ? BigInt(blockNumber) : 0n;
  const remainingBlocks = WITHDRAW_WAITING_BLOCKS - (currentBlockNumber - lastContributedBlockNumber);

  // 申购撤回
  const {
    withdraw,
    isPending: isWithdrawPending,
    writeError: errWithdraw,
    isConfirming: isWithdrawConfirming,
    isConfirmed: isWithdrawConfirmed,
  } = useWithdraw();
  const handleWithdraw = async () => {
    if (remainingBlocks > 0n) {
      toast.error(`还需要等待 ${remainingBlocks} 个区块才能撤回`);
      return;
    }
    await withdraw(token?.address as `0x${string}`);
  };

  // 赎回成功
  useEffect(() => {
    if (isWithdrawConfirmed) {
      toast.success('撤回成功');
      // 刷新 contributed 数据
      refetchContributed();
    }
  }, [isWithdrawConfirmed]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (contributedError) {
      handleContractError(contributedError, 'launch');
    }
    if (lastContributedBlockError) {
      handleContractError(lastContributedBlockError, 'launch');
    }
    if (errWithdraw) {
      handleContractError(errWithdraw, 'launch');
    }
  }, [contributedError, lastContributedBlockError, errWithdraw]);

  if (!token || isContributedPending || isLastContributedBlockPending) {
    return <LoadingIcon />;
  }

  return (
    <div className="p-6">
      <LeftTitle title="参与申购" />
      <div className="stats w-full">
        <div className="stat place-items-center">
          <div className="stat-title text-sm mr-6">我的申购质押</div>
          <div className="stat-value text-secondary">
            {formatTokenAmount(contributed || 0n)}
            <span className="text-greyscale-500 font-normal text-sm ml-2">{token.parentTokenSymbol}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {contributed && contributed > 0n && (
          <Button
            variant="outline"
            size="sm"
            className="w-1/2 text-secondary border-secondary"
            onClick={handleWithdraw}
            disabled={isWithdrawPending || isWithdrawConfirming || isWithdrawConfirmed}
          >
            {isWithdrawPending
              ? '提交中...'
              : isWithdrawConfirming
              ? '确认中...'
              : isWithdrawConfirmed
              ? '已撤回'
              : '撤回申购'}
          </Button>
        )}
        <Button variant="outline" size="sm" className="w-1/2 text-secondary border-secondary" asChild>
          <Link href={`/launch/contribute?symbol=${token.symbol}`}>
            {contributed && contributed > 0n ? '增加申购' : '去申购'}
          </Link>
        </Button>
      </div>
      {contributed && contributed > 0n && (
        <div className="mt-4 text-sm text-greyscale-500 text-center">
          申购后需等 {process.env.NEXT_PUBLIC_WITHDRAW_WAITING_BLOCKS} 个区块才能撤回（当前还需等{' '}
          {remainingBlocks > 0 ? remainingBlocks.toString() : '0'} 个区块）
        </div>
      )}
      <LoadingOverlay
        isLoading={isWithdrawPending || isWithdrawConfirming}
        text={isWithdrawPending ? '提交交易...' : '确认交易...'}
      />
    </div>
  );
};

export default ContributeInfo;
