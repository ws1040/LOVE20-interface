import React, { useState } from 'react';
import { ActionInfo } from '@/src/types/love20types';
import VerifyStatus from '@/src/components/Verify/VerifyStatus';
import VerifiedAddressesByAction from '@/src/components/Mint/VerifiedAddressesByAction';

interface VerificationTabsProps {
  actionId: bigint;
  currentRound: bigint;
  actionInfo: ActionInfo;
}

type VerificationSubTab = 'current' | 'history';

const VerificationTabs: React.FC<VerificationTabsProps> = ({ actionId, currentRound, actionInfo }) => {
  const [activeSubTab, setActiveSubTab] = useState<VerificationSubTab>('current');

  // 子Tab配置
  const subTabs: { key: VerificationSubTab; label: string }[] = [
    { key: 'current', label: '当前验证' },
    { key: 'history', label: '历史验证' },
  ];

  // 渲染子Tab内容
  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'current':
        return (
          <VerifyStatus
            actionId={actionId}
            currentRound={currentRound && currentRound > 0n ? currentRound - 1n : 0n}
            actionInfo={actionInfo}
          />
        );
      case 'history':
        return (
          <VerifiedAddressesByAction currentJoinRound={currentRound} actionId={actionId} actionInfo={actionInfo} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg">
      {/* 子Tab导航 */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-4 mx-16">
        {subTabs.map((subTab) => (
          <button
            key={subTab.key}
            onClick={() => setActiveSubTab(subTab.key)}
            className={`flex-1 px-2 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
              activeSubTab === subTab.key
                ? 'bg-white text-secondary shadow-sm'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {subTab.label}
          </button>
        ))}
      </div>

      {/* 子Tab内容 */}
      {renderSubTabContent()}
    </div>
  );
};

export default VerificationTabs;
