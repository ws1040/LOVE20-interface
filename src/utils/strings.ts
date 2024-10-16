// 地址缩写
export const abbreviateAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

// 格式化代币数量：将最小单位转换为可读数字并带有逗号分隔
export const formatTokenAmount = (balance: bigint): string => {
  // 将 balance 除以 10^decimals 转换为常规单位
  const decimals = Number(process.env.NEXT_PUBLIC_DECIMALS);
  const factor = 10n ** BigInt(decimals);
  const formatted = Number(balance) / Number(factor);

  // 使用 Intl.NumberFormat 格式化数字，添加逗号
  const formattedWithCommas = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals, // 保留小数位
  }).format(formatted);

  return formattedWithCommas;
}