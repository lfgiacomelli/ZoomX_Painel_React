import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { XCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import ToastMessage from '@/components/layout/ToastMessage';

import { ToastProps } from '@/types/toast';
import { ThreeDot } from 'react-loading-indicators';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });


  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setToast({ ...toast, visible: false });

    if (!email || !senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://backend-turma-a-2025.onrender.com/api/admin/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fun_email: email, fun_senha: senha }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.sucesso) {
          login(data.token, data.funcionario);

          try {
            await fetch('https://backend-turma-a-2025.onrender.com/api/admin/pagamentos/gerar-diarias', {
              method: 'POST',
              headers: { Authorization: `Bearer ${data.token}` },
            });
          } catch (gerarError) {
            console.error('Erro ao gerar diárias:', gerarError);
          }

          navigate('/');
        } else {
          setError('E-mail ou senha incorretos.');
          setToast({
            visible: true,
            message: 'E-mail ou senha incorretos.',
            status: 'ERROR',
          });
        }
      } else {
        setError('Erro ao tentar fazer login. Tente novamente mais tarde.');
        setToast({
          visible: true,
          message: 'Erro ao tentar fazer login. Tente novamente mais tarde.',
          status: 'ERROR',
        });
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
      setToast({
        visible: true,
        message: 'Erro de conexão. Verifique sua internet.',
        status: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      {toast.visible && (
        <ToastMessage
          message={toast.message}
          status={toast.status}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}
      <Card className={`w-full max-w-md shadow-lg border-0 transition-all duration-500 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex items-center justify-center h-12 w-12 bg-blue-100 rounded-full">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Acesse sua conta
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Entre com suas credenciais para acessar o painel
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-fade-in">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="funcionario@zoomx.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700">Senha</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="focus-visible:ring-blue-500 focus-visible:ring-offset-1 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-10 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ThreeDot size='small' color='white' />
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;