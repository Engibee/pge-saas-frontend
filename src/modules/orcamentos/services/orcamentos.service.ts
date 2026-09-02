import { apiClient } from '@/services/api/client'
import type { ApiResult } from '@/types/api'
import type { AssinarOrcamentoInput, CriarOrcamentoInput, Orcamento } from '../types/orcamento'

export const orcamentosService = {
  async criar(servicoId: string, input: CriarOrcamentoInput): Promise<ApiResult<Orcamento>> {
    const response = await apiClient.post<ApiResult<Orcamento>>(`/servicos/${servicoId}/orcamentos`, input)
    return response.data
  },

  async listarPorServico(servicoId: string): Promise<ApiResult<Orcamento[]>> {
    const response = await apiClient.get<ApiResult<Orcamento[]>>(`/servicos/${servicoId}/orcamentos`)
    return response.data
  },

  /** Endpoint interno (autenticado) — usado na tela de gestão do serviço, não na página pública de assinatura. */
  async obterPorId(id: string): Promise<ApiResult<Orcamento>> {
    const response = await apiClient.get<ApiResult<Orcamento>>(`/orcamentos/${id}`)
    return response.data
  },

  /** Endpoint público (sem autenticação) — usado pela página que o cliente abre a partir do link. */
  async assinar(id: string, input: AssinarOrcamentoInput): Promise<ApiResult<void>> {
    const response = await apiClient.post<ApiResult<void>>(`/orcamentos/${id}/assinar`, input)
    return response.data
  },

  /**
   * Monta a URL de download/preview direto do PDF. Usada em <a href>/<iframe>,
   * não via axios — é um download de arquivo binário, não uma chamada JSON.
   * O endpoint é público no backend (AllowAnonymous), então funciona mesmo
   * sem o usuário estar logado (ex.: o cliente abrindo o link do WhatsApp).
   */
  urlPdf(id: string, assinado: boolean): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'
    return `${baseUrl}/orcamentos/${id}/pdf?assinado=${assinado}`
  },
}
