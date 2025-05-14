'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useBlockNumber } from 'wagmi';

// my context
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import LeftTime from '@/src/components/Common/LeftTime';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

interface RoundProps {
  currentRound: bigint;
  roundType: string;
}

const Round: React.FC<RoundProps> = ({ currentRound, roundType }) => {
  const { data: blockNumber } = useBlockNumber();
  const context = useContext(TokenContext);
  const token = context ? context.token : undefined;

  // 计算加载状态。注意：此处仅用于渲染判断，不影响 Hook 的调用顺序
  const isLoading = !blockNumber || !token || token.voteOriginBlocks === undefined || !token.initialStakeRound;

  const [currentTokenRound, setCurrentTokenRound] = useState(0n);

  // 计算剩余时间相关变量
  const ROUND_BLOCKS = Number(process.env.NEXT_PUBLIC_PHASE_BLOCKS) || 0;
  const BLOCK_TIME = Number(process.env.NEXT_PUBLIC_BLOCK_TIME) || 0;
  // 使用默认值防止 undefined 导致 NaN
  const voteOriginBlocks = token ? Number(token.voteOriginBlocks) : 0;
  // 根据当前区块数计算初始剩余区块数及剩余时间（秒）
  const leftBlocksStatic = ROUND_BLOCKS - ((Number(blockNumber) - voteOriginBlocks) % ROUND_BLOCKS);
  const initialTimeLeft = leftBlocksStatic > 0 ? Math.ceil((leftBlocksStatic * BLOCK_TIME) / 100) : 0;

  // State: 保存倒计时剩余秒数，由 LeftTime 组件的 onTick 回调更新
  const [currentTimeLeft, setCurrentTimeLeft] = useState(initialTimeLeft);

  // 当 blockNumber 改变时重新同步剩余时间
  useEffect(() => {
    if (!blockNumber) return;
    const updatedLeftBlocks = ROUND_BLOCKS - ((Number(blockNumber) - voteOriginBlocks) % ROUND_BLOCKS);
    const updatedTimeLeft = updatedLeftBlocks > 0 ? Math.ceil((updatedLeftBlocks * BLOCK_TIME) / 100) : 0;
    setCurrentTimeLeft(updatedTimeLeft);
  }, [blockNumber, ROUND_BLOCKS, BLOCK_TIME, voteOriginBlocks]);

  // 计算当前轮次
  useEffect(() => {
    if (token && currentRound > 0n) {
      setCurrentTokenRound(currentRound - BigInt(token.initialStakeRound) + 1n);
    }
  }, [currentRound, token]);

  // 计算轮次名称
  const roundName = roundType === 'vote' ? '投票' : '行动';

  // 如果 currentRound 为空，则设置默认值，否则转换为字符串
  const displayRound = currentTokenRound != null ? currentTokenRound.toString() : '0';

  // 当尚未加载相关数据时，返回加载中状态
  if (isLoading) {
    return <LoadingIcon />;
  }

  return (
    <div className="flex justify-between items-center mb-2">
      <h1 className="text-lg font-bold">
        第 <span className="text-secondary">{displayRound}</span> 轮{roundName}阶段
      </h1>
      <span className="text-sm mt-1 pt-0">
        <span className="text-greyscale-400 mr-1">剩余:</span>
        <span className="text-secondary mr-1">{Math.ceil((currentTimeLeft * 100) / BLOCK_TIME)}</span>
        <span className="text-greyscale-400 mr-1">块, 约</span>
        <LeftTime initialTimeLeft={initialTimeLeft} onTick={setCurrentTimeLeft} />
      </span>
    </div>
  );
};

export default Round;
