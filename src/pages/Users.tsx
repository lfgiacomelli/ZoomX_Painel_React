
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Pagination } from '../components/ui/pagination';

// Dados de exemplo
const mockUsers = [
  { id: '1', name: 'João Cliente', email: 'joao.cliente@email.com', phone: '(11) 91111-1111', status: 'active', totalRides: 45, totalDeliveries: 12, createdAt: '2024-01-10' },
  { id: '2', name: 'Maria Cliente', email: 'maria.cliente@email.com', phone: '(11) 92222-2222', status: 'active', totalRides: 23, totalDeliveries: 8, createdAt: '2024-01-15' },
  { id: '3', name: 'Pedro Cliente', email: 'pedro.cliente@email.com', phone: '(11) 93333-3333', status: 'banned', totalRides: 67, totalDeliveries: 15, createdAt: '2024-01-20' },
  { id: '4', name: 'Ana Cliente', email: 'ana.cliente@email.com', phone: '(11) 94444-4444', status: 'inactive', totalRides: 12, totalDeliveries: 3, createdAt: '2024-02-01' },
];

const Users: React.FC = () => {
  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 10;
  const filteredUsers = mockUsers.filter(user => {
    return (!nameFilter || user.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
           (!statusFilter || user.status === statusFilter);
  });
  
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBanUser = (userId: string) => {
    if (confirm('Tem certeza que deseja banir este usuário?')) {
      console.log('Banindo usuário:', userId);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      console.log('Excluindo usuário:', userId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'banned':
        return <Badge className="bg-red-100 text-red-800">Banido</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-righteous text-black">Usuários</h1>
      </div>

      {/* Filtros */}
      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="banned">Banido</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setNameFilter('');
                  setStatusFilter('');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Lista de Usuários</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-righteous">Nome</th>
                  <th className="text-left py-3 px-4 font-righteous">Email</th>
                  <th className="text-left py-3 px-4 font-righteous">Telefone</th>
                  <th className="text-left py-3 px-4 font-righteous">Status</th>
                  <th className="text-left py-3 px-4 font-righteous">Corridas</th>
                  <th className="text-left py-3 px-4 font-righteous">Entregas</th>
                  <th className="text-center py-3 px-4 font-righteous">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600">{user.phone}</td>
                    <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                    <td className="py-3 px-4">{user.totalRides}</td>
                    <td className="py-3 px-4">{user.totalDeliveries}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        {user.status !== 'banned' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBanUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Banir
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
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

export default Users;
