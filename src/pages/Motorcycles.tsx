import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Pagination } from '../components/ui/pagination';
import { Loading } from '../components/ui/loading';
import ToastMessage from '@/components/layout/ToastMessage';
import EmployeesWithoutMotorcycles from '@/components/layout/EmployeesWithoutBike';

import icon from '@/assets/icon.png';

import { handleAuthError } from '@/utils/handleAuthError';

import { useNavigate } from 'react-router-dom';

import { ToastProps } from '@/types/toast';
import { Motorcycle } from '@/types/motorcycle';
import { ThreeDot } from 'react-loading-indicators';

type FuncionarioProps = {
  fun_codigo: number;
  fun_nome: string;
}

const Motorcycles: React.FC = () => {
  const BASE_URL = 'https://backend-turma-a-2025.onrender.com';

  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [funcionarios, setFuncionarios] = useState<FuncionarioProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandFilter, setBrandFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMotorcycle, setEditingMotorcycle] = useState<Partial<Motorcycle> | null>(null);

  const [model, setModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [color, setColor] = useState('');
  const [employeeCode, setEmployeeCode] = useState<number | ''>('');
  const [refreshEmployees, setRefreshEmployees] = useState(0);

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [motorcycleToDelete, setMotorcycleToDelete] = useState<Partial<Motorcycle> | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const navigate = useNavigate();

  const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });

  const itemsPerPage = 10;

  function validarPlaca(placa: string) {
    const regexAntigo = /^[A-Z]{3}[0-9]{4}$/i;
    const regexMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i;
    return regexAntigo.test(placa) || regexMercosul.test(placa);
  }

  async function listarFuncionarios() {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/funcionarios/listar-sem-moto`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (handleAuthError(response, setToast, navigate)) return;

      if (response.status === 204) {
        setFuncionarios([]);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.mensagem || 'Erro ao carregar lista de funcionários.');
      }

      setFuncionarios(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Erro ao buscar funcionários:', error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao carregar lista de funcionários.',
        status: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchMotorcycles() {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/motocicletas`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (handleAuthError(response, setToast, navigate)) return;

      if (!response.ok) {
        let errorMessage = 'Erro ao buscar motocicletas';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch { }
        const error: any = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      const data: Motorcycle[] = await response.json();
      setMotorcycles(data);
    } catch (error: any) {
      console.error('Erro ao buscar motocicletas:', error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao carregar motocicletas.',
        status: 'ERROR',
      });
      setMotorcycles([]);
    } finally {
      setLoading(false);
    }
  }

  async function addMotorcycle(newMotorcycle: Omit<Motorcycle, 'mot_codigo' | 'fun_nome'>) {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/motocicletas/adicionar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(newMotorcycle),
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao adicionar motocicleta';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch { }

        const error: any = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      await response.json();

      setToast({
        visible: true,
        message: 'Motocicleta adicionada com sucesso!',
        status: 'SUCCESS',
      });

      await fetchMotorcycles();

      setRefreshEmployees(prev => prev + 1);
    } catch (error: any) {
      console.error('Erro ao adicionar motocicleta:', error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao adicionar motocicleta.',
        status: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateMotorcycle(
    motorcycleId: number,
    updatedFields: Partial<Omit<Motorcycle, 'mot_codigo' | 'fun_nome'>>
  ) {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/motocicletas/editar/${motorcycleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao atualizar motocicleta';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch { }
        const error: any = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      await response.json();

      setToast({
        visible: true,
        message: 'Motocicleta atualizada com sucesso!',
        status: 'SUCCESS',
      });

      await fetchMotorcycles();
    } catch (error: any) {
      console.error('Erro ao atualizar motocicleta:', error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao atualizar motocicleta.',
        status: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  }

  async function deleteMotorcycle(motorcycleId: number) {
    setConfirmLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/motocicletas/excluir/${motorcycleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao excluir motocicleta';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch { }
        const error: any = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      await response.json();

      setToast({
        visible: true,
        message: 'Motocicleta excluída com sucesso!',
        status: 'SUCCESS',
      });

      await fetchMotorcycles();
    } catch (error: any) {
      console.error('Erro ao excluir motocicleta:', error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao excluir motocicleta.',
        status: 'ERROR',
      });
    } finally {
      setConfirmLoading(false);
      setIsModalDeleteOpen(false);
      setMotorcycleToDelete(null);
    }
  }

  useEffect(() => {
    fetchMotorcycles();
    listarFuncionarios();
  }, []);

  const filteredMotorcycles = motorcycles.filter(motorcycle => {
    const brandMatch = brandFilter === 'all' || motorcycle.mot_modelo.toLowerCase().includes(brandFilter.toLowerCase());

    let statusMatch = true;
    if (statusFilter === 'available') {
      statusMatch = motorcycle.fun_codigo === null;
    } else if (statusFilter === 'in_use' || statusFilter === 'maintenance') {
      statusMatch = motorcycle.fun_codigo !== null;
    }

    return brandMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredMotorcycles.length / itemsPerPage);
  const paginatedMotorcycles = filteredMotorcycles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNewMotorcycleClick = () => {
    setEditingMotorcycle(null);
    setModel('');
    setLicensePlate('');
    setYear('');
    setColor('');
    setEmployeeCode('');
    setIsModalOpen(true);
  };

  const handleEdit = (motorcycle: Motorcycle) => {
    setEditingMotorcycle(motorcycle);
    setModel(motorcycle.mot_modelo);
    setLicensePlate(motorcycle.mot_placa);
    setYear(motorcycle.mot_ano);
    setColor(motorcycle.mot_cor);
    setEmployeeCode(motorcycle.fun_codigo || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarPlaca(licensePlate.trim().toUpperCase())) {
      setToast({
        visible: true,
        message: 'Formato de placa inválido. Use ABC1234 ou ABC1D23.',
        status: 'ERROR',
      });
      return;
    }
    const motorcycleData = {
      mot_modelo: model,
      mot_placa: licensePlate.trim().toUpperCase(),
      mot_ano: Number(year),
      mot_cor: color,
      fun_codigo: employeeCode === '' || employeeCode === 0 ? null : Number(employeeCode),
    };

    try {
      if (editingMotorcycle?.mot_codigo) {
        await updateMotorcycle(editingMotorcycle.mot_codigo, motorcycleData);
      } else {
        await addMotorcycle(motorcycleData);
      }
      setIsModalOpen(false);
      setEditingMotorcycle(null);
    } catch (err) {
      setToast({
        visible: true,
        message: editingMotorcycle.mot_codigo ? "Erro ao atualizar motocicleta!" : "Erro ao cadastrar motocicleta!",
        status: 'ERROR',
      });
    }
  };

  const openDeleteModal = (motorcycle: Motorcycle) => {
    setMotorcycleToDelete(motorcycle);
    setIsModalDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!motorcycleToDelete?.mot_codigo) return;
    await deleteMotorcycle(motorcycleToDelete.mot_codigo);
  };

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
        <h1 className="text-3xl font-righteous text-black">Motocicletas</h1>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="zoomx-button" onClick={handleNewMotorcycleClick}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Motocicleta
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-righteous">
                {editingMotorcycle?.mot_codigo ? 'Editar Motocicleta' : 'Nova Motocicleta'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da motocicleta abaixo.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Modelo</label>
                  <Input
                    className="zoomx-input"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Placa</label>
                  <Input
                    className="zoomx-input"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="ABC-1234"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Ano</label>
                  <Input
                    type="number"
                    min={2000}
                    max={new Date().getFullYear()}
                    className="zoomx-input"
                    value={year}
                    onChange={(e) => setYear(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cor</label>
                  <Input
                    className="zoomx-input"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Proprietário</label>
                {funcionarios.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum funcionário disponível sem motocicleta.</p>
                ) : (
                  <Select
                    value={employeeCode === '' ? '' : String(employeeCode)}
                    onValueChange={(value) => setEmployeeCode(value === '' ? '' : Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um funcionário">
                        {employeeCode &&
                          funcionarios.find(f => String(f.fun_codigo) === String(employeeCode))?.fun_nome}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {funcionarios.map((funcionario) => (
                        <SelectItem
                          key={funcionario.fun_codigo}
                          value={String(funcionario.fun_codigo)}
                        >
                          {funcionario.fun_nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                {loading ? (
                  <Button type="submit" className="zoomx-button" disabled>
                    <ThreeDot size='small' color={"#fff"} />
                  </Button>
                ) : (
                  <Button type="submit" className="zoomx-button">
                    Salvar
                  </Button>
                )}
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isModalDeleteOpen} onOpenChange={setIsModalDeleteOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta motocicleta? Essa ação é irreversível.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <p className="text-sm text-gray-700">
                <strong>Modelo:</strong> {motorcycleToDelete?.mot_modelo || '—'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Placa:</strong> {motorcycleToDelete?.mot_placa || '—'}
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalDeleteOpen(false)}>
                Cancelar
              </Button>

              {confirmLoading ? (
                <Button variant="destructive" disabled>
                  <ThreeDot color="white" size='small' />
                </Button>
              ) : (
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirmDelete}>
                  Confirmar exclusão
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <EmployeesWithoutMotorcycles key={refreshEmployees} />

      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Modelo</label>
              <Input
                placeholder="Pesquisar por modelo..."
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="zoomx-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="in_use">Em Uso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setBrandFilter('all');
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
          <CardTitle className="font-righteous">Lista de Motocicletas</CardTitle>
          <CardDescription>
            {filteredMotorcycles.length} motocicleta(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loading text="Carregando motocicletas..." />
          ) : (
            <>
              {filteredMotorcycles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {paginatedMotorcycles.map((motorcycle) => (
                    <div
                      key={motorcycle.mot_codigo}
                      className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col w-full"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {motorcycle.mot_modelo}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${motorcycle.fun_codigo
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                            }`}
                        >
                          {motorcycle.fun_codigo ? "Em uso" : "Disponível"}
                        </span>
                      </div>

                      <dl className="text-sm text-gray-700 space-y-2 flex-1">
                        <div className="flex justify-between">
                          <dt className="font-medium text-gray-500">Placa</dt>
                          <dd>{motorcycle.mot_placa}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-gray-500">Ano</dt>
                          <dd>{motorcycle.mot_ano}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-gray-500">Cor</dt>
                          <dd>{motorcycle.mot_cor}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-gray-500">Dono</dt>
                          <dd>{motorcycle.fun_nome || "—"}</dd>
                        </div>
                      </dl>

                      <div className="flex justify-end gap-2 mt-5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full px-3 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() => handleEdit(motorcycle)}
                          aria-label={`Editar ${motorcycle.mot_modelo}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full px-3 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() => openDeleteModal(motorcycle)}
                          aria-label={`Excluir ${motorcycle.mot_modelo}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>

                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-6 text-sm">
                  Nenhuma motocicleta encontrada.
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Motorcycles;
