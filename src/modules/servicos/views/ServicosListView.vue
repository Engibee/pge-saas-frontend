<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Briefcase } from '@lucide/vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import StatusServicoBadge from '../components/StatusServicoBadge.vue'
import { servicosService } from '../services/servicos.service'
import type { Servico } from '../types/servico'

const router = useRouter()

const servicos = ref<Servico[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)

async function carregar() {
  carregando.value = true
  erro.value = null

  try {
    const resultado = await servicosService.listar()
    if (resultado.succeeded && resultado.value) {
      servicos.value = resultado.value
    } else {
      erro.value = resultado.errors.join(' ') || 'Não foi possível carregar os serviços.'
    }
  } catch {
    erro.value = 'Não foi possível conectar à API. Verifique se o backend está rodando.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)

function abrirServico(id: string) {
  router.push({ name: 'servico-detalhe', params: { id } })
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-slate-900">Serviços</h2>
      <p class="mt-1 text-sm text-slate-500">
        Atendimentos em andamento — nascem quando uma conversa do WhatsApp é aprovada como cliente.
      </p>
    </div>

    <div v-if="carregando" class="card p-6 text-sm text-slate-500">Carregando serviços...</div>

    <EmptyState
      v-else-if="erro || servicos.length === 0"
      :icon="Briefcase"
      title="Nenhum serviço ainda"
      :description="erro ?? 'Aprove uma conversa de WhatsApp para o primeiro serviço aparecer aqui.'"
    />

    <div v-else class="card overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Cliente</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Título</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Status</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Criado em</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr
            v-for="servico in servicos"
            :key="servico.id"
            class="cursor-pointer hover:bg-slate-50"
            @click="abrirServico(servico.id)"
          >
            <td class="px-4 py-3 text-sm font-medium text-slate-900">{{ servico.clienteNome }}</td>
            <td class="px-4 py-3 text-sm text-slate-600">{{ servico.titulo || '—' }}</td>
            <td class="px-4 py-3">
              <StatusServicoBadge :status="servico.status" />
            </td>
            <td class="px-4 py-3 text-sm text-slate-600">{{ formatarData(servico.createdAtUtc) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
