# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based decentralized web frontend for the LOVE20 Protocol, a blockchain governance and token system. The project uses:

- **Framework**: Next.js 15.3.3 with React 18.3.1
- **Web3**: wagmi 2.16.0 + viem 2.31.7 for Ethereum interactions
- **Styling**: TailwindCSS with DaisyUI and Radix UI components
- **State**: React Query (@tanstack/react-query) for data fetching
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: Yarn

## Development Commands

```bash
# Development server (runs on 0.0.0.0:3000)
yarn dev

# Production build
yarn build

# Test build (uses NODE_ENV=test)
yarn test

# Public test build (copies .env.public_test to .env.local)
yarn public-test

# Start production server
yarn start

# Generate ABI TypeScript files from Foundry contracts
yarn generate:abi

# Generate environment configuration
yarn generate:env
```

## Project Architecture

### Key Directories

- `src/pages/` - Next.js pages using Pages Router (not App Router)
- `src/components/` - Reusable React components organized by feature
- `src/hooks/` - Custom React hooks, especially contract interaction hooks
- `src/lib/` - Utility functions and shared logic
- `src/abis/` - Generated TypeScript ABI files from smart contracts
- `src/errors/` - Error mapping for smart contract errors
- `src/config/` - Configuration files (token configs, etc.)
- `scripts/` - Build and utility scripts

### Web3 Configuration

The application supports multiple blockchain networks configured via environment variables:

- **Chain Selection**: `NEXT_PUBLIC_CHAIN` environment variable selects the target blockchain
- **Supported Networks**: Ethereum mainnet, Sepolia, BSC testnet, Anvil local, Thinkium testnet/mainnet
- **wagmi Config**: Located in `src/wagmi.ts`, dynamically configures based on selected chain
- **Network Validation**: `src/lib/web3.ts` provides wallet network validation utilities

### Smart Contract Integration

- **ABI Generation**: Run `yarn generate:abi` to generate TypeScript ABIs from Foundry contract artifacts
- **Contract Hooks**: Custom hooks in `src/hooks/contracts/` wrap contract interactions using wagmi
- **Error Handling**: Contract-specific error mappings in `src/errors/` for better UX
- **Core Contracts**: LOVE20Token, LOVE20Vote, LOVE20Submit, LOVE20Join, etc.

### Component Organization

- **Common/**: Shared UI components (LoadingIcon, AlertBox, AddressWithCopyButton)
- **Token/**: Token-related components (TokenList, TokenTab, StTokenTab, SlTokenTab)
- **ActionList/**: Components for different action states (Voting, Verifying, Submitting)
- **My/**: User-specific panels (MyStakingPanel, MyVotingPanel, MyTokenPanel)
- **Launch/**: Token launch and deployment flows
- **Stake/**: Staking-related components and utilities

### ABI Organization

- **abi/**: This directory contains all smart contract ABI files (in JSON or TypeScript format), which are automatically generated from Foundry contract artifacts using `yarn generate:abi`. The frontend uses these ABIs to interact with smart contracts. Each core contract (such as LOVE20Token, LOVE20Vote, LOVE20Submit, LOVE20Join, etc.) has a corresponding ABI file, ensuring type safety and reliable contract method calls.

### Environment Configuration

- Uses multiple environment files: `.env.development`, `.env.public_test`, etc.
- Key variables: `NEXT_PUBLIC_CHAIN`, RPC URLs, Foundry ABI paths
- Environment generation script: `scripts/generate-env.js`

### State Management

- React Query for server state and caching
- wagmi for Web3 wallet and contract state
- React Hook Form for form state management
- Context providers for global state (ErrorContext, TokenContext)

## Development Workflow

1. **Environment Setup**: Ensure correct `.env.*` file is configured for target network
2. **Contract Updates**: After smart contract changes, run `yarn generate:abi` to update TypeScript ABIs
3. **Network Switching**: Update `NEXT_PUBLIC_CHAIN` environment variable to target different networks
4. **Testing**: Use `yarn test` for build validation; no traditional test framework detected
5. **Deployment**: Build with `yarn build` for production deployment

## Important Notes

- The project uses Pages Router, not App Router
- Static export mode is enabled (SSR disabled in wagmi config)
- Sentry is configured for error tracking
- The codebase includes Chinese comments and UI text
- Contract addresses and configurations are network-dependent via environment variables

## 项目统一规则

### Token信息获取规则
- 所有token相关信息（name, symbol, decimals等）统一使用 `const { token } = useContext(TokenContext)` 获取
- 禁止使用RPC调用获取token基础信息，TokenContext已提供完整的token数据

### 页面路由和URL结构规则  
- 统一使用 `symbol=${token.symbol}` 作为token标识参数
- 避免在URL中使用tokenAddress，提高URL可读性
- 行动相关页面使用 `id=${actionId}` 而不是 `actionId=${actionId}`
