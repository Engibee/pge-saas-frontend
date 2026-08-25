<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
    <p class="text-6xl font-bold text-slate-200">404</p>
    <h1 class="mt-4 text-xl font-semibold text-slate-900">Página não encontrada</h1>
    <p class="mt-1 text-sm text-slate-500">O endereço acessado não existe ou foi movido.</p>
    <RouterLink :to="{ name: 'dashboard' }" class="btn-primary mt-6">
      Voltar para o início
    </RouterLink>
  </div>
</template>
