import { useContext } from 'react';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useLaunches } from '@/src/hooks/contracts/useLOVE20Launch';

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
        <div className="px-6 pt-6 pb-1 bg-base-100 border-t border-gray-100">
          <TokenLabel showGovernanceLink={false} />
        </div>
        <LaunchStatus token={token} launchInfo={launchInfo} />
        {!launchInfo.hasEnded && <Contribute token={token} launchInfo={launchInfo} />}
        {launchInfo.hasEnded && <Claim token={token} launchInfo={launchInfo} />}
      </main>
    </>
  );
}
