
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Pagination } from '../components/ui/pagination';

// Dados de exemplo
const mockMotorcycles = [
  { id: '1', brand: 'Honda', model: 'CG 160', year: 2023, licensePlate: 'ABC-1234', status: 'available', employeeId: null, employeeName: null, createdAt: '2024-01-15' },
  { id: '2', brand: 'Yamaha', model: 'Factor 125', year: 2022, licensePlate: 'DEF-5678', status: 'in_use', employeeId: '1', employeeName: 'João Silva', createdAt: '2024-01-20' },
  { id: '3', brand: 'Honda', model: 'Biz 125', year: 2021, licensePlate: 'GHI-9012', status: 'maintenance', employeeId: null, employeeName: null, createdAt: '2024-02-01' },
  { id: '4', brand: 'Suzuki', model: 'Burgman 125', year: 2023, licensePlate: 'JKL-3456', status: 'available', employeeId: null, employeeName: null, createdAt: '2024-02-10' },
];

const Motorcycles: React.FC = () => {
  const [brandFilter, setBrandFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMotorcycle, setEditingMotorcycle] = useState<any>(null);
  
  const itemsPerPage = 10;
  const filteredMotorcycles = mockMotorcycles.filter(motorcycle => {
    return (!brandFilter || motorcycle.brand === brandFilter) &&
           (!statusFilter || motorcycle.status === statusFilter);
  });
  
  const totalPages = Math.ceil(filteredMotorcycles.length / itemsPerPage);
  const paginatedMotorcycles = filteredMotorcycles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (motorcycle: any) => {
    setEditingMotorcycle(motorcycle);
    setIsModalOpen(true);
  };

  const handleDelete = (motorcycleId: string) => {
    if (confirm('Tem certeza que deseja excluir esta motocicleta?')) {
      console.log('Excluindo motocicleta:', motorcycleId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvando motocicleta:', editingMotorcycle);
    setIsModalOpen(false);
    setEditingMotorcycle(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
      case 'in_use':
        return <Badge className="bg-blue-100 text-blue-800">Em Uso</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Manutenção</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-righteous text-black">Motocicletas</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="zoomx-button" onClick={() => setEditingMotorcycle({})}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Motocicleta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-righteous">
                {editingMotorcycle?.id ? 'Editar Motocicleta' : 'Nova Motocicleta'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da motocicleta abaixo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Marca</label>
                  <Input 
                    className="zoomx-input" 
                    defaultValue={editingMotorcycle?.brand}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Modelo</label>
                  <Input 
                    className="zoomx-input" 
                    defaultValue={editingMotorcycle?.model}
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
                    max="2024"
                    className="zoomx-input" 
                    defaultValue={editingMotorcycle?.year}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Placa</label>
                  <Input 
                    className="zoomx-input" 
                    defaultValue={editingMotorcycle?.licensePlate}
                    placeholder="ABC-1234"
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select defaultValue={editingMotorcycle?.status || 'available'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="in_use">Em Uso</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Marca</label>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as marcas</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Yamaha">Yamaha</SelectItem>
                  <SelectItem value="Suzuki">Suzuki</SelectItem>
                  <SelectItem value="Kawasaki">Kawasaki</SelectItem>
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
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="in_use">Em Uso</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setBrandFilter('');
                  setStatusFilter('');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Motocicletas */}
      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Lista de Motocicletas</CardTitle>
          <CardDescription>
            {filteredMotorcycles.length} motocicleta(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-righteous">Marca</th>
                  <th className="text-left py-3 px-4 font-righteous">Modelo</th>
                  <th className="text-left py-3 px-4 font-righteous">Ano</th>
                  <th className="text-left py-3 px-4 font-righteous">Placa</th>
                  <th className="text-left py-3 px-4 font-righteous">Status</th>
                  <th className="text-left py-3 px-4 font-righteous">Funcionário</th>
                  <th className="text-center py-3 px-4 font-righteous">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMotorcycles.map((motorcycle) => (
                  <tr key={motorcycle.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{motorcycle.brand}</td>
                    <td className="py-3 px-4">{motorcycle.model}</td>
                    <td className="py-3 px-4">{motorcycle.year}</td>
                    <td className="py-3 px-4 font-mono">{motorcycle.licensePlate}</td>
                    <td className="py-3 px-4">{getStatusBadge(motorcycle.status)}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {motorcycle.employeeName || '-'}
                    </td>
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
                          onClick={() => handleDelete(motorcycle.id)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Motorcycles;
