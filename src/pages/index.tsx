'use client';

import type { NextPage } from 'next';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { TokenContext } from '@/src/contexts/TokenContext';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

const Home: NextPage = () => {
  const { token } = useContext(TokenContext) || {};
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      return;
    }

    const symbol = token.symbol;
    if (symbol) {
      if (token.hasEnded) {
        router.push(`/acting/?symbol=${symbol}`);
      } else {
        router.push(`/launch/?symbol=${symbol}`);
      }
    }
  }, [token, router]);

  return <LoadingIcon />;
};

export default Home;
