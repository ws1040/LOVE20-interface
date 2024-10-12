import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, bscTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({

  appName: 'Life20 DApp',
  projectId: '3e08c0ee570fce9c29473eb34b0532c3',

  chains: [

    mainnet,

    ...(process.env.NEXT_PUBLIC_ENABLE_DEV_CHAINS === 'true'
      ? [
          {
            id: 31337,
            name: 'Anvil',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: [
                  process.env.NEXT_PUBLIC_ANVIL_RPC_URL ||
                    'http://127.0.0.1:8545',
                ],
              },
              public: {
                http: [
                  process.env.NEXT_PUBLIC_ANVIL_RPC_URL ||
                    'http://127.0.0.1:8545',
                ],
              },
            },
            blockExplorers: {
              default: {
                name: 'Anvil Explorer',
                url:
                  process.env.NEXT_PUBLIC_ANVIL_RPC_URL ||
                  'http://127.0.0.1:8545',
              },
            },
            testnet: true,
          },
        ]
      : []),

    ...(process.env.NEXT_PUBLIC_ENABLE_TEST_CHAINS === 'true' ? [sepolia, bscTestnet] : []),

  ],
  ssr: true,
});