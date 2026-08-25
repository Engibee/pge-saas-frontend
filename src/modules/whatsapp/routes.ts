import type { RouteRecordRaw } from 'vue-router'

export const whatsappRoutes: RouteRecordRaw[] = [
  {
    path: 'whatsapp',
    name: 'whatsapp-inbox',
    component: () => import('@/modules/whatsapp/views/WhatsAppInboxView.vue'),
    meta: { title: 'Conversas WhatsApp' },
  },
]
