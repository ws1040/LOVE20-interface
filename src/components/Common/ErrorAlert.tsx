'use client';
// components/common/ErrorAlert.tsx
import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useError } from '@/src/contexts/ErrorContext';

export const ErrorAlert = () => {
  const { error, setError } = useError();
  const [visible, setVisible] = useState(false);

  // 当 error 改变时控制 Alert 的显示与隐藏
  useEffect(() => {
    if (error) {
      setVisible(true);
    }
  }, [error, setError]);

  if (!visible || !error) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{error.name}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
};
