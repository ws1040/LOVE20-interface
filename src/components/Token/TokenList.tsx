import { useState, useEffect, useCallback, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/router';

// my hooks
import { useTokenDetails } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useTokensByPage, useChildTokensByPage } from '@/src/hooks/contracts/useLOVE20Launch';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my contexts
import { Token, TokenContext } from '@/src/contexts/TokenContext';

// my types
import { TokenInfo } from '@/src/types/love20types';

// my components
import LoadingIcon from '@/src/components/Common/LoadingIcon';

const PAGE_SIZE = 10;

interface TokenListProps {
  parentTokenAddress?: `0x${string}`;
}

export default function TokenList({ parentTokenAddress }: TokenListProps) {
  const router = useRouter();
  const { token: currentToken, setToken } = useContext(TokenContext) || {};

  const [start, setStart] = useState<bigint>(0n);
  const [end, setEnd] = useState<bigint>(BigInt(PAGE_SIZE));
  const [allTokens, setAllTokens] = useState<Token[]>([]);

  // 初始化时重置 allTokens
  useEffect(() => {
    setAllTokens([]);
    setStart(0n);
    setEnd(BigInt(PAGE_SIZE));
  }, [parentTokenAddress]); // 当 parentTokenAddress 改变时也重置

  // 获取token列表
  const tokensResult = parentTokenAddress
    ? useChildTokensByPage(parentTokenAddress, start, end, true)
    : useTokensByPage(start, end, true);

  const tokenAddresses = 'childTokens' in tokensResult ? tokensResult.childTokens : tokensResult.tokens;
  const isLoadingTokens = tokensResult.isPending;
  const tokensError = tokensResult.error;

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
        initialStakeRound: Number(token.initialStakeRound),
        hasEnded: launchInfos[index].hasEnded,
        voteOriginBlocks: currentToken?.voteOriginBlocks ?? 0,
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
      router.push(`/acting/?symbol=${token.symbol}`);
    } else {
      router.push(`/launch/?symbol=${token.symbol}`);
    }
  };

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (tokensError) {
      handleContractError(tokensError, 'launch');
    }
    if (detailsError) {
      handleContractError(detailsError, 'dataViewer');
    }
  }, [tokensError, detailsError]);

  return (
    <div className="space-y-4 m-4">
      {allTokens.length === 0 && !isLoadingTokens && !isLoadingDetails ? (
        <div className="text-center text-muted-foreground py-8">{parentTokenAddress ? '暂无子币' : '代币列表为空'}</div>
      ) : (
        allTokens.map((token, index) => (
          <Card key={index} onClick={() => handleTokenClick(token)}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="flex items-center gap-2 ">
                  <span className="font-semibold mr-4">{token.symbol}</span>
                  <span className="text-greyscale-500 text-sm">父币 </span>
                  <span className="text-sm">{token.parentTokenSymbol}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {token.hasEnded ? (
                    <span className="text-greyscale-500">发射已完成</span>
                  ) : (
                    <span className="text-secondary">发射中</span>
                  )}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))
      )}
      {(isLoadingTokens || isLoadingDetails) && <LoadingIcon />}
    </div>
  );
}
