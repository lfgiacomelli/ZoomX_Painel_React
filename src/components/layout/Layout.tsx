import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Footer from './AppFooter';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { funcionario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#f0f0f0]">
        <AppSidebar />

        <main className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4 lg:hidden" />
              <h2 className="text-lg font-righteous text-black">Sistema de Gestão ZoomX</h2>
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuOpen(prev => !prev)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {funcionario ? getInitials(funcionario.nome) : 'A'}
                  </span>
                </div>
                <span className="text-sm text-gray-700 hidden md:inline-block">
                  {funcionario?.nome?.split(' ')[0]}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded border z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold">{funcionario?.nome}</p>
                    <p className="text-xs text-gray-500">{funcionario?.email}</p>
                    <p className="text-xs text-gray-700">{funcionario?.cargo}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
