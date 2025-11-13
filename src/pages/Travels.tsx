import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Pagination } from '../components/ui/pagination';
import { Loading } from '../components/ui/loading';
import ToastMessage from '@/components/layout/ToastMessage';
import { handleAuthError } from '@/utils/handleAuthError';
import { useNavigate } from 'react-router-dom';
import { ToastProps } from '@/types/toast';

interface Travel {
    via_codigo: number;
    via_origem: string;
    via_destino: string;
    via_valor: string;
    via_formapagamento: string;
    via_data: string;
    via_servico: 'Mototáxi' | 'Entrega';
    via_status: 'em andamento' | 'finalizada';
    via_observacoes: string | null;
    funcionario_nome: string | null;
    atendente_nome: string | null;
    usuario_nome: string;
    usu_codigo: number;
}

const Travels: React.FC = () => {
    const BASE_URL = 'https://backend-turma-a-2025.onrender.com';

    const [travels, setTravels] = useState<Travel[]>([]);
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState('all');
    const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
    const [originDestinationFilter, setOriginDestinationFilter] = useState('');

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);

    const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });


    const itemsPerPage = 10;


    async function fetchTravelsData() {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/admin/viagens`,
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
                throw new Error(errorData.message || 'Erro ao buscar viagens');
            }
            const data: Travel[] = await response.json();
            setTravels(data);
        } catch (error: any) {
            console.error('Erro ao buscar viagens:', error);
            setToast({
                visible: true,
                message: error.message || 'Erro ao buscar viagens',
                status: 'ERROR',
            });
            setTravels([]);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchTravelsData();
    }, []);

    const filteredTravels = travels.filter((travel) => {
        const matchesStatus = statusFilter === 'all' || travel.via_status === statusFilter;
        const matchesServiceType = serviceTypeFilter === 'all' || travel.via_servico === serviceTypeFilter;
        const matchesOriginDestination =
            originDestinationFilter === '' ||
            travel.via_origem.toLowerCase().includes(originDestinationFilter.toLowerCase()) ||
            travel.via_destino.toLowerCase().includes(originDestinationFilter.toLowerCase());

        return matchesStatus && matchesServiceType && matchesOriginDestination;
    });

    const totalPages = Math.ceil(filteredTravels.length / itemsPerPage);
    const paginatedTravels = filteredTravels.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    async function handleFinalizar(id: number) {
        try {

            const response = await fetch(`${BASE_URL}/api/admin/viagens/finalizar/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                }
            });
            fetchTravelsData();

            if (!response.ok) {
                throw new Error('Falha ao finalizar as viagens');
            }

            const data = await response.json();

            console.log('Viagens finalizadas com sucesso:', data?.mensagem || data);
            setToast({
                visible: true,
                message: 'Viagem finalizada com sucesso!',
                status: 'SUCCESS',
            })
        } catch (error) {
            console.error('Erro ao finalizar a viagem:', error);
            setToast({
                visible: true,
                message: 'Erro ao finalizar a viagem. Tente novamente.',
                status: 'ERROR',
            });
        }
    }
    async function handleFinalizarTodas() {
        try {
            const response = await fetch(`${BASE_URL}/api/admin/viagens/finalizar-todas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
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
    }

    const getStatusBadge = (status: Travel['via_status']) => {
        switch (status) {
            case 'em andamento':
                return <Badge className="bg-yellow-100 text-yellow-800" >Andamento</Badge>;
            case 'finalizada':
                return <Badge className="bg-green-100 text-green-800" variant='success'>Finalizada</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getServiceBadge = (service: Travel['via_servico']) => {
        switch (service) {
            case 'Mototáxi':
                return <Badge variant="outline">Mototáxi</Badge>;
            case 'Entrega':
                return <Badge variant="outline">Entrega</Badge>;
            default:
                return <Badge variant="outline">{service}</Badge>;
        }
    };

    return (
        <div className="w-full min-h-screen p-6">
            {toast.visible && (
                <ToastMessage
                    message={toast.message}
                    status={toast.status}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-righteous text-black">Viagens</h1>
            </div>
            <Card className="zoomx-card mb-6">
                <CardHeader>
                    <CardTitle className="font-righteous">Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium">Status</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos os status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os status</SelectItem>
                                    <SelectItem value="em andamento">Em andamento</SelectItem>
                                    <SelectItem value="finalizada">Finalizada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Tipo de Serviço</label>
                            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos os tipos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os tipos</SelectItem>
                                    <SelectItem value="Mototáxi">Mototáxi</SelectItem>
                                    <SelectItem value="Entrega">Entrega</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Origem / Destino</label>
                            <Input
                                placeholder="Pesquisar por origem ou destino..."
                                value={originDestinationFilter}
                                onChange={(e) => setOriginDestinationFilter(e.target.value)}
                                className="zoomx-input"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setStatusFilter('all');
                                    setServiceTypeFilter('all');
                                    setOriginDestinationFilter('');
                                    setCurrentPage(1);
                                }}
                            >
                                Limpar Filtros
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Travels Table Card */}
            <Card className="zoomx-card">
                <CardHeader>
                    <CardTitle className="font-righteous">Lista de Viagens</CardTitle>
                    <CardDescription>
                        {filteredTravels.length} viagem(s) encontrada(s)
                    </CardDescription>
                    {
                        travels.filter(travel => travel.via_status === 'em andamento').length >= 2 && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={handleFinalizarTodas}
                            >
                                Finalizar todas
                            </Button>
                        )
                    }

                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Loading text='Carregando viagens...' />
                    ) : travels.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">Nenhuma viagem encontrada.</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-100 text-center border-b border-gray-200 text-sm">
                                            <th className="px-4 py-2 font-righteous">Origem</th>
                                            <th className="px-4 py-2 font-righteous">Destino</th>
                                            <th className="px-4 py-2 font-righteous">Valor (R$)</th>
                                            <th className="px-4 py-2 font-righteous">F. Pagamento</th>
                                            <th className="px-4 py-2 font-righteous">Status</th>
                                            <th className="px-4 py-2 font-righteous">Serviço</th>
                                            <th className="px-4 py-2 font-righteous">Mototaxista</th>
                                            <th className="px-4 py-2 font-righteous">Atendente</th>
                                            <th className="px-4 py-2 font-righteous">Usuário</th>
                                            <th className="px-4 py-2 font-righteous">Data</th>
                                            <th className="px-4 py-2 font-righteous">Ação</th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        {paginatedTravels.map((travel) => (
                                            <tr key={travel.via_codigo} className="border-b text-center border-gray-100">
                                                <td className="px-4 py-2">{travel.via_origem}</td>
                                                <td className="px-4 py-2">{travel.via_destino}</td>
                                                <td className="px-4 py-2">R$ {parseFloat(travel.via_valor).toFixed(2)}</td>
                                                <td className="px-4 py-2">{travel.via_formapagamento}</td>
                                                <td className="px-4 py-2">{getStatusBadge(travel.via_status)}</td>
                                                <td className="px-4 py-2">{getServiceBadge(travel.via_servico)}</td>
                                                <td className="px-4 py-2">{travel.funcionario_nome || '-'}</td>
                                                <td className="px-4 py-2">{travel.atendente_nome || '-'}</td>
                                                <td className="px-4 py-2">{travel.usuario_nome}</td>
                                                <td className="px-4 py-2">
                                                    {new Date(travel.via_data).toLocaleString('pt-BR')}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {travel.via_status === 'em andamento' ? (
                                                        <Button
                                                            variant="alert"
                                                            onClick={() => handleFinalizar(travel.via_codigo)}
                                                        >
                                                            Finalizar
                                                        </Button>
                                                    ) : (
                                                        '-'
                                                    )}
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

export default Travels;