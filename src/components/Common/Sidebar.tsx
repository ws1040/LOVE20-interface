// components/Common/Sidebar.tsx

import { useState } from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* 头部的汉堡菜单按钮 */}
      <button className="ml-4 mt-2 focus:outline-none" onClick={toggleSidebar}>
        <div className="w-6 h-1 bg-black mb-1"></div>
        <div className="w-6 h-1 bg-black mb-1"></div>
        <div className="w-6 h-1 bg-black"></div>
      </button>

      {/* 左侧导航菜单 */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <ul className="mt-8">
          <li className="p-4 hover:bg-gray-700">
            <Link href="/">
              <span>社区首页</span>
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link href="/governance">
              <span>治理首页</span>
            </Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link href="/my">
              <span>我的首页</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;