// src/pages/index.tsx

import type { NextPage } from 'next';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { TokenContext } from '@/src/contexts/TokenContext';
import Loading from '@/src/components/Common/Loading';

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
        router.push(`/${symbol}/acting`);
      } else {
        router.push(`/${symbol}/launch`);
      }
    }
  }, [token, router]);

  if (!token) {
    return <Loading />;
  }

  return <Loading />;
};

export default Home;
