import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Pagination } from '../components/ui/pagination';
import { Loading } from '../components/ui/loading';
import ToastMessage from '@/components/layout/ToastMessage';
import EmployeesWithoutMotorcycles from '@/components/layout/EmployeesWithoutBike';

import { handleAuthError } from '@/utils/handleAuthError';

import { useNavigate } from 'react-router-dom';

import { ToastProps } from '@/types/toast';
import { Motorcycle } from '@/types/motorcycle';


const Motorcycles: React.FC = () => {
  const BASE_URL = 'https://backend-turma-a-2025.onrender.com';

  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
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
  const navigate = useNavigate();

  const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });


  const itemsPerPage = 10;
  function validarPlaca(placa: string) {
    const regexAntigo = /^[A-Z]{3}[0-9]{4}$/i;
    const regexMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i;
    return regexAntigo.test(placa) || regexMercosul.test(placa);
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
    if (!confirm('Tem certeza que deseja excluir esta motocicleta? Esta ação é irreversível.')) {
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  }



  useEffect(() => {
    fetchMotorcycles();
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

    console.log('Dados enviados:', motorcycleData);

    if (editingMotorcycle?.mot_codigo) {
      await updateMotorcycle(editingMotorcycle.mot_codigo, motorcycleData);
    } else {
      await addMotorcycle(motorcycleData);
    }
    setIsModalOpen(false);
    setEditingMotorcycle(null);
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
                    min="2000"
                    max={new Date().getFullYear()}
                    className="zoomx-input"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
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
                <label className="text-sm font-medium">Funcionário (Código)</label>
                <Input
                  type="number"
                  className="zoomx-input"
                  value={employeeCode}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmployeeCode(val === '' ? '' : Number(val));
                  }}
                  placeholder="Anote o código do funcionário e insira aqui"
                />
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

      ---
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

      ---

      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Lista de Motocicletas</CardTitle>
          <CardDescription>
            {filteredMotorcycles.length} motocicleta(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>

          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-righteous">Modelo</th>
                      <th className="text-left py-3 px-4 font-righteous">Placa</th>
                      <th className="text-left py-3 px-4 font-righteous">Ano</th>
                      <th className="text-left py-3 px-4 font-righteous">Cor</th>
                      <th className="text-left py-3 px-4 font-righteous">Dono</th>
                      <th className="text-center py-3 px-4 font-righteous">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMotorcycles.map((motorcycle) => (
                      <tr key={motorcycle.mot_codigo} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{motorcycle.mot_modelo}</td>
                        <td className="py-3 px-4">{motorcycle.mot_placa}</td>
                        <td className="py-3 px-4">{motorcycle.mot_ano}</td>
                        <td className="py-3 px-4">{motorcycle.mot_cor}</td>
                        <td className="py-3 px-4">{motorcycle.fun_nome}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(motorcycle)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteMotorcycle(motorcycle.mot_codigo)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
          {
            filteredMotorcycles.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-4">Nenhuma motocicleta encontrada.</div>
            )
          }
        </CardContent>
      </Card>
    </div>
  );
};

export default Motorcycles;