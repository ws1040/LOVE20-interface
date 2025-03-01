import { cn } from '@/lib/utils';

interface AlertBoxProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  message: string | React.ReactNode;
  className?: string;
}

const AlertBox = ({ type = 'error', message, className }: AlertBoxProps) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
  };

  return <div className={cn('p-3 rounded border text-sm', styles[type], className)}>{message}</div>;
};

export default AlertBox;
