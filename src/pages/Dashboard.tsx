
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Dados de exemplo para os gráficos
const monthlyData = [
  { name: 'Jan', corridas: 120, entregas: 80, faturamento: 15000 },
  { name: 'Fev', corridas: 140, entregas: 95, faturamento: 18000 },
  { name: 'Mar', corridas: 160, entregas: 110, faturamento: 22000 },
  { name: 'Abr', corridas: 180, entregas: 125, faturamento: 25000 },
  { name: 'Mai', corridas: 200, entregas: 140, faturamento: 28000 },
  { name: 'Jun', corridas: 220, entregas: 155, faturamento: 32000 },
];

const statusData = [
  { name: 'Ativos', value: 65, color: '#000000' },
  { name: 'Inativos', value: 25, color: '#666666' },
  { name: 'Manutenção', value: 10, color: '#cccccc' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-righteous text-black">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Atualizado em {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="zoomx-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Corridas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">1,234</div>
            <p className="text-xs text-gray-600">+20.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entregas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">856</div>
            <p className="text-xs text-gray-600">+15.3% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">R$ 32.450</div>
            <p className="text-xs text-gray-600">+12.5% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Motocicletas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">45</div>
            <p className="text-xs text-gray-600">5 em manutenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="zoomx-card">
          <CardHeader>
            <CardTitle className="font-righteous">Estatísticas Mensais</CardTitle>
            <CardDescription>Corridas, entregas e faturamento por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="corridas" fill="#000000" name="Corridas" />
                <Bar dataKey="entregas" fill="#666666" name="Entregas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="zoomx-card">
          <CardHeader>
            <CardTitle className="font-righteous">Status das Motocicletas</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Últimas Atividades */}
      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous">Últimas Atividades</CardTitle>
          <CardDescription>Atividades recentes no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { tipo: 'Corrida', usuario: 'João Silva', valor: 'R$ 25,00', horario: '14:30' },
              { tipo: 'Entrega', usuario: 'Maria Santos', valor: 'R$ 18,50', horario: '14:25' },
              { tipo: 'Corrida', usuario: 'Pedro Costa', valor: 'R$ 32,00', horario: '14:20' },
              { tipo: 'Entrega', usuario: 'Ana Lima', valor: 'R$ 22,75', horario: '14:15' },
            ].map((atividade, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div>
                    <p className="font-medium text-black">{atividade.tipo}</p>
                    <p className="text-sm text-gray-600">{atividade.usuario}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-black">{atividade.valor}</p>
                  <p className="text-sm text-gray-600">{atividade.horario}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
