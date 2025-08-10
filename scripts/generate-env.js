const fs = require('fs');
const path = require('path');

/**
 * 地址映射规则：从 address.params 的键名映射到 .env 的键名
 */
const ADDRESS_MAPPING = {
  rootParentTokenAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_ROOT_PARENT_TOKEN',
  uniswapV2FactoryAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_UNISWAP_V2_FACTORY',
  tokenFactoryAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_TOKEN_FACTORY',
  launchAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_LAUNCH',
  stakeAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE',
  submitAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_SUBMIT',
  voteAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_VOTE',
  joinAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_JOIN',
  randomAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_RANDOM',
  verifyAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_VERIFY',
  mintAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_MINT',
  firstTokenAddress: 'NEXT_PUBLIC_CONTRACT_ADDRESS_FIRST_TOKEN',
};

/**
 * 读取指定项目目录和网络下的 address.params 文件并生成环境变量配置
 * @param {string} projectDir - 项目A的根目录路径
 * @param {string} network - 网络名称
 */
function generateEnvFromAddress(projectDir, network) {
  const addressPath = path.join(projectDir, 'script/network', network, 'address.params');

  try {
    // 检查文件是否存在
    if (!fs.existsSync(addressPath)) {
      console.error(`错误: 地址文件不存在 - ${addressPath}`);
      return;
    }

    // 读取 address.params 文件
    const addressContent = fs.readFileSync(addressPath, 'utf8');
    const lines = addressContent.split('\n');

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // 跳过注释和空行
      if (trimmedLine.startsWith('#') || !trimmedLine) {
        return;
      }

      // 解析键值对
      const equalIndex = trimmedLine.indexOf('=');
      if (equalIndex === -1) {
        return; // 跳过没有等号的行
      }

      const key = trimmedLine.substring(0, equalIndex).trim();
      const value = trimmedLine.substring(equalIndex + 1).trim();

      // 检查是否在映射规则中
      if (ADDRESS_MAPPING[key]) {
        console.log(`${ADDRESS_MAPPING[key]}=${value}`);
      }
    });
  } catch (error) {
    console.error('读取 address.params 文件时出错:', error.message);
  }
}

/**
 * 读取指定项目目录和网络下的 LOVE20.params 文件并生成环境变量配置
 * @param {string} projectDir - 项目A的根目录路径
 * @param {string} network - 网络名称 (如: sepolia, bsc.testnet, amoy等)
 */
function generateEnvFromParams(projectDir, network) {
  // 构建 LOVE20.params 文件的完整路径
  const paramsPath = path.join(projectDir, 'script/network', network, 'LOVE20.params');

  // 需要查找的关键词列表
  const targetKeywords = [
    'FIRST_TOKEN_SYMBOL',
    'PHASE_BLOCKS',
    'LAUNCH_AMOUNT',
    'PARENT_TOKEN_FUNDRAISING_GOAL',
    'WITHDRAW_WAITING_BLOCKS',
    'MIN_GOV_REWARD_MINTS_TO_LAUNCH',
    'JOIN_END_PHASE_BLOCKS',
    'PROMISED_WAITING_PHASES_MIN',
    'PROMISED_WAITING_PHASES_MAX',
    'SUBMIT_MIN_PER_THOUSAND',
    'ACTION_REWARD_MIN_VOTE_PER_THOUSAND',
    'ROUND_REWARD_GOV_PER_THOUSAND',
    'ROUND_REWARD_ACTION_PER_THOUSAND',
  ];

  try {
    // 检查文件是否存在
    if (!fs.existsSync(paramsPath)) {
      console.error(`错误: 文件不存在 - ${paramsPath}`);
      console.error(`请确认项目目录和网络名称是否正确`);
      process.exit(1);
    }

    // 读取 LOVE20.params 文件
    const paramsContent = fs.readFileSync(paramsPath, 'utf8');
    const lines = paramsContent.split('\n');

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // 跳过注释和空行
      if (trimmedLine.startsWith('#') || !trimmedLine) {
        return;
      }

      // 检查是否包含目标关键词
      for (const keyword of targetKeywords) {
        if (trimmedLine.includes(keyword)) {
          // 输出时在行前添加 NEXT_PUBLIC_ 前缀
          console.log(`NEXT_PUBLIC_${trimmedLine}`);
          break; // 找到一个关键词就跳出循环
        }
      }
    });
  } catch (error) {
    console.error('读取 LOVE20.params 文件时出错:', error.message);
    process.exit(1);
  }
}

/**
 * 主函数：读取两个文件并生成环境变量
 * @param {string} projectDir - 项目A的根目录路径
 * @param {string} network - 网络名称
 */
function generateEnvFiles(projectDir, network) {
  console.log(`# 从 ${projectDir}/script/network/${network}/ 生成环境变量配置`);
  console.log(`# 生成时间: ${new Date().toISOString()}`);
  console.log('');

  // 先生成 LOVE20.params 的配置
  console.log('# LOVE20 参数');
  generateEnvFromParams(projectDir, network);

  console.log('');

  // 再生成 address.params 的配置
  console.log('# 合约地址');
  generateEnvFromAddress(projectDir, network);
}

// 如果直接运行此脚本
if (require.main === module) {
  // 获取命令行参数
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('用法: node generate-env.js <项目目录> <网络名称>');
    console.error('示例: node generate-env.js /path/to/LOVE20core sepolia');
    console.error('支持的网络: sepolia, bsc.testnet, amoy, anvil, thinkium801, thinkium801_dev');
    process.exit(1);
  }

  const [projectDir, network] = args;

  // 验证项目目录是否存在
  if (!fs.existsSync(projectDir)) {
    console.error(`错误: 项目目录不存在 - ${projectDir}`);
    process.exit(1);
  }

  // 验证网络目录是否存在
  const networkDir = path.join(projectDir, 'script/network', network);
  if (!fs.existsSync(networkDir)) {
    console.error(`错误: 网络目录不存在 - ${networkDir}`);
    console.error('支持的网络: sepolia, bsc.testnet, amoy, anvil, thinkium801, thinkium801_dev');
    process.exit(1);
  }

  generateEnvFiles(projectDir, network);
}

module.exports = { generateEnvFromParams, generateEnvFromAddress, generateEnvFiles };
