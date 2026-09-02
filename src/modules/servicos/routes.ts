import type { RouteRecordRaw } from 'vue-router'

export const servicosRoutes: RouteRecordRaw[] = [
  {
    path: 'servicos',
    name: 'servicos-lista',
    component: () => import('@/modules/servicos/views/ServicosListView.vue'),
    meta: { title: 'Serviços' },
  },
  {
    path: 'servicos/:id',
    name: 'servico-detalhe',
    component: () => import('@/modules/servicos/views/ServicoDetalheView.vue'),
    meta: { title: 'Detalhe do Serviço' },
    props: true,
  },
]
