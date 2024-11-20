import React from 'react';
import { useBlockNumber } from 'wagmi';
import { formatSeconds } from '@/src/lib/format';

interface RoundProps {
  currentRound: bigint;
  roundName: string;
}

const Round: React.FC<RoundProps> = ({ currentRound, roundName }) => {
  const { data: blockNumber } = useBlockNumber();

  const leftBlocks = blockNumber
    ? Number(process.env.NEXT_PUBLIC_ROUND_BLOCKS) -
      (Number(blockNumber) % Number(process.env.NEXT_PUBLIC_ROUND_BLOCKS))
    : 0;
  const timeLeft = leftBlocks > 0 ? Number(leftBlocks) * Number(process.env.NEXT_PUBLIC_BLOCK_TIME) : 0;
  const timeLeftText = formatSeconds(timeLeft);

  return (
    <>
      <h1 className="text-base text-center font-bold">
        {roundName}（第 <span className="text-red-500">{Number(currentRound ?? 0n)}</span> 轮）
      </h1>
      <span className="text-sm text-gray-400 mt-1 pt-0">本轮剩余：{timeLeftText}</span>
    </>
  );
};

export default Round;
