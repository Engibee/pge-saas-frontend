<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessageCircle, Check, X } from '@lucide/vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { conversasPendentesService } from '../services/conversasPendentes.service'
import type { ConversaPendente } from '../types/conversaPendente'

const conversas = ref<ConversaPendente[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)

// Controla qual conversa está com o campo de nome aberto para aprovação.
const conversaEmAprovacao = ref<string | null>(null)
const nomeCliente = ref('')
const processando = ref<string | null>(null)

async function carregar() {
  carregando.value = true
  erro.value = null

  try {
    const resultado = await conversasPendentesService.listar('Pendente')
    if (resultado.succeeded && resultado.value) {
      conversas.value = resultado.value
    } else {
      erro.value = resultado.errors.join(' ') || 'Não foi possível carregar as conversas.'
    }
  } catch {
    erro.value = 'Não foi possível conectar à API. Verifique se o backend está rodando.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)

function abrirAprovacao(conversa: ConversaPendente) {
  conversaEmAprovacao.value = conversa.id
  nomeCliente.value = ''
}

function cancelarAprovacao() {
  conversaEmAprovacao.value = null
  nomeCliente.value = ''
}

async function confirmarAprovacao(id: string) {
  processando.value = id
  try {
    const resultado = await conversasPendentesService.aprovar(id, { nome: nomeCliente.value || undefined })
    if (resultado.succeeded) {
      conversas.value = conversas.value.filter((c) => c.id !== id)
      conversaEmAprovacao.value = null
    } else {
      erro.value = resultado.errors.join(' ') || 'Não foi possível aprovar a conversa.'
    }
  } finally {
    processando.value = null
  }
}

async function ignorar(id: string) {
  processando.value = id
  try {
    const resultado = await conversasPendentesService.ignorar(id)
    if (resultado.succeeded) {
      conversas.value = conversas.value.filter((c) => c.id !== id)
    } else {
      erro.value = resultado.errors.join(' ') || 'Não foi possível ignorar a conversa.'
    }
  } finally {
    processando.value = null
  }
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleString('pt-BR')
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-slate-900">Conversas WhatsApp</h2>
      <p class="mt-1 text-sm text-slate-500">
        Números que mandaram mensagem e ainda não são clientes. Aprove para criar o cliente e abrir
        um serviço, ou ignore (ex.: conversa pessoal do número conectado).
      </p>
    </div>

    <div v-if="carregando" class="card p-6 text-sm text-slate-500">Carregando conversas...</div>

    <EmptyState
      v-else-if="erro || conversas.length === 0"
      :icon="MessageCircle"
      title="Nenhuma conversa pendente"
      :description="erro ?? 'Quando alguém mandar mensagem pelo WhatsApp conectado, aparece aqui.'"
    />

    <div v-else class="space-y-3">
      <div v-for="conversa in conversas" :key="conversa.id" class="card p-4">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="font-medium text-slate-900">{{ conversa.telefoneOrigemE164 }}</p>
            <p class="mt-1 truncate text-sm text-slate-600">
              {{ conversa.ultimaMensagemTexto || '(mensagem sem texto)' }}
            </p>
            <p class="mt-1 text-xs text-slate-400">
              {{ conversa.quantidadeMensagens }} mensagem(ns) · última em {{ formatarData(conversa.ultimaMensagemEmUtc) }}
            </p>
          </div>

          <div v-if="conversaEmAprovacao !== conversa.id" class="flex flex-shrink-0 gap-2">
            <button
              type="button"
              class="btn-primary gap-1.5 px-3 py-1.5 text-sm"
              :disabled="processando === conversa.id"
              @click="abrirAprovacao(conversa)"
            >
              <Check class="h-4 w-4" />
              Aprovar
            </button>
            <button
              type="button"
              class="btn-secondary gap-1.5 px-3 py-1.5 text-sm"
              :disabled="processando === conversa.id"
              @click="ignorar(conversa.id)"
            >
              <X class="h-4 w-4" />
              Ignorar
            </button>
          </div>
        </div>

        <!-- Formulário de aprovação (nome opcional do cliente) -->
        <div v-if="conversaEmAprovacao === conversa.id" class="mt-4 flex items-end gap-2 border-t border-slate-100 pt-4">
          <div class="flex-1">
            <label class="label-field">Nome do cliente (opcional)</label>
            <input
              v-model="nomeCliente"
              type="text"
              placeholder="Deixe em branco para usar um nome provisório"
              class="input-field"
            />
          </div>
          <button
            type="button"
            class="btn-primary px-3 py-2.5 text-sm"
            :disabled="processando === conversa.id"
            @click="confirmarAprovacao(conversa.id)"
          >
            {{ processando === conversa.id ? 'Aprovando...' : 'Confirmar' }}
          </button>
          <button type="button" class="btn-secondary px-3 py-2.5 text-sm" @click="cancelarAprovacao">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
