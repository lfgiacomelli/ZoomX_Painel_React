import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Check, UserX } from 'lucide-react';
import { Loading } from '../components/ui/loading';
import { Pagination } from '../components/ui/pagination';
import { ApiService } from '../services/api';
import ToastMessage from '@/components/layout/ToastMessage';
import { ActionMenu } from '@/components/layout/ActionMenu';
import { useCargo } from '@/hooks/useCargo';
import { ToastProps } from '@/types/toast';

const Employees: React.FC = () => {
  const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });


  const [nameFilter, setNameFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPagamentoId, setSelectedPagamentoId] = useState<number | null>(null);
  const [selectedStatusAtual, setSelectedStatusAtual] = useState<string | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<string>('pix');

  const cargo = useCargo();

  async function fetchFuncionarios() {
    try {
      return await ApiService.get<any[]>('/api/admin/funcionarios');
    } catch (error: any) {
      setToast({
        visible: true,
        message: error.message || 'Erro ao buscar funcionários',
        status: 'ERROR',
      });
      throw new Error(error.message || 'Erro ao buscar funcionários');
    }
  }

  async function adicionarFuncionario(employeeData: any) {
    try {
      const data = await ApiService.post('/api/admin/funcionarios/adicionar', employeeData);

      const token = localStorage.getItem('token');
      if (!token) {
        setToast({
          visible: true,
          message: 'Token não encontrado. Faça login novamente.',
          status: 'ERROR',
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return data;
      }

      try {
        await fetch('https://backend-turma-a-2025.onrender.com/api/admin/pagamentos/gerar-diarias', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (gerarError) {
        console.error('Erro ao gerar diárias:', gerarError);
        setToast({
          visible: true,
          message: 'Erro ao gerar diárias após adicionar funcionário',
          status: 'ERROR',
        });
      }

      return data;
    } catch (error: any) {
      setToast({
        visible: true,
        message: error.message || 'Erro ao adicionar funcionário',
        status: 'ERROR',
      });
      throw new Error(error.message || 'Erro ao adicionar funcionário');
    }
  }


  async function editarFuncionario(id: number, employeeData: any) {
    try {
      return await ApiService.put(`/api/admin/funcionarios/editar/${id}`, employeeData);
    } catch (error: any) {
      setToast({
        visible: true,
        message: error.message || 'Erro ao editar funcionário',
        status: 'ERROR',
      });
      throw new Error(error.message || 'Erro ao editar funcionário');
    }
  }

  async function deletarFuncionario(id: number) {
    try {
      return await ApiService.delete(`/api/admin/funcionarios/excluir/${id}`);
    } catch (error: any) {
      setToast({
        visible: true,
        message: error.message || 'Erro ao deletar funcionário',
        status: 'ERROR',
      });
      throw new Error(error.message || 'Erro ao deletar funcionário');
    }
  }

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      try {
        const data = await fetchFuncionarios();
        setEmployees(data);
      } catch (error: any) {
        console.error("Erro ao carregar funcionários:", error);
        setToast({
          visible: true,
          message: error.message || 'Erro ao carregar funcionários.',
          status: 'ERROR',
        });
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [isModalOpen, isPaymentModalOpen]);

  const itemsPerPage = 5;

  const filteredEmployees = employees.filter(emp => {
    const employeePosition = emp.fun_cargo || "Mototaxista";
    const employeeStatus = emp.fun_ativo ? 'active' : 'inactive';

    return (!nameFilter || emp.fun_nome.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (!positionFilter || positionFilter === "all" || employeePosition === positionFilter) &&
      (!statusFilter || statusFilter === "all" || employeeStatus === statusFilter);
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAtivarDesativar = async (employeeId: number, currentStatus: boolean) => {
    setLoading(true);
    try {
      await ApiService.patch(`/api/admin/funcionarios/ativar-desativar/${employeeId}`);

      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.fun_codigo === employeeId ? { ...emp, fun_ativo: !currentStatus } : emp
        )
      );

      setToast({
        visible: true,
        message: `Funcionário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`,
        status: 'SUCCESS',
      });
    } catch (error: any) {
      console.error('Erro ao ativar/desativar funcionário:', error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao ativar/desativar funcionário.',
        status: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee({
      id: employee.fun_codigo,
      nome: employee.fun_nome,
      email: employee.fun_email,
      telefone: employee.fun_telefone,
      cnh: employee.fun_cnh || '',
      data_contratacao: employee.fun_data_contratacao ? employee.fun_data_contratacao.split('T')[0] : '',
      ativo: employee.fun_ativo,
      cargo: employee.fun_cargo,
      cpf: employee.fun_cpf || '',
      senha: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (employeeId: number) => {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      setLoading(true);
      try {
        await deletarFuncionario(employeeId);
        setToast({
          visible: true,
          message: 'Funcionário excluído com sucesso!',
          status: 'SUCCESS',
        });
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.fun_codigo !== employeeId));
      } catch (error: any) {
        console.error("Erro ao excluir funcionário:", error);
        setToast({
          visible: true,
          message: error.message || 'Erro ao excluir funcionário.',
          status: 'ERROR',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingEmployee?.id) {
        const updatedEmployeeData = {
          nome: editingEmployee.nome,
          email: editingEmployee.email,
          ...(editingEmployee.senha ? { senha: editingEmployee.senha } : {}),
          telefone: editingEmployee.telefone,
          cnh: editingEmployee.cnh,
          data_contratacao: editingEmployee.data_contratacao,
          ativo: editingEmployee.ativo,
          cargo: editingEmployee.cargo,
          cpf: editingEmployee.cpf,
        };
        await editarFuncionario(editingEmployee.id, updatedEmployeeData);
        setToast({
          visible: true,
          message: 'Funcionário atualizado com sucesso!',
          status: 'SUCCESS',
        });
      } else {
        const newEmployeeData = {
          nome: editingEmployee.nome,
          email: editingEmployee.email,
          senha: editingEmployee.senha,
          telefone: editingEmployee.telefone,
          cnh: editingEmployee.cnh,
          data_contratacao: editingEmployee.data_contratacao,
          ativo: editingEmployee.ativo,
          cargo: editingEmployee.cargo,
          cpf: editingEmployee.cpf,

        };
        await adicionarFuncionario(newEmployeeData);
        setToast({
          visible: true,
          message: 'Funcionário adicionado com sucesso!',
          status: 'SUCCESS',
        });
      }

      setIsModalOpen(false);
      setEditingEmployee(null);

      const data = await fetchFuncionarios();
      setEmployees(data);
    } catch (error: any) {
      console.error("Erro ao salvar funcionário:", error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao salvar funcionário.',
        status: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (ativo: boolean) => {
    return ativo
      ? <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      : <Badge className="bg-red-100 text-red-800">Indisponível</Badge>;
  };

  const openPaymentModal = (pag_codigo: number, statusAtual: string) => {
    setSelectedPagamentoId(pag_codigo);
    setSelectedStatusAtual(statusAtual);
    setFormaPagamento('pix');
    setIsPaymentModalOpen(true);
  };

  const confirmAtualizarPagamento = async () => {
    if (selectedPagamentoId === null || selectedStatusAtual === null) return;

    setLoading(true);
    try {
      const novoStatus = selectedStatusAtual === 'pago' ? 'pendente' : 'pago';
      let formaPagamentoEnviar = '';

      if (novoStatus === 'pago') {
        formaPagamentoEnviar = formaPagamento;
      }

      await ApiService.put(`/api/admin/pagamentos/atualizar-status/${selectedPagamentoId}`, {
        pag_status: novoStatus,
        pag_forma_pagament: formaPagamentoEnviar,
      });

      setEmployees(prev =>
        prev.map(emp =>
          emp.pag_codigo === selectedPagamentoId
            ? { ...emp, pag_status: novoStatus, pag_forma_pagament: formaPagamentoEnviar }
            : emp
        )
      );

      setToast({
        visible: true,
        message: `${employees.find(emp => emp.pag_codigo === selectedPagamentoId)?.fun_nome} pagou a diária com sucesso!`,
        status: 'SUCCESS',
      });
      setIsPaymentModalOpen(false);
    } catch (error: any) {
      console.error('Erro ao atualizar status do pagamento:', error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao atualizar status do pagamento.',
        status: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  };

  const PaymentModal = () => (
    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-righteous">Selecionar Forma de Pagamento</DialogTitle>
          <DialogDescription>
            Escolha a forma de pagamento para marcar como pago.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Select value={formaPagamento} onValueChange={setFormaPagamento}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pix">Pix</SelectItem>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
              <SelectItem value="cartao">Cartão</SelectItem>
              <SelectItem value="boleto">Boleto</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="zoomx-button"
              onClick={confirmAtualizarPagamento}
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

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
        <h1 className="text-3xl font-righteous text-black">Funcionários</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="zoomx-button"
              onClick={() =>
                setEditingEmployee({
                  nome: '',
                  email: '',
                  senha: '',
                  telefone: '',
                  cnh: '',
                  data_contratacao: '',
                  ativo: true,
                  cargo: 'Mototaxista',
                  cpf: '',
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-righteous">
                {editingEmployee?.id ? 'Editar Funcionário' : 'Novo Funcionário'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do funcionário abaixo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    className="zoomx-input"
                    value={editingEmployee?.nome || ''}
                    onChange={e => setEditingEmployee({ ...editingEmployee, nome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    className="zoomx-input"
                    value={editingEmployee?.email || ''}
                    onChange={e => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    className="zoomx-input"
                    value={editingEmployee?.telefone || ''}
                    onChange={e => setEditingEmployee({ ...editingEmployee, telefone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cargo</label>
                  <Select
                    value={editingEmployee?.cargo || 'Mototaxista'}
                    onValueChange={value => setEditingEmployee({ ...editingEmployee, cargo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mototaxista">Mototaxista</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Atendente">Atendente</SelectItem>
                      <SelectItem value="Gerente">Gerente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">CPF</label>
                  <Input
                    className="zoomx-input"
                    value={editingEmployee?.cpf || ''}
                    onChange={e => setEditingEmployee({ ...editingEmployee, cpf: e.target.value })}
                    maxLength={11}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">CNH</label>
                  <Input
                    className="zoomx-input"
                    value={editingEmployee?.cnh || ""}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, cnh: e.target.value })
                    }
                    maxLength={9}
                    placeholder={editingEmployee?.cargo !== "Mototaxista" ? "CNH não aplicável" : "Digite a CNH"}
                    disabled={editingEmployee?.cargo !== "Mototaxista"}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Data de Contratação</label>
                <Input
                  type="date"
                  className="zoomx-input"
                  value={editingEmployee?.data_contratacao || ''}
                  onChange={e => setEditingEmployee({ ...editingEmployee, data_contratacao: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  className="zoomx-input"
                  value={editingEmployee?.senha || ''}
                  onChange={e => setEditingEmployee({ ...editingEmployee, senha: e.target.value })}
                  placeholder={editingEmployee?.id ? 'Deixe em branco para manter a senha atual' : 'Digite a senha'}
                  required={!editingEmployee?.id}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={editingEmployee?.ativo ? 'active' : 'inactive'}
                  onValueChange={value =>
                    setEditingEmployee({
                      ...editingEmployee,
                      ativo: value === 'active',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="zoomx-button">
                  Salvar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input
                placeholder="Pesquisar por nome..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="zoomx-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cargo</label>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os cargos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cargos</SelectItem>
                  <SelectItem value="Mototaxista">Mototaxista</SelectItem>
                  <SelectItem value="Atendente">Atendente</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Operador">Operador</SelectItem>
                  <SelectItem value="Gerente">Gerente</SelectItem>
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
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setNameFilter('');
                  setPositionFilter('');
                  setStatusFilter('');
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
          <CardTitle className="font-righteous">Lista de Funcionários</CardTitle>
          <CardDescription>
            {filteredEmployees.length} funcionário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loading text='Carregando funcionários...' />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-righteous text-center">Código</th>
                      <th className="text-left py-3 px-4 font-righteous">Nome</th>
                      <th className="text-left py-3 px-4 font-righteous">Email</th>
                      <th className="text-left py-3 px-4 font-righteous">Telefone</th>
                      <th className="text-left py-3 px-4 font-righteous">Cargo</th>
                      <th className="text-left py-3 px-4 font-righteous">Status</th>
                      <th className="text-center py-3 px-4 font-righteous">Ações</th>
                      <th className="text-left py-3 px-4 font-righteous text-center">Status da diária</th>
                      <th className="text-center py-3 px-4 font-righteous">Controle Pagamentos</th>
                      <th className="text-center py-3 px-4 font-righteous">Outros</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEmployees.map((employee) => (
                      <tr key={employee.fun_codigo} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-center">{employee.fun_codigo}</td>
                        <td className="py-3 px-4 font-medium">{employee.fun_nome}</td>
                        <td className="py-3 px-4 text-gray-600">{employee.fun_email}</td>
                        <td className="py-3 px-4 text-gray-600">{employee.fun_telefone}</td>
                        <td className="py-3 px-4">{employee.fun_cargo}</td>
                        <td className="py-3 px-4">{getStatusBadge(employee.fun_ativo)}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center space-x-2">
                            <div className="relative group">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(employee)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                     whitespace-nowrap rounded bg-gray-900 text-white text-xs 
                     px-2 py-1 opacity-0 group-hover:opacity-100 
                     pointer-events-none transition-opacity duration-300">
                                Editar
                              </span>
                            </div>
                            <div className="relative group">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAtivarDesativar(employee.fun_codigo, employee.fun_ativo)}
                              >
                                {employee.fun_ativo ? (
                                  <ToggleLeft className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <ToggleRight className="w-4 h-4 text-blue-600" />
                                )}
                              </Button>
                              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                     whitespace-nowrap rounded bg-gray-900 text-white text-xs 
                     px-2 py-1 opacity-0 group-hover:opacity-100 
                     pointer-events-none transition-opacity duration-300">
                                {employee.fun_ativo ? 'Desativar' : 'Ativar'}
                              </span>
                            </div>
                            <div className="relative group">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(employee.fun_codigo)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                              <span
                                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                                        whitespace-nowrap rounded bg-gray-900 text-white text-xs 
                                        px-2 py-1 opacity-0 group-hover:opacity-100 
                                        pointer-events-none transition-opacity duration-300"
                              >
                                Demitir
                              </span>
                            </div>
                          </div>
                        </td>
                        {employee.fun_cargo.toLowerCase() === 'gerente' ? (
                          <td className="py-3 px-4 text-center">
                            <Badge className="bg-gray-700 text-white">Não aplicável</Badge>
                          </td>
                        ) : (
                          <td className="py-3 px-4 text-center">
                            {employee.pag_status === 'pago' ? (
                              <Badge className="bg-green-100 text-green-800">Pago</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                            )}
                          </td>
                        )
                        }
                        <td className="py-3 px-4 text-center">
                          {employee.fun_cargo.toLowerCase() === "gerente" ? (
                            <Badge className="bg-gray-700 text-white">Ação desabilitada</Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openPaymentModal(employee.pag_codigo, employee.pag_status)}
                              disabled={employee.pag_status === 'pago'}
                            >
                              <Check className="w-4 h-4 text-green-600" />
                              {employee.pag_status === 'pago' ? 'Pago' : 'Marcar Pago'}
                            </Button>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <ActionMenu
                            funCodigo={employee.fun_codigo}
                            funDocumento={employee.fun_documento}
                            disabled={
                              (cargo !== "gerente" && cargo !== "atendente") ||
                              employee.fun_cargo.toLowerCase() === "gerente"
                            }
                            onFotoAtualizada={() => {
                              fetchFuncionarios().then(data => setEmployees(data));
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaymentModal />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;