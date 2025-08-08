import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Loading } from '@/components/ui/loading';
import ToastMessage from '@/components/layout/ToastMessage';
import { handleAuthError } from '@/utils/handleAuthError';
import { useNavigate } from 'react-router-dom';
import { ToastProps} from '@/types/toast';

interface UsuarioAtivo {
  usu_nome: string;
  total_corridas: number;
  total_gasto: number;
}

interface MototaxistaAtivo {
  fun_nome: string;
  total_corridas: number;
  total_faturado: number;
  media_avaliacao: number | null;
}

interface HorarioPico {
  hora: string;
  total: number;
  periodo: string;
}

interface RotasPopulares {
  rota: string;
  total_viagens: number;
  valor_medio: number;
}

interface RelatorioData {
  data_inicio: string;
  data_fim: string;
  usuarios: {
    total: number;
    ativos: number;
    banidos: number;
    novos: number;
  };
  corridas: {
    total: number;
    finalizadas: number;
    em_andamento: number;
    canceladas: number;
    valor_medio: number;
    faturamento_total: number;
  };
  usuariosAtivos: UsuarioAtivo[];
  mototaxistasAtivos: MototaxistaAtivo[];
  receitaMensal: {
    labels: string[];
    valoresReceita: number[];
    valoresCorridas: number[];
  };
  statusCorridas: {
    labels: string[];
    valores: number[];
    cores: Record<string, string>;
  };
  horariosPico: HorarioPico[];
  rotasPopulares: RotasPopulares[];
}

const BASE_URL = 'https://backend-turma-a-2025.onrender.com';
const API_URL = '/api/admin/relatorios';

