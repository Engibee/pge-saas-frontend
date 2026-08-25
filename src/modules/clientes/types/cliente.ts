/** Espelha ERP.SaaS.Core.Entities.Cliente. */
export interface Cliente {
  id: string
  nome: string
  cpfCnpj?: string
  email?: string
  telefoneWhatsApp?: string
  aceitaContatoWhatsApp: boolean
  observacoes?: string
  origem: OrigemCliente
}

/** Espelha ERP.SaaS.Core.Entities.OrigemCliente. */
export enum OrigemCliente {
  Manual = 0,
  WhatsApp = 1,
  Site = 2,
  Indicacao = 3,
  Importacao = 4,
}
