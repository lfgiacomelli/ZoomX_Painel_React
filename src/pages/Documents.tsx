import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/useAuth";

type DocumentoFuncionario = {
  fun_codigo: number;
  fun_nome: string;
  fun_documento: string;
};

const BASE_URL = "https://backend-turma-a-2025.onrender.com";

export default function Documents() {
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
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!unauthorized) {
      fetchDocuments();
    }
  }, [unauthorized]);

  if (!funcionario) {
    return <p className="text-center text-gray-500">Carregando usuário...</p>;
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
      <h1 className="text-2xl font-semibold mb-2">Documentos</h1>
      <p className="mb-4 text-gray-600">
        Esta página é destinada à gestão de documentos dos mototaxistas.
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
                src={`${BASE_URL}${doc.fun_documento}`}
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
