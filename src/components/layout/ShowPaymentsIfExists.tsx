import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Button } from "../ui/button";
import { Box, LinearProgress } from "@mui/material";
import ToastMessage from "./ToastMessage";

import { useNavigate } from "react-router-dom";
import { handleAuthError } from "@/utils/handleAuthError";
export default function DailyPaymentsCard() {
    const navigate = useNavigate();
    const [haPagamentos, setHaPagamentos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{
        visible: boolean;
        message: string;
        status?: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
    }>({
        visible: false,
        message: "",
        status: "INFO",
    });

    const BASE_URL = 'https://backend-turma-a-2025.onrender.com';

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/admin/pagamentos/verificar-hoje`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (handleAuthError(response, setToast, navigate)) return;

            const data = await response.json();
            setHaPagamentos(data.ha_pagamentos);
        } catch (error) {
            setToast({
                visible: true,
                message: error.message || 'Erro ao verificar pagamentos',
                status: 'ERROR',
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleGerarDiarias() {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/api/admin/pagamentos/gerar-diarias`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || 'Erro ao gerar diárias.';
                throw new Error(errorMessage);
            }

            setToast({
                visible: true,
                message: 'Diárias geradas com sucesso!',
                status: 'SUCCESS',
            });

        } catch (error) {
            console.error('Erro ao gerar diárias:', error);
            setToast({
                visible: true,
                message: error instanceof Error ? error.message : 'Erro inesperado. Tente novamente mais tarde.',
                status: 'ERROR',
            });
        } finally {
            setLoading(false);
            fetchData();
        }
    }


    return (
        <Card className="zoomx-card w-full mt-10">
            {toast.visible && (
                <ToastMessage
                    message={toast.message}
                    status={toast.status}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}
            <CardHeader>
                <CardTitle className="font-righteous">Diárias dos Funcionários</CardTitle>
                <CardDescription>Controle e geração das diárias</CardDescription>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress color="success" />
                    </Box>
                ) : haPagamentos ? (
                    <div className="bg-green-50 border border-green-300 rounded-lg shadow-lg p-6">
                        <p className="text-green-700 font-semibold">As diárias já foram geradas para hoje.</p>
                        <p className="text-green-600 mb-4">
                            Atualize os pagamentos pendentes para liberar os funcionários para as próximas viagens.
                        </p>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg shadow-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-yellow-500 text-3xl">⚠️</div>
                            <h2 className="text-xl font-semibold text-yellow-800">
                                Nenhuma diária foi gerada para hoje.
                            </h2>
                        </div>
                        <p className="text-yellow-700 mb-6">
                            Lembre-se de gerar as diárias dos funcionários e atualizar os pagamentos para que possam ser processados corretamente.
                        </p>
                        <Button
                            onClick={handleGerarDiarias}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition"
                        >
                            Gerar Diárias
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
