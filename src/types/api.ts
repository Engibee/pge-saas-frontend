/**
 * Tipos compartilhados por toda a aplicação, espelhando os contratos que o
 * backend (ERP.SaaS.Api, em C#) vai expor. Mantidos separados dos tipos
 * específicos de cada módulo (ver src/modules/[nome]/types).
 */

/** Espelha ERP.SaaS.Core.Common.Result<T> — todo endpoint da API deve seguir este formato. */
export interface ApiResult<T = void> {
  succeeded: boolean
  value?: T
  errors: string[]
}

/** Espelha ERP.SaaS.Core.Modules.ModuleType */
export enum ModuleType {
  Core = 0,
  MoveisPlanejados = 1,
  OficinaMecanica = 2,
}

/** Espelha ERP.SaaS.Core.Entities.PapelUsuario */
export enum PapelUsuario {
  Operador = 0,
  Gerente = 1,
  AdministradorTenant = 2,
  SuperAdmin = 99,
}

/** Usuário autenticado — populado a partir do JWT decodificado (ver stores/auth.ts). */
export interface UsuarioAutenticado {
  usuarioId: string
  tenantId: string
  nomeCompleto: string
  email: string
  papel: PapelUsuario
}

/** Paginação padrão usada em listagens da API (a definir formato exato junto ao backend). */
export interface PaginatedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
}
