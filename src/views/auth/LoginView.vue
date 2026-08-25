<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const erroServidor = ref<string | null>(null)
const estaEnviando = ref(false)

// Schema de validação declarativo — reaproveitável em testes unitários,
// o que é um bom ponto a explorar no TCC (validação testável e desacoplada da UI).
const loginSchema = toTypedSchema(
  z.object({
    email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
    senha: z.string().min(1, 'Informe sua senha.'),
  }),
)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: loginSchema,
})

const [email, emailAttrs] = defineField('email')
const [senha, senhaAttrs] = defineField('senha')

const onSubmit = handleSubmit(async (values) => {
  erroServidor.value = null
  estaEnviando.value = true

  try {
    const resultado = await authStore.login(values.email, values.senha)

    if (!resultado.succeeded) {
      erroServidor.value = resultado.errors.join(' ')
      return
    }

    const redirect = (route.query.redirect as string) || { name: 'dashboard' }
    router.push(redirect)
  } finally {
    estaEnviando.value = false
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-surface px-4">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-slate-900">ERP SaaS</h1>
        <p class="mt-1 text-sm text-slate-500">Gestão para móveis planejados e mais</p>
      </div>

      <form class="card space-y-4 p-6" @submit="onSubmit" novalidate>
        <div>
          <label for="email" class="label-field">E-mail</label>
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
          <label for="senha" class="label-field">Senha</label>
          <input
            id="senha"
            v-model="senha"
            v-bind="senhaAttrs"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            class="input-field"
          />
          <p v-if="errors.senha" class="mt-1 text-xs text-red-600">{{ errors.senha }}</p>
        </div>

        <p v-if="erroServidor" class="text-sm text-red-600">{{ erroServidor }}</p>

        <button type="submit" class="btn-primary w-full" :disabled="estaEnviando">
          {{ estaEnviando ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="mt-6 text-center text-xs text-slate-400">
        Backend de autenticação ainda em desenvolvimento — este formulário já está
        pronto para consumir <code>POST /api/auth/login</code> assim que existir.
      </p>
    </div>
  </div>
</template>
