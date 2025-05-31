'use client';

// my components
import Header from '@/src/components/Header';
import SlTokenTab from '@/src/components/Token/SlTokenTab';
import StakeLiquidityPanel from '@/src/components/Stake/StakeLiquidityPanel';
import { HelpCircle } from 'lucide-react';

const StakePage = () => {
  return (
    <>
      <Header title="质押LP" />
      <main className="flex-grow">
        {/* <SlTokenTab /> */}
        <StakeLiquidityPanel />
        <div className="flex flex-col w-full p-4">
          <div className="bg-blue-50/30 border-l-4 border-l-blue-50 rounded-r-lg p-4 mb-8 text-sm">
            <div className="flex items-center gap-2 text-base font-bold text-blue-800 pb-2">
              <HelpCircle className="w-4 h-4" />
              帮助信息
            </div>
            <div className="text-base font-bold text-blue-700 pt-2 pb-1">SL代币：</div>
            <div className="text-sm text-blue-700">
              代币对儿由质押合约注入 Uniswap V2 流动性池，并铸造SL代币作为流动性质押凭证
            </div>

            <div className="text-base font-bold text-blue-700 pt-2 pb-1">治理票：</div>
            <div className="text-sm text-blue-700">所得治理票数 = SL代币数量 * 解锁期阶段数</div>
            <div className="text-base font-bold text-blue-700 pt-2 pb-1">治理激励：</div>
            <div className="text-sm text-blue-700 pb-1">1、当轮所得治理激励 = 验证激励 + 加速激励</div>
            <div className="text-sm text-blue-700 pb-1">
              2、单个地址的验证激励：当轮治理总激励 * 50% * 该地址行使验证权的治理票数 / 行使验权的治理票总数
            </div>
            <div className="text-sm text-blue-700 pb-1">
              3、单个地址的加速激励：当轮治理总激励 * 50% * 该地址质押代币数量 / 质押代币总数量
            </div>
            <div className="text-sm text-blue-700">
              4、溢出：单个地址的加速激励 超过投票激励 2 倍以上的部分，为溢出激励，自动销毁，归入未来总激励
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default StakePage;
