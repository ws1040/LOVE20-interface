import React, { useContext } from 'react';
import { useBlockNumber } from 'wagmi';

import { TokenContext } from '@/src/contexts/TokenContext';
import LeftTime from '@/src/components/Common/LeftTime';

interface RoundProps {
  currentRound: bigint;
  roundName: string;
}

const Round: React.FC<RoundProps> = ({ currentRound, roundName }) => {
  const { data: blockNumber } = useBlockNumber();
  const { token } = useContext(TokenContext) || {};

  const ROUND_BLOCKS = Number(process.env.NEXT_PUBLIC_ROUND_BLOCKS) || 0;
  const BLOCK_TIME = Number(process.env.NEXT_PUBLIC_BLOCK_TIME) || 0;

  const leftBlocks = blockNumber
    ? ROUND_BLOCKS - ((Number(blockNumber) - Number(token?.voteOriginBlocks)) % ROUND_BLOCKS)
    : 0;
  const initialTimeLeft = leftBlocks > 0 ? leftBlocks * BLOCK_TIME : 0;

  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-lg font-bold">
        {roundName} 第 <span className="text-secondary">{Number(currentRound ?? 0n)}</span> 轮
      </h1>
      <span className="text-sm text-greyscale-400 mt-1 pt-0">
        本轮剩余：
        <LeftTime initialTimeLeft={initialTimeLeft} />
      </span>
    </div>
  );
};

export default Round;
