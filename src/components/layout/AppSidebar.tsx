
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart,
  Calendar,
  List,
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '../ui/sidebar';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: BarChart,
  },
  {
    title: 'Funcionários',
    url: '/funcionarios',
    icon: List,
  },
  {
    title: 'Usuários',
    url: '/usuarios',
    icon: List,
  },
  {
    title: 'Solicitações',
    url: '/solicitacoes',
    icon: Calendar,
  },
  {
    title: 'Motocicletas',
    url: '/motocicletas',
    icon: Search,
  },
  {
    title: 'Relatórios',
    url: '/relatorios',
    icon: BarChart,
  },
  {
    title: 'Anúncios',
    url: '/anuncios',
    icon: Edit,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-black text-white font-medium" 
      : "hover:bg-gray-100 text-black";

  return (
    <Sidebar
      className="bg-[#f0f0f0] border-r border-gray-200"
      collapsible="icon"
    >
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-righteous text-black">ZoomX Admin</h1>
        <SidebarTrigger className="mt-2" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-righteous">
            Menu Principal
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center px-3 py-2 rounded-md transition-colors ${getNavCls(item.url)}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="ml-3 font-righteous">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
