import { useState, useContext } from 'react';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useActionVoters } from '@/src/hooks/contracts/useLOVE20RoundViewer';

// my components
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import ChangeRound from '@/src/components/Common/ChangeRound';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

// my utils
import { formatTokenAmount, formatRoundForDisplay } from '@/src/lib/format';

interface VotingDetailsProps {
  actionId: bigint;
  currentRound: bigint | undefined;
}

export default function VotingDetails({ actionId, currentRound }: VotingDetailsProps) {
  const { token } = useContext(TokenContext) || {};
  const [selectedRound, setSelectedRound] = useState<bigint>(currentRound || 1n);

  const { actionVoters, isPending, error } = useActionVoters(
    token?.address || '0x0000000000000000000000000000000000000000',
    selectedRound,
    actionId,
  );

  const handleChangedRound = (round: number) => {
    setSelectedRound(BigInt(round));
  };

  if (!token) {
    return <div>Token信息加载中...</div>;
  }

  // 计算投票总数
  const totalVotes = actionVoters?.reduce((sum, voter) => sum + voter.voteCount, 0n) || 0n;

  // 按投票数量降序排列
  const sortedVoters = actionVoters
    ? [...actionVoters].sort((a, b) => {
        if (a.voteCount > b.voteCount) return -1;
        if (a.voteCount < b.voteCount) return 1;
        return 0;
      })
    : [];

  // 计算投票占比
  const calculatePercentage = (voteCount: bigint) => {
    if (totalVotes === 0n) return '0.00';
    return ((Number(voteCount) / Number(totalVotes)) * 100).toFixed(2);
  };

  return (
    <div className="relative pb-4">
      {selectedRound === 0n && (
        <div className="flex items-center justify-center">
          <div className="text-center text-sm text-greyscale-500">暂无投票数据</div>
        </div>
      )}
      <div className="flex items-center">
        {selectedRound > 0 && (
          <>
            <LeftTitle title={`第 ${selectedRound.toString()} 轮投票详情`} />
            <span className="text-sm text-greyscale-500 ml-2">(</span>
            <ChangeRound
              currentRound={currentRound ? formatRoundForDisplay(currentRound, token) : 0n}
              handleChangedRound={handleChangedRound}
            />
            <span className="text-sm text-greyscale-500">)</span>
          </>
        )}
      </div>

      {selectedRound > 0 && actionVoters && (
        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
          <div className="">
            <span className="text-gray-500 mr-3">投票地址数:</span>
            <span className="font-mono text-secondary">{actionVoters.length}</span>
          </div>
          <div className="">
            <span className="text-gray-500 mr-3">总投票数:</span>
            <span className="font-mono text-secondary">{formatTokenAmount(totalVotes)}</span>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {isPending && (
        <div className="flex justify-center py-8">
          <LoadingIcon />
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="alert alert-error">
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>加载投票数据失败: {error.message}</span>
        </div>
      )}

      {/* 投票详情列表 */}
      {!isPending &&
        !error &&
        actionVoters &&
        selectedRound > 0 &&
        (sortedVoters.length === 0 ? (
          <div className="text-center text-sm text-greyscale-400 p-4">该轮次暂无投票记录</div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-1 text-left">排名</th>
                <th className="px-1 text-left">投票地址</th>
                <th className="px-1 text-right">投票数</th>
                <th className="px-1 text-right">占比</th>
              </tr>
            </thead>
            <tbody>
              {sortedVoters.map((voter, index) => (
                <tr key={voter.account} className="border-b border-gray-100">
                  <td className="px-1 text-greyscale-400">{index + 1}</td>
                  <td className="px-1">
                    <AddressWithCopyButton address={voter.account} showCopyButton={true} />
                  </td>
                  <td className="px-1 text-right font-mono text-secondary">{formatTokenAmount(voter.voteCount)}</td>
                  <td className="px-1 text-right text-greyscale-500">{calculatePercentage(voter.voteCount)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
    </div>
  );
}
