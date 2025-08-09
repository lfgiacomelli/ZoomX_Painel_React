export interface ViagemPendente {
    via_codigo: number;
    via_origem: string;
    via_destino: string;
    via_valor: string;
    via_formapagamento: string;
    funcionario_nome: string;
    usuario_nome: string;
    via_data: string;
    via_servico: string;
    via_observacoes: string | null;
}