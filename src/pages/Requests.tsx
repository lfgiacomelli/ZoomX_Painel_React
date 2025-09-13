import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Pagination } from '../components/ui/pagination';
import { Loading } from '../components/ui/loading';

import { useAuth } from '@/contexts/useAuth';
import ToastMessage from '@/components/layout/ToastMessage';
import { handleAuthError } from '@/utils/handleAuthError';
import { useNavigate } from 'react-router-dom';
import { ToastProps } from '@/types/toast';
import Lottie from 'lottie-react';
import noDataAnimation from '@/assets/animations/no_data.json';

interface Request {
  sol_codigo: number;
  sol_origem: string;
  sol_destino: string;
  sol_valor: string;
  sol_formapagamento: string;
  sol_distancia: string;
  sol_data: string;
  usu_codigo: number;
  sol_largura: number | null;
  sol_comprimento: number | null;
  sol_peso: number | null;
  sol_status: 'Pendente' | 'aceita' | 'recusada' | 'concluida';
  sol_servico: 'Mototáxi' | 'Entrega';
  sol_observacoes: string;
  usu_nome?: string;
}

interface Funcionario {
  fun_codigo: number;
  fun_nome: string;
}

const Requests: React.FC = () => {
  const { funcionario } = useAuth();
  const BASE_URL = 'https://backend-turma-a-2025.onrender.com';

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(false);

  const [showToastError, setShowToastError] = useState(false);

  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<Request | null>(null);
  const [selectedFuncionarioCodigo, setSelectedFuncionarioCodigo] = useState<number | null>(null);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });


  async function fetchRequestsData() {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/solicitacoes`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          }
        }
      );
      if (handleAuthError(response, setToast, navigate)) return;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar solicitações');
      }
      const data: Request[] = await response.json();
      setRequests(data);
    } catch (error: any) {
      console.error('Erro ao buscar solicitações:', error);
      setShowToastError(true);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }
  async function fetchFuncionarios() {
    setLoadingFuncionarios(true);
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar funcionários');
      }
      const data: Funcionario[] = await response.json();
      setFuncionarios(data);
    } catch (error: any) {
      console.error('Erro ao buscar funcionários:', error);
      setToast({
        visible: true,
        message: "Erro ao buscar lista de funcionários",
        status: "ERROR",
      });
      setFuncionarios([]);
    } finally {
      setLoadingFuncionarios(false);
    }
  }
  useEffect(() => {
    fetchRequestsData();
    fetchFuncionarios();

    const intervalId = setInterval(() => {
      fetchRequestsData().then(() => {
        setToast({
          visible: true,
          message: "Solicitações atualizadas automaticamente!",
          status: "SUCCESS",
        });
      });
    }, 12000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!requests) return;
    const pendingRequest = requests.filter(request => request.sol_status.toLowerCase() === 'pendente');
    if (pendingRequest.length > 0) {
      const audio = new Audio('/notificacao.mp3');
      audio.play();
    }
  }, [requests]);

  const filteredRequests = requests.filter((request) => {
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'taxi' && request.sol_servico === 'Mototáxi') ||
      (typeFilter === 'delivery' && request.sol_servico === 'Entrega');

    const matchesStatus = statusFilter === 'all' || request.sol_status === statusFilter;

    return matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const openApproveModal = (request: Request) => {
    setRequestToApprove(request);
    setSelectedFuncionarioCodigo(null);
    setIsApproveModalOpen(true);
  };

  const handleApprove = async () => {
    if (!requestToApprove) return setToast({
      visible: true,
      message: "Nenhuma solicitação selecionada",
      status: "ERROR",
    });
    if (selectedFuncionarioCodigo === null)
      return setToast({
        visible: true,
        message: "Selecione um funcionário para aprovar a solicitação",
        status: "ERROR",
      });

    if (!confirm('Tem certeza que deseja aprovar esta solicitação?')) return;

    setLoadingApprove(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/solicitacoes/aceitar/${requestToApprove.sol_codigo}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({ fun_codigo: selectedFuncionarioCodigo, ate_codigo: funcionario?.id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao aprovar solicitação');
      }
      setToast({
        visible: true,
        message: "Solicitação aprovada com sucesso!",
        status: "SUCCESS",
      });
      setIsApproveModalOpen(false);
      fetchRequestsData();
      window.location.reload();
    } catch (error: any) {
      console.error('Erro ao aprovar solicitação:', error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao aprovar solicitação.',
        status: "ERROR",
      });
    } finally {
      setLoadingApprove(false);
    }
  };

  const handleReject = async (requestId: number) => {
    if (!confirm('Tem certeza que deseja recusar esta solicitação?')) return;

    try {
      const response = await fetch(`${BASE_URL}/api/admin/solicitacoes/recusar/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao recusar solicitação');
      }
      setToast({
        visible: true,
        message: "Solicitação recusada com sucesso!",
        status: "SUCCESS",
      });
      fetchRequestsData();
    } catch (error: any) {
      console.error('Erro ao recusar solicitação:', error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao recusar solicitação.',
        status: "ERROR",
      });
    }
  };

  const getStatusBadge = (status: Request['sol_status']) => {
    switch (status) {
      case 'Pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
      case 'aceita':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Aceita</Badge>;
      case 'recusada':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Recusada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: Request['sol_servico']) => {
    switch (type) {
      case 'Mototáxi':
        return <Badge variant="outline">Mototáxi</Badge>;
      case 'Entrega':
        return <Badge variant="outline">Entrega</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loading text='Carregando solicitações...' />
      </div>
    )
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
        <h1 className="text-3xl font-righteous text-black">Solicitações</h1>
      </div>

      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="taxi">Mototáxi</SelectItem>
                  <SelectItem value="delivery">Entrega</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="aceita">Aceita</SelectItem>
                  <SelectItem value="recusada">Recusada</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setCurrentPage(1);
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Lista de Solicitações</CardTitle>
          <CardDescription>{filteredRequests.length} solicitação(ões) encontrada(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Lottie
                animationData={noDataAnimation}
                loop
                style={{ width: 400, height: 300 }}
              />
              <p className="text-2xl text-muted-foreground">Nenhuma solicitação encontrada para o filtro "{statusFilter}".</p>
            </div>
          ) : loading ? (
            <Loading text='Carregando solicitações...' />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-righteous">Serviço</th>
                      <th className="text-left py-3 px-4 font-righteous">Cliente</th>
                      <th className="text-left py-3 px-4 font-righteous">Origem</th>
                      <th className="text-left py-3 px-4 font-righteous">Destino</th>
                      <th className="text-left py-3 px-4 font-righteous">Valor</th>
                      <th className="text-left py-3 px-4 font-righteous">Status</th>
                      <th className="text-center py-3 px-4 font-righteous">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.map((request) => (
                      <tr key={request.sol_codigo} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{getTypeBadge(request.sol_servico)}</td>
                        <td className="py-3 px-4 font-medium">
                          {request.usu_nome || `Usuário ${request.usu_codigo}`}
                        </td>
                        <td className="py-3 px-4 text-gray-600 max-w-32 truncate">{request.sol_origem}</td>
                        <td className="py-3 px-4 text-gray-600 max-w-32 truncate">{request.sol_destino}</td>
                        <td className="py-3 px-4">R$ {parseFloat(request.sol_valor).toFixed(2)}</td>
                        <td className="py-3 px-4">{getStatusBadge(request.sol_status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewDetails(request)}>
                              Detalhes
                            </Button>
                            {request.sol_status.toLowerCase() === 'pendente' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => openApproveModal(request)}
                                >
                                  Aprovar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(request.sol_codigo)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Recusar
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
          {
            requests.length === 0 && !loading ? (
              <div className="text-center text-gray-500 py-4">Nenhuma solicitação encontrada.</div>
            ) : null
          }
        </CardContent>
      </Card>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-righteous">Detalhes da Solicitação</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <p className="text-sm text-gray-600">{getTypeBadge(selectedRequest.sol_servico)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p className="text-sm text-gray-600">{getStatusBadge(selectedRequest.sol_status)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Cliente</label>
                <p className="text-sm text-gray-600">{selectedRequest.usu_nome || `Usuário ${selectedRequest.usu_codigo}`}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Origem</label>
                <p className="text-sm text-gray-600">{selectedRequest.sol_origem}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Destino</label>
                <p className="text-sm text-gray-600">{selectedRequest.sol_destino}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Valor</label>
                <p className="text-sm text-gray-600">R$ {parseFloat(selectedRequest.sol_valor).toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Forma de Pagamento</label>
                <p
                  className={`text-sm ${selectedRequest.sol_formapagamento.toLocaleLowerCase() === "pix"
                    ? "text-green-600 font-medium"
                    : "text-gray-600"
                    }`}
                >
                  {selectedRequest.sol_formapagamento.toLocaleLowerCase() === "pix"
                    ? "PIX (pago pelo app via QRCode)"
                    : selectedRequest.sol_formapagamento}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Distância</label>
                <p className="text-sm text-gray-600">{selectedRequest.sol_distancia} km</p>
              </div>
              {selectedRequest.sol_largura !== null && (
                <div>
                  <label className="text-sm font-medium">Largura</label>
                  <p className="text-sm text-gray-600">{selectedRequest.sol_largura} cm</p>
                </div>
              )}
              {selectedRequest.sol_comprimento !== null && (
                <div>
                  <label className="text-sm font-medium">Comprimento</label>
                  <p className="text-sm text-gray-600">{selectedRequest.sol_comprimento} cm</p>
                </div>
              )}
              {selectedRequest.sol_peso !== null && (
                <div>
                  <label className="text-sm font-medium">Peso</label>
                  <p className="text-sm text-gray-600">{selectedRequest.sol_peso} kg</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Observações</label>
                <p className="text-sm text-gray-600">{selectedRequest.sol_observacoes}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Data/Hora</label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedRequest.sol_data).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-righteous">Aprovar Solicitação</DialogTitle>
          </DialogHeader>
          {requestToApprove && (
            <div className="space-y-4">
              <p>
                Aprovar solicitação #{requestToApprove.sol_codigo} -{' '}
                <strong>{requestToApprove.usu_nome || `Usuário ${requestToApprove.usu_codigo}`}</strong>
              </p>
              <div>
                <label className="block mb-1 font-medium">Selecionar Funcionário</label>
                {loadingFuncionarios ? (
                  <p>Carregando funcionários...</p>
                ) : (
                  <Select
                    value={selectedFuncionarioCodigo ? selectedFuncionarioCodigo.toString() : ''}
                    onValueChange={(val) => setSelectedFuncionarioCodigo(parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {funcionarios.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          Nenhum funcionário disponível no momento
                        </div>
                      ) : (
                        funcionarios.map((func) => (
                          <SelectItem key={func.fun_codigo} value={func.fun_codigo.toString()}>
                            {func.fun_nome}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>

                  </Select>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsApproveModalOpen(false)}
                  disabled={loadingApprove}
                >
                  Cancelar
                </Button>
                <Button onClick={handleApprove} disabled={loadingApprove}>
                  {loadingApprove ? 'Aprovando...' : 'Aprovar'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Requests;
