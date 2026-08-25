<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-slate-900">
      Olá, {{ authStore.usuario?.nomeCompleto ?? 'usuário' }} 👋
    </h2>
    <p class="mt-1 text-sm text-slate-500">
      Este é o painel inicial do seu ERP. Os indicadores (projetos em andamento,
      orçamentos pendentes, conversas não lidas) serão implementados aqui junto com o backend.
    </p>

    <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div class="card p-5">
        <p class="text-sm text-slate-500">Projetos em andamento</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">—</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-slate-500">Orçamentos pendentes</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">—</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-slate-500">Conversas não lidas</p>
        <p class="mt-2 text-3xl font-bold text-whatsapp">—</p>
      </div>
    </div>
  </div>
</template>
