'use client';

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

// my hooks
import { useActionPageData } from '@/src/hooks/composite/useActionPageData';
import { useActionVerificationMatrix } from '@/src/hooks/contracts/useLOVE20RoundViewer';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import ActionHeader from '@/src/components/Action/ActionHeader';
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';
import { formatPercentage, formatTokenAmount } from '@/src/lib/format';

const VerifyDetailPage = () => {
  const router = useRouter();
  const { id, round } = router.query;
  const actionId = id ? BigInt(id as string) : undefined;
  const roundNum = round ? BigInt(round as string) : undefined;
  const { address: account } = useAccount();
  const { token } = useContext(TokenContext) || {};

  // 零地址常量，用于识别弃权票
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  // 获取页面数据
  const { actionInfo, participantCount, totalAmount, userJoinedAmount, isJoined, isPending, error } = useActionPageData(
    {
      tokenAddress: token?.address,
      actionId,
      account,
    },
  );

  // 获取验证矩阵数据
  const {
    verificationMatrix,
    isPending: isMatrixPending,
    error: matrixError,
  } = useActionVerificationMatrix(token?.address || '0x', roundNum || 0n, actionId || 0n);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (error) {
      handleContractError(error, 'verify_detail');
    }
    if (matrixError) {
      handleContractError(matrixError, 'verify_detail_matrix');
    }
  }, [error, matrixError]);

  // 如果没有actionId，显示错误
  if (actionId === undefined) {
    return (
      <>
        <Header title="验证详情" showBackButton={true} />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-red-500">参数错误：缺少行动ID参数</div>
          </div>
        </main>
      </>
    );
  }

  const renderVerificationMatrix = () => {
    if (isMatrixPending) {
      return (
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">
            <LoadingIcon />
            <p className="mt-4 text-gray-600">加载验证矩阵中...</p>
          </div>
        </div>
      );
    }

    if (matrixError) {
      return (
        <div className="bg-white rounded-lg p-8">
          <div className="text-center text-red-500">
            加载验证矩阵失败：{matrixError.message || '获取验证矩阵失败，请稍后重试'}
          </div>
        </div>
      );
    }

    if (!verificationMatrix || verificationMatrix.verifiers.length === 0) {
      return (
        <div className="bg-white rounded-lg p-8">
          <div className="text-center text-gray-600">暂无验证数据</div>
        </div>
      );
    }

    const { verifiers, verifiees, scores } = verificationMatrix;

    // 计算每个验证者给所有被验证者的总分
    const verifierTotalScores = verifiers.map((_, verifierIndex) => {
      return verifiees.reduce((total, _, verifieeIndex) => {
        const score = scores[verifierIndex]?.[verifieeIndex];
        return total + (score !== undefined ? Number(score) : 0);
      }, 0);
    });

    // 创建验证者索引数组并按总分从大到小排序
    const sortedVerifierIndices = verifiers
      .map((_, index) => index)
      .sort((a, b) => verifierTotalScores[b] - verifierTotalScores[a]);

    // 计算百分比的辅助函数
    const calculatePercentage = (verifierIndex: number, verifieeIndex: number): string => {
      const score = scores[verifierIndex]?.[verifieeIndex];
      const totalScore = verifierTotalScores[verifierIndex];

      if (score === undefined || totalScore === 0) {
        return '0%';
      }

      const percentage = (Number(score) / totalScore) * 100;
      return `${formatPercentage(percentage)}`;
    };

    return (
      <>
        {/* 标题部分 */}
        <div className="bg-white rounded-lg mx-4 mb-4">
          <div className="px-4 py-4">
            <h2 className="text-lg font-bold">第 {roundNum?.toString()} 轮验证明细公示：</h2>
          </div>
        </div>

        {/* 表格外层包装器 - 严格控制宽度，防止影响页面 */}
        <div className="w-full max-w-full overflow-hidden px-4">
          {/* 表格容器 - 仅此处允许横向滚动，WebView优化 */}
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 max-w-full table-container-webview">
            <table className="w-full min-w-[800px]" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th
                    className="border border-gray-300 p-2 bg-gray-50 sticky left-0 z-20"
                    style={{
                      WebkitTextSizeAdjust: '100%',
                      width: '102px',
                      minWidth: '102px',
                    }}
                  >
                    <div className="text-gray-600 mb-1 whitespace-nowrap" style={{ fontSize: '12px' }}>
                      验证者 \ 行动参与者
                    </div>
                  </th>
                  {verifiees.map((verifiee, index) => (
                    <th
                      key={`verifiee-${index}`}
                      className="border border-gray-300 p-1 bg-gray-50"
                      style={{
                        WebkitTextSizeAdjust: '100%',
                        width: '100px',
                        minWidth: '100px',
                        maxWidth: '100px',
                      }}
                    >
                      <div>
                        {verifiee === ZERO_ADDRESS ? (
                          <span className="text-sm text-gray-700 font-medium">弃权票</span>
                        ) : (
                          <AddressWithCopyButton address={verifiee} colorClassName="text-gray-700" />
                        )}
                      </div>
                    </th>
                  ))}
                  {/* 总票数列 */}
                  <th
                    className="border border-gray-300 p-1 bg-gray-50"
                    style={{
                      WebkitTextSizeAdjust: '100%',
                      width: '102px',
                      minWidth: '102px',
                      maxWidth: '102px',
                    }}
                  >
                    <div className="text-gray-600 text-sm font-medium">总票数</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedVerifierIndices.map((verifierIndex, sortIndex) => {
                  const verifier = verifiers[verifierIndex];
                  return (
                    <tr key={`verifier-${verifierIndex}`}>
                      <td
                        className="border border-gray-300 p-2 bg-gray-50 sticky left-0 z-10"
                        style={{
                          WebkitTextSizeAdjust: '100%',
                          width: '100px',
                          minWidth: '100px',
                        }}
                      >
                        <div style={{ fontSize: '12px' }}>
                          <AddressWithCopyButton address={verifier} colorClassName="text-gray-700" />
                        </div>
                      </td>
                      {verifiees.map((_, verifieeIndex) => (
                        <td
                          key={`score-${verifierIndex}-${verifieeIndex}`}
                          className="border border-gray-300 p-1 text-center"
                          style={{
                            WebkitTextSizeAdjust: '100%',
                            width: '100px',
                            minWidth: '100px',
                          }}
                        >
                          {scores[verifierIndex]?.[verifieeIndex] !== undefined ? (
                            <div>
                              <span className="text-sm font-mono whitespace-nowrap">
                                {formatTokenAmount(scores[verifierIndex][verifieeIndex])}
                              </span>
                              <span className="text-gray-500">
                                ({calculatePercentage(verifierIndex, verifieeIndex)})
                              </span>
                            </div>
                          ) : (
                            <span className="font-mono whitespace-nowrap" style={{ fontSize: '14px' }}>
                              -
                            </span>
                          )}
                        </td>
                      ))}
                      {/* 总票数列 */}
                      <td
                        className="border border-gray-300 p-1 text-center bg-blue-50"
                        style={{
                          WebkitTextSizeAdjust: '100%',
                          width: '100px',
                          minWidth: '100px',
                          maxWidth: '100px',
                        }}
                      >
                        <span className="text-sm font-mono font-bold text-blue-600">
                          {formatTokenAmount(BigInt(verifierTotalScores[verifierIndex]))}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 说明文字 */}
        <div className="bg-white mx-4 mt-4 rounded-lg">
          <div className="px-4 py-3 text-xs text-gray-500">
            <p className="md:hidden text-blue-600">• 手机端请左右滑动表格查看完整内容</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Header title="验证详情" showBackButton={true} />
      <div className="flex-grow">
        {/* 头部信息 - 保持padding */}
        <div className="px-4 pt-0 pb-3">
          {actionInfo && (
            <ActionHeader
              actionInfo={actionInfo}
              participantCount={participantCount}
              totalAmount={totalAmount}
              isJoined={isJoined}
              userJoinedAmount={userJoinedAmount}
              isPending={isPending}
              showActionButtons={false}
              linkToActionInfo={true}
            />
          )}
        </div>

        {/* 主要内容 - 表格突破padding限制 */}
        {isPending ? (
          <div className="px-4">
            <div className="bg-white rounded-lg p-8">
              <div className="text-center">
                <LoadingIcon />
                <p className="mt-4 text-gray-600">加载数据中...</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="px-4">
            <div className="bg-white rounded-lg p-8">
              <div className="text-center text-red-500">
                加载失败：{error.message || '获取行动信息失败，请稍后重试'}
              </div>
            </div>
          </div>
        ) : actionInfo ? (
          renderVerificationMatrix()
        ) : (
          <div className="px-4">
            <div className="bg-white rounded-lg p-8">
              <div className="text-center text-yellow-600">行动不存在：找不到指定的行动信息</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VerifyDetailPage;
