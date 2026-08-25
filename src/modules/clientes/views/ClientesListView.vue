<script setup lang="ts">
import { Users, Plus } from '@lucide/vue'
import EmptyState from '@/components/shared/EmptyState.vue'

// TODO: substituir por chamada real a src/modules/clientes/services quando
// o endpoint GET /api/clientes existir no backend.
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">Clientes</h2>
        <p class="mt-1 text-sm text-slate-500">Cadastro de clientes, compartilhado entre todos os módulos.</p>
      </div>
      <button type="button" class="btn-primary gap-2">
        <Plus class="h-4 w-4" />
        Novo cliente
      </button>
    </div>

    <EmptyState
      :icon="Users"
      title="Nenhum cliente cadastrado ainda"
      description="Assim que o endpoint da API estiver pronto, os clientes cadastrados aparecerão aqui."
    />
  </div>
</template>
