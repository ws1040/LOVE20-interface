// src/utils/errorUtils.ts

import { ContractErrorsMaps, getErrorNameFromSelector } from '@/src/errors';
import { ErrorInfo } from '@/src/contexts/ErrorContext';
import { useError } from '@/src/contexts/ErrorContext';
import { useCallback } from 'react';

/**
 * 从 MetaMask 错误信息中解析核心的错误原因
 *
 * @param error 错误信息
 * @returns 解析出的核心错误信息
 */
function _parseMetaMaskError(error: string): string {
  /***
   * 示例错误日志：
     error TransactionExecutionError: User rejected the request.
      Details: MetaMask Tx Signature: User denied transaction signature.
   */
  const errorMatch = error.match(/User denied transaction signature/);
  if (errorMatch) {
    return '用户取消了交易';
  }
  return '';
}

/**
 * 从 Solidity 合约调用错误信息中解析核心的错误原因
 *
 * @param errorLog 整段合约调用返回的错误字符串
 * @returns 解析出的核心错误信息
 */
function _parseOriginalRevertMessage(errorLog: string): string {
  /**
   * 示例错误日志：
    ```
    The contract function "stakeLiquidity" reverted.

    Error: InvalidToAddress()
    
    Contract Call:
      address:   0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
      function:  stakeLiquidity(address tokenAddress, uint256 tokenAmountForLP, uint256 parentTokenAmountForLP, uint256 promisedWaitingPhases, address to)
      args:                    (0x75537828f2ce51be7289709686A69CbFDbB714F1, 10000000000000000000000000000, 1000000000000000000, 4, 0x0000000000000000000000000000000000000000)
      sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

    Docs: https://viem.sh/docs/contract/simulateContract
    Version: viem@2.17.0
    ```
  */
  const errorMatch = errorLog.split('\n').find((line) => line.trim().startsWith('Error:'));
  if (errorMatch) {
    const reason = errorMatch.split('Error:')[1]?.trim();
    if (reason) {
      return reason;
    }
  }

  /**
   * 示例错误日志：
    ```
    The contract function "stakeLiquidity" reverted with the following reason:
    ERC20: transfer amount exceeds balance

    Contract Call:
      address:   0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
      function:  stakeLiquidity(address tokenAddress, uint256 tokenAmountForLP, uint256 parentTokenAmountForLP, uint256 promisedWaitingPhases, address to)
      args:                    (0x75537828f2ce51be7289709686A69CbFDbB714F1, 10000000000000000000000000000, 1000000000000000000, 4, 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
      sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

    Docs: https://viem.sh/docs/contract/simulateContract
    Version: viem@2.17.0
    ```
  */
  const lines = errorLog.split('\n');
  const reasonIndex = lines.findIndex((line) => line.includes('the following reason:'));
  if (reasonIndex !== -1 && reasonIndex + 1 < lines.length) {
    const reason = lines[reasonIndex + 1].trim();
    if (reason) {
      return reason;
    }
  }

  // 如果都没有匹配上，则返回一个默认提示
  return '';
}

/**
 * 根据 solidity revert 自定义错误，返回可读的中文错误提示。
 *
 * @param error  错误信息
 * @param contractKey 用来区分合约的 key，必须在 ContractErrorsMaps 中存在
 * @returns 可读错误文案，若无法匹配则返回 "未知错误"
 */
