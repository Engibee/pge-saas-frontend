# ERP SaaS — Frontend

> ⚠️ **Repositório separado do backend.** Este repositório contém apenas o
> **frontend** (Vue 3 + TypeScript). O backend (C# / .NET 8, futuramente
> containerizado com Docker) vive em um repositório próprio — ver
> `erp-saas-backend`. Os dois se comunicam via API REST, apontada pela
> variável de ambiente `VITE_API_BASE_URL` (ver `.env.example`).

Aplicação web (SPA) do ERP SaaS, construída em **Vue 3 + TypeScript + Vite**,
consumindo a API backend (`ERP.SaaS.Api`, em C#/.NET — a ser desenvolvida em
uma etapa futura, em repositório separado).

> Este frontend já está com toda a estrutura, roteamento, autenticação (client-side)
> e chamadas de API **prontos**, mesmo sem o backend real ainda existir. As telas
> mostram estados vazios/erro apropriados até os endpoints existirem — não é
> necessário alterar nenhuma tela quando o backend for implementado, só os
> serviços em `src/*/services`.

## Stack

| Categoria           | Escolha                                             |
|----------------------|------------------------------------------------------|
| Framework            | Vue 3 (Composition API + `<script setup>`)            |
| Linguagem            | TypeScript                                            |
| Build tool           | Vite                                                   |
| Estilo               | Tailwind CSS v4                                       |
| Roteamento           | Vue Router 5                                          |
| Estado global         | Pinia                                                  |
| HTTP client          | Axios                                                  |
| Validação de formulário | vee-validate + zod                                 |
| Ícones               | lucide (`@lucide/vue`)                                |
| Utilitários reativos  | VueUse                                                |
| Lint / Format        | ESLint (flat config) + Prettier                        |

## Como rodar

```bash
cd frontend
cp .env.example .env      # ajuste VITE_API_BASE_URL se necessário
npm install
npm run dev                # http://localhost:5173
```

Outros scripts disponíveis:

```bash
npm run build      # type-check (vue-tsc) + build de produção em dist/
npm run preview    # serve o build de produção localmente
npm run lint        # ESLint com --fix
npm run format      # Prettier em src/
```

## Estrutura de pastas

```
src/
├── assets/            # CSS global (Tailwind + tema) e outros estáticos
├── components/
│   ├── ui/             # Componentes de UI genéricos e reutilizáveis (botões, inputs...)
│   └── shared/         # Componentes compartilhados entre módulos (ex.: EmptyState)
├── composables/        # Composables Vue reutilizáveis (lógica compartilhada)
├── layouts/            # Layouts de página (ex.: AppLayout com sidebar)
├── lib/                # Utilitários puros (formatação, helpers)
├── router/             # Configuração central do Vue Router
├── services/
│   └── api/             # Cliente Axios central (interceptors de auth/erro)
├── stores/              # Stores Pinia (ex.: auth.ts)
├── types/               # Tipos TypeScript compartilhados, espelhando o backend
├── views/                # Telas que não pertencem a nenhum módulo de negócio específico
│                          # (login, dashboard, 404)
└── modules/               # Um diretório por módulo de negócio — mesma filosofia
    │                        # modular do backend (IBusinessModule)
    ├── clientes/
    │   ├── components/
    │   ├── services/        # Chamadas à API específicas do módulo
    │   ├── types/            # Tipos espelhando as entidades C# do módulo
    │   └── views/
    ├── furniture/            # Módulo "Móveis Planejados"
    │   └── ...
    └── whatsapp/
        └── ...
```

### Por que essa estrutura modular?

Para manter a mesma filosofia do backend: cada módulo de negócio (`furniture`,
`clientes`, `whatsapp`, e futuramente `mechanic`) é autocontido — tem seus
próprios tipos, serviços de API e telas. Adicionar um novo módulo no futuro
significa criar uma nova pasta em `src/modules/`, sem tocar nos módulos
existentes. As rotas de cada módulo ficam em `src/modules/<modulo>/routes.ts`
e são agregadas centralmente em `src/router/index.ts`.

## Autenticação (status atual)

A store `src/stores/auth.ts` já está pronta para consumir
`POST /api/auth/login` (formato de retorno esperado documentado no próprio
arquivo) e guarda o token JWT + refresh token em `localStorage`. O
`src/services/api/client.ts` já anexa o `Authorization: Bearer <token>` em
toda requisição automaticamente, e desloga o usuário em caso de resposta
`401`.

**Nada disso funciona de verdade ainda** porque o endpoint `/api/auth/login`
não existe no backend (ver o outro projeto, `ERP.SaaS` — a API ainda será
desenvolvida). A tela de login (`src/views/auth/LoginView.vue`) já valida o
formulário com `vee-validate` + `zod`, mas qualquer tentativa de login vai
falhar com erro de conexão até a API existir.

## Variáveis de ambiente

Ver `.env.example`. A única variável obrigatória hoje é:

- `VITE_API_BASE_URL` — URL base da API backend (ex.: `http://localhost:5000/api`)

## Próximos passos sugeridos

- [ ] Implementar o backend (`erp-saas-backend`, repositório separado — API
      ASP.NET Core reaproveitando `ERP.SaaS.Core` / `ERP.SaaS.Infrastructure`
      / módulos já existentes, containerizada com Docker)
- [ ] Conectar as telas de listagem (`ClientesListView`, `ProjetosListView`) aos
      endpoints reais assim que existirem
- [ ] Implementar o formulário de criação/edição de Cliente e Projeto
- [ ] Adicionar testes unitários (ex.: Vitest) para os composables e stores
- [ ] Adicionar testes E2E (ex.: Playwright) para o fluxo de login
