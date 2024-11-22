import type { NextPage } from 'next';
import { useContext } from 'react';

import { TokenContext } from '@/src/contexts/TokenContext';
import Loading from '@/src/components/Common/Loading';
import ActingPage from '@/src/pages/acting';
import LaunchPage from '@/src/pages/launch';

const Home: NextPage = () => {
  const { token } = useContext(TokenContext) || {};

  if (!token) {
    return <Loading />;
  }

  return token.hasEnded ? <ActingPage /> : <LaunchPage />;
};

export default Home;
