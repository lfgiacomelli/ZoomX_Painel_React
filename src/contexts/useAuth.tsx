import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Funcionario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cargo: string;
}
interface AuthContextType {
  funcionario: Funcionario | null;
  token: string | null;
  login: (token: string, funcionario: Funcionario) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [funcionario, setfuncionario] = useState<Funcionario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedfuncionario = localStorage.getItem('funcionario');
    if (storedToken && storedfuncionario) {
      setToken(storedToken);
      setfuncionario(JSON.parse(storedfuncionario));
    }
    setIsLoading(false); 
  }, []);

  const login = (jwtToken: string, funcionarioData: Funcionario) => {
    setToken(jwtToken);
    setfuncionario(funcionarioData);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('funcionario', JSON.stringify(funcionarioData));
  };

  const logout = () => {
    setToken(null);
    setfuncionario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('funcionario');
  };

  return (
    <AuthContext.Provider
      value={{
        funcionario,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider');
  return context;
};
