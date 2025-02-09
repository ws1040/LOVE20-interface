'use client';

import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { TokenContext } from '@/src/contexts/TokenContext';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

const Home: NextPage = () => {
  const { token } = useContext(TokenContext) || {};
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!token || hasRedirected) {
      return;
    }

    const symbol = token.symbol;
    if (symbol) {
      setHasRedirected(true);
      const target = token.hasEnded ? `/acting/?symbol=${symbol}` : `/launch/?symbol=${symbol}`;
      router.push(target).catch((err) => {
        console.log('路由跳转被取消或出错：', err);
      });
    }
  }, [token, router, hasRedirected]);

  return <LoadingIcon />;
};

export default Home;
