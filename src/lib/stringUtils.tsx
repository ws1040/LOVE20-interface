import React from 'react';
import NavigationUtils from './navigationUtils';

/**
 * 将文本中的URL转换为可点击的链接
 * @param text 可能包含URL的文本
 * @returns React元素，其中URL被转换为链接
 */
export const renderTextWithLinks = (text: string): React.ReactNode => {
  if (!text) return text;

  // URL的正则表达式匹配模式
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  if (!urlRegex.test(text)) {
    return text;
  }

  // 将文本拆分，URL部分转为链接
  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex) || [];

  return (
    <>
      {parts.map((part, i) => {
        // 偶数索引表示普通文本
        if (i % 2 === 0) {
          return part;
        }
        // 奇数索引是URL，替换为链接
        const url = matches[(i - 1) / 2];
        return (
          <a
            key={i}
            href={url}
            onClick={(e) => {
              e.preventDefault();
              NavigationUtils.handleExternalLink(url);
            }}
            className="text-blue-500 underline hover:text-blue-700"
          >
            {url}
          </a>
        );
      })}
    </>
  );
};

/**
 * 将文本中的URL转换为可点击的链接的组件包装器
 */
export const LinkIfUrl: React.FC<{ text: string }> = ({ text }) => {
  return <>{renderTextWithLinks(text)}</>;
};
