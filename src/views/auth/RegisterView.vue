<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Check } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { TenantPlano } from '@/types/api'
import { planos } from './planos'

const router = useRouter()
const authStore = useAuthStore()

const erroServidor = ref<string | null>(null)
const estaEnviando = ref(false)

const registerSchema = toTypedSchema(
  z
    .object({
      razaoSocial: z.string().min(1, 'Informe o nome da sua empresa.'),
      nomeFantasia: z.string().optional(),
      nomeCompleto: z.string().min(1, 'Informe seu nome completo.'),
      email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
      senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
      confirmarSenha: z.string().min(1, 'Confirme sua senha.'),
      // Guardado como string no form (radio/valor de input), convertido para
      // número na hora de enviar — ver onSubmit.
      plano: z.string().min(1, 'Escolha um plano.'),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
      message: 'As senhas não coincidem.',
      path: ['confirmarSenha'],
    }),
)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: registerSchema,
  initialValues: {
    // Plano "Standard" pré-selecionado (é o marcado como destaque na definição de planos).
    plano: String(TenantPlano.Standard),
  },
})

const [razaoSocial, razaoSocialAttrs] = defineField('razaoSocial')
const [nomeFantasia, nomeFantasiaAttrs] = defineField('nomeFantasia')
const [nomeCompleto, nomeCompletoAttrs] = defineField('nomeCompleto')
const [email, emailAttrs] = defineField('email')
const [senha, senhaAttrs] = defineField('senha')
const [confirmarSenha, confirmarSenhaAttrs] = defineField('confirmarSenha')
const [plano] = defineField('plano')

const onSubmit = handleSubmit(async (values) => {
  erroServidor.value = null
  estaEnviando.value = true

  try {
    const resultado = await authStore.register({
      razaoSocial: values.razaoSocial,
      nomeFantasia: values.nomeFantasia || undefined,
      nomeCompleto: values.nomeCompleto,
      email: values.email,
      senha: values.senha,
      plano: Number(values.plano),
    })

    if (!resultado.succeeded) {
      erroServidor.value = resultado.errors.join(' ') || 'Não foi possível criar a conta.'
      return
    }

    // Cadastro implica login automático (ver authStore.register) — pula
    // direto para a tela principal, sem passar por /login de novo.
    router.push({ name: 'dashboard' })
  } finally {
    estaEnviando.value = false
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
    <div class="w-full max-w-3xl">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-slate-900">Crie sua conta</h1>
        <p class="mt-1 text-sm text-slate-500">Comece a usar o ERP SaaS na sua marcenaria</p>
      </div>

      <form class="card space-y-6 p-6" @submit="onSubmit" novalidate>
        <!-- Dados da empresa -->
        <div>
          <h2 class="mb-3 text-sm font-semibold text-slate-900">Sua empresa</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="razaoSocial" class="label-field">Razão social *</label>
              <input
                id="razaoSocial"
                v-model="razaoSocial"
                v-bind="razaoSocialAttrs"
                type="text"
                class="input-field"
              />
              <p v-if="errors.razaoSocial" class="mt-1 text-xs text-red-600">{{ errors.razaoSocial }}</p>
            </div>
            <div>
              <label for="nomeFantasia" class="label-field">Nome fantasia</label>
              <input
                id="nomeFantasia"
                v-model="nomeFantasia"
                v-bind="nomeFantasiaAttrs"
                type="text"
                class="input-field"
              />
            </div>
          </div>
        </div>

        <!-- Dados do usuário -->
        <div>
          <h2 class="mb-3 text-sm font-semibold text-slate-900">Sua conta de acesso</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="nomeCompleto" class="label-field">Nome completo *</label>
              <input
                id="nomeCompleto"
                v-model="nomeCompleto"
                v-bind="nomeCompletoAttrs"
                type="text"
                class="input-field"
              />
              <p v-if="errors.nomeCompleto" class="mt-1 text-xs text-red-600">{{ errors.nomeCompleto }}</p>
            </div>

            <div class="sm:col-span-2">
              <label for="email" class="label-field">E-mail *</label>
              <input
                id="email"
                v-model="email"
                v-bind="emailAttrs"
                type="email"
                autocomplete="email"
                placeholder="voce@empresa.com.br"
                class="input-field"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
            </div>

            <div>
              <label for="senha" class="label-field">Senha *</label>
              <input
                id="senha"
                v-model="senha"
                v-bind="senhaAttrs"
                type="password"
                autocomplete="new-password"
                placeholder="Mínimo 8 caracteres"
                class="input-field"
              />
              <p v-if="errors.senha" class="mt-1 text-xs text-red-600">{{ errors.senha }}</p>
            </div>

            <div>
              <label for="confirmarSenha" class="label-field">Confirmar senha *</label>
              <input
                id="confirmarSenha"
                v-model="confirmarSenha"
                v-bind="confirmarSenhaAttrs"
                type="password"
                autocomplete="new-password"
                class="input-field"
              />
              <p v-if="errors.confirmarSenha" class="mt-1 text-xs text-red-600">{{ errors.confirmarSenha }}</p>
            </div>
          </div>
        </div>

        <!-- Seleção de plano -->
        <div>
          <h2 class="mb-3 text-sm font-semibold text-slate-900">Escolha seu plano</h2>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label
              v-for="def in planos"
              :key="def.valor"
              class="relative flex cursor-pointer flex-col rounded-xl border p-4 transition-colors"
              :class="
                Number(plano) === def.valor
                  ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              "
            >
              <input type="radio" name="plano" :value="String(def.valor)" v-model="plano" class="sr-only" />

              <span
                v-if="def.destaque"
                class="absolute -top-2 right-3 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-medium text-white"
              >
                Mais popular
              </span>

              <span class="text-sm font-semibold text-slate-900">{{ def.nome }}</span>
              <span class="mt-1 text-lg font-bold text-slate-900">{{ def.precoMensal }}</span>
              <span class="mt-1 text-xs text-slate-500">{{ def.descricao }}</span>

              <ul class="mt-3 space-y-1.5">
                <li
                  v-for="recurso in def.recursos"
                  :key="recurso"
                  class="flex items-start gap-1.5 text-xs text-slate-600"
                >
                  <Check class="mt-0.5 h-3 w-3 flex-shrink-0 text-brand-600" />
                  {{ recurso }}
                </li>
              </ul>
            </label>
          </div>
          <p v-if="errors.plano" class="mt-1 text-xs text-red-600">{{ errors.plano }}</p>
        </div>

        <p v-if="erroServidor" class="text-sm text-red-600">{{ erroServidor }}</p>

        <button type="submit" class="btn-primary w-full" :disabled="estaEnviando">
          {{ estaEnviando ? 'Criando conta...' : 'Criar conta e entrar' }}
        </button>

        <p class="text-center text-xs text-slate-400">
          Nenhuma cobrança é feita neste cadastro — o pagamento ainda não está integrado.
        </p>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Já tem uma conta?
        <RouterLink :to="{ name: 'login' }" class="font-medium text-brand-600 hover:text-brand-700">
          Entrar
        </RouterLink>
      </p>
    </div>
  </div>
</template>
