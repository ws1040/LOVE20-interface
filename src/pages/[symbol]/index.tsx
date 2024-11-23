import type { NextPage } from 'next';
import { useContext } from 'react';

import { TokenContext } from '@/src/contexts/TokenContext';
import Loading from '@/src/components/Common/Loading';
import ActingPage from './acting';
import LaunchPage from './launch';

const Home: NextPage = () => {
  const { token } = useContext(TokenContext) || {};

  if (!token) {
    return <Loading />;
  }

  console.log('<<<<<<<<<<<<<<<<<<<<<<<token>>>>>>>>>>>>>>>>>>>>>>>');
  console.log(token);

  return token.hasEnded ? <ActingPage /> : <LaunchPage />;
};

export default Home;
