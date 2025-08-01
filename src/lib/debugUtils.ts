// 创建一个强力的错误调试工具
export const deepLogError = (error: any, context?: string) => {
  const prefix = context ? `[${context}]` : '';

  console.group(`🐛 ${prefix} 深度错误分析`);

  try {
    // 基本信息
    console.log('📋 错误类型:', typeof error);
    console.log('📋 错误构造函数:', error?.constructor?.name);
    console.log('📋 是否为 Error 实例:', error instanceof Error);

    // 尝试不同的字符串化方法
    try {
      console.log('📋 toString():', error?.toString?.());
    } catch (e) {
      console.log('📋 toString() 失败:', e);
    }

    try {
      console.log('📋 JSON.stringify:', JSON.stringify(error));
    } catch (e) {
      console.log('📋 JSON.stringify 失败:', e);
    }

    // 反射检查所有属性
    if (error && typeof error === 'object') {
      console.log('🔍 反射检查开始...');

      // 获取所有属性名（包括不可枚举的）
      const allKeys = Object.getOwnPropertyNames(error);
      console.log('📋 所有属性名:', allKeys);

      // 逐个检查属性
      allKeys.forEach((key) => {
        try {
          const value = error[key];
          const descriptor = Object.getOwnPropertyDescriptor(error, key);
          console.log(`🔑 属性 ${key}:`, {
            value: value,
            type: typeof value,
            descriptor: descriptor,
            isFunction: typeof value === 'function',
          });
        } catch (e) {
          console.log(`🔑 属性 ${key} 访问失败:`, e);
        }
      });

      // 检查原型链
      let proto = Object.getPrototypeOf(error);
      let level = 0;
      while (proto && level < 3) {
        console.log(`🧬 原型链 ${level}:`, proto.constructor?.name);
        const protoKeys = Object.getOwnPropertyNames(proto);
        console.log(`🧬 原型 ${level} 属性:`, protoKeys);
        proto = Object.getPrototypeOf(proto);
        level++;
      }
    }

    // 特殊错误类型检查
    console.log('🔍 特殊类型检查...');
    console.log('📋 是否 AbortError:', error?.name === 'AbortError');
    console.log('📋 是否 TimeoutError:', error?.name === 'TimeoutError');
    console.log('📋 是否 NetworkError:', error?.name === 'NetworkError');
    console.log('📋 是否包含 revert:', error?.toString?.()?.includes?.('revert'));

    // 检查是否是 Promise 相关错误
    if (error?.code) console.log('📋 错误代码:', error.code);
    if (error?.errno) console.log('📋 errno:', error.errno);
    if (error?.syscall) console.log('📋 syscall:', error.syscall);
  } catch (debugError) {
    console.error('🚨 调试工具本身出错:', debugError);
  } finally {
    console.groupEnd();
  }
};

// 专门针对 confirmError 的调试函数
export const logConfirmError = (confirmError: any, hash?: string, additionalContext?: any) => {
  console.group(`🚨 Transaction Confirmation Error 分析`);

  try {
    console.log('📋 交易Hash:', hash);
    console.log('📋 时间戳:', new Date().toISOString());
    console.log('📋 附加上下文:', additionalContext);

    if (!confirmError) {
      console.log('✅ confirmError 为空');
      return;
    }

    // 深度分析错误
    deepLogError(confirmError, 'confirmError');

    // 尝试分析错误类型
    console.log('🔍 错误类型分析:');

    // 检查是否是超时错误
    const errorString = confirmError?.toString?.() || '';
    const errorMessage = confirmError?.message || '';

    if (errorString.includes('timeout') || errorMessage.includes('timeout')) {
      console.log('⏰ 可能是超时错误');
    }

    if (errorString.includes('revert') || errorMessage.includes('revert')) {
      console.log('🔄 可能是交易回滚错误');
    }

    if (errorString.includes('insufficient') || errorMessage.includes('insufficient')) {
      console.log('💰 可能是余额不足错误');
    }

    if (errorString.includes('allowance') || errorMessage.includes('allowance')) {
      console.log('🔐 可能是授权不足错误 - 这就是你的问题！');
    }

    // 检查 wagmi/viem 特有的错误结构
    if (confirmError?.cause) {
      console.log('🎯 检查 cause 属性:');
      deepLogError(confirmError.cause, 'confirmError.cause');
    }

    if (confirmError?.details) {
      console.log('🎯 检查 details 属性:');
      console.log('Details:', confirmError.details);
    }

    if (confirmError?.data) {
      console.log('🎯 检查 data 属性:');
      console.log('Data:', confirmError.data);
    }
  } catch (debugError) {
    console.error('🚨 confirmError 调试失败:', debugError);
  } finally {
    console.groupEnd();
  }
};

// 原有的简单日志函数保留
export const logError = (error: any, context?: string) => {
  const prefix = context ? `[${context}]` : '';

  if (error instanceof Error) {
    console.error(`${prefix} Error Name:`, error.name);
    console.error(`${prefix} Error Message:`, error.message);
    console.error(`${prefix} Error Stack:`, error.stack);
    console.error(`${prefix} Error Cause:`, error.cause);
  } else if (typeof error === 'object' && error !== null) {
    console.error(`${prefix} Error Object:`, JSON.stringify(error, null, 2));
    console.error(`${prefix} Error Keys:`, Object.keys(error));

    // 尝试提取常见的错误属性
    if (error.message) console.error(`${prefix} Message:`, error.message);
    if (error.code) console.error(`${prefix} Code:`, error.code);
    if (error.reason) console.error(`${prefix} Reason:`, error.reason);
    if (error.data) console.error(`${prefix} Data:`, error.data);
  } else {
    console.error(`${prefix} Error:`, error);
  }
};

// 专门用于处理 wagmi/viem 错误的函数
export const logWeb3Error = (error: any, context?: string) => {
  deepLogError(error, context);

  // 额外处理 wagmi/viem 特有的错误信息
  if (error?.details) console.error(`[${context}] Details:`, error.details);
  if (error?.metaMessages) console.error(`[${context}] Meta Messages:`, error.metaMessages);
  if (error?.shortMessage) console.error(`[${context}] Short Message:`, error.shortMessage);
  if (error?.version) console.error(`[${context}] Version:`, error.version);
};
