// LimitedDashboard.tsx
import React, { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, MapPin, Navigation, Wallet } from "lucide-react";

import { ToastProps } from "@/types/toast";
import { handleAuthError } from "@/utils/handleAuthError";
import ToastMessage from "@/components/layout/ToastMessage";
import { useAuth } from "@/contexts/useAuth";
import { Trip } from "@/types/travel";

const LimitedDashboard: FC = () => {
  const { funcionario, token } = useAuth();
  const id = funcionario?.id;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [travel, setTravel] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const BASE_URL = "https://backend-turma-a-2025.onrender.com";

  const [toast, setToast] = useState<ToastProps>({
    visible: false,
    message: "",
    status: "INFO",
  });

  async function fetchViagensEmAndamento() {
    if (!id) return;
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/funcionarios/viagens-em-andamento/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (handleAuthError(response, setToast, navigate)) return;
      if (!response.ok) throw new Error("Erro ao carregar viagem em andamento");

      const data = await response.json();
      setTravel(data);
    } catch (err) {
      console.error(err);
      setToast({
        visible: true,
        message: "Erro ao buscar viagens em andamento.",
        status: "ERROR",
      });
    }
  }

  async function fetchTrips() {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${BASE_URL}/api/admin/funcionarios/viagens/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (handleAuthError(response, setToast, navigate)) return;
      if (!response.ok) throw new Error("Erro ao carregar viagens");

      const data: Trip[] = await response.json();
      setTrips(data);
    } catch (err) {
      console.error("Erro ao buscar viagens:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      await fetchViagensEmAndamento();
      await fetchTrips();
    };

    fetchAllData();

    const intervalId = setInterval(fetchAllData, 20000);

    return () => clearInterval(intervalId);
  }, [id]);

  const generateMapsLink = (origin: string, destination?: string) => {
    if (destination) {
      return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        origin
      )}&destination=${encodeURIComponent(destination)}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      origin
    )}`;
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

      <h1 className="text-3xl font-bold font-righteous text-gray-800">
        Dashboard do Mototáxista
      </h1>

      {travel.length > 0 && (
        <Card className="border-yellow-400 border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              🚦 Corrida em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {travel.map((t) => (
              <div
                key={t.via_codigo}
                className="space-y-3 p-4 border rounded-lg bg-yellow-50"
              >
                <p>
                  <strong>Passageiro:</strong> {t.usu_nome}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  <span>
                    <strong>Origem:</strong> {t.via_origem}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Navigation size={16} className="text-green-600" />
                  <span>
                    <strong>Destino:</strong> {t.via_destino}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Wallet size={16} className="text-purple-600" />
                  <span>
                    <strong>Valor:</strong>{" "}
                    {parseFloat(t.via_valor || "0").toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </p>
                <p>
                  <strong>Pagamento:</strong> {t.via_formapagamento}
                </p>
                <p>
                  <strong>Rotas:</strong>
                </p>
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(generateMapsLink(t.via_origem), "_blank")
                    }
                  >
                    Ir até o Passageiro
                  </Button>
                  <Button
                    className="zoomx-button"
                    onClick={() =>
                      window.open(
                        generateMapsLink(t.via_origem, t.via_destino),
                        "_blank"
                      )
                    }
                  >
                    Iniciar Corrida
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Total de Corridas</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {loading ? (
              <Skeleton className="h-8 w-20 mx-auto" />
            ) : (
              <p className="text-3xl font-bold text-blue-600">{trips.length}</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Ganhos Totais Estimados</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {loading ? (
              <Skeleton className="h-8 w-24 mx-auto" />
            ) : (
              <p className="text-3xl font-bold text-green-600">
                {trips
                  .reduce(
                    (acc, t) => acc + parseFloat(t.via_valor || "0"),
                    0
                  )
                  .toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Status Atual</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {travel.length > 0 ? (
              <p className="text-lg font-semibold text-yellow-600">Em Corrida</p>
            ) : (
              <p className="text-lg font-semibold text-gray-500">Disponível</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Últimas corridas */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Últimas Corridas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : trips.length === 0 ? (
            <div className="flex items-center gap-2 text-gray-500">
              <AlertCircle size={18} />
              Nenhuma corrida encontrada.
            </div>
          ) : (
            <ul className="space-y-3">
              {trips.slice(0, 5).map((trip) => (
                <li
                  key={trip.via_codigo}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <p>
                    <strong>Origem:</strong> {trip.via_origem} →{" "}
                    <strong>Destino:</strong> {trip.via_destino}
                  </p>
                  <p>
                    <strong>Valor:</strong>{" "}
                    {parseFloat(trip.via_valor || "0").toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}{" "}
                    | <strong>Status:</strong>{" "}
                    <span
                      className={
                        trip.via_status === "finalizada"
                          ? "text-green-600 font-semibold"
                          : "text-yellow-600 font-semibold"
                      }
                    >
                      {trip.via_status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(trip.via_data).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Button
            className="zoomx-button mt-4 w-full"
            onClick={() => navigate(`/viagensFuncionario/${id}`)}
          >
            Ver todas as viagens
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LimitedDashboard;
