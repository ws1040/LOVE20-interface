// 客户端环境检测工具函数

/**
 * 检查是否在客户端环境
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * 安全地获取window对象
 */
export const getWindow = (): Window | undefined => {
  return isClient() ? window : undefined;
};

/**
 * 检查是否有Web3钱包
 */
export const hasWeb3Wallet = (): boolean => {
  if (!isClient()) return false;

  const win = getWindow();
  return !!(win && win.ethereum);
};

/**
 * 安全地获取以太坊提供者
 */
export const getEthereumProvider = (): any => {
  if (!hasWeb3Wallet()) return null;

  const win = getWindow();
  return win?.ethereum || null;
};

/**
 * 检查MetaMask是否可用
 */
export const isMetaMaskAvailable = (): boolean => {
  const provider = getEthereumProvider();
  return !!(provider && provider.isMetaMask);
};

/**
 * 延迟执行函数，确保在客户端挂载后执行
 */
export const onClientReady = (callback: () => void): void => {
  if (isClient()) {
    // 如果已经在客户端，延迟执行以确保DOM完全加载
    setTimeout(callback, 0);
  }
};
