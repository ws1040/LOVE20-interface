// src/components/TokenLabel.tsx

import React, { useContext } from 'react';
import Link from 'next/link';

import { TokenContext } from '@/src/contexts/TokenContext';
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import AddToMetamask from '@/src/components/Common/AddToMetamask';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

interface TokenLabelProps {}

const TokenLabel: React.FC<TokenLabelProps> = ({}) => {
  const { token } = useContext(TokenContext) || {};
  if (!token) {
    return <LoadingIcon />;
  }

  return (
    <div className="flex items-center">
      <div className="mr-2">
        <div className="flex items-center">
          <span className="font-bold text-2xl mr-2">{token.symbol}</span>
          <AddressWithCopyButton address={token.address as `0x${string}`} />
          <AddToMetamask
            tokenAddress={token.address as `0x${string}`}
            tokenSymbol={token.symbol || ''}
            tokenDecimals={token.decimals || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default TokenLabel;
