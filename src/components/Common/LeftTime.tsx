import React, { useState, useEffect } from 'react';
import { formatSeconds } from '@/src/lib/format';

interface LeftTimeProps {
  initialTimeLeft: number;
}

const LeftTime: React.FC<LeftTimeProps> = ({ initialTimeLeft }) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);

  useEffect(() => {
    if (initialTimeLeft <= 0) {
      return;
    } else {
      setTimeLeft(initialTimeLeft);
    }

    const timerRef = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef);
          window.location.reload();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef);
    };
  }, [initialTimeLeft]);

  const timeLeftText = formatSeconds(timeLeft);

  return <>{timeLeftText}</>;
};

export default LeftTime;
