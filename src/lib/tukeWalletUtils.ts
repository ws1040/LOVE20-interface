// src/lib/tukeWalletUtils.ts
import { ethers } from 'ethers';

export const isTukeWallet = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (!window.ethereum) return false;

  const ethereum = window.ethereum as any;

  if (ethereum.isTuke) {
    console.log('检测到TUKE钱包：isTuke标识');
    return true;
  }
  if (ethereum.isTrust) {
    console.log('检测到TUKE钱包：isTrust标识');
    return true;
  }

  const isMetaMask = ethereum.isMetaMask;
  const isWalletConnect = ethereum.isWalletConnect;
  const isCoinbaseWallet = ethereum.isCoinbaseWallet;
  if (!isMetaMask && !isWalletConnect && !isCoinbaseWallet) {
    console.log('检测到不是metamask等主流钱包，认为是TUKE钱包：isTuke标识');
    return true;
  }

  console.log('未检测到TUKE钱包，使用标准模式');
  return false;
};

export const sendTransactionForTuke = async (
  abi: readonly any[] | any[],
  address: `0x${string}`,
  functionName: string,
  args: any[] = [],
  value?: bigint,
) => {
  try {
    console.log('address:', address);
    console.log('functionName:', functionName);
    console.log('args:', args);

    if (!window.ethereum) {
      throw new Error('没有检测到 window.ethereum 对象');
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);

    // 转换参数：将BigInt转换为ethers.BigNumber
    const ethersArgs = args.map((arg) => {
      if (typeof arg === 'bigint') {
        const converted = ethers.BigNumber.from(arg.toString());
        return converted;
      }
      return arg;
    });
    console.log('ethersArgs:', ethersArgs);

    const overrides: any = {};
    if (value && value > 0n) {
      overrides.value = ethers.BigNumber.from(value.toString());
      console.log('添加value:', overrides.value.toString());
    }

    // try {
    //   // 尝试手动设置gas限制
    //   overrides.gasLimit = ethers.BigNumber.from('1000000'); // 100万gas，通常足够
    //   overrides.gasPrice = await provider.getGasPrice();
    //   console.log('手动设置gas:', {
    //     gasLimit: overrides.gasLimit.toString(),
    //     gasPrice: overrides.gasPrice.toString(),
    //   });
    // } catch (gasError) {
    //   console.warn('获取gas价格失败，使用默认值:', gasError);
    //   overrides.gasLimit = ethers.BigNumber.from('1000000');
    // }

    // 发送交易
    console.log('发送交易请求...');
    console.log(`调用: contract.${functionName}(...args, overrides)`);
    const tx = await contract[functionName](...ethersArgs, overrides);
    console.log('tx:', tx);
    console.log('tx.hash:', tx.hash);

    return tx.hash as `0x${string}`;
  } catch (error: any) {
    console.error('TUKE ethers交易发送失败:');
    console.error('错误类型:', typeof error);
    console.error('错误对象:', error);

    if (error.code === 4001) {
      console.error('用户取消了交易');
      throw new Error('用户取消了交易');
    } else if (error.code) {
      console.error('错误代码:', error.code);
      console.error('错误消息:', error.message || error.reason);
      console.error('错误数据:', error.data);
    }

    // 重新抛出原始错误
    throw error;
  }
};

export const waitForTukeTransaction = async (txHash: string) => {
  try {
    console.log('等待TUKE交易确认:', txHash);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const receipt = await provider.waitForTransaction(txHash);

    console.log('TUKE交易已确认！');
    console.log('区块号:', receipt.blockNumber);
    console.log('Gas使用量:', receipt.gasUsed.toString());
    console.log('交易收据:', receipt);

    return receipt;
  } catch (error) {
    console.error('❌ TUKE交易确认失败:', error);
    throw error;
  }
};
