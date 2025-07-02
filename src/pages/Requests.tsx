
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Pagination } from '../components/ui/pagination';

// Dados de exemplo
const mockRequests = [
  { 
    id: '1', 
    type: 'taxi', 
    userId: '1', 
    userName: 'João Cliente', 
    origin: 'Rua A, 123', 
    destination: 'Rua B, 456', 
    status: 'pending', 
    price: 25.50, 
    createdAt: '2024-07-02T14:30:00', 
    details: 'Corrida urgente para o aeroporto' 
  },
  { 
    id: '2', 
    type: 'delivery', 
    userId: '2', 
    userName: 'Maria Cliente', 
    origin: 'Shopping Center', 
    destination: 'Rua C, 789', 
    status: 'approved', 
    price: 18.00, 
    createdAt: '2024-07-02T13:45:00', 
    details: 'Entrega de documentos' 
  },
  { 
    id: '3', 
    type: 'taxi', 
    userId: '3', 
    userName: 'Pedro Cliente', 
    origin: 'Estação Metro', 
    destination: 'Hospital Central', 
    status: 'completed', 
    price: 32.00, 
    createdAt: '2024-07-02T12:15:00', 
    details: 'Emergência médica' 
  },
];

const Requests: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const itemsPerPage = 10;
  const filteredRequests = mockRequests.filter(request => {
    return (typeFilter === 'all' || request.type === typeFilter) &&
           (statusFilter === 'all' || request.status === statusFilter);
  });
  
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = (requestId: string) => {
    if (confirm('Tem certeza que deseja aprovar esta solicitação?')) {
      console.log('Aprovando solicitação:', requestId);
    }
  };

  const handleReject = (requestId: string) => {
    if (confirm('Tem certeza que deseja recusar esta solicitação?')) {
      console.log('Recusando solicitação:', requestId);
    }
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Recusado</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'taxi':
        return <Badge variant="outline">Moto Táxi</Badge>;
      case 'delivery':
        return <Badge variant="outline">Entrega</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-righteous text-black">Solicitações</h1>
      </div>

      {/* Filtros */}
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
                  <SelectItem value="taxi">Moto Táxi</SelectItem>
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
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Recusado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setTypeFilter('all');
                  setStatusFilter('all');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Solicitações */}
      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Lista de Solicitações</CardTitle>
          <CardDescription>
            {filteredRequests.length} solicitação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-righteous">Tipo</th>
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
                  <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{getTypeBadge(request.type)}</td>
                    <td className="py-3 px-4 font-medium">{request.userName}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-32 truncate">{request.origin}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-32 truncate">{request.destination}</td>
                    <td className="py-3 px-4">R$ {request.price.toFixed(2)}</td>
                    <td className="py-3 px-4">{getStatusBadge(request.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(request)}
                        >
                          Detalhes
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApprove(request.id)}
                            >
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(request.id)}
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
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
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
                  <p className="text-sm text-gray-600">{getTypeBadge(selectedRequest.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p className="text-sm text-gray-600">{getStatusBadge(selectedRequest.status)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Cliente</label>
                <p className="text-sm text-gray-600">{selectedRequest.userName}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Origem</label>
                <p className="text-sm text-gray-600">{selectedRequest.origin}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Destino</label>
                <p className="text-sm text-gray-600">{selectedRequest.destination}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Valor</label>
                <p className="text-sm text-gray-600">R$ {selectedRequest.price.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Detalhes</label>
                <p className="text-sm text-gray-600">{selectedRequest.details}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Data/Hora</label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedRequest.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Requests;
