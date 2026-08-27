<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Users, Plus } from '@lucide/vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import EmptyState from '@/components/shared/EmptyState.vue'
import { clientesService } from '../services/clientes.service'
import type { Cliente } from '../types/cliente'

// --- Listagem ---

const clientes = ref<Cliente[]>([])
const carregandoLista = ref(true)
const erroLista = ref<string | null>(null)

async function carregarClientes() {
  carregandoLista.value = true
  erroLista.value = null

  try {
    const resultado = await clientesService.listar()
    if (resultado.succeeded && resultado.value) {
      clientes.value = resultado.value
    } else {
      erroLista.value = resultado.errors.join(' ') || 'Não foi possível carregar os clientes.'
    }
  } catch {
    erroLista.value = 'Não foi possível conectar à API. Verifique se o backend está rodando.'
  } finally {
    carregandoLista.value = false
  }
}

onMounted(carregarClientes)

// --- Formulário de cadastro ---

const erroFormulario = ref<string | null>(null)
const enviando = ref(false)
const mostrarFormulario = ref(false)

// Campos opcionais tratados como string vazia -> undefined antes de enviar,
// para não mandar "" ao backend onde ele espera null/ausente.
const clienteSchema = toTypedSchema(
  z.object({
    nome: z.string().min(1, 'Informe o nome do cliente.'),
    cpfCnpj: z.string().optional(),
    email: z.union([z.literal(''), z.string().email('E-mail inválido.')]).optional(),
    telefoneWhatsApp: z.string().optional(),
    observacoes: z.string().optional(),
  }),
)

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: clienteSchema,
})

const [nome, nomeAttrs] = defineField('nome')
const [cpfCnpj, cpfCnpjAttrs] = defineField('cpfCnpj')
const [email, emailAttrs] = defineField('email')
const [telefoneWhatsApp, telefoneWhatsAppAttrs] = defineField('telefoneWhatsApp')
const [observacoes, observacoesAttrs] = defineField('observacoes')

const onSubmit = handleSubmit(async (values) => {
  erroFormulario.value = null
  enviando.value = true

  try {
    const resultado = await clientesService.criar({
      nome: values.nome,
      cpfCnpj: values.cpfCnpj || undefined,
      email: values.email || undefined,
      telefoneWhatsApp: values.telefoneWhatsApp || undefined,
      observacoes: values.observacoes || undefined,
    })

    if (!resultado.succeeded) {
      erroFormulario.value = resultado.errors.join(' ') || 'Não foi possível cadastrar o cliente.'
      return
    }

    resetForm()
    mostrarFormulario.value = false
    await carregarClientes()
  } catch {
    erroFormulario.value = 'Não foi possível conectar à API. Verifique se o backend está rodando.'
  } finally {
    enviando.value = false
  }
})

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">Clientes</h2>
        <p class="mt-1 text-sm text-slate-500">Cadastro de clientes, compartilhado entre todos os módulos.</p>
      </div>
      <button type="button" class="btn-primary gap-2" @click="mostrarFormulario = !mostrarFormulario">
        <Plus class="h-4 w-4" />
        {{ mostrarFormulario ? 'Cancelar' : 'Novo cliente' }}
      </button>
    </div>

    <!-- Formulário de cadastro -->
    <form v-if="mostrarFormulario" class="card mb-6 space-y-4 p-6" @submit="onSubmit" novalidate>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label for="nome" class="label-field">Nome *</label>
          <input id="nome" v-model="nome" v-bind="nomeAttrs" type="text" class="input-field" />
          <p v-if="errors.nome" class="mt-1 text-xs text-red-600">{{ errors.nome }}</p>
        </div>

        <div>
          <label for="cpfCnpj" class="label-field">CPF/CNPJ</label>
          <input id="cpfCnpj" v-model="cpfCnpj" v-bind="cpfCnpjAttrs" type="text" class="input-field" />
        </div>

        <div>
          <label for="telefoneWhatsApp" class="label-field">Telefone (WhatsApp)</label>
          <input
            id="telefoneWhatsApp"
            v-model="telefoneWhatsApp"
            v-bind="telefoneWhatsAppAttrs"
            type="text"
            placeholder="+5511999998888"
            class="input-field"
          />
        </div>

        <div>
          <label for="email" class="label-field">E-mail</label>
          <input id="email" v-model="email" v-bind="emailAttrs" type="email" class="input-field" />
          <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
        </div>

        <div>
          <label for="observacoes" class="label-field">Observações</label>
          <input id="observacoes" v-model="observacoes" v-bind="observacoesAttrs" type="text" class="input-field" />
        </div>
      </div>

      <p v-if="erroFormulario" class="text-sm text-red-600">{{ erroFormulario }}</p>

      <button type="submit" class="btn-primary" :disabled="enviando">
        {{ enviando ? 'Salvando...' : 'Salvar cliente' }}
      </button>
    </form>

    <!-- Listagem -->
    <div v-if="carregandoLista" class="card p-6 text-sm text-slate-500">Carregando clientes...</div>

    <EmptyState
      v-else-if="erroLista || clientes.length === 0"
      :icon="Users"
      title="Nenhum cliente cadastrado ainda"
      :description="erroLista ?? 'Clique em \'Novo cliente\' para cadastrar o primeiro.'"
    />

    <div v-else class="card overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Nome</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Contato</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Origem</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Cadastrado em</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="cliente in clientes" :key="cliente.id">
            <td class="px-4 py-3 text-sm font-medium text-slate-900">{{ cliente.nome }}</td>
            <td class="px-4 py-3 text-sm text-slate-600">
              {{ cliente.telefoneWhatsApp || cliente.email || '—' }}
            </td>
            <td class="px-4 py-3 text-sm text-slate-600">{{ cliente.origem }}</td>
            <td class="px-4 py-3 text-sm text-slate-600">{{ formatarData(cliente.createdAtUtc) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
