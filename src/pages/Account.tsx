import React from 'react';
import { useAuth } from '@/contexts/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Account: React.FC = () => {
  const { funcionario } = useAuth();

  if (!funcionario) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-center text-gray-600 text-lg">Nenhum funcionário autenticado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-righteous text-black">Minha Conta</h1>

      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle className="font-righteous text-xl">Informações do Funcionário</CardTitle>
          <CardDescription>Esses dados são apenas para visualização.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={funcionario.nome} disabled className="zoomx-input" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={funcionario.email} disabled className="zoomx-input" />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" value={funcionario.telefone} disabled className="zoomx-input" />
          </div>

          {funcionario.cpf && (
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" value={funcionario.cpf} disabled className="zoomx-input" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
