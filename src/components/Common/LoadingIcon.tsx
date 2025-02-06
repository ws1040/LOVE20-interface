// components/Common/LoadingIcon.tsx
'use client';
import { Loader2 } from 'lucide-react';

const LoadingIcon: React.FC = () => {
  return <Loader2 className="mx-auto h-4 w-4 animate-spin text-greyscale-500" />;
};

export default LoadingIcon;
