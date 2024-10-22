import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Header from '../../components/Header';
import { useCurrentRound } from '../../hooks/contracts/useLOVE20Verify';
import ActionDetail from '../../components/ActionDetail/ActionDetail';
import Loading from '../../components/Common/Loading';

import MyJoinInfoOfActionPancel from '../../components/My/MyJoinInfoOfActionPancel';
import VerifiedAddressesByAction from '../../components/Mint/VerifiedAddressesByAction';

const ActRewardsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const actId = id as string;

  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();

  const [isPickerOpen, setPickerOpen] = useState(false); // 控制选择器的显示状态
  const [selectedRound, setSelectedRound] = useState<number | null>(null); // 记录选择的轮次

  // 打开或关闭轮次选择器
  const togglePicker = () => setPickerOpen(!isPickerOpen);

  // 处理轮次选择
  const handleSelectRound = (round: number) => {
    setSelectedRound(round);
    setPickerOpen(false); // 选择完毕后关闭选择器
  };

  useEffect(() => {
    setSelectedRound(currentRound > 0 ? Number(currentRound) - 1 : null);
  }, [currentRound]);

  return (
    <>
      <Header title="行动详情" />
      <main className="flex-grow">
        <div className="flex flex-col items-center space-y-6 p-4 bg-base-100 border-t border-gray-100">
          <h1 className="text-base text-center">
            {isPendingCurrentRound ? (
              <Loading />
            ) : currentRound > 0 ? (
              <>
                已完成 (第
                <span className="text-red-500">{Number(selectedRound)}</span>轮)
                <button
                  onClick={togglePicker}
                  className="ml-4 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  切换轮次
                </button>
              </>
            ) : (
              '没有完成的轮次'
            )}
          </h1>
        </div>

        <MyJoinInfoOfActionPancel actionId={BigInt(actId || 0)} currentRound={currentRound} />

        <VerifiedAddressesByAction
          round={selectedRound !== null ? BigInt(selectedRound) : 0n}
          actionId={BigInt(actId || 0)}
        />

        {isPendingCurrentRound ? (
          <Loading />
        ) : (
          <ActionDetail
            actionId={BigInt(actId || 0)}
            round={selectedRound !== null ? BigInt(selectedRound) : 0n}
            showSubmitter={currentRound > 0}
          />
        )}

        {isPickerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-72">
              <h2 className="text-lg font-bold text-center mb-4">选择轮次</h2>
              <div className="max-h-64 overflow-y-auto">
                {Array.from({ length: Number(currentRound) }, (_, i) => {
                  const round = Number(currentRound) - 1 - i;
                  return (
                    <div
                      key={round}
                      className="p-2 text-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectRound(round)}
                    >
                      第 {round} 轮
                    </div>
                  );
                })}
              </div>
              <button
                onClick={togglePicker}
                className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md w-full hover:bg-gray-400"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ActRewardsPage;
