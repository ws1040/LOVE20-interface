import { useContext, useMemo } from 'react';
import { useValidGovVotes } from '@/src/hooks/contracts/useLOVE20Stake';
import { useGovData } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useAccount } from 'wagmi';

const SUBMIT_MIN_PERCENTAGE = Number(process.env.NEXT_PUBLIC_SUBMIT_MIN_PER_THOUSAND || '0') / 1000;

export const useCanSubmit = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  // 我的治理票&总有效票数
  const {
    validGovVotes,
    isPending: isPendingValidGovVotes,
    error: errorValidGovVotes,
  } = useValidGovVotes((token?.address as `0x${string}`) || '', (accountAddress as `0x${string}`) || '');

  // 使用 useGovData 获取治理数据
  const { govData, isPending: isPendingGovData, error: errorGovData } = useGovData(token?.address as `0x${string}`);

  // 检查是否有足够的治理票权
  const hasEnoughVotes = useMemo(() => {
    if (!validGovVotes || !govData?.govVotes || govData.govVotes === 0n) return false;

    // 计算百分比
    const percentage = Number(validGovVotes) / Number(govData.govVotes);
    return percentage >= SUBMIT_MIN_PERCENTAGE;
  }, [validGovVotes, govData?.govVotes]);

  const isPending = isPendingValidGovVotes || isPendingGovData;
  const error = errorValidGovVotes ?? errorGovData;

  return { hasEnoughVotes, validGovVotes, govData, SUBMIT_MIN_PERCENTAGE, isPending, error };
};
