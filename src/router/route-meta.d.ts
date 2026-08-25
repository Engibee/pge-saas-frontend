// Estende o tipo RouteMeta do vue-router com os campos customizados usados
// nas rotas da aplicação (ver src/router/index.ts).
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Exibido no <title> da página e opcionalmente em breadcrumbs. */
    title?: string
    /** Quando true, a rota exige usuário autenticado (ver guarda em router/index.ts). */
    requiresAuth?: boolean
    /** Quando true, a rota é acessível sem autenticação (ex.: login, 404). */
    public?: boolean
  }
}
