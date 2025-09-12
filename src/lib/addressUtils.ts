/**
 * 地址格式转换工具
 * 支持TKM链的TH地址格式和以太坊0x地址格式的互相转换
 */

import TkmIban from './tkmIban';

/**
 * 将0x地址转换为TH格式地址
 * @param address 0x开头的以太坊地址
 * @returns TH开头的TKM地址
 */
export function addressToTH(address: string): string {
  if (!address || address === '') {
    return '';
  }

  try {
    // 使用TKM专用的IBAN实现
    return TkmIban.toIban(address);
  } catch (error) {
    console.error('转换为TH地址失败:', error);
    return '';
  }
}

/**
 * 将TH地址转换为0x格式
 * @param thAddress TH开头的TKM地址
 * @returns 0x开头的以太坊地址
 */
export function thToAddress(thAddress: string): string {
  if (!thAddress || thAddress === '') {
    return '';
  }

  // 特殊地址处理
  if (thAddress === 'TH48000000000000000000000000001EKI') {
    return '0x0000000000000000000000000000000000010002';
  }

  try {
    // 使用TKM专用的IBAN实现
    return TkmIban.toAddress(thAddress).toLowerCase();
  } catch (error) {
    console.error('转换TH地址为0x失败:', error);
    return '';
  }
}

/**
 * 判断是否为有效的0x地址
 * @param address 地址字符串
 * @returns 是否为有效0x地址
 */
export function isValidEthAddress(address: string): boolean {
  const reg = /^0[Xx][A-Fa-f0-9]{40}$/;
  return reg.test(address);
}

/**
 * 判断是否为TH格式地址
 * @param address 地址字符串
 * @returns 是否为TH格式地址
 */
export function isTHAddress(address: string): boolean {
  try {
    // 使用TKM专用的IBAN验证
    return TkmIban.isValid(address);
  } catch {
    return false;
  }
}

/**
 * 用户输入地址标准化函数
 * 自动检测并转换为标准的0x格式（用于区块链交易）
 * @param userInput 用户输入的地址（可能是0x、XE或TH格式）
 * @returns 标准化的0x地址，如果无效返回空字符串
 */
export function normalizeAddressInput(userInput: string): string {
  if (!userInput || userInput === '') {
    return '';
  }

  // 去除前后空格
  const trimmed = userInput.trim();

  // 如果已经是有效的0x格式，直接返回小写版本
  if (isValidEthAddress(trimmed)) {
    return trimmed.toLowerCase();
  }

  // 如果是TH格式，使用专门的转换函数
  if (isTHAddress(trimmed)) {
    return thToAddress(trimmed);
  }

  // 都不是有效格式
  return '';
}

/**
 * 获取用户友好的地址显示格式
 * @param address 0x格式地址
 * @param format 显示格式：'short' | 'iban' | 'full'
 * @returns 格式化后的地址字符串
 */
export function formatAddressForDisplay(address: string, format: 'short' | 'iban' | 'th' | 'full' = 'short'): string {
  if (!address || !isValidEthAddress(address)) {
    return '';
  }

  switch (format) {
    case 'short':
      // 缩写显示：0x1234...5678
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

    case 'th':
      // TH格式显示
      return addressToTH(address);

    case 'full':
    default:
      return address.toLowerCase();
  }
}

/**
 * 验证地址输入并返回错误信息
 * @param userInput 用户输入的地址
 * @returns 错误信息，如果有效返回null
 */
export function validateAddressInput(userInput: string): string | null {
  if (!userInput || userInput.trim() === '') {
    return '请输入收款地址';
  }

  const trimmed = userInput.trim();

  // 检查各种可能的格式
  if (isValidEthAddress(trimmed)) {
    return null; // 有效的0x地址
  }

  if (isTHAddress(trimmed)) {
    // TH格式，尝试转换验证
    const converted = normalizeAddressInput(trimmed);
    if (converted) {
      return null;
    }
  }

  return '请输入有效的地址格式（支持 0x、XE 或 TH 格式）';
}
