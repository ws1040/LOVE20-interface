import { parseUnits as viemParseUnits, formatUnits as viemFormatUnits } from 'viem';
import { Token } from '@/src/contexts/TokenContext';

// 地址缩写
export const abbreviateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// 【显示函数-输出整数】从wei到eth 并带有逗号分隔 例如从 1000000000000000000 转换为 1
export const formatTokenAmountInteger = (balance: bigint): string => {
  const formatted = formatUnits(balance);
  const numberFormatted = Number(formatted);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(numberFormatted);
};

// 【显示函数-自动选择小数位数】从wei到eth 并带有逗号分隔 例如从 1000000000000000000 转换为 1.0000
export const formatTokenAmount = (balance: bigint, maximumFractionDigits_ = 4): string => {
  const formatted = formatUnits(balance);
  const numberFormatted = Number(formatted);

  // 如果过小，显示0
  if (balance < BigInt(10)) {
    return '0';
  }

  // 如果指定了小数位数，直接使用指定的位数
  if (maximumFractionDigits_ !== 4) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: maximumFractionDigits_,
    }).format(numberFormatted);
  }

  // 根据数值大小使用不同的格式化规则
  if (numberFormatted >= 1000) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(numberFormatted);
  } else if (numberFormatted >= 10) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(numberFormatted);
  } else if (numberFormatted >= 1) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 4,
    }).format(numberFormatted);
  } else if (numberFormatted >= 0.001) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 4,
    }).format(numberFormatted);
  } else {
    // 数字 < 0.001：使用折叠显示，例如 0.0000229 显示为 0.0{4}229
    if (numberFormatted === 0) return '0';

    // 对于极小的数值，使用字符串处理来保持精度
    const formattedStr = formatUnits(balance);
    const parts = formattedStr.split('.');
    if (parts.length < 2) return formattedStr;

    const fractionalPart = parts[1];

    // 计算小数部分前导 0 的个数
    let zeroCount = 0;
    for (const ch of fractionalPart) {
      if (ch === '0') {
        zeroCount++;
      } else {
        break;
      }
    }

    // 截取从第一个非 0 数字开始后的 4 位有效数字
    const significant = fractionalPart.slice(zeroCount, zeroCount + 4);

    return `0.0{${zeroCount}}${significant}`;
  }
};

// 【转换函数】从eth到wei
export const parseUnits = (value: string): bigint => {
  const decimals = parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || '18', 10);
  try {
    const normalizedValue = value.replace(/,/g, '');
    return viemParseUnits(normalizedValue, decimals);
  } catch (error) {
    console.error('parseUnits error:', error);
    return BigInt(0);
  }
};

// 【转换函数】从wei到eth
export const formatUnits = (value: bigint): string => {
  const decimals = parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || '18', 10);
  return viemFormatUnits(value, decimals);
};

// 去除小数结尾多余的0: 1.000000000000000000 -> 1
export const removeExtraZeros = (value: string) => {
  if (value.includes('.')) {
    // 先移除所有逗号再解析
    const valueWithoutCommas = value.replace(/,/g, '');
    return parseFloat(valueWithoutCommas).toString();
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
  } else if (seconds > 60) {
    return `${Math.floor(seconds / 60)}分${Math.ceil(seconds % 60)}秒`;
  } else {
    return `${Math.ceil(seconds)}秒`;
  }
};

// 格式化轮次
export const formatRoundForDisplay = (round: bigint, token: Token): bigint => {
  if (!round || !token) {
    return BigInt(0);
  }
  return round;
  // 不显示子币自己的轮次了
  // return round - BigInt(token.initialStakeRound) + BigInt(1);
};

// 将整数转换为千分位, 保留n小数, 并去掉小数位末尾的0
export const formatIntegerStringWithCommas = (
  value: string,
  maximumFractionDigits: number = 2,
  maximumFractionDigits2: number = 4,
): string => {
  const num = Number(value);

  if (num >= 1) {
    // 当数值大于等于 1 时，按常规格式化
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: maximumFractionDigits,
    }).format(num);
  } else if (num >= 0.001) {
    // 当数值在 [0.001, 1) 区间内，使用另一种小数位数格式
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: maximumFractionDigits2 + 1,
    }).format(num);
  } else {
    // 当数值小于 0.001（非 0）时，用 0.{N} 的方式显示
    if (num === 0) return '0';

    // 为了确保获取足够多的小数位，这里使用 toFixed，额外补充一些精度位数
    const extraPrecision = 10;
    const fixedStr = num.toFixed(maximumFractionDigits2 + extraPrecision);
    const parts = fixedStr.split('.');
    if (parts.length < 2) return fixedStr; // 如果没有小数部分则直接返回

    const fractionalPart = parts[1];

    // 计算小数部分前导的 0 的个数
    let zeroCount = 0;
    for (const ch of fractionalPart) {
      if (ch === '0') {
        zeroCount++;
      } else {
        break;
      }
    }
    // 截取从第一个非 0 数字开始后的部分
    const significant = fractionalPart.slice(zeroCount);

    return `0.0{${zeroCount}}${significant}`;
  }
};

// 去除小数末尾的0
const removeTrailingZeros = (num: number, digits: number): string => {
  return num.toFixed(digits).replace(/\.?0+$/, '');
};

// 格式化百分比显示
export const formatPercentage = (value: number | string): string => {
  if (value === undefined || value === null || isNaN(Number(value))) return '-%';

  const num = typeof value === 'string' ? parseFloat(value) : value;
  const absNum = Math.abs(num);

  if (absNum === 0) return '0%';
  if (absNum >= 100) return num.toLocaleString(undefined, { maximumFractionDigits: 0 }) + '%';
  if (absNum >= 10) return removeTrailingZeros(num, 1) + '%';
  if (absNum >= 1) return removeTrailingZeros(num, 2) + '%';
  if (absNum >= 0.1) return removeTrailingZeros(num, 3) + '%';
  if (absNum >= 0.01) return removeTrailingZeros(num, 4) + '%';
  return removeTrailingZeros(num, 6) + '%';
};
