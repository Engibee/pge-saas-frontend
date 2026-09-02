import type { RouteRecordRaw } from 'vue-router'

export const whatsappRoutes: RouteRecordRaw[] = [
  {
    path: 'whatsapp',
    name: 'whatsapp-inbox',
    component: () => import('@/modules/whatsapp/views/ConversasPendentesView.vue'),
    meta: { title: 'Conversas WhatsApp' },
  },
  {
    path: 'whatsapp/configuracao',
    name: 'whatsapp-configuracao',
    component: () => import('@/modules/whatsapp/views/WhatsAppConfiguracaoView.vue'),
    meta: { title: 'Configuração do WhatsApp' },
  },
]
