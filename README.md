# LOVE20-interface

Decentralized web frontend of LOVE20 Protocal

## Tech Stack

This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](/packages/create-rainbowkit).

## Getting Started

First, install the dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Configuration

DAPP 使用了 WalletConnect，并提供了一个默认 WalletConnect Cloud Project ID。若要使用自己的 Project ID，您可以在 [WalletConnect Cloud](https://cloud.walletconnect.com) 创建账户并获取项目 ID，并在项目根目录下 `.env.development` 文件修改以下配置：

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=Your WalletConnect Project ID
```
