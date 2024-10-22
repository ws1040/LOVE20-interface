import Header from '../../components/Header';

import MyTokenPanel from '../../components/My/MyTokenPanel';
import MyActAssetsPanel from '../../components/My/MyActAssetsPanel';
import MyGovernanceAssetsPanel from '../../components/My/MyGovernanceAssetsPanel';
import MyStakedActionList from '../../components/ActionList/MyStakedActionList';
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
