import { useAuth } from "@/contexts/useAuth";
import { ToastProps } from "@/types/toast";
import { useState, useEffect, useCallback } from "react";
import ToastMessage from "@/components/layout/ToastMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, RefreshCw } from "lucide-react";

export default function DailyBilling() {
    const BASE_URL = "https://backend-turma-a-2025.onrender.com";

    const { funcionario, token } = useAuth();
    const funCodigo = funcionario?.id;

    const [faturamentoDiario, setFaturamentoDiario] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<ToastProps>({
        visible: false,
        message: "",
        status: "INFO",
    });

    const fetchFaturamentoDiario = useCallback(async () => {
        if (!funCodigo) return;

        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/api/admin/funcionarios/ganhos-diarios/${funCodigo}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar faturamento diário.");
            }

            const result = await response.json();
            if (result.status !== "success") {
                throw new Error(result.message || "Erro ao buscar faturamento diário.");
            }

            setFaturamentoDiario(result.data.totalGanhos ?? 0);
        } catch (error) {
            console.error("Erro ao buscar faturamento diário:", error);
            setToast({
                visible: true,
                message: error instanceof Error ? error.message : "Erro desconhecido.",
                status: "ERROR",
            });
        } finally {
            setLoading(false);
        }
    }, [BASE_URL, token, funCodigo]);

    useEffect(() => {
        fetchFaturamentoDiario();
    }, [fetchFaturamentoDiario]);

    return (
        <div className="max-w-full mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 space-y-6">
            {toast.visible && (
                <ToastMessage
                    message={toast.message}
                    status={toast.status}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}

            <header className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <DollarSign className="text-green-600" size={24} />
                    Faturamento Diário
                </h2>
                <button
                    onClick={fetchFaturamentoDiario}
                    disabled={loading}
                    className={`p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 ${loading ? "cursor-not-allowed opacity-50" : ""
                        }`}
                >
                    <RefreshCw className={`${loading ? "animate-spin" : ""}`} size={16} />
                    Atualizar
                </button>
            </header>

            <main className="text-center">
                {loading ? (
                    <Skeleton className="h-12 w-40 mx-auto" />
                ) : faturamentoDiario !== null ? (
                    <p className="text-3xl font-bold text-green-600">
                        {faturamentoDiario.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </p>
                ) : (
                    <p className="text-gray-500">Nenhum dado disponível</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                    Valor estimado acumulado do dia de hoje
                </p>
            </main>
        </div>
    );
}
