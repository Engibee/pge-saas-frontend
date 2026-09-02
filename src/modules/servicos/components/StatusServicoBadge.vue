<script setup lang="ts">
import { computed } from 'vue'
import { statusServicoLabel } from '../types/servico'

const props = defineProps<{
  status: string
}>()

// Cores sugeridas no comentário do backend (ver ERP.SaaS.Core.Entities.Servico):
// EmAndamento=amarelo, EscopoDefinido/OrcamentoEnviado=azul, Aprovado=verde,
// Concluido=cinza, Cancelado=vermelho.
const colorClasses = computed(() => {
  switch (props.status) {
    case 'EmAndamento':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    case 'EscopoDefinido':
    case 'OrcamentoEnviado':
      return 'bg-blue-50 text-blue-700 ring-blue-600/20'
    case 'Aprovado':
      return 'bg-green-50 text-green-700 ring-green-600/20'
    case 'Cancelado':
      return 'bg-red-50 text-red-700 ring-red-600/20'
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
    {{ statusServicoLabel[status] ?? status }}
  </span>
</template>
