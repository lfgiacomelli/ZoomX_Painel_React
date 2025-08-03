import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/loading";
import ToastMessage from "./ToastMessage";
import { useNavigate } from "react-router-dom";

export default function DocumentAlert() {
    const navigate = useNavigate();
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{
        visible: boolean;
        message: string;
        status?: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
    }>({
        visible: false,
        message: "",
        status: "INFO",
    });

    const handleNavigateToEmployees = () => {
        navigate("/funcionarios");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://backend-turma-a-2025.onrender.com/api/admin/foto-funcionario/listar-sem-foto",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) {
                    setToast({
                        visible: true,
                        message: "Erro ao buscar dados",
                        status: "ERROR",
                    })
                }

                const data = await response.json();
                setCount(data.length);

            } catch (err) {
                console.error("Erro na requisição:", err);
                setError("Falha ao verificar documentos pendentes");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (count === null || count === 0) {
        return null;
    }

    return (
        <Alert className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
            {toast.visible && (
                <ToastMessage
                    message={toast.message}
                    status={toast.status}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}
            <div className="flex items-start gap-4">
                <FileWarning className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                    <AlertTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Atenção: {count} {count === 1 ? 'funcionário' : 'funcionários'} {count === 1 ? 'está' : 'estão'} com pendências
                    </AlertTitle>
                    <AlertDescription className="text-sm text-yellow-700 dark:text-yellow-300">
                        Para finalizar o cadastro, envie a foto do funcionário segurando a CNH. Acesse a opção <strong>"Outros"</strong> na lista de funcionários para realizar o envio.
                    </AlertDescription>

                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                    onClick={handleNavigateToEmployees}
                >
                    Enviar Agora
                </Button>
            </div>
        </Alert>
    );
}