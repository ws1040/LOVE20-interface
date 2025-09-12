/**
 * TKM链专用IBAN实现
 * 基于TKM提供的代码，使用TH作为国家代码
 */

import { isAddress, getAddress } from 'viem';
import BN from 'bn.js';

/**
 * 左填充函数
 */
const leftPad = (string: string, bytes: number): string => {
  let result = string;
  while (result.length < bytes * 2) {
    result = '0' + result;
  }
  return result;
};

/**
 * 为mod 97计算准备IBAN，将前4个字符移到末尾并将字母转换为数字
 */
const iso13616Prepare = (iban: string): string => {
  const A = 'A'.charCodeAt(0);
  const Z = 'Z'.charCodeAt(0);

  iban = iban.toUpperCase();
  iban = iban.substr(4) + iban.substr(0, 4);

  return iban
    .split('')
    .map((n) => {
      const code = n.charCodeAt(0);
      if (code >= A && code <= Z) {
        // A = 10, B = 11, ... Z = 35
        return (code - A + 10).toString();
      } else {
        return n;
      }
    })
    .join('');
};

/**
 * 计算IBAN的MOD 97 10校验和
 */
const mod9710 = (iban: string): number => {
  let remainder = iban;
  let block: string;

  while (remainder.length > 2) {
    block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(block.length);
  }

  return parseInt(remainder, 10) % 97;
};

/**
 * TKM IBAN类
 */
class TkmIban {
  private _iban: string;

  constructor(iban: string) {
    this._iban = iban;
  }

  /**
   * 从以太坊地址创建TH IBAN地址
   */
  static fromAddress(address: string): TkmIban {
    if (!isAddress(address)) {
      throw new Error('Provided address is not a valid address: ' + address);
    }

    // 移除0x前缀
    const cleanAddress = address.replace('0x', '').replace('0X', '');

    // 转换为BigNumber并转为36进制
    const asBn = new BN(cleanAddress, 16);
    const base36 = asBn.toString(36);
    const padded = leftPad(base36, 15);

    return TkmIban.fromBban(padded.toUpperCase());
  }

  /**
   * 从BBAN创建TH IBAN
   */
  static fromBban(bban: string): TkmIban {
    const countryCode = 'TH'; // 🔑 TKM链使用TH作为国家代码

    const remainder = mod9710(iso13616Prepare(countryCode + '00' + bban));
    const checkDigit = ('0' + (98 - remainder)).slice(-2);

    return new TkmIban(countryCode + checkDigit + bban);
  }

  /**
   * 从以太坊地址创建TH IBAN字符串
   */
  static toIban(address: string): string {
    return TkmIban.fromAddress(address).toString();
  }

  /**
   * 将TH IBAN地址转换为以太坊地址
   */
  static toAddress(iban: string): string {
    const ibanObj = new TkmIban(iban);

    if (!ibanObj.isDirect()) {
      throw new Error("IBAN is indirect and can't be converted");
    }

    return ibanObj.toAddress();
  }

  /**
   * 验证TH IBAN地址是否有效
   */
  static isValid(iban: string): boolean {
    const ibanObj = new TkmIban(iban);
    return ibanObj.isValid();
  }

  /**
   * 检查IBAN是否有效
   */
  isValid(): boolean {
    return (
      /^TH[0-9]{2}(ETH[0-9A-Z]{13}|[0-9A-Z]{30,31})$/.test(this._iban) && mod9710(iso13616Prepare(this._iban)) === 1
    );
  }

  /**
   * 检查是否为直接IBAN
   */
  isDirect(): boolean {
    return this._iban.length === 34 || this._iban.length === 35;
  }

  /**
   * 检查是否为间接IBAN
   */
  isIndirect(): boolean {
    return this._iban.length === 20;
  }

  /**
   * 获取校验和
   */
  checksum(): string {
    return this._iban.substr(2, 2);
  }

  /**
   * 转换为以太坊地址
   */
  toAddress(): string {
    if (this.isDirect()) {
      const base36 = this._iban.substr(4);
      const asBn = new BN(base36, 36);
      return getAddress(`0x${asBn.toString(16).padStart(40, '0')}`);
    }

    return '';
  }

  /**
   * 转换为字符串
   */
  toString(): string {
    return this._iban;
  }
}

export default TkmIban;
