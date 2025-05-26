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
        <div className="flex flex-col w-full p-4">
          <div className="bg-gray-100 text-greyscale-500 rounded-lg p-4 mb-8 text-sm">
            <div className="text-base font-bold text-greyscale-700 pb-2">治理票</div>
            <div className="text-sm text-greyscale-500">1、质押后，代币对将自动注入 Uniswap V2 流动性池</div>
            <div className="text-sm text-greyscale-500">2、所得治理票数 = SL数量 * 解锁期阶段数</div>
            <div className="text-base font-bold text-greyscale-700 pt-2 pb-1">治理激励</div>
            <div className="text-sm text-greyscale-500 pb-1">1、当轮所得治理激励 = 验证激励 + 加速激励</div>
            <div className="text-sm text-greyscale-500 pb-1">
              2、单个地址的验证激励：当轮治理总激励 * 50% * 该地址行使验证权的治理票数 / 行使验权的治理票总数
            </div>
            <div className="text-sm text-greyscale-500 pb-1">
              3、单个地址的加速激励：当轮治理总激励 * 50% * 该地址质押代币数量 / 质押代币总数量
            </div>
            <div className="text-sm text-greyscale-500">
              4、溢出：单个地址的加速激励 超过投票激励 2 倍以上的部分，为溢出激励，自动销毁，归入未来总激励
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default StakePage;
