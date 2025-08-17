import ToastMessage from "@/components/layout/ToastMessage";
import { ToastProps } from "@/types/toast";
import React, { useEffect, useState } from "react";

export default function PushNotifications() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    title: "",
    body: "",
  });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<ToastProps>({ visible: false, message: "", status: "INFO" });
  const [showUserList, setShowUserList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const BASE_URL = "https://backend-turma-a-2025.onrender.com";

  useEffect(() => {
    async function fetchUsuarios() {
      setLoadingTokens(true);
      try {
        const res = await fetch(`${BASE_URL}/api/admin/notificacoes/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        setUsuarios(data);
      } catch (error: any) {
        setToast({ visible: true, message: error.message || "Erro desconhecido", status: "ERROR" });
      } finally {
        setLoadingTokens(false);
      }
    }
    fetchUsuarios();
  }, []);

  function toggleToken(token: string) {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(token)) newSelected.delete(token);
    else newSelected.add(token);
    setSelectedTokens(newSelected);
  }

  function selectAll() {
    setSelectedTokens(new Set(filteredUsers.map((u) => u.push_token)));
  }

  function deselectAll() {
    setSelectedTokens(new Set());
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setToast({ visible: false, message: "", status: "INFO" });

    if (selectedTokens.size === 0) {
      setToast({ visible: true, message: "Selecione ao menos um destinatário", status: "ERROR" });
      return;
    }
    if (!form.title || !form.body) {
      setToast({ visible: true, message: "Preencha título e mensagem", status: "ERROR" });
      return;
    }

    const usuariosSelecionados = usuarios.filter((u) => selectedTokens.has(u.push_token));
    const messages = usuariosSelecionados.map(({ push_token, usu_nome }) => ({
      token: push_token,
      title: form.title.replace("{nome}", usu_nome),
      body: form.body.replace("{nome}", usu_nome),
    }));

    setSending(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/notificacoes/enviar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ messages }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erro ao enviar notificação");
      }
      setToast({
        visible: true,
        message: `Notificações enviadas com sucesso para ${usuariosSelecionados.length} ${usuariosSelecionados.length > 1 ? "usuários" : "usuário"}`,
        status: "SUCCESS",
      });
      setForm({ title: "", body: "" });
      setSelectedTokens(new Set());
    } catch (error: any) {
      setToast({ visible: true, message: error.message || "Erro desconhecido", status: "ERROR" });
    } finally {
      setSending(false);
    }
  }

  const filteredUsers = usuarios.filter(
    (user) =>
      user.usu_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.push_token.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCount = selectedTokens.size;

  return (
    <div className="max-w-full mx-auto justify-start p-4">
      {toast.visible && (
        <ToastMessage
          message={toast.message}
          status={toast.status}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Painel de Notificações Push</h1>
        <p className="text-gray-600">Envie mensagens personalizadas para os usuários do aplicativo</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recipient Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-gray-900">Destinatários</h2>
              <span className="text-sm text-gray-700">
                {selectedCount} {selectedCount === 1 ? "selecionado" : "selecionados"}
              </span>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowUserList(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-900">Selecionar usuários</span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={selectAll}
                  className="flex-1 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Selecionar todos
                </button>
                <button
                  onClick={deselectAll}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">

            <h2 className="text-xl text-gray-900 mb-6">Dados da Notificação</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Título *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ex: Novidades disponíveis!"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    {"{nome}"}
                  </code>{" "}
                  para personalizar com o nome do usuário
                </p>
              </div>

              <div>
                <label
                  htmlFor="body"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mensagem *
                </label>
                <textarea
                  id="body"
                  name="body"
                  value={form.body}
                  onChange={handleChange}
                  placeholder="Ex: Olá {nome}, temos novidades para você!"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending || selectedCount === 0}
                  className={`w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium transition-colors ${sending
                    ? "bg-gray-400 cursor-not-allowed"
                    : selectedCount === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 hover:bg-black text-white"
                    }`}
                >
                  {sending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar para {selectedCount}{" "}
                      {selectedCount === 1 ? "destinatário" : "destinatários"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showUserList && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setShowUserList(false)}
              ></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Selecionar Destinatários
                      </h3>
                      <button
                        onClick={() => setShowUserList(false)}
                        className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                        aria-label="Fechar"
                      >
                        ×
                      </button>
                    </div>

                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Pesquisar usuários ou tokens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                      />
                    </div>

                    {/* User list */}
                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                      {loadingTokens ? (
                        <div className="p-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                          <p className="mt-2 text-gray-600">Carregando usuários...</p>
                        </div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          {searchTerm
                            ? "Nenhum resultado encontrado"
                            : "Nenhum usuário com token encontrado"}
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {filteredUsers.map(({ usu_nome, push_token }) => (
                            <li key={push_token} className="hover:bg-gray-50">
                              <label className="flex items-center px-4 py-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedTokens.has(push_token)}
                                  onChange={() => toggleToken(push_token)}
                                  className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                                />
                                <div className="ml-3 flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {usu_nome}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {push_token}
                                  </p>
                                </div>
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowUserList(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirmar ({selectedCount} selecionados)
                </button>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
