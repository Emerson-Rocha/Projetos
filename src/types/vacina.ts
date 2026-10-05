export interface Vacina {
  id_vacina: number;

  nome: string;
  tipo: string;
  especie: string;
  fabricante: string;

  lote: string;
  validade: string;
  quantidade: number;

  status: string;

  fornecedor: string;
  responsavel: string;
  dataEntrada: string;
  dataFabricacao: string;
  notaFiscal: string;

  valorUnitario: number;
  valorTotal: number;

  temperatura: string;
  localArmazenamento: string;
}

