import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart,
  File,
  UserCircle,
  Bike,
  Star,
  User,
  Edit,
  BarChart2Icon,
  LogOut,
  Bell,
  Clipboard,
  UserCog,
  Route
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
import { useAuth } from '@/contexts/useAuth';
import { useCargo } from '@/hooks/useCargo';

const baseMenuItems = [
  { title: 'Dashboard', url: '/', icon: BarChart },
  { title: 'Solicitações', url: '/solicitacoes', icon: Clipboard },
  { title: 'Viagens', url: '/viagens', icon: Route },
  { title: 'Funcionários', url: '/funcionarios', icon: UserCircle },
  { title: 'Motocicletas', url: '/motocicletas', icon: Bike },
  { title: 'Diárias', url: '/diarias', icon: BarChart2Icon },
  { title: 'Avaliações', url: '/avaliacoes', icon: Star },
  { title: 'Usuários', url: '/usuarios', icon: UserCog },
  // { title: 'Notificações', url: '/notificacoes', icon: Bell },
  // { title: 'Anúncios', url: '/anuncios', icon: Edit },
  { title: 'Relatórios', url: '/relatorios', icon: BarChart2Icon },
  { title: 'Conta', url: '/conta', icon: User },
];


interface WeatherData {
  temp: number;
  icon: string;
  description: string;
}

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, funcionario } = useAuth();

  const cargo = useCargo();
  const funCodigo = funcionario?.id;
  const menuItems =
    cargo === "mototaxista"
      ? [
        { title: "Dashboard", url: "/", icon: BarChart },
        { title: "Minhas Viagens", url: `/viagensFuncionario/${funCodigo}`, icon: Route },
        { title: "Minha Motocicleta", url: `/motocicletaFuncionario/${funCodigo}`, icon: Bike },
        { title: "Meus ganhos diários", url: `/ganhosDiarios/${funCodigo}`, icon: BarChart2Icon },
        { title: "Conta", url: "/conta", icon: User },
      ]
      : (() => {
        let items = [...baseMenuItems];

        if (cargo === "gerente" || cargo === "atendente") {
          items.splice(items.length - 1, 0, {
            title: "Documentos",
            url: "/documentos",
            icon: File,
          });
        }

        return items;
      })();



  const [weather, setWeather] = useState<WeatherData | null>(null);

  const API_KEY = '848082604d168d1154ccdd2326eb057e';
  const CITY = 'Presidente Venceslau,BR';

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}&lang=pt_br`
      );
      if (!res.ok) throw new Error('Erro ao buscar clima');
      const data = await res.json();
      setWeather({
        temp: Math.round(data.main.temp),
        icon: data.weather[0].icon,
        description: data.weather[0].description,
      });
    } catch (error) {
      console.error(error);
      setWeather(null);
    }
  };

  useEffect(() => {
    fetchWeather();

    const intervalId = setInterval(() => {
      fetchWeather();
    }, 3600000);

    return () => clearInterval(intervalId);
  }, []);

  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path)
      ? 'bg-black text-white font-medium'
      : 'hover:bg-gray-100 text-black';

  const handleLogout = () => {
    if (confirm('Deseja realmente sair da conta?')) {
      logout();
    }
  };

  return (
    <Sidebar className="bg-[#f0f0f0] border-r border-gray-200" collapsible="icon">
      <div className="p-4 border-b border-gray-200">
        {state === 'collapsed' ? (
          <div className="flex items-center justify-center h-12">
            <h1 className="text-2xl font-righteous text-black">ZX</h1>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-xl font-righteous text-black text-center">ZoomX</h1>
            <h1 className="text-sm font-righteous text-black text-center">
              Painel de gestão
            </h1>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            <div className="text-xs text-gray-500 text-center text-sm">
              {new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            {weather && (
              <div className="mt-3 flex items-center justify-center space-x-2 text-black font-righteous text-sm">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  className="w-6 h-6"
                  loading="lazy"
                />
                <span>
                  {weather.temp}° em Presidente Venceslau
                </span>
              </div>
            )}
          </div>
        )}

        <SidebarTrigger className="mt-2 " />
      </div>

      <SidebarContent className="flex flex-col justify-between h-full">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-600 font-righteous">
              Menu Principal
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center px-3 py-2 rounded-md transition-colors ${getNavCls(
                          item.url
                        )}`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="ml-3 font-righteous">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-100 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {state !== 'collapsed' && (
              <span className="ml-3 font-righteous">Sair</span>
            )}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
