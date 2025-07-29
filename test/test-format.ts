// Help:
// npx tsx test/test-format.ts

// 简单的测试文件来测试 formatTokenAmount 函数
import { formatTokenAmount } from '../src/lib/format';

console.log('formatTokenAmount(1000000000000000000) =', formatTokenAmount(1000000000000000000n)); // 1 ETH
console.log('formatTokenAmount(100000000000000000) =', formatTokenAmount(100000000000000000n)); // 0.1 ETH
console.log('formatTokenAmount(10000000000000000) =', formatTokenAmount(10000000000000000n)); // 0.01 ETH
console.log('formatTokenAmount(1000000000000000) =', formatTokenAmount(1000000000000000n)); // 0.001 ETH
console.log('formatTokenAmount(100000000000000) =', formatTokenAmount(100000000000000n)); // 0.0001 ETH
console.log('formatTokenAmount(10000000000000) =', formatTokenAmount(10000000000000n)); // 0.00001 ETH
console.log('formatTokenAmount(200) =', formatTokenAmount(200n)); // 200 wei
console.log('formatTokenAmount(1) =', formatTokenAmount(1n)); // 1 wei
console.log('formatTokenAmount(100) =', formatTokenAmount(100n)); // 100 wei
console.log('formatTokenAmount(1000) =', formatTokenAmount(1000n)); // 1000 wei
