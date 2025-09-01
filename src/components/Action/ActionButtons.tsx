import { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TokenContext } from '@/src/contexts/TokenContext';

interface ActionButtonsProps {
  isJoined: boolean;
  actionId: bigint;
  userJoinedAmount?: bigint;
  isPending?: boolean;
}

export default function ActionButtons({ isJoined, actionId, userJoinedAmount, isPending = false }: ActionButtonsProps) {
  const { token } = useContext(TokenContext) || {};

  if (!token) {
    return null;
  }

  const joinActionHref = `/acting/join?symbol=${token.symbol}&id=${actionId}`;
  const myParticipationHref = `/my/myaction?symbol=${token.symbol}&id=${actionId}`;

  if (isPending) {
    return (
      <div className="flex justify-center mb-6">
        <div className="loading loading-spinner loading-md"></div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex justify-center">
      {!isJoined ? (
        <Button className="w-1/2" asChild>
          <Link href={joinActionHref}>加入行动 &gt;&gt;</Link>
        </Button>
      ) : (
        <Link className="text-secondary hover:text-secondary/80 text-sm cursor-pointer" href={myParticipationHref}>
          我的参与 &gt;&gt;
        </Link>
      )}
    </div>
  );
}
