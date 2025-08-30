import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { LinearProgress } from "@mui/material";
import ToastMessage from "./ToastMessage";

import { TriangleAlert } from "lucide-react";
import { handleAuthError } from "@/utils/handleAuthError";
import { useNavigate } from "react-router-dom";

type EmployeeWithoutMotorcycle = {
  fun_codigo: number;
  fun_nome: string;
};

export default function EmployeesWithoutMotorcycles() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employeesWithoutMotorcycles, setEmployeesWithoutMotorcycles] = useState<EmployeeWithoutMotorcycle[]>([]);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    status?: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
  }>({
    visible: false,
    message: "",
    status: "INFO",
  });

  const BASE_URL = "https://backend-turma-a-2025.onrender.com";

  useEffect(() => {
    fetchEmployeesWithoutMotorcycles();
  }, []);

  async function fetchEmployeesWithoutMotorcycles() {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/funcionarios/listar-sem-moto`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (handleAuthError(response, setToast, navigate)) return;

      if (response.status === 204) {
        // Nenhum mototaxista sem moto
        setEmployeesWithoutMotorcycles([]);
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao buscar funcionários sem moto");
      }

      const data: EmployeeWithoutMotorcycle[] = await response.json();
      setEmployeesWithoutMotorcycles(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setToast({
        visible: true,
        message: error.message || "Erro ao buscar funcionários sem moto",
        status: "ERROR",
      });
    } finally {
      setLoading(false);
    }
  }

  if (employeesWithoutMotorcycles.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-6">
      {toast.visible && (
        <ToastMessage
          message={toast.message}
          status={toast.status}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}

      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-xl font-medium text-gray-900">
            Mototaxistas sem Motocicleta
          </CardTitle>
          <CardDescription className="text-base text-gray-500">
            Lista de mototaxistas sem motocicletas cadastradas
            <span className="text-yellow-600 inline-flex items-center ml-1">
              <TriangleAlert className="w-4 h-4 mr-1" />
              Funcionários sem motocicleta cadastrada ficarão indisponíveis para
              novas solicitações até regularizarem essa pendência no sistema.
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {loading ? (
            <div className="w-full">
              <LinearProgress
                color="inherit"
                className="text-gray-200"
              />
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {employeesWithoutMotorcycles.map((employee) => (
                <li
                  key={employee.fun_codigo}
                  className="py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-medium text-gray-900">
                        {employee.fun_nome}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {employee.fun_codigo}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800">
                      Sem moto
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
