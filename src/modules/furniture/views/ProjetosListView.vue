<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sofa, Plus } from '@lucide/vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import StatusProjetoBadge from '../components/StatusProjetoBadge.vue'
import { projetosService } from '../services/projetos.service'
import type { ProjetoMovelPlanejado } from '../types/projeto'

const projetos = ref<ProjetoMovelPlanejado[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)

async function carregarProjetos() {
  carregando.value = true
  erro.value = null

  try {
    const resultado = await projetosService.listar()
    if (resultado.succeeded && resultado.value) {
      projetos.value = resultado.value.items
    } else {
      erro.value = resultado.errors.join(' ') || 'Não foi possível carregar os projetos.'
    }
  } catch {
    // Esperado até o endpoint /api/furniture/projetos existir no backend.
    erro.value = 'Backend ainda não disponível para esta listagem.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregarProjetos)

function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">Projetos</h2>
        <p class="mt-1 text-sm text-slate-500">Projetos de móveis planejados em andamento.</p>
      </div>
      <button type="button" class="btn-primary gap-2">
        <Plus class="h-4 w-4" />
        Novo projeto
      </button>
    </div>

    <div v-if="carregando" class="card p-6 text-sm text-slate-500">Carregando projetos...</div>

    <EmptyState
      v-else-if="erro || projetos.length === 0"
      :icon="Sofa"
      title="Nenhum projeto encontrado"
      :description="erro ?? 'Cadastre o primeiro projeto para começar.'"
    />

    <div v-else class="card overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Projeto</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Valor</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr
            v-for="projeto in projetos"
            :key="projeto.id"
            class="cursor-pointer hover:bg-slate-50"
          >
            <td class="px-4 py-3 text-sm font-medium text-slate-900">{{ projeto.titulo }}</td>
            <td class="px-4 py-3">
              <StatusProjetoBadge :status="projeto.status" />
            </td>
            <td class="px-4 py-3 text-right text-sm text-slate-700">
              {{ formatarMoeda(projeto.valorTotalOrcamento) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
