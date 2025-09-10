import { useContext, useMemo } from 'react';
import { useValidGovVotes } from '@/src/hooks/contracts/useLOVE20Stake';
import { useGovData } from '@/src/hooks/contracts/useLOVE20RoundViewer';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useAccount } from 'wagmi';

const SUBMIT_MIN_PERCENTAGE = Number(process.env.NEXT_PUBLIC_SUBMIT_MIN_PER_THOUSAND || '0') / 1000;

export const useCanSubmit = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: account } = useAccount();

  // 我的治理票&总有效票数
  const {
    validGovVotes,
    isPending: isPendingValidGovVotes,
    error: errorValidGovVotes,
  } = useValidGovVotes((token?.address as `0x${string}`) || '', (account as `0x${string}`) || '');

  // 使用 useGovData 获取治理数据
  const { govData, isPending: isPendingGovData, error: errorGovData } = useGovData(token?.address as `0x${string}`);

  // 计算治理票百分比
  const percentage = useMemo(() => {
    if (!validGovVotes || !govData?.govVotes || govData.govVotes === BigInt(0)) return 0;
    return Number(validGovVotes) / Number(govData.govVotes);
  }, [validGovVotes, govData?.govVotes]);

  // 检查是否有足够的治理票权
  const hasEnoughVotes = useMemo(() => {
    return percentage >= SUBMIT_MIN_PERCENTAGE;
  }, [percentage]);

  const isPending = isPendingValidGovVotes || isPendingGovData;
  const error = errorValidGovVotes ?? errorGovData;

  return { hasEnoughVotes, percentage, validGovVotes, govData, SUBMIT_MIN_PERCENTAGE, isPending, error };
};
