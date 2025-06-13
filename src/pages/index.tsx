'use client';

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import LoadingIcon from '@/src/components/Common/LoadingIcon';

const Home: NextPage = () => {
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (hasRedirected) {
      return;
    }

    let target = '';
    const symbol = router.query.symbol as string;
    if (symbol) {
      setHasRedirected(true);
      target = `/acting/?symbol=${symbol}`;
    } else {
      target = `/acting/`;
    }
    router.push(target).catch((err) => {
      console.log('路由跳转被取消或出错：', err);
    });
  }, [router, hasRedirected]);

  return <LoadingIcon />;
};

export default Home;
