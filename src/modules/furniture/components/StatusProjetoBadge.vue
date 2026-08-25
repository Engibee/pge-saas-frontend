<script setup lang="ts">
import { computed } from 'vue'
import { StatusProjeto, statusProjetoLabel } from '../types/projeto'

const props = defineProps<{
  status: StatusProjeto
}>()

// Mapeia cada status para uma cor semântica — mantém a lógica de estilo
// isolada do restante do componente pai.
const colorClasses = computed(() => {
  switch (props.status) {
    case StatusProjeto.Cancelado:
      return 'bg-red-50 text-red-700 ring-red-600/20'
    case StatusProjeto.Entregue:
    case StatusProjeto.InstalacaoConcluida:
      return 'bg-green-50 text-green-700 ring-green-600/20'
    case StatusProjeto.EmProducao:
    case StatusProjeto.PronoParaEntrega:
      return 'bg-blue-50 text-blue-700 ring-blue-600/20'
    case StatusProjeto.Aprovado:
      return 'bg-brand-50 text-brand-700 ring-brand-600/20'
    default:
      return 'bg-slate-100 text-slate-600 ring-slate-500/20'
  }
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
    :class="colorClasses"
  >
    {{ statusProjetoLabel[status] }}
  </span>
</template>
