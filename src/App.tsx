
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './contexts/useAuth';
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
import Travels from "./pages/Travels";
import Reviews from "./pages/Reviews";
import Account from "./pages/Account";
import LoginPage from './pages/Login';
import Home from "./pages/Home";
import Email from "./pages/E-mail";
import PaymentsEmployees from  "./pages/PaymentsEmployees";
import EmployeeTrips from "./pages/EmployeeTrips";
import Documentos from "./pages/Documents";
import { PrivateRoute } from './routes/PrivateRoutes';



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/e-mail" element={<Email />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/funcionarios" element={<Layout><Employees /></Layout>} />
              <Route path="/usuarios" element={<Layout><Users /></Layout>} />
              <Route path="/solicitacoes" element={<Layout><Requests /></Layout>} />
              <Route path="/diarias" element={<Layout><PaymentsEmployees /></Layout>} />
              <Route path="/viagensFuncionario/:funCodigo" element={<Layout><EmployeeTrips /></Layout>} />
              <Route path="/motocicletas" element={<Layout><Motorcycles /></Layout>} />
              <Route path="/relatorios" element={<Layout><Reports /></Layout>} />
              <Route path="/anuncios" element={<Layout><Announcements /></Layout>} />
              <Route path="/viagens" element={<Layout><Travels /></Layout>} />
              <Route path="/avaliacoes" element={<Layout><Reviews /></Layout>} />
              <Route path="/documentos" element={<Layout><Documentos /></Layout>} />
              <Route path="/conta" element={<Layout><Account /></Layout>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
