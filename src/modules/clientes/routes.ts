import type { RouteRecordRaw } from 'vue-router'

export const clientesRoutes: RouteRecordRaw[] = [
  {
    path: 'clientes',
    name: 'clientes-lista',
    component: () => import('@/modules/clientes/views/ClientesListView.vue'),
    meta: { title: 'Clientes' },
  },
]
