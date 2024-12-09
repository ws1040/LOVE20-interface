import { useContext } from 'react';
import dynamic from 'next/dynamic';

import { TokenContext } from '@/src/contexts/TokenContext';
import { useLaunches } from '@/src/hooks/contracts/useLOVE20Launch';
import Burn from '@/src/components/Launch/Burn';
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

const Contribute = dynamic(() => import('@/src/components/Launch/Contribute'), { ssr: false });

export default function ContributePage() {
  const { token } = useContext(TokenContext) || {};
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
      <Header title="底池销毁" />
      <main className="flex-grow">
        <Burn token={token} launchInfo={launchInfo} />
      </main>
    </>
  );
}
