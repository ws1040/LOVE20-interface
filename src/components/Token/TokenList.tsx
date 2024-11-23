import { useState, useEffect, useCallback, useContext } from 'react';
import { ChevronRight } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

import { useTokenDetails } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useTokensByPage } from '@/src/hooks/contracts/useLOVE20Launch';
import { TokenInfo } from '@/src/types/life20types';
import { Token, TokenContext } from '@/src/contexts/TokenContext';
import Loading from '@/src/components/Common/Loading';

const PAGE_SIZE = 10;

export default function TokenList() {
  const router = useRouter();
  const context = useContext(TokenContext);
  const { setToken } = context || {};

  const [start, setStart] = useState<bigint>(0n);
  const [end, setEnd] = useState<bigint>(BigInt(PAGE_SIZE));
  const [allTokens, setAllTokens] = useState<Token[]>([]);

  // 初始化时重置 allTokens
  useEffect(() => {
    setAllTokens([]);
    setStart(0n);
    setEnd(BigInt(PAGE_SIZE));
  }, []);

  // 获取token列表
  const { tokens: tokenAddresses, isPending: isLoadingTokens, error: tokensError } = useTokensByPage(start, end, true);

  // 获取tokens详情
  const {
    tokens,
    launchInfos,
    isPending: isLoadingDetails,
    error: detailsError,
  } = useTokenDetails(tokenAddresses || []);

  useEffect(() => {
    if (tokenAddresses && tokens && launchInfos) {
      const newTokens = tokens.map((token: TokenInfo, index: number) => ({
        name: token.name,
        symbol: token.symbol,
        address: tokenAddresses[index],
        decimals: Number(token.decimals),
        parentTokenAddress: launchInfos[index].parentTokenAddress,
        parentTokenSymbol: token.parentTokenSymbol,
        slTokenAddress: token.slAddress,
        stTokenAddress: token.stAddress,
        hasEnded: launchInfos[index].hasEnded,
      }));
      setAllTokens((prev) => {
        // 过滤掉已存在的symbol，避免重复
        const existingSymbols = new Set(prev.map((token) => token.symbol));
        const filteredNewTokens = newTokens.filter((token) => !existingSymbols.has(token.symbol));
        return [...prev, ...filteredNewTokens];
      });
    }
  }, [tokens, launchInfos]);

  // 加载更多tokens
  const loadMoreTokens = useCallback(() => {
    if (!isLoadingTokens && tokens && tokens.length > 0) {
      setStart(end);
      setEnd(end + BigInt(PAGE_SIZE));
    }
  }, [isLoadingTokens, tokens, end]);

  const handleScroll = useDebouncedCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      loadMoreTokens();
    }
  }, 200);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // 切换代币
  const handleTokenClick = (token: Token) => {
    if (!setToken) {
      toast.error('请先选择代币');
      return;
    }
    //切换代币
    setToken(token);
    //跳转代币详情页
    if (token.hasEnded) {
      router.push(`/${token.symbol}/acting`);
    } else {
      router.push(`/${token.symbol}/launch`);
    }
  };

  if (tokensError || detailsError) {
    return <div className="text-red-500">加载错误，请稍后再试。</div>;
  }

  return (
    <div className="space-y-4 m-4">
      {allTokens.map((token, index) => (
        <Card key={index} onClick={() => handleTokenClick(token)}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="flex items-center gap-2 ">
                <span className="font-semibold text-primary mr-4">${token.symbol}</span>
                <span className="text-gray-500 text-sm">父币 ${token.parentTokenSymbol}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {token.hasEnded ? (
                  <span className="text-gray-500">发射已完成</span>
                ) : (
                  <span className="text-green-500">发射中</span>
                )}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
      {(isLoadingTokens || isLoadingDetails) && <Loading />}
    </div>
  );
}
