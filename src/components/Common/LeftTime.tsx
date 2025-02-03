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

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="inline-flex gap-1  text-secondary">
      {days > 0 && (
        <div>
          <span className="countdown font-mono">
            <span style={{ '--value': days } as React.CSSProperties}></span>
          </span>
          天
        </div>
      )}
      <div>
        <span className="countdown font-mono">
          <span style={{ '--value': hours } as React.CSSProperties}></span>
        </span>
        时
      </div>
      <div>
        <span className="countdown font-mono">
          <span style={{ '--value': minutes } as React.CSSProperties}></span>
        </span>
        分
      </div>
      {days <= 0 && (
        <div>
          <span className="countdown font-mono">
            <span style={{ '--value': seconds } as React.CSSProperties}></span>
          </span>
          秒
        </div>
      )}
    </div>
  );
};

export default LeftTime;