const Reports: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const [reportType, setReportType] = useState('general');

  const navigate = useNavigate();
  const [data, setData] = useState<RelatorioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });


  useEffect(() => {
    async function fetchRelatorio() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}${API_URL}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            }
          }
        );
        if (handleAuthError(res, setToast, navigate)) return;

        if (!res.ok) throw new Error('Erro ao buscar relatório');
        const json = await res.json();

        json.usuarios.total = Number(json.usuarios.total);
        json.usuarios.ativos = Number(json.usuarios.ativos);
        json.usuarios.banidos = Number(json.usuarios.banidos);
        json.usuarios.novos = Number(json.usuarios.novos);

        json.corridas.total = Number(json.corridas.total);
        json.corridas.finalizadas = Number(json.corridas.finalizadas);
        json.corridas.em_andamento = Number(json.corridas.em_andamento);
        json.corridas.canceladas = Number(json.corridas.canceladas);
        json.corridas.valor_medio = Number(json.corridas.valor_medio);
        json.corridas.faturamento_total = Number(json.corridas.faturamento_total);

        json.usuariosAtivos = json.usuariosAtivos.map((u: any) => ({
          usu_nome: u.usu_nome,
          total_corridas: Number(u.total_corridas),
          total_gasto: Number(u.total_gasto),
        }));

        json.mototaxistasAtivos = json.mototaxistasAtivos.map((m: any) => ({
          fun_nome: m.fun_nome,
          total_corridas: Number(m.total_corridas),
          total_faturado: Number(m.total_faturado),
          media_avaliacao: m.media_avaliacao ? Number(m.media_avaliacao) : null,
        }));

        json.horariosPico = json.horariosPico.map((h: any) => ({
          hora: h.hora,
          total: Number(h.total),
          periodo: h.periodo,
        }));

        json.rotasPopulares = json.rotasPopulares.map((r: any) => ({
          rota: r.rota,
          total_viagens: Number(r.total_viagens),
          valor_medio: Number(r.valor_medio),
        }));

        json.receitaMensal.valoresReceita = json.receitaMensal.valoresReceita.map((v: string) =>
          Number(v)
        );
        json.receitaMensal.valoresCorridas = json.receitaMensal.valoresCorridas.map((v: string) =>
          Number(v)
        );

        json.statusCorridas.valores = json.statusCorridas.valores.map((v: string) =>
          Number(v)
        );

        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRelatorio();
  }, [period, reportType]);

  const exportReport = (format: string) => {
    if (!data) {
      setToast({
        visible: true,
        message: 'Nenhum dado disponível para exportação.',
        status: 'ERROR',
      });
      return;
    }

    const rows = [
      ['Período', `${data.data_inicio} até ${data.data_fim}`],
      ['Total de Corridas', data.corridas.total],
      ['Corridas Finalizadas', data.corridas.finalizadas],
      ['Corridas Canceladas', data.corridas.canceladas],
      ['Faturamento Total', `R$ ${data.corridas.faturamento_total.toFixed(2)}`],
      ['Valor Médio por Corrida', `R$ ${data.corridas.valor_medio.toFixed(2)}`],
      ['Usuários Ativos', data.usuarios.ativos],
      ['Total de Usuários', data.usuarios.total],
      ['Usuários Novos', data.usuarios.novos],
      ['Usuários Banidos', data.usuarios.banidos],
    ];

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Relatório Geral - ZoomX', 14, 20);

      autoTable(doc, {
        head: [['Métrica', 'Valor']],
        body: rows,
        startY: 30,
      });

      doc.save('relatorio-zoomx.pdf');
    }

    if (format === 'excel') {
      const worksheetData = rows.map(([key, value]) => ({ Métrica: key, Valor: value }));
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

      saveAs(blob, 'relatorio-zoomx.xlsx');
    }
  };


  if (loading) return (
    <div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Loading />
      Montando relatório...
    </div>
  );
  if (error) return <div className="text-red-600">Erro: {error}</div>;
  if (!data) return null;

  const dailyData = data.horariosPico.map((h) => ({
    day: h.hora,
    corridas: h.total,
    entregas: 0,
    faturamento: 0,
  }));

  const monthlyRevenue = data.receitaMensal.labels.map((label, i) => ({
    month: label,
    valor: data.receitaMensal.valoresReceita[i],
  }));

  const serviceDistribution = data.statusCorridas.labels.map((label, i) => ({
    name: label,
    value: data.statusCorridas.valores[i],
    color: data.statusCorridas.cores[label.toLowerCase()] || '#ccc',
  }));

  const topEmployees = data.usuariosAtivos.map((u) => ({
    name: u.usu_nome,
    corridas: u.total_corridas,
    entregas: 0,
    faturamento: u.total_gasto,
  }));

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
        <h1 className="text-3xl font-righteous text-black">Relatórios</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            Exportar PDF
          </Button>

          <Button variant="outline" onClick={() => exportReport('excel')}>
            Exportar Excel
          </Button>
        </div>
      </div>

      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Período</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Relatório Geral</SelectItem>
                  <SelectItem value="financial">Relatório Financeiro</SelectItem>
                  <SelectItem value="operational">Relatório Operacional</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="zoomx-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Corridas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{data.corridas.total}</div>
            <p className="text-xs text-green-600">
              Finalizadas: {data.corridas.finalizadas} | Canceladas: {data.corridas.canceladas}
            </p>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Entregas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">--</div>
            <p className="text-xs text-gray-600">Sem dados disponíveis</p>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">R$ {data.corridas.faturamento_total.toFixed(2)}</div>
            <p className="text-xs text-gray-600">Valor médio: R$ {data.corridas.valor_medio.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{data.usuarios.ativos}</div>
            <p className="text-xs text-gray-600">Total usuários: {data.usuarios.total}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="zoomx-card">
          <CardHeader>
            <CardTitle className="font-righteous">Atividades por Horário Pico</CardTitle>
            <CardDescription>Corridas por horário mais comum</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="corridas" fill="#000000" name="Corridas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader>
            <CardTitle className="font-righteous">Faturamento Mensal</CardTitle>
            <CardDescription>Evolução do faturamento ao longo do período</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Faturamento']} />
                <Line type="monotone" dataKey="valor" stroke="#000000" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader>
            <CardTitle className="font-righteous">Status das Corridas</CardTitle>
            <CardDescription>Distribuição dos status das corridas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader>
            <CardTitle className="font-righteous">Usuários Mais Ativos</CardTitle>
            <CardDescription>Top usuários por corridas e gasto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEmployees.map((employee, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-righteous">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-600">
                        {employee.corridas} corridas • {employee.entregas} entregas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black">
                      R$ {employee.faturamento.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600">faturamento</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Relatório Detalhado</CardTitle>
          <CardDescription>Dados detalhados do período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-righteous">Métrica</th>
                  <th className="text-left py-3 px-4 font-righteous">Valor Atual</th>
                  <th className="text-left py-3 px-4 font-righteous">Período Anterior</th>
                  <th className="text-left py-3 px-4 font-righteous">Variação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Total de Corridas</td>
                  <td className="py-3 px-4">{data.corridas.total}</td>
                  <td className="py-3 px-4">--</td>
                  <td className="py-3 px-4 text-green-600">--</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Total de Entregas</td>
                  <td className="py-3 px-4">--</td>
                  <td className="py-3 px-4">--</td>
                  <td className="py-3 px-4 text-gray-600">Sem dados</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Faturamento Total</td>
                  <td className="py-3 px-4">R$ {data.corridas.faturamento_total.toFixed(2)}</td>
                  <td className="py-3 px-4">--</td>
                  <td className="py-3 px-4 text-green-600">--</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Ticket Médio</td>
                  <td className="py-3 px-4">R$ {data.corridas.valor_medio.toFixed(2)}</td>
                  <td className="py-3 px-4">--</td>
                  <td className="py-3 px-4 text-gray-600">--</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Usuários Ativos</td>
                  <td className="py-3 px-4">{data.usuarios.ativos}</td>
                  <td className="py-3 px-4">{data.usuarios.total}</td>
                  <td className="py-3 px-4 text-green-600">--</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