export function getReadableRevertErrMsg(error: string, contractKey: string): ErrorInfo {
  const rawMessage: string = error ?? '';

  // 1.优先检查是否是十六进制错误选择器格式，使用更精确的匹配模式
  // 示例格式：
  // - "Data:   0xd6e1a062 (4 bytes)"  (Viem 错误格式)
  // - 'data: "0xa748da06"'            (JSON-RPC 错误格式)
  // - "0xa748da06"                    (直接错误选择器)
  // - "execution reverted, data: 0xa748da06"  (其他格式)

  let selector = '';

  // 匹配 Viem 格式：Data:   0xd6e1a062 (4 bytes)
  const viemMatch = rawMessage.match(/Data:\s*0x([a-fA-F0-9]{8})\s*\(4 bytes\)/i);
  if (viemMatch) {
    selector = '0x' + viemMatch[1];
  }

  // 匹配 JSON-RPC 格式：data: "0xa748da06" 或 data: 0xa748da06
  if (!selector) {
    const jsonRpcMatch = rawMessage.match(/data:\s*"?0x([a-fA-F0-9]{8})"?/i);
    if (jsonRpcMatch) {
      selector = '0x' + jsonRpcMatch[1];
    }
  }

  // 匹配独立的 4 字节选择器，但要确保它不是地址的一部分
  // 地址是 40 个字符，选择器是 8 个字符
  if (!selector) {
    const standaloneMatch = rawMessage.match(/(?:^|[^a-fA-F0-9])0x([a-fA-F0-9]{8})(?:[^a-fA-F0-9]|$)/);
    if (standaloneMatch) {
      selector = '0x' + standaloneMatch[1];
    }
  }

  if (selector) {
    const errorName = getErrorNameFromSelector(selector, contractKey);
    if (errorName) {
      const errorMap = ContractErrorsMaps[contractKey];
      if (errorMap && errorMap[errorName]) {
        return { name: '交易错误', message: errorMap[errorName] };
      }
    }
  }

  // 2.解析传统格式的错误信息
  const matched = rawMessage.match(/(?:([A-Za-z0-9_]+)\()|(?:ERC20:\s*(.+))/);
  let errorName = '';
  if (matched && (matched[1] != undefined || matched[2] != undefined)) {
    if (matched[1]) {
      // 类似 "InvalidToAddress()"
      errorName = matched[1];
    } else if (matched[2]) {
      // 类似 "ERC20: transfer amount exceeds balance"
      errorName = `${matched[2]}`;
    }
  }

  // 3.根据合约key获取对应的错误映射
  const errorMap = ContractErrorsMaps[contractKey];
  if (errorMap && errorMap[errorName]) {
    return { name: '交易错误', message: errorMap[errorName] };
  }

  // 4.解析 MetaMask 错误
  const metaMaskError = _parseMetaMaskError(rawMessage);
  if (metaMaskError) {
    return { name: '交易提示', message: metaMaskError };
  }

  // 5.如果找不到对应的错误文案，则返回默认的错误文案
  const originalRevertError = _parseOriginalRevertMessage(rawMessage);
  if (originalRevertError) {
    //打印原始错误
    return { name: '交易错误', message: originalRevertError };
  }

  // 未知错误
  return {
    name: '交易错误',
    message: '交易失败，请稍后刷新重试',
  };
}

/**
 * 自定义 Hook 用于处理错误
 * @param context 错误上下文，例如 'stake' 或 'uniswap'
 * @returns handleContractError 函数
 */
export const useHandleContractError = () => {
  const { setError } = useError();

  /**
   * 处理错误并设置错误信息
   * @param error 捕获到的错误对象
   * @param context 错误上下文，例如 'stake' 或 'uniswap'
   */
  const handleContractError = useCallback(
    (error: any, context: string) => {
      console.error('Context:', context);
      console.error('Error Object:', error);

      // 尝试从多个可能的位置提取错误信息
      let errorMessage = '';
      let errorStringified = '';

      // 安全地序列化 error 对象，处理 BigInt
      try {
        errorStringified = JSON.stringify(error, (key, value) => {
          // 将 BigInt 转换为字符串
          if (typeof value === 'bigint') {
            return value.toString();
          }
          return value;
        });
      } catch (e) {
        // 如果序列化失败，使用 toString 或默认值
        errorStringified = error?.toString() || 'Error object cannot be stringified';
      }

      const sources = [error?.message, error?.cause?.message, error?.data, error?.reason, errorStringified];

      for (const source of sources) {
        if (source && typeof source === 'string') {
          const parsedError = getReadableRevertErrMsg(source, context);
          if (parsedError.message !== '交易失败，请稍后刷新重试') {
            errorMessage = parsedError.message;
            break;
          }
        }
      }

      const finalError = errorMessage
        ? { name: '交易错误', message: errorMessage }
        : getReadableRevertErrMsg(error?.message || errorStringified, context);

      console.error('Final Error Message:', finalError);

      setError(finalError);
    },
    [setError],
  );

  return { handleContractError };
};
