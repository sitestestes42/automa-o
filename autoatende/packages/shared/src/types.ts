/**
 * Tipos de domínio compartilhados entre apps/web e apps/api.
 * Estes tipos representam os DTOs trocados via API REST.
 * Eles NÃO substituem os tipos gerados pelo Prisma no backend;
 * servem como contrato estável entre frontend e backend.
 */

export type TomComunicacao =
  | "profissional"
  | "amigavel"
  | "descontraido"
  | "direto"
  | "personalizado";

export type NivelIA = "sem_ia" | "basica" | "avancada";

export type StatusLead =
  | "novo"
  | "em_atendimento"
  | "agendado"
  | "convertido"
  | "perdido";

export interface EmpresaDTO {
  id: string;
  nome: string;
  responsavel: string;
  segmento: string;
  cidade: string;
  estado: string;
  descricao?: string | null;
  endereco?: string | null;
  site?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ServicoDTO {
  id: string;
  empresaId: string;
  nome: string;
  descricao?: string | null;
  preco: number;
  duracaoMinutos: number;
  disponibilidade?: string | null;
  observacoes?: string | null;
}

export interface FaqDTO {
  id: string;
  empresaId: string;
  pergunta: string;
  resposta: string;
}

export interface ConfiguracaoAtendimentoDTO {
  empresaId: string;
  horarioInicio: string;
  horarioFim: string;
  diasFuncionamento: string[];
  mensagemBoasVindas: string;
  mensagemForaHorario: string;
  nomeBot: string;
  tom: TomComunicacao;
}

export interface RegraAtendimentoDTO {
  id: string;
  empresaId: string;
  palavrasChaveHumano: string[];
  assuntosProibidos: string[];
  mensagemTransferencia: string;
}

export interface AutomacaoDTO {
  empresaId: string;
  ativa: boolean;
  nivelIA: NivelIA;
  configuracaoCompilada: Record<string, unknown>;
  atualizadoEm: string;
}

export interface LeadDTO {
  id: string;
  empresaId: string;
  nome: string;
  telefone: string;
  interesse?: string | null;
  servicoId?: string | null;
  origem: string;
  status: StatusLead;
  ultimaMensagem?: string | null;
  criadoEm: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}
