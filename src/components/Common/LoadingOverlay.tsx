import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-white" />
        <p className="mt-2 text-sm font-medium text-white">Loading</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
