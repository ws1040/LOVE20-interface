import React, { useContext } from 'react';

import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';

interface VerifingDataPanelProps {
  currentRound: bigint;
}

const VerifingDataPanel: React.FC<VerifingDataPanelProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  return <div className="flex flex-col items-center space-y-4 p-6 bg-white"></div>;
};

export default VerifingDataPanel;
