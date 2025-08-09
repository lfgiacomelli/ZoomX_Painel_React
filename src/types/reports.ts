
export interface UsuarioAtivo {
  usu_nome: string;
  total_corridas: number;
  total_gasto: number;
}

export interface MototaxistaAtivo {
  fun_nome: string;
  total_corridas: number;
  total_faturado: number;
  media_avaliacao: number | null;
}

export interface HorarioPico {
  hora: string;
  total: number;
  periodo: string;
}

export interface RotasPopulares {
  rota: string;
  total_viagens: number;
  valor_medio: number;
}

export interface RelatorioData {
  data_inicio: string;
  data_fim: string;
  usuarios: {
    total: number;
    ativos: number;
    banidos: number;
    novos: number;
  };
  corridas: {
    total: number;
    finalizadas: number;
    em_andamento: number;
    canceladas: number;
    valor_medio: number;
    faturamento_total: number;
  };
  usuariosAtivos: UsuarioAtivo[];
  mototaxistasAtivos: MototaxistaAtivo[];
  receitaMensal: {
    labels: string[];
    valoresReceita: number[];
    valoresCorridas: number[];
  };
  statusCorridas: {
    labels: string[];
    valores: number[];
    cores: Record<string, string>;
  };
  horariosPico: HorarioPico[];
  rotasPopulares: RotasPopulares[];
}
