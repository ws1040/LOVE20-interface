import type { NextPage } from 'next';
import { useContext } from 'react';

import { TokenContext } from '@/src/contexts/TokenContext';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import ActingPage from './acting';
import LaunchPage from './launch';

const Home: NextPage = () => {
  const { token } = useContext(TokenContext) || {};

  if (!token) {
    return <LoadingIcon />;
  }

  return token.hasEnded ? <ActingPage /> : <LaunchPage />;
};

export default Home;
