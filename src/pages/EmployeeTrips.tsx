import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format, isSameDay, parseISO, set } from "date-fns";
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
import { Loader2, MapPin, Calendar, DollarSign, CreditCard, Bike, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToastMessage from "@/components/layout/ToastMessage";

import { handleAuthError } from "@/utils/handleAuthError";

import { ToastProps } from "@/types/toast";
import { Trip } from "@/types/travel";
import { Loading } from "@/components/ui/loading";
import noDataAnimation from '@/assets/animations/no_data.json';

import Lottie from "lottie-react";

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
  const [filterDate, setFilterDate] = useState<string>("");
  const [notaMedia, setNotaMedia] = useState<number | null>(null);

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

    async function fetchAverageGrade() {
      try {
        const response = await fetch(`
          https://backend-turma-a-2025.onrender.com/api/admin/funcionarios/nota-media/${funCodigo}
          `, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (handleAuthError(response, setToast, navigate)) return;

        const data = await response.json();
        setNotaMedia(data.nota_media);
        console.log(notaMedia);
        console.log("Média de notas:", data);
      } catch (error) {
        console.error("Erro ao buscar média de notas:", error);
      }
    }

    fetchAverageGrade();
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

  const filteredTrips = filterDate
    ? trips.filter((trip) => isSameDay(parseISO(trip.via_data), new Date(filterDate)))
    : trips;

  const totalFaturamento = filteredTrips.reduce((acc, trip) => acc + parseFloat(trip.via_valor), 0);

  if (loading) {
    return <Loading text="Carregando histórico de viagens..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-destructive">
        <p className="font-medium">Erro ao carregar viagens</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  const fun_nome = trips[0].fun_nome;


  const NotaEstrelas = ({ notaMedia }: { notaMedia: number }) => {
    const estrelas = Array.from({ length: 5 }, (_, i) => i < Math.round(notaMedia));

    return (
      <p className="flex flex-col items-start text-lg text-yellow-700">
        <span>Nota média dos clientes: {notaMedia}</span>
        <div className="flex mt-1">
          {estrelas.map((cheia, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${cheia ? "text-yellow-500" : "text-gray-300"}`}
            />
          ))}
        </div>
      </p>
    );
  };

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
        <NotaEstrelas notaMedia={notaMedia ?? 0} />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Total de viagens: {filteredTrips.length} | Faturamento: {formatCurrency(totalFaturamento.toString())}
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
            {filteredTrips.map((trip) => (
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
      {!filteredTrips.length && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Lottie
            animationData={noDataAnimation}
            loop
            style={{ width: 400, height: 300 }}
          />
          <p className="text-2xl text-muted-foreground">Nenhuma viagem encontrada.</p>
        </div>
      )}
      {filteredTrips.map((trip) => (
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
                  <p><span className="font-medium">Origem:</span> {trip.via_origem}</p>
                  <p><span className="font-medium">Destino:</span> {trip.via_destino}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pagamento
                </h3>
                <div className="pl-6 space-y-1">
                  <p><span className="font-medium">Valor:</span> {formatCurrency(trip.via_valor)}</p>
                  <p><span className="font-medium">Forma:</span> {trip.via_formapagamento}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Bike className="h-4 w-4" />
                  Motocicleta utilizada
                </h3>
                <div className="pl-6">
                  <p>{trip.mot_modelo} • {trip.mot_placa}</p>
                </div>
              </div>

              {trip.via_observacoes && (
                <div className="space-y-2">
                  <h3 className="font-medium">Observações</h3>
                  <div className="pl-6">
                    <p className="text-sm text-muted-foreground">{trip.via_observacoes}</p>
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
