'use client';

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import LoadingIcon from '@/src/components/Common/LoadingIcon';
import { NavigationUtils } from '@/src/lib/navigationUtils';

const Home: NextPage = () => {
  // const router = useRouter();
  // const [hasRedirected, setHasRedirected] = useState(false);

  // useEffect(() => {
  //   if (hasRedirected) {
  //     return;
  //   }

  //   // 尝试处理钱包环境中的重定向问题
  //   const handled = NavigationUtils.handleIndexRedirect(router);
  //   if (handled) {
  //     setHasRedirected(true);
  //     return;
  //   }

  //   let target = '';
  //   const symbol = router.query.symbol as string;
  //   if (symbol) {
  //     setHasRedirected(true);
  //     target = `/token/?symbol=${symbol}`;
  //   } else {
  //     target = `/token/`;
  //   }
  //   router.push(target).catch((err) => {
  //     console.log('路由跳转被取消或出错：', err);
  //   });
  // }, [router, hasRedirected]);

  // return <LoadingIcon />;

  return (
    <>
      <Head>
        <title>LOVE20 - 区块链项目</title>
        <meta name="description" content="LOVE20 区块链项目测试页面" />
      </Head>

      {/* 覆盖默认布局，使用全屏显示 */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 z-50">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">LOVE20</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6 text-gray-600">
            <p className="text-lg font-medium">LOVE20目前正在测试中</p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-500 mb-2">测试环境</p>
                <Link
                  href="https://love20tkm.github.io/interface-test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  https://love20tkm.github.io/interface-test
                </Link>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-500 mb-2">项目文档</p>
                <Link
                  href="https://love20tkm.github.io/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  https://love20tkm.github.io/docs/
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-400">感谢您的关注与支持</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
