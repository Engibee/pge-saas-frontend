import { apiClient } from '@/services/api/client'
import type { ApiResult, PaginatedResult } from '@/types/api'
import type { Cliente } from '../types/cliente'

/**
 * Camada de serviço do módulo Clientes: isola os componentes/views de detalhes
 * de HTTP. Os endpoints ainda não existem no backend — assim que existirem,
 * nenhuma view precisa mudar, só esta função.
 */
export const clientesService = {
  async listar(): Promise<ApiResult<PaginatedResult<Cliente>>> {
    const response = await apiClient.get<ApiResult<PaginatedResult<Cliente>>>('/clientes')
    return response.data
  },

  async obterPorId(id: string): Promise<ApiResult<Cliente>> {
    const response = await apiClient.get<ApiResult<Cliente>>(`/clientes/${id}`)
    return response.data
  },

  async criar(cliente: Omit<Cliente, 'id'>): Promise<ApiResult<Cliente>> {
    const response = await apiClient.post<ApiResult<Cliente>>('/clientes', cliente)
    return response.data
  },
}
