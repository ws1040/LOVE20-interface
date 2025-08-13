'use client';

import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import LoadingIcon from '@/src/components/Common/LoadingIcon';
import { NavigationUtils } from '@/src/lib/navigationUtils';
import { TokenContext } from '../contexts/TokenContext';

const Home: NextPage = () => {
  const router = useRouter();
  const { token } = useContext(TokenContext) || {};
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
    if (!symbol) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('currentToken');
          console.log('[success]clear local storage');
        }
      } catch (e) {
        console.error('清理本地缓存失败：', e);
      }
    }

    console.log('[token]', token);
    if (token) {
      if (symbol) {
        setHasRedirected(true);
        target = token?.hasEnded ? `/acting/?symbol=${symbol}` : `/launch/?symbol=${symbol}`;
      } else {
        target = token?.hasEnded ? `/acting/` : `/launch/`;
      }
      router.push(target).catch((err) => {
        console.log('路由跳转被取消或出错：', err);
      });
    }
  }, [router, hasRedirected, token]);

  return <LoadingIcon />;
};

export default Home;
