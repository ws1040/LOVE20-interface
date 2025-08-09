'use client';

import { useContext, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits as viemFormatUnits } from 'viem';

// ui
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HandCoins, Info, TableOfContents, Pickaxe, Blocks, BarChart2, Users, Rocket } from 'lucide-react';

// my context
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';

// my hooks
import { useTokenStatistics } from '@/src/hooks/contracts/useLOVE20RoundViewer';
import { useLaunchInfo } from '@/src/hooks/contracts/useLOVE20Launch';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { formatPercentage } from '@/src/lib/format';

// 简单的字段组件
function Field({ label, value, percentage }: { label: string; value: string; percentage?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm text-muted-foreground font-mono">{label}</div>
      <div className="text-sm font-medium break-all text-secondary font-mono">
        {value}
        {percentage && <span className="text-sm text-muted-foreground ml-1">({percentage})</span>}
      </div>
    </div>
  );
}

// 地址展示卡片
function AddressItem({ name, address }: { name: string; address?: string }) {
  return (
    <div className="rounded-lg">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm">{name}</div>
        <AddressWithCopyButton address={address as `0x${string}`} />
      </div>
    </div>
  );
}

// 数字格式化（带千分位）
function formatBigIntWithCommas(v?: bigint) {
  if (v === undefined || v === null) return '0';
  const s = v.toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 金额格式化：使用当前 token 的 decimals
function formatAmount(value?: bigint, decimals?: number, symbol?: string) {
  if (value === undefined || value === null) return '0';
  const d = typeof decimals === 'number' ? decimals : 18;
  const str = viemFormatUnits(value, d);
  // 默认按 0/2/4 的常用小数展示，并尽量短
  const num = Number(str);
  let formatted: string;
  if (num === 0) formatted = '0';
  else if (Math.abs(num) >= 1000) formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
  else if (Math.abs(num) >= 10) formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
  else formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(num);
  return symbol ? `${formatted} ${symbol}` : formatted;
}

const TokenPage = () => {
  const { isConnected } = useAccount();
  const { token: currentToken } = useContext(TokenContext) || {};

  const {
    tokenStatistics,
    error: errorTokenStatistics,
    isPending: isPendingTokenStatistics,
  } = useTokenStatistics((currentToken?.address as `0x${string}`) || '0x0000000000000000000000000000000000000000');

  const {
    launchInfo,
    error: errorLaunchInfo,
    isPending: isPendingLaunchInfo,
  } = useLaunchInfo((currentToken?.address as `0x${string}`) || '0x0000000000000000000000000000000000000000');

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorTokenStatistics) handleContractError(errorTokenStatistics, 'roundViewer');
    if (errorLaunchInfo) handleContractError(errorLaunchInfo, 'launch');
  }, [errorTokenStatistics, errorLaunchInfo]);

  const decimals = currentToken?.decimals ?? 18;
  const symbol = currentToken?.symbol ?? '';
  const parentSymbol = currentToken?.parentTokenSymbol ?? '';

  // 代币统计（变量命名与 TokenStats 保持一致）
  const maxSupply = tokenStatistics?.maxSupply ?? 0n;
  const totalSupply = tokenStatistics?.totalSupply ?? 0n;
  const reservedAvailable = tokenStatistics?.reservedAvailable ?? 0n;
  const rewardAvailable = tokenStatistics?.rewardAvailable ?? 0n;
  const stakedTokenAmountForSt = tokenStatistics?.stakedTokenAmountForSt ?? 0n;
  const joinedTokenAmount = tokenStatistics?.joinedTokenAmount ?? 0n;
  const tokenAmountForSl = tokenStatistics?.tokenAmountForSl ?? 0n;
  const parentPool = tokenStatistics?.parentPool ?? 0n;
  const finishedRounds = tokenStatistics?.finishedRounds ?? 0n;
  const actionsCount = tokenStatistics?.actionsCount ?? 0n;
  const joiningActionsCount = tokenStatistics?.joiningActionsCount ?? 0n;

  const unminted = maxSupply > totalSupply ? maxSupply - totalSupply : 0n;
  const otherBalance = totalSupply - joinedTokenAmount - tokenAmountForSl - stakedTokenAmountForSt;

  // 发射区块
  const startBlock = launchInfo?.startBlock;
  const endBlock = launchInfo?.endBlock;

  // 常量合约地址（来自环境变量）
  const constantsAddresses = {
    TokenFactory: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_TOKEN_FACTORY,
    Launch: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_LAUNCH,
    Stake: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_STAKE,
    Vote: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_VOTE,
    Join: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_JOIN,
    Verify: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_VERIFY,
    Mint: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MINT,
    Random: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_RANDOM,
  } as const;

  // 当前代币相关地址
  const currentAddresses = {
    token: currentToken?.address,
    parent: currentToken?.parentTokenAddress,
    sl: currentToken?.slTokenAddress,
    st: currentToken?.stTokenAddress,
    pair: currentToken?.uniswapV2PairAddress,
  } as const;

  if (isPendingTokenStatistics || isPendingLaunchInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <>
      <Header title="代币首页" />
      <main className="flex-grow">
        {!isConnected ? (
          <div className="flex flex-col items-center p-4 mt-4">
            <div className="text-center mb-4 text-greyscale-500">没有链接钱包，请先连接钱包</div>
          </div>
        ) : !currentToken ? (
          <LoadingIcon />
        ) : (
          <div className="p-4 md:p-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight font-mono">{currentToken.symbol}</h1>
                    <Badge variant="secondary" className="font-mono">
                      {currentToken.name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Pickaxe className="h-4 w-4" />
                      已铸造：
                      <span className="font-mono">{`${formatAmount(totalSupply, decimals)}`}</span>
                    </span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="inline-flex items-center gap-1">
                      <Info className="h-4 w-4" />
                      {`Decimals: ${decimals}`}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <Tabs defaultValue="stats" className="w-full mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stats" className="gap-2">
                  <BarChart2 className="h-4 w-4" />
                  统计
                </TabsTrigger>
                <TabsTrigger value="contracts" className="gap-2">
                  <Blocks className="h-4 w-4" />
                  合约地址
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stats" className="mt-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader className="px-4 pt-4 pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <TableOfContents className="h-5 w-5 text-primary" />
                          基本信息
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 grid-cols-2 px-4 pt-2 pb-4">
                        <Field label="Symbol" value={currentToken.symbol} />
                        <Field label="Name" value={currentToken.name} />
                        <Field label="父币 Symbol" value={parentSymbol} />
                        <Field label="父币 Name" value={currentToken.parentTokenName} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="px-4 pt-4 pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Pickaxe className="h-5 w-5 text-primary" />
                          铸造情况
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pt-2 pb-4">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                          <Field label="最大铸造量" value={formatAmount(maxSupply, decimals)} />
                          <Field
                            label="已铸造量（流通量）"
                            value={formatAmount(totalSupply, decimals)}
                            percentage={formatPercentage((Number(totalSupply) / Number(maxSupply)) * 100)}
                          />
                          <Field
                            label="未铸造量"
                            value={formatAmount(unminted, decimals)}
                            percentage={formatPercentage((Number(unminted) / Number(maxSupply)) * 100)}
                          />
                          <Field
                            label="未分配待铸造量"
                            value={formatAmount(rewardAvailable, decimals)}
                            percentage={formatPercentage((Number(rewardAvailable) / Number(maxSupply)) * 100)}
                          />
                          <Field
                            label="已分配待铸造量"
                            value={formatAmount(reservedAvailable, decimals)}
                            percentage={formatPercentage((Number(reservedAvailable) / Number(maxSupply)) * 100)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="px-4 pt-4 pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <HandCoins className="h-5 w-5 text-primary" />
                          已铸代币分布
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pt-2 pb-4">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                          <Field label="已铸代币量（流通量）" value={formatAmount(totalSupply, decimals)} />
                          <Field
                            label="行动参与量"
                            value={formatAmount(joinedTokenAmount, decimals)}
                            percentage={formatPercentage((Number(joinedTokenAmount) / Number(totalSupply)) * 100)}
                          />
                          <Field
                            label="流动性质押量"
                            value={formatAmount(tokenAmountForSl, decimals)}
                            percentage={formatPercentage((Number(tokenAmountForSl) / Number(totalSupply)) * 100)}
                          />
                          <Field
                            label="加速激励质押量"
                            value={formatAmount(stakedTokenAmountForSt, decimals)}
                            percentage={formatPercentage((Number(stakedTokenAmountForSt) / Number(totalSupply)) * 100)}
                          />
                          <Field
                            label="其他"
                            value={formatAmount(otherBalance, decimals)}
                            percentage={formatPercentage((Number(otherBalance) / Number(totalSupply)) * 100)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="px-4 pt-4 pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Rocket className="h-5 w-5 text-primary" />
                          发射情况
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4 px-4 pt-2 pb-4">
                        <Field label="启动公平发射区块" value={formatBigIntWithCommas(startBlock)} />
                        <Field label="完成公平发射区块" value={formatBigIntWithCommas(endBlock)} />
                        <Field label="托底池父币数量" value={formatAmount(parentPool, decimals, parentSymbol)} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="px-4 pt-4 pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Users className="h-5 w-5 text-primary" />
                          治理情况
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4 px-4 pt-2 pb-4">
                        <Field label="首次治理轮次" value={String(currentToken.initialStakeRound ?? 0)} />
                        <Field label="已完成轮数" value={formatBigIntWithCommas(finishedRounds)} />
                        <Field label="累计发起行动数" value={formatBigIntWithCommas(actionsCount)} />
                        <Field label="进行中的行动数" value={formatBigIntWithCommas(joiningActionsCount)} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contracts" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="px-4 pt-4 pb-2">
                      <CardTitle className="text-lg">LOVE20 核心合约地址：</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 px-4 pt-2 pb-4">
                      <AddressItem name="TokenFactory" address={constantsAddresses.TokenFactory} />
                      <AddressItem name="Launch" address={constantsAddresses.Launch} />
                      <AddressItem name="Stake" address={constantsAddresses.Stake} />
                      <AddressItem name="Vote" address={constantsAddresses.Vote} />
                      <AddressItem name="Join" address={constantsAddresses.Join} />
                      <AddressItem name="Verify" address={constantsAddresses.Verify} />
                      <AddressItem name="Mint" address={constantsAddresses.Mint} />
                      <AddressItem name="Random" address={constantsAddresses.Random} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="px-4 pt-4 pb-2">
                      <CardTitle className="text-lg">{`${currentToken.symbol} 相关代币地址：`}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 px-4 pt-2 pb-4">
                      <AddressItem name={`${currentToken.symbol}(当前代币)`} address={currentAddresses.token} />
                      <AddressItem name={`${currentToken.parentTokenSymbol}(父币)`} address={currentAddresses.parent} />
                      <AddressItem name="流动性质押凭证SL代币" address={currentAddresses.sl} />
                      <AddressItem name="代币质押凭证ST代币" address={currentAddresses.st} />
                      <AddressItem name="UniswapV2Pair" address={currentAddresses.pair} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </>
  );
};

export default TokenPage;
