import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Info, Plus } from 'lucide-react';
import ToastMessage from '@/components/layout/ToastMessage';
import { Skeleton } from '@/components/ui/skeleton';

import { handleAuthError } from '@/utils/handleAuthError';

import { useNavigate } from 'react-router-dom';

import { ToastProps } from '@/types/toast';
import { PaymentsEmployeesProps } from '@/types/paymentsemployees';


export default function PaymentsEmployees() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentsEmployeesProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDiarias, setLoadingDiarias] = useState(false);
  const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });

  const [filterToday, setFilterToday] = useState(false);

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
      setToast({ visible: true, message: 'Erro ao buscar pagamentos. Tente novamente mais tarde.', status: 'ERROR' });
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
        setToast({ visible: true, message: 'As diárias já foram geradas hoje.', status: 'INFO' });
      } else {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || 'Erro ao gerar diárias');
        setToast({ visible: true, message: '✅ Diárias geradas com sucesso!', status: 'SUCCESS' });
        fetchPayments();
      }
      if (handleAuthError(response, setToast, navigate)) return;

    } catch (error: any) {
      console.error('Erro ao gerar diárias:', error);
      setToast({ visible: true, message: error?.message || 'Erro inesperado. Tente novamente mais tarde.', status: 'ERROR' });
    } finally {
      setLoadingDiarias(false);
    }
  };

  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getUTCDate() === today.getUTCDate() &&
      date.getUTCMonth() === today.getUTCMonth() &&
      date.getUTCFullYear() === today.getUTCFullYear()
    );
  };

  const filteredPayments = filterToday
    ? payments.filter((p) => isToday(p.pag_data))
    : payments;

  const renderStatus = (payment: PaymentsEmployeesProps) => {
    const baseClass = 'flex items-center gap-1 text-sm font-medium';
    const status = payment.pag_status.toUpperCase();

    const effectiveStatus =
      status === 'PENDENTE' && !isToday(payment.pag_data) ? 'CANCELADO' : status;

    switch (effectiveStatus) {
      case 'PAGO':
        return <span className={`${baseClass} text-green-600`}><CheckCircle size={16} /> Pago</span>;
      case 'PENDENTE':
        return <span className={`${baseClass} text-yellow-600`}><Clock size={16} /> Pendente</span>;
      case 'CANCELADO':
        return <span className={`${baseClass} text-red-600`}><XCircle size={16} /> Cancelado</span>;
      default:
        return <span className={`${baseClass} text-gray-500`}><Info size={16} /> {status}</span>;
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
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
          <p className="text-sm text-gray-500 mt-1">Gerencie os pagamentos pendentes, pagos e crie novas diárias.</p>
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
              <th className="px-6 py-4 text-left">Código do pagamento</th>
              <th className="px-6 py-4 text-left">Funcionário</th>
              <th className="px-6 py-4 text-left">Valor</th>
              <th className="px-6 py-4 text-center">Forma de Pagamento</th>
              <th className="px-6 py-4 text-left">Data</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
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
            ) : filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.pag_codigo} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-700">{payment.pag_codigo}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{payment.fun_nome}</td>
                  <td className="px-6 py-4">{formatCurrency(payment.pag_valor)}</td>
                  <td className="px-6 py-4 text-gray-700 text-center">
                    {payment.pag_forma_pagament.toLowerCase() === 'pix' ? (
                      <span className="text-green-600 font-medium">PIX</span>
                    ) : (
                      payment.pag_forma_pagament || 'Não especificado'
                    )}
                  </td>
                  <td className="px-6 py-4">{formatDate(payment.pag_data)}</td>
                  <td className="px-6 py-4">{renderStatus(payment)}</td>
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
