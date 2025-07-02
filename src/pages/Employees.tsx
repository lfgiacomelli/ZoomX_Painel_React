
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { Loading } from '../components/ui/loading';
import { Pagination } from '../components/ui/pagination';

// Dados de exemplo para demonstração
const mockEmployees = [
  { id: '1', name: 'João Silva', email: 'joao@zoomx.com', phone: '(11) 99999-0001', position: 'Motociclista', status: 'active', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: '2', name: 'Maria Santos', email: 'maria@zoomx.com', phone: '(11) 99999-0002', position: 'Supervisor', status: 'active', createdAt: '2024-01-20', updatedAt: '2024-01-20' },
  { id: '3', name: 'Pedro Costa', email: 'pedro@zoomx.com', phone: '(11) 99999-0003', position: 'Motociclista', status: 'inactive', createdAt: '2024-02-01', updatedAt: '2024-02-01' },
  { id: '4', name: 'Ana Lima', email: 'ana@zoomx.com', phone: '(11) 99999-0004', position: 'Operador', status: 'active', createdAt: '2024-02-10', updatedAt: '2024-02-10' },
  { id: '5', name: 'Carlos Oliveira', email: 'carlos@zoomx.com', phone: '(11) 99999-0005', position: 'Motociclista', status: 'active', createdAt: '2024-02-15', updatedAt: '2024-02-15' },
];

const Employees: React.FC = () => {
  // Estados para filtros
  const [nameFilter, setNameFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Estados para modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  
  // Estados para paginação (simulação)
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Simulação do hook de funcionários
  const itemsPerPage = 5;
  const filteredEmployees = mockEmployees.filter(emp => {
    return (!nameFilter || emp.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
           (!positionFilter || emp.position === positionFilter) &&
           (!statusFilter || emp.status === statusFilter);
  });
  
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = (employeeId: string) => {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      console.log('Excluindo funcionário:', employeeId);
      // Aqui seria feita a chamada para a API
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvando funcionário:', editingEmployee);
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-righteous text-black">Funcionários</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="zoomx-button" onClick={() => setEditingEmployee({})}>
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
                    defaultValue={editingEmployee?.name}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email" 
                    className="zoomx-input" 
                    defaultValue={editingEmployee?.email}
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <Input 
                    className="zoomx-input" 
                    defaultValue={editingEmployee?.phone}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cargo</label>
                  <Select defaultValue={editingEmployee?.position}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motociclista">Motociclista</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Operador">Operador</SelectItem>
                      <SelectItem value="Gerente">Gerente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select defaultValue={editingEmployee?.status || 'active'}>
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

      {/* Filtros */}
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
                  <SelectItem value="">Todos os cargos</SelectItem>
                  <SelectItem value="Motociclista">Motociclista</SelectItem>
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
                  <SelectItem value="">Todos os status</SelectItem>
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

      {/* Tabela de Funcionários */}
      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Lista de Funcionários</CardTitle>
          <CardDescription>
            {filteredEmployees.length} funcionário(s) encontrado(s)
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
                      <th className="text-left py-3 px-4 font-righteous">Nome</th>
                      <th className="text-left py-3 px-4 font-righteous">Email</th>
                      <th className="text-left py-3 px-4 font-righteous">Telefone</th>
                      <th className="text-left py-3 px-4 font-righteous">Cargo</th>
                      <th className="text-left py-3 px-4 font-righteous">Status</th>
                      <th className="text-center py-3 px-4 font-righteous">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEmployees.map((employee) => (
                      <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{employee.name}</td>
                        <td className="py-3 px-4 text-gray-600">{employee.email}</td>
                        <td className="py-3 px-4 text-gray-600">{employee.phone}</td>
                        <td className="py-3 px-4">{employee.position}</td>
                        <td className="py-3 px-4">{getStatusBadge(employee.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(employee)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(employee.id)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
