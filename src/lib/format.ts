import { parseUnits as viemParseUnits, formatUnits as viemFormatUnits } from 'viem';

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
  return viemParseUnits(value, decimals);
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