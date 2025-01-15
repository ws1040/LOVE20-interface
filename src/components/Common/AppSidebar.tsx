import { useContext, useState } from 'react';
import { TokenContext } from '@/src/contexts/TokenContext';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

// 修改后的 AppSidebar 组件
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { token } = useContext(TokenContext) || {};
  if (!token) {
    return null;
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // 动态生成导航数据
  const data = {
    navMain: [
      {
        title: '社区',
        url: '#',
        items: [
          {
            title: '社区首页',
            url: `${basePath}/acting?symbol=${token.symbol}`,
            isActive: false,
          },
          {
            title: '治理首页',
            url: `${basePath}/gov?symbol=${token.symbol}`,
            isActive: false,
          },
          {
            title: '推举行动',
            url: `${basePath}/vote/actions4submit?symbol=${token.symbol}`,
            isActive: false,
          },
          {
            title: '交易代币',
            url: `${basePath}/dex/swap?symbol=${token.symbol}`,
            isActive: false,
          },
        ],
      },
      {
        title: '发射',
        url: '#',
        items: [
          {
            title: '发射平台',
            url: `${basePath}/launch?symbol=${token.symbol}`,
            isActive: false,
          },
          {
            title: '所有代币',
            url: `${basePath}/tokens?symbol=${token.symbol}`,
            isActive: false,
          },
          {
            title: `兑换${process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL}`,
            url: `${basePath}/launch/deposit?symbol=${token.symbol}`,
            isActive: false,
          },
        ],
      },
      {
        title: '我的',
        url: '#',
        items: [
          {
            title: '我的首页',
            url: `${basePath}/my?symbol=${token.symbol}`,
            isActive: false,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild isActive={subItem.isActive || false}>
                      <a href={subItem.url}>{subItem.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
