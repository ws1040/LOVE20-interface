const fs = require('fs');
const path = require('path');

/**
 * 读取 LOVE20.params 文件并生成环境变量配置
 */
function generateEnvFromParams() {
  const paramsPath = path.join(__dirname, '..', 'LOVE20.params');

  // 需要查找的关键词列表
  const targetKeywords = [
    'FIRST_TOKEN_SYMBOL',
    'PHASE_BLOCKS',
    'WITHDRAW_WAITING_BLOCKS',
    'JOIN_END_PHASE_BLOCKS',
    'PROMISED_WAITING_PHASES_MIN',
    'PROMISED_WAITING_PHASES_MAX',
    'SUBMIT_MIN_PER_THOUSAND',
    'ROUND_REWARD_GOV_PER_THOUSAND',
    'ROUND_REWARD_ACTION_PER_THOUSAND',
  ];

  try {
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

// 如果直接运行此脚本
if (require.main === module) {
  generateEnvFromParams();
}

module.exports = { generateEnvFromParams };
