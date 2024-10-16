// src/components/TokenLabel.tsx

import React, { useContext } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from '@mui/material';
import Link from 'next/link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast from 'react-hot-toast';

import { abbreviateAddress } from '../../utils/strings';
import { TokenContext } from '../../contexts/TokenContext';

const TokenLabel: React.FC = () => {

  const tokenContext = useContext(TokenContext);
  if (!tokenContext || !tokenContext.token) {
    return <div className="text-center text-error">Token information is not available.</div>;
  }
  const { token } = tokenContext;
  
  const handleCopy = () => {
    toast.success('地址已复制到剪贴板！');
  };

  return (
      <div className="flex items-center mb-4">
        <div className="mr-2">
          <span className="font-bold text-2xl text-yellow-500">$</span>
          <span className="font-bold text-2xl">{token.symbol}</span> 
          <span className="text-sm text-gray-500 ml-2">{abbreviateAddress(token.address)}</span>
        </div>
        <CopyToClipboard text={token.address} onCopy={handleCopy}>
          <Tooltip title="Copy address">
              <button className="btn btn-circle btn-ghost btn-xs text-gray-400">
                <ContentCopyIcon/>
              </button>
          </Tooltip>
        </CopyToClipboard>
        <Link href="/governance" className="text-blue-400 text-sm hover:underline ml-auto">参与治理&gt;&gt;</Link>
      </div>
  );
};

export default TokenLabel;
