import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Box, LinearProgress } from "@mui/material";
import ToastMessage from "./ToastMessage";
import { useNavigate } from "react-router-dom";
import { handleAuthError } from "@/utils/handleAuthError";

export default function DailyPaymentsCard() {
  const navigate = useNavigate();
  const [haPagamentos, setHaPagamentos] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", status: "INFO" as "INFO" | "SUCCESS" | "ERROR" | "WARNING" });

  const BASE_URL = 'https://backend-turma-a-2025.onrender.com';

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/pagamentos/verificar-hoje`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (handleAuthError(res, setToast, navigate)) return;
      const data = await res.json();
      setHaPagamentos(data.ha_pagamentos);
    } catch (error: any) {
      setToast({ visible: true, message: error?.message || 'Erro ao verificar pagamentos', status: 'ERROR' });
    } finally {
      setLoading(false);
    }
  }

  async function handleGerarDiarias() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/pagamentos/gerar-diarias`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` } });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Erro ao gerar diárias.');
      }
      setToast({ visible: true, message: 'Diárias geradas com sucesso!', status: 'SUCCESS' });
    } catch (error: any) {
      setToast({ visible: true, message: error?.message || 'Erro inesperado.', status: 'ERROR' });
    } finally {
      fetchData();
      setLoading(false);
    }
  }

  return (
    <Card className="w-full mt-6">
      {toast.visible && <ToastMessage message={toast.message} status={toast.status} onHide={() => setToast({ ...toast, visible: false })} />}
      <CardHeader>
        <CardTitle>Diárias dos Funcionários</CardTitle>
        <CardDescription>Geração e controle diário</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Box sx={{ width: '100%' }}><LinearProgress /></Box>
        ) : haPagamentos ? (
          <p className="text-green-600 font-semibold">As diárias já foram geradas hoje.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-yellow-700 font-semibold">Nenhuma diária foi gerada hoje.</p>
            <Button onClick={handleGerarDiarias} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
              Gerar Diárias
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
