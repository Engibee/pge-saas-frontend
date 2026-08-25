<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-slate-900">Detalhe do projeto</h2>
    <p class="mt-1 text-sm text-slate-500">
      Ambientes, itens de orçamento e histórico de mensagens WhatsApp deste projeto
      aparecerão aqui (id: {{ id }}).
    </p>
  </div>
</template>
