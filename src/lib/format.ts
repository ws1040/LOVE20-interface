import { parseUnits as viemParseUnits, formatUnits as viemFormatUnits } from 'viem';
import { Token } from '@/src/contexts/TokenContext';

// 地址缩写
export const abbreviateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// 格式化代币数量：将最小单位转换为可读数字并带有逗号分隔 例如从 1000000000000000000 转换为 1.0000
export const formatTokenAmount = (balance: bigint, maximumFractionDigits_ = 4): string => {
  const formatted = formatUnits(balance);
  const numberFormatted = Number(formatted);

  // 如果过小，显示0
  if (balance < 10n) {
    return '0';
  }

  // 如果数字小于0.0001，则显示<0.0001
  if (numberFormatted < 0.0001) {
    return '<0.0001';
  }

  // 使用 Intl.NumberFormat 格式化数字，添加逗号
  const formattedWithCommas = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maximumFractionDigits_, // 保留小数位
  }).format(numberFormatted);

  return formattedWithCommas;
};

// to wei/BigInt
export const parseUnits = (value: string): bigint => {
  const decimals = parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || '18', 10);
  try {
    const normalizedValue = value.replace(/,/g, '');
    return viemParseUnits(normalizedValue, decimals);
  } catch (error) {
    console.error('parseUnits error:', error);
    return 0n;
  }
};

// from wei/BigInt
export const formatUnits = (value: bigint): string => {
  const decimals = parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || '18', 10);
  return viemFormatUnits(value, decimals);
};

// 去除小数结尾多余的0
export const removeExtraZeros = (value: string) => {
  if (value.includes('.')) {
    return parseFloat(value).toString();
  }
  return value;
};

// 将秒转换为小时和分钟
export const formatSeconds = (seconds: number): string => {
  if (seconds > 86400) {
    return `${Math.floor(seconds / 86400)}天${Math.floor((seconds % 86400) / 3600)}小时${Math.floor(
      (seconds % 3600) / 60,
    )}分`;
  } else if (seconds > 3600) {
    return `${Math.floor(seconds / 3600)}小时${Math.floor((seconds % 3600) / 60)}分`;
  } else {
    return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
  }
};

// 格式化轮次
export const formatRoundForDisplay = (round: bigint, token: Token): bigint => {
  if (!round || !token) {
    return 0n;
  }
  return round - BigInt(token.initialStakeRound) + 1n;
};

// 将整数转换为千分位, 保留n小数, 并去掉小数位末尾的0
export const formatIntegerWithCommas = (value: bigint, maximumFractionDigits: number): string => {
  const formatted = formatUnits(value);
  const numberFormatted = Number(formatted);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maximumFractionDigits,
  }).format(numberFormatted);
};

export const formatIntegerStringWithCommas = (value: string, maximumFractionDigits: number): string => {
  const numberFormatted = Number(value);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maximumFractionDigits,
  }).format(numberFormatted);
};
