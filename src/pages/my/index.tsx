import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import Link from 'next/link';

import { TokenContext } from '@/src/contexts/TokenContext';
import Header from '@/src/components/Header';
import LeftTitle from '@/src/components/Common/LeftTitle';
import MyTokenPanel from '@/src/components/My/MyTokenPanel';
import MyGovernanceAssetsPanel from '@/src/components/My/MyGovernanceAssetsPanel';
import MyStakedActionList from '@/src/components/ActionList/MyStakedActionList';

const MyPage = () => {
  const { token } = useContext(TokenContext) || {};

  return (
    <>
      <Header title="我的" />
      <main className="flex-grow">
        <MyTokenPanel token={token} />
        <div className="flex-col items-center px-6 pt-2 pb-2">
          <div className="flex justify-between items-center">
            <LeftTitle title="治理资产" />
            <Button variant="link" className="text-secondary border-secondary" asChild>
              <Link href={`/gov/unstake?symbol=${token?.symbol}`}>取消质押</Link>
            </Button>
          </div>
          <MyGovernanceAssetsPanel token={token} />
        </div>
        <MyStakedActionList token={token} />
      </main>
    </>
  );
};

export default MyPage;
