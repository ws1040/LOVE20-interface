'use client';

import type { NextPage } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import LeftTitle from '@/src/components/Common/LeftTitle';

// 定义文章项的接口
interface Article {
  slug: string;
  title: string;
  date: string | null;
  description: string;
}

export async function getStaticProps() {
  const articlesDirectory = path.join(process.cwd(), 'public/articles');
  const filenames = fs.readdirSync(articlesDirectory);

  const articles = filenames.map((filename) => {
    const filePath = path.join(articlesDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug: filename.replace('.md', ''),
      title: data.title || filename,
      date: data.date || null,
      description: data.description || '',
    };
  });

  return {
    props: {
      articles: articles.sort((a, b) => (a.date > b.date ? -1 : 1)),
    },
  };
}

const Home: NextPage<{ articles: Article[] }> = ({ articles }) => {
  return (
    <div className="container mx-auto px-4 pt-8">
      <LeftTitle title="LOVE20 内测入口" />
      <div className="w-full text-center mt-2 mb-6">
        <Button variant="outline" size="sm" className="mt-2 w-1/2 text-secondary border-secondary" asChild>
          <Link href={`/acting/`}>加入社群铸币 &gt;&gt;</Link>
        </Button>
      </div>
      <LeftTitle title="LOVE20 协议介绍" />
      <div className="grid gap-6 mt-2 mb-6 border rounded-lg py-2 px-4">
        <div className="p-2 text-gray-700">
          <p className="">
            1. LOVE20 协议是一个基于 "可验证共识行动" 和“流动性质押获取治理权” 的 <strong>去中心化社群铸币协议</strong>
            ，目的是帮助社群，铸造真正属于自己的代币。
          </p>
          <p className="mt-2">
            2. <strong>LOVE20 有以下特点：</strong>
          </p>
          <p className="ml-2">① 公平发射</p>
          <p className="ml-2">② 零预留代币</p>
          <p className="ml-2">③ 完全去中心化</p>
          <p className="mt-2">
            3. <strong>LOVE20 所有代码完全开源</strong>，前端代码下载后可以在本地直接运行，不需要依赖任何中心化服务器。
          </p>
          <p className="mt-2 text-red-500">
            声明：LOVE20
            是一个社会实验，旨在帮助大家拥抱更美好的生活，不鼓励大家将之作为投机工具，请大家注意风险，谨慎投资。
          </p>
        </div>
      </div>

      <LeftTitle title="LOVE20 白皮书" />
      <div className="grid grid-cols-1 mt-2 border rounded-lg py-2 px-4">
        {articles.map((article: Article) => (
          <Link
            href={`/articles/${article.slug}`}
            key={article.slug}
            className="flex items-center justify-between py-2"
          >
            <h2 className="font-medium text-primary">《{article.title}》</h2>
            <span className="text-primary text-sm">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
