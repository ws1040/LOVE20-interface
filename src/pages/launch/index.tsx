import { useContext } from 'react';

import { TokenContext } from '@/src/contexts/TokenContext';
import { useLaunches } from '@/src/hooks/contracts/useLOVE20Launch';

import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import LaunchStatus from '@/src/components/Launch/LaunchStatus';
import ContributeInfo from '@/src/components/Launch/ContributeInfo';
import Claim from '@/src/components/Launch/Claim';
import TokenTab from '@/src/components/Token/TokenTab';
import Todeploy from '@/src/components/Launch/Todeploy';

export default function TokenFairLaunch() {
  const tokenContext = useContext(TokenContext);
  const { token } = tokenContext || { token: null };
  const {
    launchInfo,
    isPending: isLaunchInfoPending,
    error: launchInfoError,
  } = useLaunches(token ? token.address : '0x0');

  if (isLaunchInfoPending) {
    return <LoadingIcon />;
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
        <TokenTab />
        <LaunchStatus token={token} launchInfo={launchInfo} />
        {!launchInfo.hasEnded && token && <ContributeInfo token={token} launchInfo={launchInfo} />}
        {launchInfo.hasEnded && token && <Claim token={token} launchInfo={launchInfo} />}
        {launchInfo.hasEnded && token && <Todeploy token={token} launchInfo={launchInfo} />}
      </main>
    </>
  );
}
