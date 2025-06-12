'use client';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronRight, UserPen } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// my hooks
import { useJoinedActions } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Join';

// my contexts
import { Token } from '@/src/contexts/TokenContext';

// my types & funcs
import { JoinedAction } from '@/src/types/love20types';
import { formatPercentage, formatTokenAmount } from '@/src/lib/format';

// my components
import LeftTitle from '@/src/components/Common/LeftTitle';
import RoundLite from '@/src/components/Common/RoundLite';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import AddressWithCopyButton from '../Common/AddressWithCopyButton';

interface MyStakedActionListProps {
  token: Token | null | undefined;
}

const MyStakedActionList: React.FC<MyStakedActionListProps> = ({ token }) => {
  const { address: accountAddress } = useAccount();
  const { currentRound } = useCurrentRound();
  const {
    joinedActions,
    isPending: isPendingJoinedActions,
    error: errorJoinedActions,
  } = useJoinedActions((token?.address as `0x${string}`) || '', accountAddress as `0x${string}`);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  if (errorJoinedActions) {
    handleContractError(errorJoinedActions, 'dataViewer');
  }

  if (isPendingJoinedActions) {
    return (
      <>
        <div className="pt-4 px-4">
          <LeftTitle title="我参与的行动" />
          <div className="text-sm mt-4 text-greyscale-500 text-center">
            <LoadingIcon />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="pt-4 px-4">
      <LeftTitle title="我参与的行动" />
      <RoundLite currentRound={currentRound} roundType="act" />
      {!joinedActions?.length ? (
        <div className="text-sm text-greyscale-500 text-center my-6">没有参与行动，请先参与</div>
      ) : (
        <div className="mt-4 space-y-4">
          {joinedActions?.map((action: JoinedAction, index: number) => (
            <Card key={action.action.head.id} className="shadow-none">
              <Link
                href={`/my/actrewards?id=${action.action.head.id}&symbol=${token?.symbol}`}
                key={action.action.head.id}
                className="relative block"
              >
                <CardHeader className="px-3 pt-2 pb-1 flex-row justify-between items-baseline">
                  <div className="flex items-baseline">
                    <span className="text-greyscale-400 text-sm">{`No.`}</span>
                    <span className="text-secondary text-xl font-bold mr-2">{String(action.action.head.id)}</span>
                    <span className="font-bold text-greyscale-800">{`${action.action.body.action}`}</span>
                  </div>
                  {action.votesNum > 0 ? (
                    <span className="text-secondary text-xs">进行中</span>
                  ) : (
                    <span className="text-error text-xs">未投票</span>
                  )}
                </CardHeader>
                <CardContent className="px-3 pt-1 pb-2">
                  <div className="text-greyscale-500">{action.action.body.consensus}</div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="flex items-center">
                      <UserPen className="text-greyscale-400 mr-1 h-3 w-3 -translate-y-0.5" />
                      <span className="text-greyscale-400">
                        <AddressWithCopyButton
                          address={action.action.head.author as `0x${string}`}
                          showCopyButton={false}
                          colorClassName2="text-secondary"
                        />
                      </span>
                    </span>
                    {action.votesNum > 0 && (
                      <span>
                        <span className="text-greyscale-400 mr-1">投票</span>
                        <span className="text-secondary">{formatPercentage(Number(action.votePercent) / 100)}</span>
                      </span>
                    )}
                    <span>
                      <span className="text-greyscale-400 mr-1">我参与代币</span>
                      <span className="text-secondary">{formatTokenAmount(action.stakedAmount)}</span>
                    </span>
                  </div>
                </CardContent>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-greyscale-400 pointer-events-none" />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyStakedActionList;
