import { parseUnits as viemParseUnits, formatUnits as viemFormatUnits } from 'viem';
import { Token } from '@/src/contexts/TokenContext';
// 地址缩写
export const abbreviateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// 格式化代币数量：将最小单位转换为可读数字并带有逗号分隔
export const formatTokenAmount = (balance: bigint): string => {
  const formatted = formatUnits(balance);
  // 使用 Intl.NumberFormat 格式化数字，添加逗号
  const formattedWithCommas = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2, // 保留小数位
  }).format(Number(formatted));

  return formattedWithCommas;
};

// to wei/BigInt
export const parseUnits = (value: string): bigint => {
  const decimals = parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || '18', 10);
  try {
    return viemParseUnits(value, decimals);
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
