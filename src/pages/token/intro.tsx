'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import { TokenContext } from '@/src/contexts/TokenContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { formatPercentage } from '@/src/lib/format';

const INTRO_MD_URL = '/token/INTRO.md';

function applyPlaceholders(md: string, vars: Record<string, string | number | undefined | null>): string {
  let out = md;
  for (const [key, value] of Object.entries(vars)) {
    const safe = value === undefined || value === null ? '' : String(value);
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), safe);
  }
  return out;
}

const TokenIntroPage = () => {
  const { token } = useContext(TokenContext) || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawMd, setRawMd] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(INTRO_MD_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`加载失败：${res.status}`);
        const text = await res.text();
        if (!cancelled) setRawMd(text);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || '加载失败');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const renderedMd = useMemo(() => {
    const vars = {
      SYMBOL: token?.symbol,
      NAME: token?.name,
      DECIMALS: token?.decimals,
      PARENT_SYMBOL: token?.parentTokenSymbol,
      PARENT_NAME: token?.parentTokenName,
      TOKEN_ADDRESS: token?.address,
      PARENT_ADDRESS: token?.parentTokenAddress,
      SL_ADDRESS: token?.slTokenAddress,
      ST_ADDRESS: token?.stTokenAddress,
      PAIR_ADDRESS: token?.uniswapV2PairAddress,
      WITHDRAW_WAITING_BLOCKS: process.env.NEXT_PUBLIC_WITHDRAW_WAITING_BLOCKS ?? '?',
      MIN_VALIDATOR_VOTE_PERCENT: formatPercentage(Number(process.env.NEXT_PUBLIC_SUBMIT_MIN_PER_THOUSAND ?? 0) / 10),
    } as const;
    return applyPlaceholders(rawMd, vars);
  }, [rawMd, token]);

  return (
    <>
      <Header title="代币介绍" />
      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <LoadingIcon />
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <article className="prose lg:prose-xl mx-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {renderedMd}
              </ReactMarkdown>
            </article>
          </div>
        )}
      </main>
    </>
  );
};

export default TokenIntroPage;
