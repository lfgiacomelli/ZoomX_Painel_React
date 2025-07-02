
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider collapsedWidth={64}>
      <div className="min-h-screen flex w-full bg-[#f0f0f0]">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4 lg:hidden" />
              <h2 className="text-lg font-righteous text-black">Sistema de Gestão ZoomX</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bem-vindo, Admin</span>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-righteous">A</span>
              </div>
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
