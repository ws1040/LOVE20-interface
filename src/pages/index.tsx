import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import ActingPage from './acting';

const Home: NextPage = () => {
  return (
    // <div className={styles.container}>
    //   <Head>
    //     <title>Life20 DApp</title>
    //     <link href="/favicon.ico" rel="icon" />
    //   </Head>

    //   <main className={styles.main}>
    //     <ConnectButton />
    //   </main>

      <ActingPage />

    //   <footer className={styles.footer}>
        
    //   </footer>
    // </div>
  );
};

export default Home;
