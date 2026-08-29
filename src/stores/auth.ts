import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiClient } from '@/services/api/client'
import type { ApiResult, UsuarioAutenticado } from '@/types/api'

interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiraEmUtc: string
  usuario: UsuarioAutenticado
}

export interface RegisterPayload {
  razaoSocial: string
  nomeFantasia?: string
  nomeCompleto: string
  email: string
  senha: string
  /** Valor numérico do enum TenantPlano (0 = Free, 1 = Standard, 2 = Empresarial). */
  plano: number
}

const STORAGE_KEY = 'erp-saas:auth'

/**
 * Store de autenticação — login, cadastro de conta e persistência de sessão
 * (JWT access token + refresh token) em localStorage.
 */
export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const usuario = ref<UsuarioAutenticado | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  function restoreFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as {
        accessToken: string
        refreshToken: string
        usuario: UsuarioAutenticado
      }
      accessToken.value = parsed.accessToken
      refreshToken.value = parsed.refreshToken
      usuario.value = parsed.usuario
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  function persistToStorage() {
    if (!accessToken.value || !usuario.value) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
        usuario: usuario.value,
      }),
    )
  }

  async function login(email: string, senha: string): Promise<ApiResult<void>> {
    try {
      const response = await apiClient.post<ApiResult<LoginResponse>>('/auth/login', {
        email,
        senha,
      })

      if (!response.data.succeeded || !response.data.value) {
        return { succeeded: false, errors: response.data.errors }
      }

      const { accessToken: token, refreshToken: refresh, usuario: user } = response.data.value
      accessToken.value = token
      refreshToken.value = refresh
      usuario.value = user
      persistToStorage()

      return { succeeded: true, errors: [] }
    } catch {
      return { succeeded: false, errors: ['Não foi possível conectar ao servidor. Tente novamente.'] }
    }
  }

  /**
   * Cria a conta (Tenant + usuário administrador) via POST /api/auth/register.
   * Em caso de sucesso, o backend já devolve uma sessão autenticada — por
   * isso, assim como em login(), já guardamos os tokens aqui: cadastro
   * implica login automático, sem precisar de uma segunda chamada.
   */
  async function register(payload: RegisterPayload): Promise<ApiResult<void>> {
    try {
      const response = await apiClient.post<ApiResult<LoginResponse>>('/auth/register', payload)

      if (!response.data.succeeded || !response.data.value) {
        return { succeeded: false, errors: response.data.errors }
      }

      const { accessToken: token, refreshToken: refresh, usuario: user } = response.data.value
      accessToken.value = token
      refreshToken.value = refresh
      usuario.value = user
      persistToStorage()

      return { succeeded: true, errors: [] }
    } catch {
      return { succeeded: false, errors: ['Não foi possível conectar ao servidor. Tente novamente.'] }
    }
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    usuario.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // Restaura a sessão salva assim que a store é criada (refresh de página, etc.).
  restoreFromStorage()

  return {
    accessToken,
    refreshToken,
    usuario,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
