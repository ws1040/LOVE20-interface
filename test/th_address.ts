/**
 * TH地址和0x地址转换演示
 * TKM链使用TH开头的地址格式，基于IBAN标准与以太坊0x地址互相转换
 *
 * 使用自定义的TKM IBAN实现，完全替代web3-eth-iban库
 */

import {
  addressToTH,
  thToAddress,
  normalizeAddressInput,
  isTHAddress,
  isValidEthAddress,
  formatAddressForDisplay,
  validateAddressInput,
} from '../src/lib/addressUtils';

/**
 * 智能转换地址格式
 * @param address 输入地址
 * @param targetType 目标格式：'TH' 或 '0x'
 * @returns 转换后的地址
 */
function transformAddress(address: string, targetType: 'TH' | '0x'): string {
  if (!address || address === '') {
    return '';
  }

  // 判断是否为IBAN格式（以TH开头）或0x格式
  const isTH = /^TH/i.test(address);

  if (targetType === 'TH' && !isTH) {
    // 当前是0x地址，转换为TH地址
    return addressToTH(address);
  }

  if (targetType === '0x' && isTH) {
    // 当前是TH地址，转换为0x地址
    return thToAddress(address);
  }

  // 已经是目标格式，直接返回
  return address;
}

// 演示函数
function demo() {
  console.log('=== TKM链TH地址和0x地址转换演示 ===\n');
  console.log('使用自定义TKM IBAN实现，无需web3-eth-iban库\n');

  // 测试地址
  const testEthAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

  console.log('1. 0x地址转TH地址：');
  console.log(`输入: ${testEthAddress}`);
  try {
    const convertedTH = addressToTH(testEthAddress);
    console.log(`输出: ${convertedTH}`);
    console.log(`验证TH地址有效性: ${isTHAddress(convertedTH)}`);

    // 再转换回来验证
    const convertedBack = thToAddress(convertedTH);
    console.log(`转换回0x: ${convertedBack}`);
    console.log(`往返转换是否一致: ${testEthAddress.toLowerCase() === convertedBack}`);
  } catch (error) {
    console.log(`转换失败: ${error}`);
  }
  console.log('');

  console.log('2. 地址验证演示：');
  console.log(`${testEthAddress} 是有效0x地址: ${isValidEthAddress(testEthAddress)}`);
  console.log(`无效地址验证: ${isTHAddress('INVALID_ADDRESS')}`);
  console.log('');

  console.log('3. 智能转换演示：');
  console.log(`将0x地址转为TH格式: ${transformAddress(testEthAddress, 'TH')}`);
  const thAddr = addressToTH(testEthAddress);
  if (thAddr) {
    console.log(`将TH地址转为0x格式: ${transformAddress(thAddr, '0x')}`);
  }
  console.log('');

  console.log('4. 用户输入标准化演示（转账功能常用）：');
  const testInputs = [
    testEthAddress,
    testEthAddress.toUpperCase(),
    '  ' + testEthAddress + '  ', // 有空格
    addressToTH(testEthAddress), // TH格式
    'invalid_address',
  ];

  testInputs.forEach((input, index) => {
    if (input) {
      const normalized = normalizeAddressInput(input);
      console.log(`输入${index + 1}: "${input}" -> 标准化: "${normalized}"`);
    }
  });
  console.log('');

  console.log('5. 地址验证功能演示：');
  const addressesToValidate = [
    testEthAddress,
    testEthAddress.toUpperCase(),
    addressToTH(testEthAddress),
    'TH48000000000000000000000000001EKI', // 特殊地址
    '0xinvalid',
    'THinvalid',
    '',
  ];

  addressesToValidate.forEach((addr, index) => {
    const error = validateAddressInput(addr);
    console.log(`地址${index + 1}: "${addr}" -> ${error ? `错误: ${error}` : '✅ 有效'}`);
  });
  console.log('');

  console.log('6. 地址显示格式演示：');
  console.log(`完整格式: ${formatAddressForDisplay(testEthAddress, 'full')}`);
  console.log(`缩写格式: ${formatAddressForDisplay(testEthAddress, 'short')}`);
  console.log(`TH格式: ${formatAddressForDisplay(testEthAddress, 'th')}`);
  console.log('');

  console.log('7. 实际项目使用建议：');
  console.log(`
// 在转账组件中使用
const handleAddressInput = (userInput: string) => {
  const standardAddress = normalizeAddressInput(userInput);
  if (standardAddress) {
    // 使用标准化的0x地址进行转账
    setRecipientAddress(standardAddress);
  } else {
    // 提示用户地址格式错误
    const error = validateAddressInput(userInput);
    showError(error || '地址格式错误');
  }
};

// 在组件中显示友好的地址格式
const displayAddress = (address: string) => {
  return formatAddressForDisplay(address, 'th') || formatAddressForDisplay(address, 'short');
};

// 检查是否为TH地址
const checkTHAddress = (address: string) => {
  return isTHAddress(address);
};
  `);
}

// 导出工具函数
export { transformAddress, demo };

// 如果直接运行此文件，执行演示
if (require.main === module) {
  demo();
}
