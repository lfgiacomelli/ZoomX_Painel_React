import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "../components/ui/skeleton";
import { ToastProps } from "@/types/toast";
import ToastMessage from "@/components/layout/ToastMessage";
import { Motorcycle } from "@/types/motorcycle";
import { Bike, Calendar, AlertCircle, File, Palette, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/useAuth";
import { mapColor } from "@/utils/motorcyclesColors";
import { Loading } from "@/components/ui/loading";

export default function EmployeeMotorcycle() {
    const { funcionario } = useAuth();
    const funcionarioId = funcionario?.id;

    const [toast, setToast] = useState<ToastProps>({
        visible: false,
        message: "",
        status: "INFO",
    });
    const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

      const BASE_URL = "https://backend-turma-a-2025.onrender.com";
    

    


    const fetchMotorcycleData = useCallback(async () => {
        if (!funcionarioId) return;

        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}/api/admin/motocicletas/funcionario/${funcionarioId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar dados da motocicleta");
            }

            const data: Motorcycle = await response.json();
            setMotorcycle(data);
            setLastUpdated(format(new Date(), "PPpp", { locale: ptBR }));
        } catch (error) {
            console.error(error);
            setToast({
                visible: true,
                message: error instanceof Error ? error.message : "Erro desconhecido ao buscar dados",
                status: "ERROR",
            });
        } finally {
            setLoading(false);
        }
    }, [funcionarioId]);

    useEffect(() => {
        fetchMotorcycleData();
    }, [fetchMotorcycleData]);

    const handleRefresh = () => fetchMotorcycleData();

    if(loading){
        return <Loading text="Carregando dados da motocicleta..." />;
    }

    return (
        <div className="p-6 max-w-full mx-auto space-y-8">
            {toast.visible && (
                <ToastMessage
                    message={toast.message}
                    status={toast.status}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}

            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <Bike className="text-blue-600" size={28} />
                        <span>Sua motocicleta</span>
                    </h1>
                    {lastUpdated && (
                        <p className="text-sm text-gray-500 mt-1">
                            Atualizado em: {lastUpdated}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                        Esta motocicleta está vinculada ao seu código de funcionário.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Caso haja algum dado incorreto, entre em contato com o atual atendente na empresa para corrigir essa informação!
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                >
                    Atualizar
                </button>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/2" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-16 rounded-lg" />
                            ))}
                        </div>
                    </div>
                ) : motorcycle ? (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {motorcycle.mot_modelo}
                                </h2>
                                <p className="text-gray-500">{motorcycle.mot_ano}</p>
                            </div>
                            <Badge variant="outline" className="px-3 py-1 text-sm">
                                {motorcycle.fun_codigo ? "Vinculada" : "Não vinculada"}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <File size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Placa</h3>
                                        <p className="font-mono font-bold text-lg tracking-wider">
                                            {motorcycle.mot_placa}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                        <Palette size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Cor</h3>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded-full border border-gray-200"
                                                style={{ backgroundColor: mapColor(motorcycle?.mot_cor) }}
                                            />
                                            <span className="capitalize">{motorcycle?.mot_cor}</span>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {motorcycle.fun_nome && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Responsável</h3>
                                            <p className="font-medium">{motorcycle.fun_nome}</p>
                                            <p className="text-sm text-gray-500">
                                                Código: {motorcycle.fun_codigo}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Ano</h3>
                                        <p>{motorcycle.mot_ano}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Nenhuma motocicleta encontrada</h3>
                        <p className="mt-2 text-gray-500">
                            Você não possui uma motocicleta vinculada no momento. Atualize essa pendência na empresa para estar disponível para corridas.
                        </p>
                        <button
                            onClick={handleRefresh}
                            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
