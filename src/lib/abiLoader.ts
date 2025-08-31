/**
 * ABI 懒加载工具
 * 只在需要时才加载大型 ABI 文件，减少初始编译时间
 */

import { Abi } from 'abitype';

// 延迟加载的 ABI 缓存
const abiCache = new Map<string, Promise<Abi>>();

/**
 * 懒加载 ABI 文件
 * @param abiName ABI 文件名
 * @returns Promise<Abi>
 */
export async function loadAbi(abiName: string): Promise<Abi> {
  if (abiCache.has(abiName)) {
    return abiCache.get(abiName)!;
  }

  const abiPromise = (async () => {
    try {
      const module = await import(`../abis/${abiName}`);
      const abiExportName = `${abiName}Abi`;

      if (!module[abiExportName]) {
        throw new Error(`ABI export ${abiExportName} not found in ${abiName}`);
      }

      return module[abiExportName] as Abi;
    } catch (error) {
      console.error(`Failed to load ABI ${abiName}:`, error);
      throw error;
    }
  })();

  abiCache.set(abiName, abiPromise);
  return abiPromise;
}

// 预定义的 ABI 名称，提供类型安全
export type AbiName =
  | 'LOVE20Hub'
  | 'LOVE20Join'
  | 'LOVE20Launch'
  | 'LOVE20Mint'
  | 'LOVE20MintViewer'
  | 'LOVE20Random'
  | 'LOVE20RoundViewer'
  | 'LOVE20SLToken'
  | 'LOVE20Stake'
  | 'LOVE20STToken'
  | 'LOVE20Submit'
  | 'LOVE20Token'
  | 'LOVE20TokenViewer'
  | 'LOVE20Verify'
  | 'LOVE20Vote'
  | 'UniswapV2ERC20'
  | 'UniswapV2Factory'
  | 'UniswapV2Pair'
  | 'UniswapV2Router'
  | 'WETH9';

/**
 * 类型安全的 ABI 加载器
 * @param abiName 预定义的 ABI 名称
 * @returns Promise<Abi>
 */
export function loadTypedAbi(abiName: AbiName): Promise<Abi> {
  return loadAbi(abiName);
}

/**
 * 批量预加载常用的 ABI
 * 可以在应用启动时调用以提前加载关键 ABI
 */
export async function preloadCriticalAbis(): Promise<void> {
  const criticalAbis: AbiName[] = ['LOVE20Token', 'LOVE20Hub', 'LOVE20Join', 'LOVE20Launch'];

  await Promise.all(criticalAbis.map((abiName) => loadTypedAbi(abiName)));
}

/**
 * 清除 ABI 缓存（主要用于测试）
 */
export function clearAbiCache(): void {
  abiCache.clear();
}
