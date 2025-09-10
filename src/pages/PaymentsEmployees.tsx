import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, Clock, Plus, Filter, Calendar, User, Frown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, isToday, parseISO, isBefore, startOfDay, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import ToastMessage from '@/components/layout/ToastMessage';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { handleAuthError } from '@/utils/handleAuthError';
import { formatCurrency } from '@/utils/formatCurrency';

import { ToastProps } from '@/types/toast';
import { PaymentsEmployeesProps } from '@/types/paymentsemployees';
import { Loading } from '@/components/ui/loading';

type PaymentStatus = 'PAGO' | 'PENDENTE' | 'CANCELADO' | 'TODOS';
type PaymentMethod = 'PIX' | 'DINHEIRO' | 'TED' | 'TODOS';

export default function PaymentsEmployees() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentsEmployeesProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDiarias, setLoadingDiarias] = useState(false);
  const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>('TODOS');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod>('TODOS');
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, boolean>>({
    id: true,
    employee: true,
    amount: true,
    method: true,
    date: true,
    status: true,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backend-turma-a-2025.onrender.com/api/admin/pagamentos/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (handleAuthError(response, setToast, navigate)) return;

      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      setToast({
        visible: true,
        message: 'Erro ao buscar pagamentos. Tente novamente mais tarde.',
        status: 'ERROR'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayments = async () => {
    setLoadingDiarias(true);
    try {
      const response = await fetch('https://backend-turma-a-2025.onrender.com/api/admin/pagamentos/gerar-diarias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 204) {
        setToast({
          visible: true,
          message: 'As diárias já foram geradas hoje.',
          status: 'INFO'
        });
      } else {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || 'Erro ao gerar diárias');
        setToast({
          visible: true,
          message: 'Diárias geradas com sucesso!',
          status: 'SUCCESS'
        });
        fetchPayments();
      }

      if (handleAuthError(response, setToast, navigate)) return;

    } catch (error: any) {
      console.error('Erro ao gerar diárias:', error);
      setToast({
        visible: true,
        message: error?.message || 'Erro inesperado. Tente novamente mais tarde.',
        status: 'ERROR'
      });
    } finally {
      setLoadingDiarias(false);
    }
  };

  const getPaymentStatus = (payment: PaymentsEmployeesProps) => {
    const rawStatus = payment.pag_status.toUpperCase();
    const paymentDate = parseISO(payment.pag_data);
    if (rawStatus === 'PENDENTE' && isBefore(startOfDay(paymentDate), startOfToday())) {
      return 'CANCELADO';
    }
    return rawStatus;
  };

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const status = getPaymentStatus(payment);

      const matchesSearch =
        payment.pag_codigo.toString().includes(searchTerm) ||
        payment.fun_nome.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'TODOS' || status === statusFilter;

      const matchesMethod =
        methodFilter === 'TODOS' || payment.pag_forma_pagamento.toUpperCase() === methodFilter;

      const matchesDate =
        !dateFilter || format(parseISO(payment.pag_data), 'yyyy-MM-dd') === dateFilter;

      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    });
  }, [payments, searchTerm, statusFilter, methodFilter, dateFilter]);

  const paymentStats = useMemo(() => {
    return payments.reduce((acc, payment) => {
      const status = getPaymentStatus(payment);

      acc.total++;
      acc.totalAmount += payment.pag_valor;

      if (status === 'PAGO') {
        acc.paid++;
        acc.paidAmount += payment.pag_valor;
      } else if (status === 'PENDENTE') {
        acc.pending++;
        acc.pendingAmount += payment.pag_valor;
      } else if (status === 'CANCELADO') {
        acc.canceled++;
      }

      return acc;
    }, {
      total: 0,
      paid: 0,
      pending: 0,
      canceled: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
    });
  }, [payments]);

  const renderStatusBadge = (payment: PaymentsEmployeesProps) => {
    const status = getPaymentStatus(payment);

    switch (status) {
      case 'PAGO':
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" />Pago</Badge>;
      case 'PENDENTE':
        return <Badge variant="pending" className="gap-1"><Clock className="h-3 w-3" />Pendente</Badge>;
      case 'CANCELADO':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Cancelado</Badge>;
      default:
        return <Badge variant="outline" className="gap-1">{status}</Badge>;
    }
  };

  const renderPaymentMethod = (method: string) => {
    switch (method.toUpperCase()) {
      case 'PIX': return <Badge variant="default">PIX</Badge>;
      case 'DINHEIRO': return <Badge variant="secondary">Dinheiro</Badge>;
      case 'TED': return <Badge variant="outline">TED</Badge>;
      default: return <span className="text-muted-foreground">{method || 'Não especificado'}</span>;
    }
  };

  if (loading) {
    return (
      <Loading text='Carregando pagamentos...' />
    )
  }

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
      {toast.visible && (
        <ToastMessage
          message={toast.message}
          status={toast.status}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Diárias</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os pagamentos de diárias dos funcionários
          </p>
        </div>

        <Button onClick={handlePayments} disabled={loadingDiarias}>
          <Plus className="mr-2 h-4 w-4" />
          {loadingDiarias ? 'Gerando...' : 'Gerar Diárias'}
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentStats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagamentos Realizados</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentStats.paid}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentStats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagamentos Cancelados</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentStats.canceled}</div>
              </CardContent>
            </Card>
          </div>
          <h1>Para confirmar e autorizar o pagamento, vá para a seção "Funcionários"</h1>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Lista de Pagamentos</CardTitle>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <Input
                    placeholder="Pesquisar funcionário ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-[300px]"
                  />

                  <div className="flex gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value as PaymentStatus)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODOS">Todos</SelectItem>
                        <SelectItem value="PAGO">Pago</SelectItem>
                        <SelectItem value="PENDENTE">Pendente</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={methodFilter}
                      onValueChange={(value) => setMethodFilter(value as PaymentMethod)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODOS">Todos</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                        <SelectItem value="TED">TED</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      type="date"
                      value={dateFilter || ''}
                      onChange={(e) => setDateFilter(e.target.value || null)}
                      className="w-[140px]"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        <Filter className="mr-2 h-4 w-4" />
                        Colunas
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {Object.entries({
                        id: 'ID',
                        employee: 'Funcionário',
                        amount: 'Valor',
                        method: 'Método',
                        date: 'Data',
                        status: 'Status',
                      }).map(([key, label]) => (
                        <DropdownMenuCheckboxItem
                          key={key}
                          checked={columnFilters[key]}
                          onCheckedChange={(checked) =>
                            setColumnFilters({ ...columnFilters, [key]: checked })
                          }
                        >
                          {label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Input
                    type="reset"
                    value="Limpar Filtros"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('TODOS');
                      setMethodFilter('TODOS');
                      setDateFilter(null);
                    }}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columnFilters.id && <TableHead>ID</TableHead>}
                    {columnFilters.employee && <TableHead>Funcionário</TableHead>}
                    {columnFilters.amount && <TableHead className="text-right">Valor</TableHead>}
                    {columnFilters.method && <TableHead>Método</TableHead>}
                    {columnFilters.date && <TableHead>Data</TableHead>}
                    {columnFilters.status && <TableHead>Status</TableHead>}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        {Object.entries(columnFilters).map(([key]) => (
                          <TableCell key={key}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.pag_codigo}>
                        {columnFilters.id && <TableCell className="font-medium">#{payment.pag_codigo}</TableCell>}
                        {columnFilters.employee && <TableCell>{payment.fun_nome}</TableCell>}
                        {columnFilters.amount && <TableCell className="text-right">{formatCurrency(payment.pag_valor)}</TableCell>}
                        {columnFilters.method && <TableCell>{renderPaymentMethod(payment.pag_forma_pagamento)}</TableCell>}
                        {columnFilters.date && <TableCell>{format(parseISO(payment.pag_data), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>}
                        {columnFilters.status && <TableCell>{renderStatusBadge(payment)}</TableCell>}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={Object.values(columnFilters).filter(Boolean).length} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                          <Frown className="h-8 w-8" />
                          Nenhum pagamento encontrado
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
