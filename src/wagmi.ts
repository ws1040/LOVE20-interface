// wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain, mainnet, sepolia, bscTestnet } from 'wagmi/chains';

// 定义自定义链 Anvil
const anvil: Chain = {
  id: 31337,
  name: 'Anvil',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ANVIL_RPC_URL || 'http://127.0.0.1:8545'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_ANVIL_RPC_URL || 'http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'Anvil Explorer', url: process.env.NEXT_PUBLIC_ANVIL_RPC_URL || 'http://127.0.0.1:8545' },
  },
  testnet: true,
};

// 映射链名称到链配置
const CHAIN_MAP: Record<string, Chain> = {
  mainnet: mainnet,
  sepolia: sepolia,
  bscTestnet: bscTestnet,
  anvil: anvil,
};

// 从环境变量中获取所选的链名称
const selectedChainName = process.env.NEXT_PUBLIC_CHAIN || 'mainnet';

// 获取对应的链配置，如果未找到则默认使用 mainnet
const selectedChain = CHAIN_MAP[selectedChainName] || mainnet;

export const config = getDefaultConfig({
  appName: 'Life20 DApp',

  // WalletConnect Cloud Project ID
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

  chains: [selectedChain],

  // 启用服务器端渲染（SSR）
  ssr: true,
});
