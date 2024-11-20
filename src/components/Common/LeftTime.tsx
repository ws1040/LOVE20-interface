import React, { useState, useEffect, useRef } from 'react';
import { formatSeconds } from '@/src/lib/format';

interface LeftTimeProps {
  initialTimeLeft: number;
}

const LeftTime: React.FC<LeftTimeProps> = ({ initialTimeLeft }) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(false);

  useEffect(() => {
    isMountedRef.current = true;

    if (initialTimeLeft <= 0) {
      return;
    } else {
      setTimeLeft(initialTimeLeft);
    }

    // 清除之前的定时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      // 如果组件已卸载，直接返回
      if (!isMountedRef.current) return;

      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          console.log('1.prevTime', prevTime);
          return 0;
        }
        console.log('2.prevTime', prevTime);
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [initialTimeLeft]);

  const timeLeftText = formatSeconds(timeLeft);

  return <>{timeLeftText}</>;
};

export default LeftTime;
