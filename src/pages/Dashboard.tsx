import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import { Button } from '@/components/ui/button';
import ToastMessage from '@/components/layout/ToastMessage';
import { useNavigate } from 'react-router-dom';

import ShowPaymentsIfExists from '@/components/layout/ShowPaymentsIfExists';
import EmployeesWithoutMotorcycles from '@/components/layout/EmployeesWithoutBike';
import DocumentAlert from '@/components/layout/DocumentAlert';
import { handleAuthError } from '@/utils/handleAuthError';

interface SolicitacaoPendente {
  sol_codigo: number;
  sol_origem: string;
  sol_destino: string;
  sol_valor: string;
  sol_formapagamento: string;
  usu_nome: string;
}

interface ViagemPendente {
  via_codigo: number;
  via_origem: string;
  via_destino: string;
  via_valor: string;
  via_formapagamento: string;
  funcionario_nome: string;
  usuario_nome: string;
  via_data: string;
  via_servico: string;
  via_observacoes: string | null;
}

interface ContadorData {
  total: number;
}

interface Review {
  id: number;
  usuario_nome: string;
  nota: number;
  comentario: string;
  data: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState<SolicitacaoPendente[]>([]);
  const [viagensPendentes, setViagensPendentes] = useState<ViagemPendente[]>([]);
  const [totalCorridasFinalizadas, setTotalCorridasFinalizadas] = useState<number | null>(null);
  const [loadingSolicitacoes, setLoadingSolicitacoes] = useState(false);
  const [loadingViagens, setLoadingViagens] = useState(false);
  const [loadingContador, setLoadingContador] = useState(false);
  const [faturamento, setFaturamento] = useState<any>(null);
  const [funcionariosAtivos, setFuncionariosAtivos] = useState<any[]>([]);
  const [totalAvaliacoes, setTotalAvaliacoes] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    status?: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
  }>({
    visible: false,
    message: "",
    status: "INFO",
  });



  const BASE_URL = 'https://backend-turma-a-2025.onrender.com';
  useEffect(() => {
    const fetchSolicitacoes = async () => {
      setLoadingSolicitacoes(true);
      try {
        const res = await fetch(
          `${BASE_URL}/api/admin/solicitacoes/pendentes`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            }
          }
        );
        if (handleAuthError(res, setToast, navigate)) return;


        if (!res.ok) throw new Error('Erro ao buscar solicitações');
        const data: SolicitacaoPendente[] = await res.json();
        setSolicitacoesPendentes(data);
        if (data.length > 0) {
          setToast({
            visible: true,
            message: `Você tem ${data.length} solicitações pendentes.`,
            status: 'INFO',
          });
        }
      } catch (error) {
        console.error('Erro ao buscar solicitações pendentes:', error);
      } finally {
        setLoadingSolicitacoes(false);
      }
    };

    const fetchViagens = async () => {
      setLoadingViagens(true);
      try {
        const res = await fetch(`${BASE_URL}/api/admin/viagens/pendentes`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            }
          }
        );
        if (handleAuthError(res, setToast, navigate)) return;

        if (!res.ok) throw new Error('Erro ao buscar viagens');
        const data: ViagemPendente[] = await res.json();
        setViagensPendentes(data);
      } catch (error) {
        console.error('Erro ao buscar viagens pendentes:', error);
      } finally {
        setLoadingViagens(false);
      }
    };

    const fetchContador = async () => {
      setLoadingContador(true);
      try {
        const response = await fetch(`${BASE_URL}/api/admin/viagens/finalizadas`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            }
          }
        );
        if (handleAuthError(response, setToast, navigate)) return;

        if (!response.ok) throw new Error('Erro ao buscar contador de viagens finalizadas');
        const data: ContadorData = await response.json();
        setTotalCorridasFinalizadas(data.total);
      } catch (error) {
        console.error('Erro ao buscar contador de viagens finalizadas:', error);
        setTotalCorridasFinalizadas(null);
      } finally {
        setLoadingContador(false);
      }
    };
    const fetchFaturamento = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/relatorios/faturamento`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            }
          }
        );
        if (handleAuthError(response, setToast, navigate)) return;

        if (!response.ok) throw new Error('Erro ao buscar faturamento');
        const data = await response.json();
        setFaturamento(data);


      } catch (error) {
        console.error('Erro ao buscar faturamento:', error);
        return null;
      }
    };
    const fetchFuncionariosAtivos = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/funcionarios/ativos`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            }
          }
        );
        if (handleAuthError(response, setToast, navigate)) return;

        if (!response.ok) throw new Error('Erro ao buscar funcionários ativos');
        const data = await response.json();
        setFuncionariosAtivos(data);
      }
      catch (error) {
        console.error('Erro ao buscar funcionários ativos:', error);
        return null;
      }
    }
    async function fetchReviewsData() {
      setLoadingContador(true);
      try {
        const response = await fetch(`${BASE_URL}/api/avaliacoes`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        if (handleAuthError(response, setToast, navigate)) return;

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao buscar avaliações');
        }

        const data: Review[] = await response.json();
        setReviews(data);

        const totalAvaliacoes = data.length;

        setTotalAvaliacoes(totalAvaliacoes);
      } catch (error: any) {
        console.error('Erro ao buscar avaliações:', error);
        setToast({
          visible: true,
          message: error.message || 'Erro ao carregar avaliações.',
          status: 'ERROR',
        });
        setReviews([]);
        setTotalAvaliacoes(0);
      } finally {
        setLoadingContador(false);
      }
    }

    const fetchAllData = () => {
      fetchSolicitacoes();
      fetchViagens();
      fetchContador();
      fetchFaturamento()
      fetchFuncionariosAtivos();
      fetchReviewsData();
    };

    fetchAllData();

    const intervalId = setInterval(fetchAllData, 6000);

    return () => clearInterval(intervalId);
  }, []);

  const goToSolicitacoes = () => {
    navigate('/solicitacoes');
  };

  async function handleFinalizarTodas() {
    try {
      setLoadingViagens(true);
      const response = await fetch(`${BASE_URL}/api/admin/viagens/finalizar-todas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao finalizar as viagens');
      }

      const data = await response.json();

      console.log('Viagens finalizadas com sucesso:', data?.mensagem || data);
      setToast({
        visible: true,
        message: 'Todas as viagens foram finalizadas com sucesso!',
        status: 'SUCCESS',
      });
    } catch (error) {
      console.error('Erro ao finalizar todas as viagens:', error);
      setToast({
        visible: true,
        message: 'Erro ao finalizar todas as viagens. Tente novamente.',
        status: 'ERROR',
      });
    }
    finally {
      setLoadingViagens(false);
    }
  }



  return (
    <div className="space-y-6">
      {toast.visible && (
        <ToastMessage
          message={toast.message}
          status={toast.status}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-righteous text-black">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Atualizado em {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="zoomx-card">
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Corridas Finalizadas</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingContador ? (
              <div className="text-2xl text-black text-center">Atualizando...</div>
            ) : (
              <div className="text-2xl text-black text-center">
                {totalCorridasFinalizadas !== null ? totalCorridasFinalizadas : 'N/A'}
              </div>
            )}
            <Button
              className="zoomx-button mt-4 w-full"
              onClick={() => navigate('/viagens')}
              aria-label="Ver viagens"
            >
              Ver viagens
            </Button>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-center">Total de Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingContador ? (
              <div className="text-2xl text-black text-center">Atualizando...</div>
            ) : (
              <div className="text-2xl text-black text-center">
                {totalAvaliacoes !== null ? totalAvaliacoes : 'N/A'}
              </div>
            )}
            <Button
              className="zoomx-button mt-4 w-full"
              onClick={() => navigate('/avaliacoes')}
              aria-label="Ver avaliações"
            >
              Ver avaliações
            </Button>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-center">Faturamento do dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-black text-center">
              {loadingContador ? (
                <div className="text-2xl text-black text-center">Atualizando...</div>
              ) : (
                <div className="text-2xl text-black text-center">
                  {faturamento ? `R$ ${parseFloat(faturamento.faturamento_diario).toFixed(2)}` : 'N/A'}

                </div>
              )}
              <Button
                className="zoomx-button mt-4 w-full"
                onClick={() => navigate('/relatorios')}
                aria-label="Ver relatório"
              >
                Ver relatório
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mototáxistas disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-black text-center">
              {funcionariosAtivos.length}
            </div>
            <Button
              className="zoomx-button mt-4 w-full"
              onClick={() => navigate('/funcionarios')}
              aria-label="Ver lista de mototáxistas ativos"
            >
              Ver Mototáxistas
            </Button>
          </CardContent>

        </Card>
      </div>

      ---
      <DocumentAlert />

      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Solicitações Pendentes</CardTitle>
          <CardDescription>Solicitações que ainda não foram atendidas</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSolicitacoes ? (
            <p>Atualizando solicitações...</p>
          ) : solicitacoesPendentes.length === 0 ? (
            <p>Nenhuma solicitação pendente.</p>
          ) : (
            <>
              <Box sx={{ width: '100%' }}>
                <LinearProgress color='warning' />
              </Box>
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {solicitacoesPendentes.map((sol) => (
                  <li
                    key={sol.sol_codigo}
                    className="border border-gray-200 rounded p-3 flex justify-between items-center hover:shadow"
                  >
                    <div className="flex flex-col space-y-1 max-w-[70%]">
                      <p>
                        <strong>Origem: </strong> {sol.sol_origem} | <strong> Destino:</strong> {sol.sol_destino} | <strong>Valor:</strong> R$ {parseFloat(sol.sol_valor).toFixed(2)} | <strong>Forma de pagamento:</strong> {sol.sol_formapagamento.toLocaleLowerCase() === "pix" ? "PIX" : sol.sol_formapagamento}
                      </p>
                      <p>
                        <strong>Usuário:</strong> {sol.usu_nome}
                      </p>
                    </div>
                    <button
                      onClick={goToSolicitacoes}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                      aria-label={`Ver detalhes da solicitação ${sol.sol_codigo}`}
                    >
                      Ver Solicitações
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      ---

      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Viagens em Andamento</CardTitle>
          <CardDescription>Viagens que estão atualmente em andamento</CardDescription>
        </CardHeader>
        <CardContent>


          {loadingViagens ? (
            <p>Atualizando viagens...</p>
          ) : viagensPendentes.length === 0 ? (
            <p>Nenhuma viagem em andamento.</p>
          ) : (
            <><Box sx={{ width: '100%' }}>
              <LinearProgress color='warning' />
            </Box>
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {viagensPendentes.map((via) => (
                  <li
                    key={via.via_codigo}
                    className="border border-gray-200 rounded p-3 hover:shadow"
                  >
                    <p>
                      <strong>Origem:</strong> {via.via_origem} | <strong>Destino:</strong> {via.via_destino} | <strong>Valor:</strong> R$ {parseFloat(via.via_valor).toFixed(2)} | <strong>Mototáxista:</strong> {via.funcionario_nome} | <strong>Usuário:</strong> {via.usuario_nome}
                    </p>

                    {via.via_observacoes && (
                      <p>
                        <strong>Observações:</strong> {via.via_observacoes}
                      </p>
                    )}
                  </li>
                ))}
                <div className="mt-4">
                  <Button
                    onClick={handleFinalizarTodas}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                    aria-label="Ver lista de solicitações"
                  >
                    Finalizar todas
                  </Button>
                </div>
              </ul>
            </>
          )}
        </CardContent>
      </Card>
      <ShowPaymentsIfExists />
      <EmployeesWithoutMotorcycles />
    </div>
  );
};

export default Dashboard;
