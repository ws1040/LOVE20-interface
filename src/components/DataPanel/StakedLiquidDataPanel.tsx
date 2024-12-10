import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useContext } from 'react';

import { formatTokenAmount } from '@/src/lib/format';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useTokenAmounts } from '@/src/hooks/contracts/useLOVE20SLToken';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

interface StakedLiquidDataPanelProps {}

const StakedLiquidDataPanel: React.FC<StakedLiquidDataPanelProps> = ({}) => {
  const { token } = useContext(TokenContext) || {};

  const {
    tokenAmount,
    parentTokenAmount,
    feeTokenAmount,
    feeParentTokenAmount,
    isPending: isPendingTokenAmount,
  } = useTokenAmounts(token?.slTokenAddress as `0x${string}`);

  if (isPendingTokenAmount) {
    return <LoadingIcon />;
  }

  return (
    <div className="flex-col items-center px-6">
      <LeftTitle title="流动性质押详情" />
      <div className="stats border rounded-lg w-full grid grid-cols-2 divide-x-0 mt-2 mb-6">
        <div className="stat place-items-center pt-3 ">
          <div className="stat-title">{token?.symbol}</div>
          <div className="stat-value text-xl">{formatTokenAmount(tokenAmount || BigInt(0))}</div>
        </div>
        <div className="stat place-items-center pt-3 ">
          <div className="stat-title">{token?.parentTokenSymbol}</div>
          <div className="stat-value text-xl">{formatTokenAmount(parentTokenAmount || BigInt(0))}</div>
        </div>
      </div>
      <LeftTitle title="待分配手续费" />
      <div className="stats border rounded-lg w-full grid grid-cols-2 divide-x-0 mt-2 mb-6">
        <div className="stat place-items-center pt-3">
          <div className="stat-title">{token?.symbol}</div>
          <div className="stat-value text-xl">{formatTokenAmount(feeTokenAmount || BigInt(0))}</div>
        </div>
        <div className="stat place-items-center pt-3">
          <div className="stat-title">{token?.parentTokenSymbol}</div>
          <div className="stat-value text-xl">{formatTokenAmount(feeParentTokenAmount || BigInt(0))}</div>
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant="outline" className="w-1/2 text-secondary border-secondary" asChild>
          <Link href={`/gov/stakelp?symbol=${token?.symbol}`}>质押获取治理票</Link>
        </Button>
      </div>
    </div>
  );
};

export default StakedLiquidDataPanel;
