import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import { furnitureRoutes } from '@/modules/furniture/routes'
import { clientesRoutes } from '@/modules/clientes/routes'
import { whatsappRoutes } from '@/modules/whatsapp/routes'

/**
 * Composição das rotas de todos os módulos de negócio habilitados.
 * Para desabilitar um módulo no frontend, basta remover sua entrada aqui
 * (espelha o array `enabledModules` da composição raiz do backend em C#).
 */
const moduleRoutes = [...clientesRoutes, ...whatsappRoutes, ...furnitureRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: 'Entrar', public: true },
    },
    {
      path: '/cadastro',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { title: 'Criar conta', public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { title: 'Início' },
        },
        ...moduleRoutes,
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Página não encontrada', public: true },
    },
  ],
})

// Guarda de navegação global: redireciona para /login quando a rota exige
// autenticação e não há sessão ativa; e evita que um usuário já logado
// acesse a tela de login novamente.
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})

router.afterEach((to) => {
  const baseTitle = 'ERP SaaS'
  document.title = to.meta.title ? `${to.meta.title} · ${baseTitle}` : baseTitle
})

export default router
