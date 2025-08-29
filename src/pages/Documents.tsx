import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/useAuth";
import { handleAuthError } from "@/utils/handleAuthError";
import { useNavigate } from "react-router-dom";
import ToastMessage from "@/components/layout/ToastMessage";
import { ToastProps } from "@/types/toast";
import { Loading } from "@/components/ui/loading";

type DocumentoFuncionario = {
  fun_codigo: number;
  fun_nome: string;
  fun_documento: string;
  url: string;
};

const BASE_URL = "https://backend-turma-a-2025.onrender.com";

export default function Documents() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });


  const { funcionario } = useAuth();
  const [documents, setDocuments] = useState<DocumentoFuncionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (
      funcionario &&
      funcionario.cargo !== "Gerente" &&
      funcionario.cargo !== "Administrador"
    ) {
      setUnauthorized(true);
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 3000);
    }
  }, [funcionario]);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch(
          `${BASE_URL}/api/admin/foto-funcionario/exibir-fotos`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (handleAuthError(response, setToast, navigate)) return;

        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        setToast({
          visible: true,
          message: "Erro ao buscar documentos. Tente novamente mais tarde.",
          status: "ERROR",
        });
      } finally {
        setLoading(false);
      }
    }

    if (!unauthorized) {
      fetchDocuments();
    }
  }, [unauthorized]);

  if (loading) {
    return <Loading text="Carregando documentos..." />;
  }

  if (unauthorized) {
    return (
      <div className="text-center text-red-500 mt-6">
        Você não tem permissão para acessar esta página. Redirecionando...
      </div>
    );
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
      <h1 className="text-2xl mb-2">Documentos</h1>
      <p className="mb-4 text-gray-600">
        Gerencie documentos de funcionários cadastrados no sistema.
      </p>

      {loading ? (
        <p className="text-gray-500">Carregando documentos...</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-500">Nenhum documento encontrado.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <li
              key={doc.fun_codigo}
              className="border rounded-lg shadow-sm bg-white p-2 flex flex-col items-center"
            >
              <img
                src={doc.url}
                alt={`Documento de ${doc.fun_nome}`}

                className="w-full max-w-[240px] h-auto object-contain rounded border bg-gray-50"
              />

              <p className="mt-2 font-medium text-sm text-gray-800 text-center">
                {doc.fun_nome}
              </p>
              <p className="text-xs text-gray-400">ID: {doc.fun_codigo}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
