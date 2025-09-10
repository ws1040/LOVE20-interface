// Help:
// npx tsx test/test-format.ts

// 简单的测试文件来测试 formatTokenAmount 函数
import { formatTokenAmount } from '../src/lib/format';

console.log('formatTokenAmount(1000000000000000000) =', formatTokenAmount(BigInt(1000000000000000000))); // 1 ETH
console.log('formatTokenAmount(1000000000000000000-1) =', formatTokenAmount(BigInt(1000000000000000000) - BigInt(1))); // 0.999999999999999999 ETH
console.log('formatTokenAmount(100000000000000000) =', formatTokenAmount(BigInt(100000000000000000))); // 0.1 ETH
console.log('formatTokenAmount(10000000000000000) =', formatTokenAmount(BigInt(10000000000000000))); // 0.01 ETH
console.log('formatTokenAmount(1000000000000000) =', formatTokenAmount(BigInt(1000000000000000))); // 0.001 ETH
console.log('formatTokenAmount(100000000000000) =', formatTokenAmount(BigInt(100000000000000))); // 0.0001 ETH
console.log('formatTokenAmount(10000000000000) =', formatTokenAmount(BigInt(10000000000000))); // 0.00001 ETH
console.log('formatTokenAmount(200) =', formatTokenAmount(BigInt(200))); // 200 wei
console.log('formatTokenAmount(1) =', formatTokenAmount(BigInt(1))); // 1 wei
console.log('formatTokenAmount(100) =', formatTokenAmount(BigInt(100))); // 100 wei
console.log('formatTokenAmount(1000) =', formatTokenAmount(BigInt(1000))); // 1000 wei
