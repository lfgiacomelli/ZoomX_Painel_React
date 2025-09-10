export interface Employee {
  fun_codigo: number;
  fun_nome: string;
  fun_documento: string;
  fun_cargo: string;
  fun_email: string;
  fun_telefone: string;
  fun_ativo: "Ativo" | "Indisponível";
  fun_senha?: string;
  pag_codigo?: number;
}