import { formatTokenAmount } from '@/src/lib/format';
import { useBlockNumber } from 'wagmi';

// my contexts
import { LaunchInfo } from '@/src/types/life20types';
import { TOKEN_CONFIG } from '@/src/config/tokenConfig';

// my contexts
import { Token } from '@/src/contexts/TokenContext';

// my components
import LeftTime from '@/src/components/Common/LeftTime';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

const LaunchStatus: React.FC<{ token: Token | null; launchInfo: LaunchInfo }> = ({ token, launchInfo }) => {
  const { data: blockNumber } = useBlockNumber();
  const leftBlocks = blockNumber ? launchInfo.secondHalfMinBlocks - (blockNumber - launchInfo.secondHalfStartBlock) : 0;
  const timeLeft = leftBlocks > 0 ? Number(leftBlocks) * Number(process.env.NEXT_PUBLIC_BLOCK_TIME) : 0;
  const ratio = Number(launchInfo.totalContributed) / Number(launchInfo.parentTokenFundraisingGoal);
  const ratioPercent = (ratio * 100).toFixed(1);

  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeLeft % 3600) / 60);

  if (!launchInfo) {
    return <div className="text-red-500">找不到发射信息</div>;
  }
  if (!token) {
    return <LoadingIcon />;
  }

  return (
    <div className="flex-col items-center px-4">
      <div className="stats w-full grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center pb-2">
          <div className="stat-title text-sm">
            <span className="text-secondary">{token.symbol} </span>
            发射总量
          </div>
          <div className="stat-value text-xl">{`${formatTokenAmount(BigInt(TOKEN_CONFIG.fairLaunch))}`}</div>
        </div>
        <div className="stat place-items-center pb-2">
          <div className="stat-title text-sm">
            <span className="text-secondary">{token.parentTokenSymbol} </span>
            筹集目标
          </div>
          <div className="stat-value text-xl">{formatTokenAmount(launchInfo.parentTokenFundraisingGoal)}</div>
        </div>
      </div>
      <div className="text-center text-xs mb-4 text-greyscale-400">
        兑换比例：1 {token.parentTokenSymbol} ={' '}
        {(Number(TOKEN_CONFIG.fairLaunch) / Number(launchInfo.parentTokenFundraisingGoal)).toLocaleString('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}{' '}
        {token.symbol}
      </div>
      <div className="stats w-full border">
        <div className="stat place-items-center">
          <div className={`stat-title text-sm mr-6 ${launchInfo.hasEnded ? 'text-secondary' : ''}`}>
            {launchInfo.hasEnded ? '发射已结束' : '已筹集到'}
          </div>
          <div className={`stat-value`}>
            {launchInfo.hasEnded && <span className="text-greyscale-500 font-normal text-sm mr-2">共筹得</span>}
            <span className={`${!launchInfo.hasEnded ? 'text-secondary' : ''}`}>
              {formatTokenAmount(launchInfo.totalContributed)}
            </span>
            <span className="text-greyscale-500 font-normal text-sm ml-2">{token.parentTokenSymbol}</span>
          </div>
          <div className="stat-desc pt-2">
            {launchInfo.hasEnded && `超出筹集目标的 ${token.parentTokenSymbol} 在申领时退还`}
            {!launchInfo.hasEnded && ratio < 0.5 && `已筹集${ratioPercent}%，达到 50% 开始倒计时`}
            {!launchInfo.hasEnded && ratio >= 0.5 && leftBlocks <= 0 && `已筹集${ratioPercent}%`}
            {!launchInfo.hasEnded && ratio >= 0.5 && leftBlocks > 0 && (
              <>
                {ratio < 1 ? '发射结束至少要' : '距离发射结束'}：<LeftTime initialTimeLeft={timeLeft} />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-100 text-greyscale-500 rounded-lg p-4 mt-4 text-sm">
        <p className="mb-1 font-medium">经济模型：</p>
        <p>1. 代币总量：{formatTokenAmount(BigInt(TOKEN_CONFIG.totalSupply))}</p>
        <p>2. 发射数量：{formatTokenAmount(BigInt(TOKEN_CONFIG.fairLaunch))} (10%)</p>
        <p>3. 治理激励：{formatTokenAmount(BigInt(TOKEN_CONFIG.govRewards))} (45%)</p>
        <p>4. 行动激励：{formatTokenAmount(BigInt(TOKEN_CONFIG.actionRewards))} (45%)</p>
        <p className="mt-2 mb-1 font-medium">发射结束判定：</p>
        <p>
          1. 从首笔达成 50%最低募资数量开始，需等待 {launchInfo.secondHalfMinBlocks.toString()} 个区块
          {leftBlocks > 0 &&
            (days > 0 || hours > 0 || minutes > 0) &&
            ` (当前还剩余 ${leftBlocks > 0 ? leftBlocks.toString() : '0'} 个区块，约 ${days > 0 ? days + ' 天 ' : ''}${
              hours > 0 ? hours + ' 小时 ' : ''
            }${minutes > 0 ? minutes + ' 分钟' : ''}`}
        </p>
        <p>2. 累计申购达到100%</p>
        <p className="mt-2 mb-1 font-medium">发射规则：</p>
        <p>1. 代币发放：按申购数量占比比例发放</p>
        <p>2. 超过募集目标的父币，将按申购比例返还</p>
      </div>
    </div>
  );
};

export default LaunchStatus;
