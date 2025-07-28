import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Pagination } from '../components/ui/pagination';
import { Loading } from '../components/ui/loading';
import ToastMessage from '@/components/layout/ToastMessage';

const Users: React.FC = () => {
  const BASE_URL = 'https://backend-turma-a-2025.onrender.com';

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    status?: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
  }>({
    visible: false,
    message: "",
    status: "INFO",
  });

  const itemsPerPage = 10;

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/usuarios`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          }
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar usuários');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      setToast({
        visible: true,
        message: error.message || 'Erro ao carregar usuários.',
        status: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const userNameMatch = !nameFilter || user.usu_nome.toLowerCase().includes(nameFilter.toLowerCase());
    const userStatusMatch = statusFilter === 'all' || (user.usu_ativo ? 'active' : 'inactive') === statusFilter;
    return userNameMatch && userStatusMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBanUser = async (userId: number, currentStatus: boolean) => {
    const action = currentStatus ? 'desativar' : 'ativar';
    if (confirm(`Tem certeza que deseja ${action} este usuário?`)) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/admin/usuarios/status/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro ao ${action} usuário`);
        }
        await response.json();

        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.usu_codigo === userId ? { ...user, usu_ativo: !currentStatus } : user
          )
        );

        setToast({
          visible: true,
          message: `Usuário ${currentStatus ? 'banido' : 'desbanido'} com sucesso!`,
          status: 'SUCCESS',
        });
      } catch (error: any) {
        console.error(`Erro ao ${action} usuário:`, error);
        setToast({
          visible: true,
          message: error.message || `Erro ao ${action} usuário.`,
          status: 'ERROR',
        });
      } finally {
        setLoading(false);
      }
    }
  };


  const handleDeleteUser = async (userId: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário? Esta ação é irreversível.')) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/admin/usuarios/excluir/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao excluir usuário');
        }
        await response.json(); 

        setUsers(prevUsers => prevUsers.filter(user => user.usu_codigo !== userId));
        setToast({
          visible: true,
          message: 'Usuário excluído com sucesso!',
          status: 'SUCCESS',
        });
      } catch (error: any) {
        console.error('Erro ao excluir usuário:', error);
        setToast({
          visible: true,
          message: error.message || 'Erro ao excluir usuário.',
          status: 'ERROR',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      : <Badge className="bg-red-100 text-red-800">Inativo</Badge>;
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
        <h1 className="text-3xl font-righteous text-black">Usuários</h1>
      </div>

      ---

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
          <CardTitle className="font-righteous">Lista de Usuários</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuário(s) encontrado(s)
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
                      <th className="text-left py-3 px-4 font-righteous">Status</th>
                      <th className="text-left py-3 px-4 font-righteous">Ações</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.usu_codigo} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{user.usu_nome}</td>
                        <td className="py-3 px-4 text-gray-600">{user.usu_email}</td>
                        <td className="py-3 px-4 text-gray-600">{user.usu_telefone}</td>
                        <td className="py-3 px-4">{getStatusBadge(user.usu_ativo)}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-start space-x-2"> 
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBanUser(user.usu_codigo, user.usu_ativo)}
                              className={user.usu_ativo ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                            >
                              {user.usu_ativo ? 'Banir' : 'Desbanir'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user.usu_codigo)}
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

export default Users;