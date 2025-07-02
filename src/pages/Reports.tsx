
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Dados de exemplo para os relatórios
const dailyData = [
  { day: 'Seg', corridas: 45, entregas: 30, faturamento: 1500 },
  { day: 'Ter', corridas: 52, entregas: 35, faturamento: 1750 },
  { day: 'Qua', corridas: 48, entregas: 28, faturamento: 1600 },
  { day: 'Qui', corridas: 61, entregas: 42, faturamento: 2100 },
  { day: 'Sex', corridas: 58, entregas: 38, faturamento: 1950 },
  { day: 'Sab', corridas: 73, entregas: 45, faturamento: 2400 },
  { day: 'Dom', corridas: 39, entregas: 25, faturamento: 1300 },
];

const monthlyRevenue = [
  { month: 'Jan', valor: 45000 },
  { month: 'Fev', valor: 52000 },
  { month: 'Mar', valor: 48000 },
  { month: 'Abr', valor: 61000 },
  { month: 'Mai', valor: 58000 },
  { month: 'Jun', valor: 73000 },
];

const serviceDistribution = [
  { name: 'Moto Táxi', value: 65, color: '#000000' },
  { name: 'Entregas', value: 35, color: '#666666' },
];

const topEmployees = [
  { name: 'João Silva', corridas: 156, entregas: 89, faturamento: 8500 },
  { name: 'Maria Santos', corridas: 134, entregas: 76, faturamento: 7200 },
  { name: 'Pedro Costa', corridas: 128, entregas: 71, faturamento: 6900 },
  { name: 'Ana Lima', corridas: 119, entregas: 68, faturamento: 6400 },
];

const Reports: React.FC = () => {
  const [period, setPeriod] = useState('week');
  const [reportType, setReportType] = useState('general');

  const exportReport = (format: string) => {
    console.log(`Exportando relatório em formato: ${format}`);
    // Aqui seria implementada a lógica de exportação
  };

  return (
    <div className="space-y-6">
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

      {/* Filtros */}
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

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="zoomx-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Corridas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">376</div>
            <p className="text-xs text-green-600">+12% vs período anterior</p>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Entregas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">243</div>
            <p className="text-xs text-green-600">+8% vs período anterior</p>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">R$ 12.600</div>
            <p className="text-xs text-green-600">+15% vs período anterior</p>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">R$ 20,36</div>
            <p className="text-xs text-red-600">-2% vs período anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Atividades Diárias */}
        <Card className="zoomx-card">
          <CardHeader>
            <CardTitle className="font-righteous">Atividades por Dia</CardTitle>
            <CardDescription>Corridas e entregas realizadas na semana</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="corridas" fill="#000000" name="Corridas" />
                <Bar dataKey="entregas" fill="#666666" name="Entregas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Faturamento Mensal */}
        <Card className="zoomx-card">
          <CardHeader>
            <CardTitle className="font-righteous">Faturamento Mensal</CardTitle>
            <CardDescription>Evolução do faturamento ao longo do ano</CardDescription>
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

        {/* Distribuição de Serviços */}
        <Card className="zoomx-card">
          <CardHeader>
            <CardTitle className="font-righteous">Distribuição de Serviços</CardTitle>
            <CardDescription>Proporção entre moto táxi e entregas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

        {/* Top Funcionários */}
        <Card className="zoomx-card">
          <CardHeader>
            <CardTitle className="font-righteous">Top Funcionários</CardTitle>
            <CardDescription>Funcionários com melhor performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEmployees.map((employee, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                    <p className="font-bold text-black">R$ {employee.faturamento.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">faturamento</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Detalhada */}
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
                  <td className="py-3 px-4">376</td>
                  <td className="py-3 px-4">336</td>
                  <td className="py-3 px-4 text-green-600">+11.9%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Total de Entregas</td>
                  <td className="py-3 px-4">243</td>
                  <td className="py-3 px-4">225</td>
                  <td className="py-3 px-4 text-green-600">+8.0%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Faturamento Total</td>
                  <td className="py-3 px-4">R$ 12.600</td>
                  <td className="py-3 px-4">R$ 10.956</td>
                  <td className="py-3 px-4 text-green-600">+15.0%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Ticket Médio</td>
                  <td className="py-3 px-4">R$ 20,36</td>
                  <td className="py-3 px-4">R$ 19,52</td>
                  <td className="py-3 px-4 text-green-600">+4.3%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Funcionários Ativos</td>
                  <td className="py-3 px-4">45</td>
                  <td className="py-3 px-4">42</td>
                  <td className="py-3 px-4 text-green-600">+7.1%</td>
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
