// src/components/TokenLabel.tsx

import React, { useContext } from 'react';
import Link from 'next/link';

import { TokenContext } from '@/src/contexts/TokenContext';
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import AddToMetamask from '@/src/components/Common/AddToMetamask';
import Loading from '@/src/components/Common/Loading';

interface TokenLabelProps {
  showGovernanceLink?: boolean;
}

const TokenLabel: React.FC<TokenLabelProps> = ({ showGovernanceLink = false }) => {
  const tokenContext = useContext(TokenContext);
  const { token } = tokenContext || {};
  if (!token) {
    return <Loading />;
  }

  return (
    <div className="flex items-center mb-4">
      <div className="mr-2">
        <div className="flex items-center">
          <span className="font-bold text-2xl text-yellow-500">$</span>
          <span className="font-bold text-2xl mr-2">{token.symbol}</span>
          <AddressWithCopyButton address={token.address as `0x${string}`} />
          <AddToMetamask
            tokenAddress={token?.address as `0x${string}`}
            tokenSymbol={token?.symbol || ''}
            tokenDecimals={token?.decimals || 0}
          />
        </div>
      </div>

      {false && (
        <Link href={`/${token?.symbol}/gov`} className="text-blue-400 text-sm hover:underline ml-auto">
          参与治理&gt;&gt;
        </Link>
      )}
    </div>
  );
};

export default TokenLabel;
