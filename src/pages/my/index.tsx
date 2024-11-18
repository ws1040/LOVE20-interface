import Header from '@/src/components/Header';

import MyTokenPanel from '@/src/components/My/MyTokenPanel';
import MyActAssetsPanel from '@/src/components/My/MyActAssetsPanel';
import MyGovernanceAssetsPanel from '@/src/components/My/MyGovernanceAssetsPanel';
import MyStakedActionList from '@/src/components/ActionList/MyStakedActionList';
const MyPage = () => {
  return (
    <>
      <Header title="我的" />
      <main className="flex-grow">
        <MyTokenPanel />
        <MyGovernanceAssetsPanel />
        <MyActAssetsPanel />
        <MyStakedActionList />
      </main>
    </>
  );
};

export default MyPage;
