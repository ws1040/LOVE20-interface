// Help:
// npx tsx test/test-scientific-notation.ts

// 测试科学记数法转换的关键场景
import { formatTokenAmount } from '../src/lib/format';
import { safeToBigInt } from '../src/lib/clientUtils';

console.log('=== 测试科学记数法转换修复 ===');

// 测试环境变量中的问题案例
const testCases = [
  { value: '2E+25', desc: '环境变量中的科学记数法' },
  { value: '2e+25', desc: '小写科学记数法' },
  { value: '1.5E+20', desc: '带小数的科学记数法' },
  { value: '0', desc: '零值' },
  { value: '1000000000000000000', desc: '普通大数' },
];

testCases.forEach(({ value, desc }) => {
  try {
    const bigintValue = safeToBigInt(value);
    const formatted = formatTokenAmount(bigintValue);
    console.log(`✅ ${desc}: "${value}" -> "${formatted}"`);
  } catch (error) {
    console.log(`❌ ${desc}: "${value}" -> ERROR: ${error}`);
  }
});

console.log('\n=== 专门测试原始问题场景 ===');
const envValue = process.env.NEXT_PUBLIC_PARENT_TOKEN_FUNDRAISING_GOAL ?? '2E+25';
console.log(`环境变量值: ${envValue}`);

try {
  const result = formatTokenAmount(safeToBigInt(envValue));
  console.log(`✅ 成功: formatTokenAmount(safeToBigInt('${envValue}')) = "${result}"`);
} catch (error) {
  console.log(`❌ 失败: ${error}`);
}
