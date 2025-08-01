'use client';
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, text = 'Loading' }) => {
  // 阻止背景滚动
  useEffect(() => {
    if (isLoading) {
      // 保存当前body样式
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // 阻止背景滚动
      document.body.style.overflow = 'hidden';

      return () => {
        // 恢复原始样式
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLoading]);

  if (!isLoading) return null;

  // 阻止遮罩层的默认触摸行为
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 touch-none overscroll-none"
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      style={{ touchAction: 'none' }}
    >
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-white" />
        <p className="mt-2 text-sm font-medium text-white">{text}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
