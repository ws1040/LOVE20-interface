// src/components/TokenLabel.tsx

import React, { useContext } from 'react';
import Link from 'next/link';

import AddressWithCopyButton from '../Common/AddressWithCopyButton';
import { TokenContext } from '../../contexts/TokenContext';

interface TokenLabelProps {
  showGovernanceLink?: boolean;
}

const TokenLabel: React.FC<TokenLabelProps> = ({ showGovernanceLink = false }) => {
  const tokenContext = useContext(TokenContext);
  if (!tokenContext || !tokenContext.token) {
    return <div className="text-center text-error">Token information is not available.</div>;
  }
  const { token } = tokenContext;

  return (
    <div className="flex items-center mb-4">
      <div className="mr-2">
        <div className="flex items-center">
          <span className="font-bold text-2xl text-yellow-500">$</span>
          <span className="font-bold text-2xl mr-2">{token.symbol}</span>
          <AddressWithCopyButton address={token.address as `0x${string}`} />
        </div>
      </div>

      {showGovernanceLink && (
        <Link href="/gov" className="text-blue-400 text-sm hover:underline ml-auto">
          参与治理&gt;&gt;
        </Link>
      )}
    </div>
  );
};

export default TokenLabel;
