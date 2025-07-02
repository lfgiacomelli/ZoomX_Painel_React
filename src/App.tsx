
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Users from "./pages/Users";
import Requests from "./pages/Requests";
import Motorcycles from "./pages/Motorcycles";
import Reports from "./pages/Reports";
import Announcements from "./pages/Announcements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/funcionarios" element={<Employees />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/solicitacoes" element={<Requests />} />
            <Route path="/motocicletas" element={<Motorcycles />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/anuncios" element={<Announcements />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
