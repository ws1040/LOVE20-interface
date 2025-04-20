// wagmi.ts
import { createStorage, createConfig, http } from 'wagmi';
import { Chain, mainnet, sepolia, bscTestnet } from 'wagmi/chains';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

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

// 定义自定义链 Thinkium Test
const thinkium801: Chain = {
  id: 801,
  name: 'thinkium801',
  nativeCurrency: { name: 'TestTKM', symbol: 'TKM', decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_THINKIUM_RPC_URL || 'https://rpc-testnet.ruleos.com'] } },
  testnet: true,
};

// 映射链名称到链配置
const CHAIN_MAP: Record<string, Chain> = {
  mainnet: mainnet,
  sepolia: sepolia,
  bscTestnet: bscTestnet,
  anvil: anvil,
  thinkium801: thinkium801,
};

// 从环境变量中获取所选的链名称
const selectedChainName = process.env.NEXT_PUBLIC_CHAIN || 'mainnet';

// 获取对应的链配置，如果未找到则默认使用 mainnet
const selectedChain = CHAIN_MAP[selectedChainName] || mainnet;

// 通过 RainbowKit 获取连接器
const { connectors } = getDefaultWallets({
  appName: 'LOVE20 DAPP',

  // WalletConnect Cloud Project ID
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
});

// 创建存储
const storage = createStorage({
  key: 'LOVE20-dapp',
  storage: typeof window !== 'undefined' ? localStorage : undefined,
});

// 创建配置
export const config = createConfig({
  connectors,
  storage,
  chains: [selectedChain],
  transports:
    selectedChain.id === sepolia.id
      ? {
          [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://eth-sepolia.api.onfinality.io/public'),
        }
      : {
          [selectedChain.id]: http(selectedChain.rpcUrls.default.http[0]),
        },
  ssr: false, // 如果需要服务器端渲染
});
