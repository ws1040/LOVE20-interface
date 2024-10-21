import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { useCurrentRound } from '../../hooks/contracts/useLOVE20Verify';

import Header from '../../components/Header';
import ActionDetail from '../../components/ActionDetail/ActionDetail';

const ActionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const idParam = id as string;
  const { currentRound } = useCurrentRound();

  return (
    <>
      <Header title="提交验证" />
      <main className="flex-grow">
        <ActionDetail actionId={BigInt(idParam || 0)} round={BigInt(currentRound || 0)} showSubmitter={true} />
      </main>
    </>
  );
};

export default ActionPage;
