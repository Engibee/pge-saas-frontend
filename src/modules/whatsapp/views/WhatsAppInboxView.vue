<script setup lang="ts">
import { MessageCircle } from '@lucide/vue'
import EmptyState from '@/components/shared/EmptyState.vue'
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-slate-900">Conversas WhatsApp</h2>
      <p class="mt-1 text-sm text-slate-500">
        Mensagens recebidas de clientes via WhatsApp aparecerão aqui, vinculadas ao cadastro
        de cliente correspondente.
      </p>
    </div>

    <EmptyState
      :icon="MessageCircle"
      title="Nenhuma conversa ainda"
      description="Depende do endpoint de webhook do WhatsApp estar publicado e do histórico de mensagens ser implementado no backend."
    />
  </div>
</template>
