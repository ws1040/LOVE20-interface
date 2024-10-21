import React, { useContext } from 'react';

import { TokenContext } from '../../contexts/TokenContext';
import { formatTokenAmount } from '../../utils/strings';

interface VerifingDataPanelProps {
  currentRound: bigint;
}

const VerifingDataPanel: React.FC<VerifingDataPanelProps> = ({ currentRound }) => {
  const { token } = useContext(TokenContext) || {};

  return <div className="flex flex-col items-center space-y-4 p-6 bg-base-100"></div>;
};

export default VerifingDataPanel;
