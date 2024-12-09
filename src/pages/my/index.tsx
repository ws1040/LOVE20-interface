import { useContext } from 'react';

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
        <div className="flex-col items-center px-6 pt-6 pb-2">
          <LeftTitle title="参与治理的资产" />
          <MyGovernanceAssetsPanel token={token} />
        </div>
        <MyStakedActionList token={token} />
      </main>
    </>
  );
};

export default MyPage;
