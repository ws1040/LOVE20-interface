import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractErrorMessage = (error: any): string => {
  if (error?.reason) return error.reason;
  if (error?.data?.message) return error.data.message;
  if (error?.message) return error.message;
  return '发生未知错误';
};
