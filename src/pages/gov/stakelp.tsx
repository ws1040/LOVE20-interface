'use client';

// my components
import Header from '@/src/components/Header';
import SlTokenTab from '@/src/components/Token/SlTokenTab';
import StakeLiquidityPanel from '@/src/components/Stake/StakeLiquidityPanel';

const StakePage = () => {
  return (
    <>
      <Header title="质押LP" />
      <main className="flex-grow">
        <SlTokenTab />
        <StakeLiquidityPanel />
        <div className="flex flex-col w-full p-4 mt-4">
          <div className="text-base font-bold text-greyscale-700 pb-2">规则说明：</div>
          <div className="text-sm text-greyscale-500">1、所得治理票数 = LP 数量 * 释放期轮次</div>
          <div className="text-sm text-greyscale-500">
            2、释放期指：申请解锁后，几轮之后可以领取。最小为4轮，最大为12轮。
          </div>
        </div>
      </main>
    </>
  );
};

export default StakePage;
