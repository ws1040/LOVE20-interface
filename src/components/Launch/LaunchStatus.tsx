import { formatTokenAmount, removeExtraZeros } from '@/src/lib/format';
import { useBlockNumber } from 'wagmi';

// my contexts
import { LaunchInfo } from '@/src/types/life20types';
import { TOKEN_CONFIG } from '@/src/config/tokenConfig';

// my contexts
import { Token } from '@/src/contexts/TokenContext';

// my components
import LoadingIcon from '@/src/components/Common/LoadingIcon';

const LaunchStatus: React.FC<{ token: Token | null; launchInfo: LaunchInfo }> = ({ token, launchInfo }) => {
  const { data: blockNumber } = useBlockNumber();
  const leftBlocks = blockNumber ? launchInfo.secondHalfMinBlocks - (blockNumber - launchInfo.secondHalfStartBlock) : 0;
  const ratio = Number(launchInfo.totalContributed) / Number(launchInfo.parentTokenFundraisingGoal);
  const ratioPercent = (ratio * 100).toFixed(1);

  if (!launchInfo) {
    return <div className="text-red-500">找不到发射信息</div>;
  }
  if (!token) {
    return <LoadingIcon />;
  }

  return (
    <div className="flex-col items-center px-4">
      <div className="grid place-items-center">
        <div className="stat-title text-base mr-6 text-secondary">
          {launchInfo.hasEnded ? '发射已结束' : '发射进行中'}
        </div>
      </div>
      <div className="stats w-full grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center pb-1">
          <div className="stat-title text-sm">
            <span>{token.parentTokenSymbol} </span>
            筹集目标
          </div>
          <div className="stat-value text-xl">{formatTokenAmount(launchInfo.parentTokenFundraisingGoal)}</div>
        </div>
        <div className="stat place-items-center pb-1">
          <div className="stat-title text-sm">
            <span>{token.symbol} </span>
            发射总量
          </div>
          <div className="stat-value text-xl">{`${formatTokenAmount(BigInt(TOKEN_CONFIG.fairLaunch))}`}</div>
        </div>
      </div>
      <div className="text-center text-xs mb-4 text-greyscale-500">
        兑换比例：1 {token.parentTokenSymbol} ={' '}
        {removeExtraZeros(
          (Number(TOKEN_CONFIG.fairLaunch) / Number(launchInfo.parentTokenFundraisingGoal)).toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }),
        )}{' '}
        {token.symbol}
      </div>
      <div className="stats w-full border">
        <div className="stat place-items-center">
          <div className="stat-title text-sm mr-6 ">累计申购</div>
          <div className="stat-value">
            <span className="text-3xl text-secondary">{formatTokenAmount(launchInfo.totalContributed)}</span>
            <span className="text-greyscale-500 font-normal text-sm ml-2">{token.parentTokenSymbol}</span>
          </div>
          <div className="mt-2 rounded-lg text-sm">
            <p className="mt-2 mb-1 font-medium">发射结束条件：</p>
            <p className="text-greyscale-600">
              1. 累计申购达到募资目标 100%{!launchInfo.hasEnded && `（当前 ${ratioPercent}%）`}
            </p>
            <p className="text-greyscale-600">
              2. 最后一笔申购，距离首笔达成 50%募资目标的所在区块
              {!launchInfo.hasEnded && ratio >= 0.5 && `（第 ${launchInfo.secondHalfStartBlock.toString()}区块）`}
              ，至少{launchInfo.secondHalfMinBlocks.toString()}个区块
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 text-greyscale-500 rounded-lg p-4 mt-4 text-sm">
        <p className="mt-1 font-medium">经济模型：</p>
        <p>1. 代币总量：{formatTokenAmount(BigInt(TOKEN_CONFIG.totalSupply))}</p>
        <p>2. 发射数量：{formatTokenAmount(BigInt(TOKEN_CONFIG.fairLaunch))} (10%)</p>
        <p>3. 治理激励：{formatTokenAmount(BigInt(TOKEN_CONFIG.govRewards))} (45%)</p>
        <p>4. 行动激励：{formatTokenAmount(BigInt(TOKEN_CONFIG.actionRewards))} (45%)</p>
        <p className="mt-3 font-medium">发射规则：</p>
        <p>1. 代币发放：按申购数量占比比例发放</p>
        <p>2. 超过募集目标的父币，将按申购比例返还</p>
      </div>
    </div>
  );
};

export default LaunchStatus;
