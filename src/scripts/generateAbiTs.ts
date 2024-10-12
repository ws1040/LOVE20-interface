// src/scripts/generateAbiTs.ts
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // 引入 dotenv 库以读取 .env 文件

// 源目录
const abiDirPath = process.env.NEXT_PUBLIC_FOUNDRY_ABI_PATH;
if (!abiDirPath) {
  console.error('Error: NEXT_PUBLIC_FOUNDRY_ABI_PATH is not defined in .env file.');
  process.exit(1);
}

// 指定要转换的文件名列表
const filesToConvert = ['LOVE20Join', 'LOVE20Launch', 'LOVE20Mint', 'LOVE20Random', 'LOVE20SLToken', 'LOVE20STToken', 'LOVE20Stake', 'LOVE20Submit', 'LOVE20Token', 'LOVE20Verify', 'LOVE20Vote', 'WETH9','UniswapV2ERC20', 'UniswapV2Factory', 'UniswapV2Pair'];

// 遍历文件名列表，进行转换
filesToConvert.forEach((fileName) => {
  const abiJsonPath = path.resolve(abiDirPath, `${fileName}.sol/${fileName}.json`);
  const abiTsPath = path.resolve(__dirname, '../abis', `${fileName}.ts`);

  // 检查 ABI JSON 文件是否存在
  if (!fs.existsSync(abiJsonPath)) {
    console.error(`Error: ${abiJsonPath} does not exist.`);
    return;
  }

  // 读取并解析 ABI JSON 文件
  const abiJson = JSON.parse(fs.readFileSync(abiJsonPath, 'utf-8'));

  // 生成 TypeScript 文件的内容
  const content = `
import { Abi } from 'abitype';

export const ${fileName.charAt(0).toLowerCase() + fileName.slice(1)}Abi = ${JSON.stringify(
    abiJson.abi || abiJson,
    null,
    2
  )} as const satisfies Abi;
`;

  // 将内容写入到 .ts 文件
  fs.writeFileSync(abiTsPath, content);

  console.log(`${fileName}.ts generated successfully.`);
});