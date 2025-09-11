// test/test-error.ts
import { getErrorNameFromSelector } from '@/src/errors';
import { getReadableRevertErrMsg } from '../src/lib/errorUtils';

// 模拟错误对象
const mockError = {
  message: `Stake failed ContractFunctionExecutionError: Data size of 4 bytes is too small for given parameters.

Params: (uint256 govVotesAdded, uint256 slAmountAdded)
Data:   0xbb55fd27 (4 bytes)
 
Contract Call:
  address:   0xb8003E373bfb3A5d96d2D0cE334FAc0b79Cd6833
  function:  stakeLiquidity(address tokenAddress, uint256 tokenAmountForLP, uint256 parentTokenAmountForLP, uint256 promisedWaitingPhases, address to)
  args:                    (0x717dADA4a22282d636B0D3B20bf0a5557b77DCF3, 19999606000000, 10000000000000, 1, 0xE2D5ba089c32298B45A9DB9508fB84004C825C65)
  sender:    0xE2D5ba089c32298B45A9DB9508fB84004C825C65`,
};

// 测试函数
function testErrorHandling() {
  console.log('=== 开始测试错误处理逻辑 ===\n');

  // 1. 测试错误选择器提取
  console.log('1. 测试错误选择器提取:');
  const selector = '0xbb55fd27';
  console.log(`错误选择器: ${selector}`);

  // 2. 测试从选择器获取错误名称
  console.log('\n2. 测试从选择器获取错误名称:');

  // 测试不同的合约上下文
  const contractKeys = ['stake', 'slToken', 'token', 'common'];

  contractKeys.forEach((key) => {
    const errorName = getErrorNameFromSelector(selector, key);
    console.log(`合约上下文 '${key}': ${errorName || '未找到'}`);
  });

  // 3. 测试完整的错误处理流程
  console.log('\n3. 测试完整的错误处理流程:');

  contractKeys.forEach((key) => {
    console.log(`\n--- 使用合约上下文 '${key}' ---`);
    const result = getReadableRevertErrMsg(mockError.message, key);
    if (result === null) {
      console.log(`结果: 用户取消交易，不作为错误处理`);
    } else {
      console.log(`结果: ${JSON.stringify(result, null, 2)}`);
    }
  });

  // 4. 测试用户取消交易的情况
  console.log('\n4. 测试用户取消交易的情况:');

  const userCancelCases = [
    // MetaMask 格式
    'TransactionExecutionError: User rejected the request.',
    'User denied transaction signature',
    'User rejected the request',
    'Error: User denied transaction signature',
    // TrustWallet 格式
    'Error: cancel',
    'cancel',
    // 其他可能的格式
    'User denied',
    'User rejected',
  ];

  userCancelCases.forEach((userCancelError) => {
    console.log(`\n测试用例: "${userCancelError}"`);
    const result = getReadableRevertErrMsg(userCancelError, 'test');
    if (result === null) {
      console.log('✅ 正确识别为用户取消，不作为错误处理');
    } else {
      console.log('❌ 未正确识别为用户取消:', JSON.stringify(result, null, 2));
    }
  });
}

// 运行测试
testErrorHandling();
