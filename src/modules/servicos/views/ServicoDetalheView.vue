<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Plus, Trash2, FileText, ExternalLink } from '@lucide/vue'
import StatusServicoBadge from '../components/StatusServicoBadge.vue'
import { servicosService } from '../services/servicos.service'
import { StatusServico, statusServicoLabel } from '../types/servico'
import type { Servico } from '../types/servico'
import { orcamentosService } from '@/modules/orcamentos/services/orcamentos.service'
import type { Orcamento, ItemOrcamentoInput } from '@/modules/orcamentos/types/orcamento'

const route = useRoute()
const servicoId = route.params.id as string

// --- Serviço ---

const servico = ref<Servico | null>(null)
const carregandoServico = ref(true)
const erroServico = ref<string | null>(null)

const titulo = ref('')
const escopo = ref('')
const salvandoEscopo = ref(false)

async function carregarServico() {
  carregandoServico.value = true
  erroServico.value = null

  try {
    const resultado = await servicosService.obterPorId(servicoId)
    if (resultado.succeeded && resultado.value) {
      servico.value = resultado.value
      titulo.value = resultado.value.titulo ?? ''
      escopo.value = resultado.value.escopo ?? ''
    } else {
      erroServico.value = resultado.errors.join(' ') || 'Serviço não encontrado.'
    }
  } catch {
    erroServico.value = 'Não foi possível conectar à API.'
  } finally {
    carregandoServico.value = false
  }
}

async function salvarEscopo() {
  salvandoEscopo.value = true
  try {
    const resultado = await servicosService.atualizar(servicoId, {
      titulo: titulo.value || undefined,
      escopo: escopo.value || undefined,
    })
    if (resultado.succeeded && resultado.value) {
      servico.value = resultado.value
    }
  } finally {
    salvandoEscopo.value = false
  }
}

// Select nativo: o "value" de cada <option> é a CHAVE em texto do enum
// (ex.: "EmAndamento"), igual ao que servico.status já traz do backend —
// então dá pra usar :value="servico.status" direto, sem precisar de um
// segundo ref sincronizado manualmente. No @change, convertemos essa chave
// de volta para o número que o backend espera ao SALVAR (ver comentário em
// types/servico.ts sobre a diferença entre o que a API devolve e o que ela recebe).
async function mudarStatus(event: Event) {
  const chave = (event.target as HTMLSelectElement).value as keyof typeof StatusServico
  const resultado = await servicosService.atualizar(servicoId, { status: StatusServico[chave] })
  if (resultado.succeeded && resultado.value) {
    servico.value = resultado.value
  }
}

// --- Orçamentos ---

const orcamentos = ref<Orcamento[]>([])
const carregandoOrcamentos = ref(true)
const mostrarFormOrcamento = ref(false)
const itensNovoOrcamento = ref<ItemOrcamentoInput[]>([{ descricao: '', quantidade: 1, valorUnitario: 0 }])
const observacoesNovoOrcamento = ref('')
const enviandoOrcamento = ref(false)
const erroOrcamento = ref<string | null>(null)

const totalNovoOrcamento = computed(() =>
  itensNovoOrcamento.value.reduce((soma, item) => soma + item.quantidade * item.valorUnitario, 0),
)

async function carregarOrcamentos() {
  carregandoOrcamentos.value = true
  try {
    const resultado = await orcamentosService.listarPorServico(servicoId)
    if (resultado.succeeded && resultado.value) {
      orcamentos.value = resultado.value
    }
  } finally {
    carregandoOrcamentos.value = false
  }
}

function adicionarItem() {
  itensNovoOrcamento.value.push({ descricao: '', quantidade: 1, valorUnitario: 0 })
}

function removerItem(indice: number) {
  if (itensNovoOrcamento.value.length > 1) {
    itensNovoOrcamento.value.splice(indice, 1)
  }
}

