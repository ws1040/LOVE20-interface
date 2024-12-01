import { useRouter } from 'next/router';

import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Join';
import ActionDetail from '@/src/components/ActionDetail/ActionDetail';
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import MyJoinInfoOfActionPancel from '@/src/components/My/MyJoinInfoOfActionPancel';
import VerifiedAddressesByAction from '@/src/components/Mint/VerifiedAddressesByAction';

const ActRewardsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const actId = id as string;

  const {
    currentRound: currentJoinRound,
    isPending: isPendingCurrentJoinRound,
    error: errCurrentJoinRound,
  } = useCurrentRound();

  if (errCurrentJoinRound) {
    console.error(errCurrentJoinRound);
    return <div>错误: {errCurrentJoinRound.message}</div>;
  }

  if (isPendingCurrentJoinRound) {
    return <LoadingIcon />;
  }

  return (
    <>
      <Header title="行动详情" />
      <main className="flex-grow">
        <MyJoinInfoOfActionPancel actionId={BigInt(actId || 0)} currentJoinRound={currentJoinRound} />
        <VerifiedAddressesByAction currentJoinRound={currentJoinRound} actionId={BigInt(actId || 0)} />
        <ActionDetail actionId={BigInt(actId || 0)} round={currentJoinRound} showSubmitter={false} />
      </main>
    </>
  );
};

export default ActRewardsPage;
