import { useTotalSupply } from '../../hooks/contracts/useLOVE20Token';

import React, { useContext, useState } from 'react';
import { Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import TokenLabel from './TokenLabel';
import { TokenContext } from '../../contexts/TokenContext';

export default function TokenTab() {

  const { token } = useContext(TokenContext) || {};
  const { totalSupply, isPending: isTotalSupplyPending, error: totalSupplyError } = useTotalSupply(token?.address as `0x${string}` || '');
  
  console.log('totalSupply', totalSupply);//为啥不是 1e9 * 1e18 而是 1e7 * 1e18

  // 控制 Tooltip 的显隐 begin
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const handleTooltipToggle = () => {
    setTooltipOpen((prev) => !prev);
  };
  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };
  // 控制 Tooltip 的显隐 end

  if (!token?.address) {
    return <div>Loading token information...</div>;
  }else{
    return (
      <div className="p-6 bg-base-100">
      
      <TokenLabel />

      <div className="flex items-center">
        <div className="mr-2">
          <span className="text-sm">已铸币量: </span>
          <span className="text-lg font-semibold text-orange-400">
            {isTotalSupplyPending 
              ? 'Loading...' 
              : `${(Number(totalSupply) / 10 ** Number(process.env.NEXT_PUBLIC_DECIMALS)).toLocaleString()}`}
          </span>
        </div>
        <Tooltip
          // 1e10
          title={`铸币上限 ${1e10.toLocaleString()}`}
          open={tooltipOpen}
          onClose={handleTooltipClose}
          disableHoverListener
          disableFocusListener
          disableTouchListener
          // 可以根据需要添加 TransitionComponent 等属性
        >
          <button
            className="btn btn-circle btn-ghost btn-xs text-gray-400"
            onClick={handleTooltipToggle}
          >
            <HelpOutlineIcon />
          </button>
        </Tooltip>
      </div>
    </div>
  );
  }
}