async function criarOrcamento() {
  erroOrcamento.value = null

  const itensValidos = itensNovoOrcamento.value.filter((item) => item.descricao.trim().length > 0)
  if (itensValidos.length === 0) {
    erroOrcamento.value = 'Adicione pelo menos um item com descrição.'
    return
  }

  enviandoOrcamento.value = true
  try {
    const resultado = await orcamentosService.criar(servicoId, {
      itens: itensValidos,
      observacoesGerais: observacoesNovoOrcamento.value || undefined,
    })

    if (!resultado.succeeded) {
      erroOrcamento.value = resultado.errors.join(' ') || 'Não foi possível criar o orçamento.'
      return
    }

    mostrarFormOrcamento.value = false
    itensNovoOrcamento.value = [{ descricao: '', quantidade: 1, valorUnitario: 0 }]
    observacoesNovoOrcamento.value = ''
    await carregarOrcamentos()
    await carregarServico() // status do serviço pode ter avançado
  } finally {
    enviandoOrcamento.value = false
  }
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

onMounted(() => {
  carregarServico()
  carregarOrcamentos()
})
</script>

<template>
  <div class="max-w-3xl">
    <div v-if="carregandoServico" class="card p-6 text-sm text-slate-500">Carregando...</div>
    <div v-else-if="erroServico" class="card p-6 text-sm text-red-600">{{ erroServico }}</div>

    <template v-else-if="servico">
      <div class="mb-6 flex items-start justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">{{ servico.clienteNome }}</h2>
          <p class="mt-1 text-sm text-slate-500">
            Serviço aberto em {{ new Date(servico.createdAtUtc).toLocaleDateString('pt-BR') }}
          </p>
        </div>
        <StatusServicoBadge :status="servico.status" />
      </div>

      <!-- Escopo -->
      <div class="card mb-6 space-y-4 p-6">
        <h3 class="text-sm font-semibold text-slate-900">Escopo do serviço</h3>

        <div>
          <label class="label-field">Título</label>
          <input v-model="titulo" type="text" placeholder="Ex.: Cozinha planejada" class="input-field" />
        </div>

        <div>
          <label class="label-field">Descrição do escopo</label>
          <textarea
            v-model="escopo"
            rows="4"
            placeholder="O que foi combinado com o cliente..."
            class="input-field"
          />
        </div>

        <div class="flex items-center justify-between">
          <button type="button" class="btn-primary" :disabled="salvandoEscopo" @click="salvarEscopo">
            {{ salvandoEscopo ? 'Salvando...' : 'Salvar escopo' }}
          </button>

          <select :value="servico.status" class="input-field w-auto" @change="mudarStatus">
            <option v-for="(rotulo, chave) in statusServicoLabel" :key="chave" :value="chave">
              {{ rotulo }}
            </option>
          </select>
        </div>
      </div>

      <!-- Orçamentos -->
      <div class="card p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-900">Orçamentos</h3>
          <button
            type="button"
            class="btn-primary gap-1.5 px-3 py-1.5 text-sm"
            @click="mostrarFormOrcamento = !mostrarFormOrcamento"
          >
            <Plus class="h-4 w-4" />
            Novo orçamento
          </button>
        </div>

        <!-- Formulário de novo orçamento -->
        <div v-if="mostrarFormOrcamento" class="mb-6 space-y-4 rounded-lg border border-slate-200 p-4">
          <div v-for="(item, indice) in itensNovoOrcamento" :key="indice" class="grid grid-cols-12 gap-2">
            <input
              v-model="item.descricao"
              type="text"
              placeholder="Descrição do item"
              class="input-field col-span-6"
            />
            <input v-model.number="item.quantidade" type="number" min="0.01" step="0.01" class="input-field col-span-2" />
            <input v-model.number="item.valorUnitario" type="number" min="0" step="0.01" class="input-field col-span-3" />
            <button
              type="button"
              class="col-span-1 flex items-center justify-center text-slate-400 hover:text-red-600"
              @click="removerItem(indice)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>

          <button type="button" class="text-sm font-medium text-brand-600 hover:text-brand-700" @click="adicionarItem">
            + Adicionar item
          </button>

          <textarea
            v-model="observacoesNovoOrcamento"
            rows="2"
            placeholder="Observações gerais (opcional)"
            class="input-field"
          />

          <div class="flex items-center justify-between border-t border-slate-100 pt-4">
            <p class="text-sm font-semibold text-slate-900">Total: {{ formatarMoeda(totalNovoOrcamento) }}</p>
            <button type="button" class="btn-primary" :disabled="enviandoOrcamento" @click="criarOrcamento">
              {{ enviandoOrcamento ? 'Criando...' : 'Criar orçamento' }}
            </button>
          </div>

          <p v-if="erroOrcamento" class="text-sm text-red-600">{{ erroOrcamento }}</p>
        </div>

        <!-- Lista de orçamentos existentes -->
        <div v-if="carregandoOrcamentos" class="text-sm text-slate-500">Carregando orçamentos...</div>
        <p v-else-if="orcamentos.length === 0" class="text-sm text-slate-500">Nenhum orçamento criado ainda.</p>

        <ul v-else class="space-y-2">
          <li
            v-for="orcamento in orcamentos"
            :key="orcamento.id"
            class="flex items-center justify-between rounded-lg border border-slate-200 p-3"
          >
            <div class="flex items-center gap-3">
              <FileText class="h-5 w-5 text-slate-400" />
              <div>
                <p class="text-sm font-medium text-slate-900">{{ formatarMoeda(orcamento.valorTotal) }}</p>
                <p class="text-xs text-slate-500">
                  {{ orcamento.itens.length }} item(ns) ·
                  {{ orcamento.status === 'Assinado' ? 'Assinado' : 'Aguardando aceite' }}
                </p>
              </div>
            </div>
            <a
              :href="orcamentosService.urlPdf(orcamento.id, orcamento.temPdfAssinado)"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Ver PDF
              <ExternalLink class="h-3.5 w-3.5" />
            </a>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
