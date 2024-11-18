import { useContext } from 'react';
import { TokenContext, TokenContextType } from '@/src/contexts/TokenContext';

const useTokenContext = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokenContext must be used within a TokenProvider');
  }
  return context;
};

export default useTokenContext;
