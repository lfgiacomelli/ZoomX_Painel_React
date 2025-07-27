import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Info, Plus } from 'lucide-react';
import ToastMessage from '@/components/layout/ToastMessage';
import { Skeleton } from '@/components/ui/skeleton';

type PaymentsEmployeesProps = {
  pag_codigo: number;
  fun_nome: string;
  pag_valor: number;
  pag_status: 'PAGO' | 'PENDENTE' | 'CANCELADO' | string;
  pag_data: string;
  pag_forma_pagament: string;
};

export default function PaymentsEmployees() {
  const [payments, setPayments] = useState<PaymentsEmployeesProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDiarias, setLoadingDiarias] = useState<boolean>(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    status: 'INFO' as 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING',
  });

  const [filterToday, setFilterToday] = useState<boolean>(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.0.26:3000/api/admin/pagamentos/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      setToast({
        visible: true,
        message: 'Erro ao buscar pagamentos. Tente novamente mais tarde.',
        status: 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  };

  async function handlePayments() {
    setLoadingDiarias(true);
    try {
      const response = await fetch('http://192.168.0.26:3000/api/admin/pagamentos/gerar-diarias', {
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
          status: 'INFO',
        });
      } else {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Erro ao gerar diárias');
        }

        setToast({
          visible: true,
          message: '✅ Diárias geradas com sucesso!',
          status: 'SUCCESS',
        });

        fetchPayments();
      }
    } catch (error: any) {
      console.error('Erro ao gerar diárias:', error);
      setToast({
        visible: true,
        message: error?.message || 'Erro inesperado. Tente novamente mais tarde.',
        status: 'ERROR',
      });
    } finally {
      setLoadingDiarias(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const filteredPayments = filterToday
    ? payments.filter((p) => isToday(p.pag_data))
    : payments;

  const renderStatus = (status: string) => {
    const baseClass = 'flex items-center gap-1 text-sm font-medium';

    switch (status.toUpperCase()) {
      case 'PAGO':
        return (
          <span className={`${baseClass} text-green-600`}>
            <CheckCircle size={16} /> Pago
          </span>
        );
      case 'PENDENTE':
        return (
          <span className={`${baseClass} text-yellow-600`}>
            <Clock size={16} /> Pendente
          </span>
        );
      case 'CANCELADO':
        return (
          <span className={`${baseClass} text-red-600`}>
            <XCircle size={16} /> Cancelado
          </span>
        );
      default:
        return (
          <span className={`${baseClass} text-gray-500`}>
            <Info size={16} /> {status}
          </span>
        );
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section className="p-6">
      {toast.visible && (
        <ToastMessage
          message={toast.message}
          status={toast.status}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}

      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Diárias dos Funcionários</h1>
          <p className="text-sm text-gray-500 mt-1">Pagamentos realizados ou pendentes</p>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700 font-medium text-sm">
            <input
              type="checkbox"
              checked={filterToday}
              onChange={() => setFilterToday(!filterToday)}
              className="w-4 h-4"
            />
            Ver hoje
          </label>

          <button
            onClick={handlePayments}
            disabled={loadingDiarias}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus size={16} />
            {loadingDiarias ? 'Gerando...' : 'Gerar Diárias'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-medium">
            <tr>
              <th className="px-6 py-4 text-left">#</th>
              <th className="px-6 py-4 text-left">Funcionário</th>
              <th className="px-6 py-4 text-left">Valor</th>
              <th className="px-6 py-4 text-left">Forma de Pagamento</th>
              <th className="px-6 py-4 text-left">Data</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-t">
                    {Array(6)
                      .fill(0)
                      .map((_, colIdx) => (
                        <td key={colIdx} className="px-6 py-4">
                          <Skeleton className="h-4 w-full max-w-[120px]" />
                        </td>
                      ))}
                  </tr>
                ))
              : filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr
                      key={payment.pag_codigo}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-gray-700">{payment.pag_codigo}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{payment.fun_nome}</td>
                      <td className="px-6 py-4">{formatCurrency(payment.pag_valor)}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {payment.pag_forma_pagament || 'Não especificado'}
                      </td>
                      <td className="px-6 py-4">{formatDate(payment.pag_data)}</td>
                      <td className="px-6 py-4">{renderStatus(payment.pag_status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Nenhum pagamento encontrado.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
