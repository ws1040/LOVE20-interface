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
  const [isOpen, setIsOpen] = useState(false);
  const tokenContext = useContext(TokenContext);
  const { token } = tokenContext || {};

  // 动态生成导航数据
  const data = {
    navMain: [
      {
        title: '社区',
        url: '#',
        items: [
          {
            title: '社区首页',
            url: token ? `/${token.symbol}/acting` : '/token/acting',
            isActive: false,
          },
          {
            title: '治理首页',
            url: token ? `/${token.symbol}/gov` : '/token/gov',
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
            url: token ? `/${token.symbol}/launch` : '/token/launch',
            isActive: false,
          },
          {
            title: '所有代币',
            url: '/tokens',
            isActive: false,
          },
          {
            title: '交易代币',
            url: token ? `/${token.symbol}/dex/swap` : '/token/dex/swap',
            isActive: false,
          },
          {
            title: '兑换',
            url: token ? `/${token.symbol}/launch/deposit` : '/token/launch/deposit',
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
            url: token ? `/${token.symbol}/my` : '/my',
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
        {/* 为每个父项创建一个 SidebarGroup */}
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
