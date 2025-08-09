import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Calendar, DollarSign, CreditCard, Bike } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ToastMessage from "@/components/layout/ToastMessage";

import { handleAuthError } from "@/utils/handleAuthError";

import { ToastProps } from "@/types/toast";
import { Trip } from "@/types/travel";

const statusVariantMap: Record<string, string> = {
    "concluído": "default",
    "cancelado": "destructive",
    "pendente": "outline",
    "em andamento": "secondary",
};

export default function EmployeeTrips() {
    const { funCodigo } = useParams<{ funCodigo: string }>();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });


    useEffect(() => {
        if (!funCodigo) return;

        const fetchTrips = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `https://backend-turma-a-2025.onrender.com/api/admin/funcionarios/viagens/${funCodigo}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (handleAuthError(response, setToast, navigate)) return;


                if (!response.ok) throw new Error("Erro ao carregar viagens");

                const data = await response.json();
                setTrips(data);
            } catch (err) {
                console.error("Erro ao buscar viagens:", err);
                setError(err instanceof Error ? err.message : "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [funCodigo]);

    const formatCurrency = (value: string) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(parseFloat(value));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "PPp", { locale: ptBR });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Carregando histórico de viagens...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-destructive">
                <p className="font-medium">Erro ao carregar viagens</p>
                <p className="text-sm text-muted-foreground">{error}</p>
            </div>
        );
    }

    if (trips.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <p className="font-medium">Nenhuma viagem registrada</p>
                <p className="text-sm text-muted-foreground">
                    Este funcionário ainda não realizou nenhuma viagem.
                </p>
            </div>
        );
    }
    const fun_nome = trips.length > 0 ? trips[0].fun_nome : "";


    const valorFaturamento = trips.reduce((total, trip) => {
        return total + parseFloat(trip.via_valor);
    }, 0);

    return (
        <div className="space-y-6">
            {toast.visible && (
                <ToastMessage
                    message={toast.message}
                    status={toast.status}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">Histórico de viagens de {fun_nome}</h1>
                <p className="text-sm text-muted-foreground">
                    Todas as viagens realizadas pelo funcionário #{funCodigo}
                </p>
            </div>
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Total de viagens: {trips.length} | Faturamento total: {formatCurrency(valorFaturamento.toString())}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() => window.print()}
                >
                    Imprimir Histórico
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Serviço</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Rota</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Pagamento</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trips.map((trip) => (
                            <TableRow key={trip.via_codigo}>
                                <TableCell className="font-medium">#{trip.via_codigo}</TableCell>
                                <TableCell>{trip.via_servico}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        {formatDate(trip.via_data)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate max-w-[180px]">
                                            {trip.via_origem} → {trip.via_destino}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        {formatCurrency(trip.via_valor)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        {trip.via_formapagamento}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusVariantMap[trip.via_status.toLowerCase()] as any}>
                                        {trip.via_status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {trips.map((trip) => (
                <Card key={`details-${trip.via_codigo}`} className="mt-6">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Detalhes da Viagem #{trip.via_codigo}</CardTitle>
                                <CardDescription className="mt-1">
                                    {trip.via_servico} • {formatDate(trip.via_data)}
                                </CardDescription>
                            </div>
                            <Badge variant={statusVariantMap[trip.via_status.toLowerCase()] as any}>
                                {trip.via_status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h3 className="font-medium flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Rota
                                </h3>
                                <div className="pl-6 space-y-1">
                                    <p>
                                        <span className="font-medium">Origem:</span> {trip.via_origem}
                                    </p>
                                    <p>
                                        <span className="font-medium">Destino:</span> {trip.via_destino}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-medium flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Pagamento
                                </h3>
                                <div className="pl-6 space-y-1">
                                    <p>
                                        <span className="font-medium">Valor:</span> {formatCurrency(trip.via_valor)}
                                    </p>
                                    <p>
                                        <span className="font-medium">Forma:</span> {trip.via_formapagamento}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Bike className="h-4 w-4" />
                                    Veículo
                                </h3>
                                <div className="pl-6">
                                    <p>
                                        {trip.mot_modelo} • {trip.mot_placa}
                                    </p>
                                </div>
                            </div>

                            {trip.via_observacoes && (
                                <div className="space-y-2">
                                    <h3 className="font-medium">Observações</h3>
                                    <div className="pl-6">
                                        <p className="text-sm text-muted-foreground">
                                            {trip.via_observacoes}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}