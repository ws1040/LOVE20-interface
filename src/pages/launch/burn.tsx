'use client';

import { useContext, useEffect } from 'react';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useLaunches } from '@/src/hooks/contracts/useLOVE20Launch';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import Burn from '@/src/components/Launch/Burn';
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

export default function BurnPage() {
  const { token } = useContext(TokenContext) || {};
  const {
    launchInfo,
    isPending: isLaunchInfoPending,
    error: launchInfoError,
  } = useLaunches(token ? token.address : '0x0');

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (launchInfoError) {
      handleContractError(launchInfoError, 'launch');
    }
  }, [launchInfoError]);


  return (
    <>
      <Header title="底池销毁" />
      <main className="flex-grow">
        {isLaunchInfoPending ? (
          <LoadingIcon />
        ) : !launchInfo ? (
          <div className="text-red-500">找不到发射信息</div>
        ) : (
          <Burn token={token} launchInfo={launchInfo} />
        )}
      </main>
    </>
  );
}
}
