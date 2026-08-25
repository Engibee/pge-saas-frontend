import { Home, Users, MessageCircle, Sofa, Settings } from '@lucide/vue'
import type { Component } from 'vue'

export interface NavItem {
  label: string
  routeName: string
  icon: Component
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

/**
 * Navegação lateral, agrupada por origem (Core vs. módulo de negócio).
 * Assim como no backend (IBusinessModule.GetMenuItems), a ideia é que
 * cada módulo "contribua" com suas próprias entradas — aqui simplificado
 * em um array estático, mas o padrão já está pronto para virar dinâmico
 * quando o backend expuser quais módulos estão habilitados por tenant.
 */
export const navGroups: NavGroup[] = [
  {
    title: 'Geral',
    items: [
      { label: 'Início', routeName: 'dashboard', icon: Home },
      { label: 'Clientes', routeName: 'clientes-lista', icon: Users },
      { label: 'Conversas WhatsApp', routeName: 'whatsapp-inbox', icon: MessageCircle },
    ],
  },
  {
    title: 'Móveis Planejados',
    items: [{ label: 'Projetos', routeName: 'furniture-projetos', icon: Sofa }],
  },
  {
    title: 'Sistema',
    items: [{ label: 'Configurações', routeName: 'dashboard', icon: Settings }],
  },
]
