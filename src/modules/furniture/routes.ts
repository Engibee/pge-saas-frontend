import type { RouteRecordRaw } from 'vue-router'

/**
 * Rotas do módulo "Móveis Planejados". Mantidas dentro do próprio módulo
 * (src/modules/furniture) e importadas pelo router central — o mesmo espírito
 * de modularidade do backend (IBusinessModule), aplicado ao frontend: para
 * desabilitar/remover o módulo, basta não importar este arquivo em router/index.ts.
 */
export const furnitureRoutes: RouteRecordRaw[] = [
  {
    path: 'projetos',
    name: 'furniture-projetos',
    component: () => import('@/modules/furniture/views/ProjetosListView.vue'),
    meta: { title: 'Projetos' },
  },
  {
    path: 'projetos/:id',
    name: 'furniture-projeto-detalhe',
    component: () => import('@/modules/furniture/views/ProjetoDetalheView.vue'),
    meta: { title: 'Detalhe do Projeto' },
    props: true,
  },
]
