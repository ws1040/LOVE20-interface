'use client';

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import LoadingIcon from '@/src/components/Common/LoadingIcon';
import { NavigationUtils } from '@/src/lib/navigationUtils';

const Home: NextPage = () => {
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (hasRedirected) {
      return;
    }

    // 尝试处理钱包环境中的重定向问题
    const handled = NavigationUtils.handleIndexRedirect(router);
    if (handled) {
      setHasRedirected(true);
      return;
    }

    let target = '';
    const symbol = router.query.symbol as string;
    if (symbol) {
      setHasRedirected(true);
      target = `/token/?symbol=${symbol}`;
    } else {
      target = `/token/`;
    }
    router.push(target).catch((err) => {
      console.log('路由跳转被取消或出错：', err);
    });
  }, [router, hasRedirected]);

  return <LoadingIcon />;
};

export default Home;
