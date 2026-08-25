import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

/**
 * Instância central do Axios. Todo módulo de serviço (ex.: src/modules/[nome]/services)
 * deve importar `apiClient` daqui em vez de usar axios diretamente — assim os
 * interceptors de autenticação e tratamento de erro valem para toda a aplicação.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de requisição: anexa o Bearer token (JWT) em toda chamada,
// quando o usuário estiver autenticado.
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  return config
})

// Interceptor de resposta: em caso de 401 (token expirado/inválido), desloga
// o usuário e redireciona para o login. A lógica de refresh token automático
// (tentar renovar antes de deslogar) será adicionada junto com a implementação
// completa do JWT no backend.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push({ name: 'login' })
    }

    return Promise.reject(error)
  },
)
