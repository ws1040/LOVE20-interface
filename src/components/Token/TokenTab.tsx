import React, { useContext, useState } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Tooltip } from '@mui/material';

import { formatTokenAmount } from '@/src/lib/format';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useTotalSupply } from '@/src/hooks/contracts/useLOVE20Token';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import TokenLabel from './TokenLabel';

export default function TokenTab() {
  const { token } = useContext(TokenContext) || {};
  const {
    totalSupply,
    isPending: isTotalSupplyPending,
    error: totalSupplyError,
  } = useTotalSupply((token?.address as `0x${string}`) || '');

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
    return <LoadingIcon />;
  }

  return (
    <div className="px-6 pt-2 pb-6">
      <TokenLabel />

      {false && (
        <div className="flex items-center">
          <div className="mr-2">
            <span className="text-sm text-greyscale-500">已铸币量: </span>
            <span className="text-lg font-semibold text-orange-400">
              {isTotalSupplyPending ? <LoadingIcon /> : formatTokenAmount(totalSupply || 0n)}
            </span>
          </div>
          <Tooltip
            // 1e10
            title={`铸币上限 ${(1e10).toLocaleString()}`}
            open={tooltipOpen}
            onClose={handleTooltipClose}
            disableHoverListener
            disableFocusListener
            disableTouchListener
            // 可以根据需要添加 TransitionComponent 等属性
          >
            <button className="btn btn-circle btn-ghost btn-xs text-greyscale-400" onClick={handleTooltipToggle}>
              <HelpOutlineIcon />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
