'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useBlockNumber } from 'wagmi';

// my context
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import LeftTime from '@/src/components/Common/LeftTime';

interface RoundProps {
  currentRound: bigint;
  roundType: string;
}

const Round: React.FC<RoundProps> = ({ currentRound, roundType }) => {
  const { data: blockNumber } = useBlockNumber();
  const { token } = useContext(TokenContext) || {};
  const [currentTokenRound, setCurrentTokenRound] = useState(0n);

  // 计算剩余时间
  const ROUND_BLOCKS = Number(process.env.NEXT_PUBLIC_ROUND_BLOCKS) || 0;
  const BLOCK_TIME = Number(process.env.NEXT_PUBLIC_BLOCK_TIME) || 0;
  // 使用默认值防止 undefined 导致 NaN
  const voteOriginBlocks = token?.voteOriginBlocks ? Number(token.voteOriginBlocks) : 0;
  const leftBlocks = blockNumber ? ROUND_BLOCKS - ((Number(blockNumber) - voteOriginBlocks) % ROUND_BLOCKS) : 0;
  const initialTimeLeft = leftBlocks > 0 ? leftBlocks * BLOCK_TIME : 0;

  // 计算当前轮次
  useEffect(() => {
    if (currentRound > 0n && token?.initialStakeRound) {
      setCurrentTokenRound(currentRound - BigInt(token?.initialStakeRound) + 1n);
    }
  }, [currentRound, token?.initialStakeRound]);

  // 计算轮次名称
  const roundName = roundType === 'vote' ? '投票轮' : '行动轮';

  // 如果 currentRound 为空，则设置默认值，否则转换为字符串
  const displayRound = currentRound != null ? currentRound.toString() : '0';

  return (
    <div className="flex justify-between items-center mb-2">
      <h1 className="text-lg font-bold">
        {roundName} 第 <span className="text-secondary">{displayRound}</span> 轮
      </h1>
      <span className="text-sm mt-1 pt-0">
        <span className="text-greyscale-400 mr-1">本轮剩余:</span>
        <span className="text-secondary mr-1">{leftBlocks}</span>
        <span className="text-greyscale-400 mr-1">块, 约</span>
        <LeftTime initialTimeLeft={initialTimeLeft} />
      </span>
    </div>
  );
};

export default Round;
