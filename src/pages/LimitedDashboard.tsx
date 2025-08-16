import React, { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";

import { ToastProps } from "@/types/toast";
import { handleAuthError } from "@/utils/handleAuthError";
import ToastMessage from "@/components/layout/ToastMessage";
import { useAuth } from "@/contexts/useAuth";

import { Trip } from "@/types/travel";

const LimitedDashboard: FC = () => {
  const { funcionario, token } = useAuth();
  const funCodigo = funcionario?.id;
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const BASE_URL = "https://backend-turma-a-2025.onrender.com";

  const [toast, setToast] = useState<ToastProps>({
    visible: false,
    message: "",
    status: "INFO",
  });

  useEffect(() => {
    if (!funCodigo) return;

    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${BASE_URL}/api/admin/funcionarios/viagens/${funCodigo}`,
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
    };

    fetchTrips();
  }, [funCodigo]);

  return (
    <div className="space-y-6">
      {toast.visible && (
        <ToastMessage
          message={toast.message}
          status={toast.status}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}

      <h1 className="text-2xl font-righteous text-black">
        Dashboard do Mototáxista
      </h1>

      {/* Total de corridas */}
      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle>Total de Corridas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LinearProgress color="warning" />
          ) : (
            <p className="text-3xl font-bold text-center">
              {trips.length}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Últimas corridas */}
      <Card className="zoomx-card">
        <CardHeader>
          <CardTitle>Últimas Corridas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LinearProgress color="warning" />
          ) : trips.length === 0 ? (
            <p>Nenhuma corrida encontrada.</p>
          ) : (
            <ul className="space-y-3">
              {trips.slice(0, 5).map((trip) => (
                <li
                  key={trip.via_codigo}
                  className="border border-gray-200 rounded p-3"
                >
                  <p>
                    <strong>Origem:</strong> {trip.via_origem} →{" "}
                    <strong>Destino:</strong> {trip.via_destino}
                  </p>
                  <p>
                    <strong>Valor:</strong> R$ {trip.via_valor} |{" "}
                    <strong>Status:</strong>{" "}
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
                    {new Date(trip.via_data).toLocaleDateString("pt-BR")}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Button
            className="zoomx-button mt-4 w-full"
            onClick={() => navigate(`/viagensFuncionario/${funCodigo}`)}
          >
            Ver todas as viagens
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LimitedDashboard;
