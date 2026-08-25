<script setup lang="ts">
import { LogOut } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { navGroups } from './navigation'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="flex h-screen bg-surface">
    <!-- Sidebar -->
    <aside class="flex w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
      <div class="flex h-16 items-center border-b border-slate-200 px-6">
        <span class="text-lg font-bold text-slate-900">ERP SaaS</span>
      </div>

      <nav class="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <div v-for="group in navGroups" :key="group.title">
          <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {{ group.title }}
          </p>
          <ul class="space-y-0.5">
            <li v-for="item in group.items" :key="item.routeName">
              <RouterLink
                :to="{ name: item.routeName }"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                active-class="bg-brand-50 text-brand-700 hover:bg-brand-50 hover:text-brand-700"
              >
                <component :is="item.icon" class="h-4 w-4" />
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="border-t border-slate-200 p-4">
        <div class="mb-3 px-2">
          <p class="truncate text-sm font-medium text-slate-900">
            {{ authStore.usuario?.nomeCompleto }}
          </p>
          <p class="truncate text-xs text-slate-500">{{ authStore.usuario?.email }}</p>
        </div>
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          @click="handleLogout"
        >
          <LogOut class="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>

    <!-- Conteúdo principal -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <header class="flex h-16 flex-shrink-0 items-center border-b border-slate-200 bg-white px-6">
        <h1 class="text-sm font-medium text-slate-500">
          {{ $route.meta.title }}
        </h1>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
