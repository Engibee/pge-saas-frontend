import { apiClient } from '@/services/api/client'
import type { ApiResult } from '@/types/api'

/**
 * Camada de serviço para ações de WhatsApp iniciadas pelo usuário do ERP
 * (ex.: reenviar um orçamento). Espelha ERP.SaaS.Core.Interfaces.IWhatsAppService
 * do backend, mas expondo apenas o que faz sentido chamar a partir da UI.
 */
export const whatsAppService = {
  async enviarTexto(clienteId: string, mensagem: string): Promise<ApiResult<void>> {
    const response = await apiClient.post<ApiResult<void>>('/whatsapp/enviar-texto', {
      clienteId,
      mensagem,
    })
    return response.data
  },
}
