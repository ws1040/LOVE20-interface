import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { TokenContext } from '@/src/contexts/TokenContext';
import { useLaunches } from '@/src/hooks/contracts/useLOVE20Launch';
import { formatTokenAmount } from '@/src/lib/format';

import Header from '@/src/components/Header';
import Loading from '@/src/components/Common/Loading';
import TokenLabel from '@/src/components/Token/TokenLabel';
import LaunchStatus from '@/src/components/Launch/LaunchStatus';
import Contribute from '@/src/components/Launch/Contribute';
import Claim from '@/src/components/Launch/Claim';

export default function TokenFairLaunch() {
  const tokenContext = useContext(TokenContext);
  const { token } = tokenContext || { token: null };
  const {
    launchInfo,
    isPending: isLaunchInfoPending,
    error: launchInfoError,
  } = useLaunches(token ? token.address : '0x0');

  if (isLaunchInfoPending) {
    return <Loading />;
  }
  if (launchInfoError) {
    return <div className="text-red-500">加载发射信息失败</div>;
  }
  if (!launchInfo) {
    return <div className="text-red-500">找不到发射信息</div>;
  }

  return (
    <>
      <Header title="Launch" />
      <main className="flex-grow">
        <div className="px-6 pt-6 pb-1  bg-white">
          <TokenLabel showGovernanceLink={false} />
        </div>
        <LaunchStatus token={token} launchInfo={launchInfo} />
        {!launchInfo.hasEnded && token && <Contribute token={token} launchInfo={launchInfo} />}
        {launchInfo.hasEnded && token && <Claim token={token} launchInfo={launchInfo} />}

        {launchInfo?.hasEnded && (
          <div className="bg-white p-6 mt-4 shadow-sm">
            <h3 className="text-base font-medium mb-2">部署子币</h3>
            <div className="w-full text-center">
              <Link href={`/${token?.symbol}/launch/deploy`}>
                <Button size="sm" className="w-1/2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  去部署
                </Button>
              </Link>
            </div>
            <div className="bg-gray-100 text-gray-500 rounded-lg p-4 text-sm mt-4">
              <p className="mb-1">说明：</p>
              <p>1. 部署者：须持有${token?.symbol}不少于 0.5%的治理票</p>
              <p>2. 子币发射目标：须筹集 20,000,000个 {token?.symbol}</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
