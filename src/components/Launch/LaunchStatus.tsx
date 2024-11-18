import { formatTokenAmount } from '@/src/lib/format';
import { Token } from '@/src/contexts/TokenContext';
import { LaunchInfo } from '@/src/types/life20types';
import { TOKEN_CONFIG } from '@/src/config/tokenConfig';

const LaunchStatus: React.FC<{ token: Token | null; launchInfo: LaunchInfo }> = ({ token, launchInfo }) => {
  if (!launchInfo) {
    return <div className="text-red-500">找不到发射信息</div>;
  }

  return (
    <div className="bg-white px-6 pb-6 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          {launchInfo?.hasEnded ? (
            <h2 className="text-xl font-medium text-red-600">发射已结束</h2>
          ) : (
            <h2 className="text-xl font-medium text-blue-400">公平发射中</h2>
          )}
        </div>
        {/* <p className="text-sm text-gray-600">剩余时间: {formatTimeLeft(launchInfo?.timeLeft)}</p> */}
      </div>
      <div className="space-y-6">
        <div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{
                width: `${
                  Number(launchInfo.totalContributed) < Number(launchInfo.parentTokenFundraisingGoal)
                    ? (Number(launchInfo.totalContributed) / Number(launchInfo.parentTokenFundraisingGoal)) * 100
                    : 100
                }%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            已筹 {formatTokenAmount(launchInfo.totalContributed)} {token?.parentTokenSymbol} /{' '}
            {formatTokenAmount(launchInfo.parentTokenFundraisingGoal)} {token?.parentTokenSymbol}(
            {((Number(launchInfo.totalContributed) / Number(launchInfo.parentTokenFundraisingGoal)) * 100).toFixed(2)}%)
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <p>
            <span className="text-gray-500 mr-2">共发射</span>
            <span className="text-orange-500 text-2xl font-bold">
              {`${formatTokenAmount(BigInt(TOKEN_CONFIG.fairLaunch))}`}
            </span>
            <span className="text-gray-500 ml-2">{token?.symbol}</span>
          </p>
        </div>

        <div className="bg-gray-100 text-gray-500 rounded-lg p-4 text-sm">
          <p className="mb-1">经济模型：</p>
          <p>1、代币总量：{formatTokenAmount(BigInt(TOKEN_CONFIG.totalSupply))}</p>
          <p>2、发射数量：{formatTokenAmount(BigInt(TOKEN_CONFIG.fairLaunch))} (10%)</p>
          <p>3、治理激励：{formatTokenAmount(BigInt(TOKEN_CONFIG.govRewards))} (45%)</p>
          <p className="mb-4">4、行动激励：{formatTokenAmount(BigInt(TOKEN_CONFIG.actionRewards))} (45%)</p>
          <p className="mb-1">发射规则：</p>
          <p>1、代币发放：按申购数量占比比例发放；</p>
          <p>2、超过募集目标的父币，将按申购比例返还；</p>
        </div>
      </div>
    </div>
  );
};

export default LaunchStatus;
