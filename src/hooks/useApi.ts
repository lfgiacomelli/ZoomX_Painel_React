
import { useState } from 'react';
import { useToast } from './use-toast';

export const useApi = <T = any>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const execute = async (
    apiCall: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      
      if (successMessage) {
        toast({
          title: "Sucesso",
          description: successMessage,
        });
      }
      
      return result;
    } catch (err) {
      const message = errorMessage || 'Ocorreu um erro inesperado';
      setError(message);
      
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};
