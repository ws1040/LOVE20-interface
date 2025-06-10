'use client';
import React, { useState, useEffect } from 'react';
import { formatSeconds } from '@/src/lib/format';

interface LeftTimeProps {
  initialTimeLeft: number;
  onTick?: (timeLeft: number) => void;
}

const LeftTime: React.FC<LeftTimeProps> = ({ initialTimeLeft, onTick }) => {
  // 计算目标时间（milliseconds）
  const [targetTime, setTargetTime] = useState<number>(Date.now() + initialTimeLeft * 1000);
  // 当前剩余秒数
  const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);

  // 当传入的初始时间变化时，重新设定目标时间
  useEffect(() => {
    setTargetTime(Date.now() + initialTimeLeft * 1000);
  }, [initialTimeLeft]);

  // 每秒计算一次剩余时间，确保倒计时与 targetTime 保持同步
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
      setTimeLeft(newTimeLeft);
      if (onTick) {
        onTick(newTimeLeft);
      }
      if (newTimeLeft <= 0) {
        clearInterval(timer);
        window.location.reload();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime, onTick]);

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="inline-flex gap-1 text-greyscale-400">
      {days > 0 && (
        <div>
          <span className="countdown font-mono">
            <span style={{ '--value': days } as React.CSSProperties}></span>
          </span>
          天
        </div>
      )}
      {(hours > 0 || days > 0) && (
        <div>
          <span className="countdown font-mono">
            <span style={{ '--value': hours } as React.CSSProperties}></span>
          </span>
          时
        </div>
      )}
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
