<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { orcamentosService } from '../services/orcamentos.service'

const route = useRoute()
const orcamentoId = route.params.id as string

const nome = ref('')
const enviando = ref(false)
const erro = ref<string | null>(null)
const aceito = ref(false)

// Antes de aceitar, mostra o PDF rascunho (sempre gerado com os dados mais
// atuais). Depois de aceitar, troca para a versão assinada (a mesma que fica
// salva, nunca muda depois) — ver ObterPdf no backend.
const urlPdfAtual = computed(() => orcamentosService.urlPdf(orcamentoId, aceito.value))

async function assinar() {
  erro.value = null

  if (!nome.value.trim()) {
    erro.value = 'Informe seu nome completo.'
    return
  }

  enviando.value = true
  try {
    const resultado = await orcamentosService.assinar(orcamentoId, { nome: nome.value.trim() })

    if (!resultado.succeeded) {
      erro.value = resultado.errors.join(' ') || 'Não foi possível registrar o aceite.'
      return
    }

    aceito.value = true
  } catch {
    erro.value = 'Não foi possível conectar ao servidor. Tente novamente.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface px-4 py-8">
    <div class="mx-auto max-w-3xl">
      <div class="mb-6 text-center">
        <h1 class="text-xl font-bold text-slate-900">Seu orçamento</h1>
        <p class="mt-1 text-sm text-slate-500">Revise os itens abaixo antes de aceitar.</p>
      </div>

      <div class="card overflow-hidden" style="height: 70vh">
        <iframe :src="urlPdfAtual" class="h-full w-full" title="Orçamento em PDF" />
      </div>

      <div class="card mt-6 p-6">
        <p v-if="aceito" class="text-center text-sm font-medium text-green-700">
          ✓ Orçamento aceito com sucesso! A versão assinada já está sendo exibida acima.
        </p>

        <template v-else>
          <h2 class="mb-3 text-sm font-semibold text-slate-900">Aceitar orçamento</h2>
          <p class="mb-4 text-xs text-slate-500">
            Ao informar seu nome e confirmar, você registra o aceite eletrônico deste orçamento
            (nome, data/hora e endereço IP) — não é uma assinatura digital certificada (ICP-Brasil).
          </p>

          <div class="flex flex-col gap-2 sm:flex-row">
            <input v-model="nome" type="text" placeholder="Seu nome completo" class="input-field flex-1" />
            <button type="button" class="btn-primary" :disabled="enviando" @click="assinar">
              {{ enviando ? 'Enviando...' : 'Aceitar e assinar' }}
            </button>
          </div>

          <p v-if="erro" class="mt-2 text-sm text-red-600">{{ erro }}</p>
        </template>
      </div>
    </div>
  </div>
</template>
