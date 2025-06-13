import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useBlockNumber } from 'wagmi';

import { Token } from '@/src/contexts/TokenContext';
import LeftTitle from '@/src/components/Common/LeftTitle';

// my hooks
import { useLaunchInfo } from '@/src/hooks/contracts/useLOVE20Launch';
import { useHandleContractError } from '@/src/lib/errorUtils';

const Todeploy: React.FC<{ token: Token }> = ({ token }) => {
  // 获取当前区块号
  const { data: blockNumber } = useBlockNumber();

  // 获取发射信息
  const {
    launchInfo,
    isPending: isLaunchInfoPending,
    error: launchInfoError,
  } = useLaunchInfo(token ? token.address : '0x0000000000000000000000000000000000000000');

  // 错误处理
  const { handleContractError } = useHandleContractError();
  React.useEffect(() => {
    if (launchInfoError) {
      handleContractError(launchInfoError, 'launch');
    }
  }, [launchInfoError]);

  // 计算时间相关的函数
  const formatTimeFromBlocks = (blocks: number): string => {
    const BLOCK_TIME = Number(process.env.NEXT_PUBLIC_BLOCK_TIME) || 0; // 单位：百分之一秒
    const totalSeconds = Math.ceil((blocks * BLOCK_TIME) / 100);

    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

    let result = '';
    if (days > 0) result += `${days}天`;
    if (hours > 0) result += `${hours}小时`;
    if (minutes > 0) result += `${minutes}分钟`;

    return result || '少于1分钟';
  };

  if (isLaunchInfoPending || !blockNumber) {
    return <></>;
  }

  // 获取等待区块数配置
  const CHILD_TOKEN_WAITING_BLOCKS = Number(process.env.NEXT_PUBLIC_CHILD_TOKEN_WAITING_BLOCKS) || 0;

  // 计算当前区块与发射开始区块的差值
  const currentBlock = Number(blockNumber);
  const startBlock = Number(launchInfo?.startBlock || 0);
  const blocksPassed = currentBlock - startBlock;

  // 检查是否还在等待期内
  const isWaitingPeriod = blocksPassed < CHILD_TOKEN_WAITING_BLOCKS;
  const remainingBlocks = CHILD_TOKEN_WAITING_BLOCKS - blocksPassed;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <LeftTitle title="部署子币" />
        <Button variant="link" className="text-secondary border-secondary" asChild>
          <Link href={`/tokens/children/?symbol=${token?.symbol}`}>子币列表</Link>
        </Button>
      </div>

      <div className="w-full text-center">
        {isWaitingPeriod ? (
          <div className="px-4 pt-4 text-center">
            <p className="text-greyscale-500">
              还剩 <span className="font-semibold">{remainingBlocks}</span> 区块开放子币部署
            </p>
            <p className="text-sm mt-1 text-greyscale-400">（约{formatTimeFromBlocks(remainingBlocks)}）</p>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="mt-2 w-1/2 text-secondary border-secondary" asChild>
            <Link href={`/launch/deploy?symbol=${token?.symbol}`}>
              <Plus className="w-4 h-4" />
              去部署
            </Link>
          </Button>
        )}
      </div>
      <div className="bg-gray-100 text-greyscale-500 rounded-lg p-4 text-sm mt-4">
        <p className="mb-1">说明：</p>
        <p>1. 部署者：须持有 {token?.symbol}不少于 0.5%的治理票</p>
        <p>2. 子币发射目标：须筹集 20,000,000个 {token?.symbol}</p>
      </div>
    </div>
  );
};

export default Todeploy;
