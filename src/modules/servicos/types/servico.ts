/**
 * Espelha ERP.SaaS.Core.Entities.StatusServico. Usado para ENVIAR (PUT
 * /api/servicos/{id}) — o backend serializa enums recebidos como número, não
 * como string (diferente das respostas GET, onde vem como string via
 * .ToString()). Os valores numéricos abaixo precisam bater exatamente com o
 * enum em C#.
 */
export enum StatusServico {
  EmAndamento = 0,
  EscopoDefinido = 1,
  OrcamentoEnviado = 2,
  Aprovado = 3,
  Concluido = 4,
  Cancelado = 5,
}

export const statusServicoLabel: Record<string, string> = {
  EmAndamento: 'Em andamento',
  EscopoDefinido: 'Escopo definido',
  OrcamentoEnviado: 'Orçamento enviado',
  Aprovado: 'Aprovado',
  Concluido: 'Concluído',
  Cancelado: 'Cancelado',
}

/** Espelha ERP.SaaS.Api.Dtos.ServicoResponseDto (backend). Note que `status` vem como STRING nas respostas (ex.: "EmAndamento"). */
export interface Servico {
  id: string
  clienteId: string
  clienteNome: string
  titulo?: string
  escopo?: string
  status: string
  origem: string
  usuarioResponsavelId?: string
  createdAtUtc: string
}

/** Espelha ERP.SaaS.Api.Dtos.AtualizarServicoRequestDto (backend). */
export interface AtualizarServicoInput {
  titulo?: string
  escopo?: string
  /** Valor numérico do enum StatusServico — ver comentário acima. */
  status?: StatusServico
}
