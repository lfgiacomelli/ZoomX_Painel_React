export interface PaymentsEmployeesProps {
  pag_codigo: number;
  fun_nome: string;
  pag_valor: number;
  pag_status: 'PAGO' | 'PENDENTE' | 'CANCELADO' | string;
  pag_data: string;
  pag_forma_pagament: string;
}