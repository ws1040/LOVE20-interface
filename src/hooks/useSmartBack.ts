import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { NavigationUtils } from '@/src/lib/navigationUtils';

/**
 * 智能回退Hook - 针对TokenPocket等钱包环境优化
 */
export const useSmartBack = (fallbackPath?: string) => {
  const router = useRouter();

  const smartBack = useCallback(() => {
    NavigationUtils.smartBack(router, fallbackPath);
  }, [router, fallbackPath]);

  return smartBack;
};

export default useSmartBack;
