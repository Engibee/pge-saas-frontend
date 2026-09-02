<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Copy, ShieldAlert } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { whatsappConfigService } from '../services/whatsappConfig.service'
import type { WhatsAppConfiguracao } from '../types/whatsappConfig'

const authStore = useAuthStore()

// Esta tela só faz sentido para quem pode configurar — a proteção de
// verdade é no backend ([Authorize(Roles = "AdministradorTenant")]), isto
// aqui é só uma conveniência de UX para não mostrar um formulário que vai
// falhar com 401 para quem não tem o papel certo.
const podeConfigurar = computed(() => authStore.usuario?.papel === 'AdministradorTenant')

const configuracaoAtual = ref<WhatsAppConfiguracao | null>(null)
const carregando = ref(true)
const erroCarregamento = ref<string | null>(null)

async function carregar() {
  if (!podeConfigurar.value) {
    carregando.value = false
    return
  }

  carregando.value = true
  try {
    const resultado = await whatsappConfigService.obter()
    if (resultado.succeeded && resultado.value) {
      configuracaoAtual.value = resultado.value
    } else {
      erroCarregamento.value = resultado.errors.join(' ') || 'Não foi possível carregar a configuração.'
    }
  } catch {
    erroCarregamento.value = 'Não foi possível conectar à API.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)

// --- Formulário ---

const erroFormulario = ref<string | null>(null)
const sucessoFormulario = ref(false)
const enviando = ref(false)

const schema = toTypedSchema(
  z.object({
    phoneNumberId: z.string().min(1, 'Informe o Phone Number ID.'),
    accessToken: z.string().min(1, 'Informe o Access Token.'),
    businessAccountId: z.string().optional(),
    numeroOrigem: z.string().optional(),
    webhookVerifyToken: z.string().min(1, 'Defina um token de verificação.'),
  }),
)

const { defineField, handleSubmit, errors } = useForm({ validationSchema: schema })

const [phoneNumberId, phoneNumberIdAttrs] = defineField('phoneNumberId')
const [accessToken, accessTokenAttrs] = defineField('accessToken')
const [businessAccountId, businessAccountIdAttrs] = defineField('businessAccountId')
const [numeroOrigem, numeroOrigemAttrs] = defineField('numeroOrigem')
const [webhookVerifyToken, webhookVerifyTokenAttrs] = defineField('webhookVerifyToken')

const onSubmit = handleSubmit(async (values) => {
  erroFormulario.value = null
  sucessoFormulario.value = false
  enviando.value = true

  try {
    const resultado = await whatsappConfigService.atualizar({
      phoneNumberId: values.phoneNumberId,
      accessToken: values.accessToken,
      businessAccountId: values.businessAccountId || undefined,
      numeroOrigem: values.numeroOrigem || undefined,
      webhookVerifyToken: values.webhookVerifyToken,
    })

    if (!resultado.succeeded) {
      erroFormulario.value = resultado.errors.join(' ') || 'Não foi possível salvar a configuração.'
      return
    }

    configuracaoAtual.value = resultado.value ?? null
    sucessoFormulario.value = true
  } catch {
    erroFormulario.value = 'Não foi possível conectar à API.'
  } finally {
    enviando.value = false
  }
})

const copiado = ref(false)
async function copiarWebhookUrl() {
  if (!configuracaoAtual.value?.webhookUrl) return
  await navigator.clipboard.writeText(configuracaoAtual.value.webhookUrl)
  copiado.value = true
  setTimeout(() => (copiado.value = false), 2000)
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-slate-900">Configuração do WhatsApp</h2>
      <p class="mt-1 text-sm text-slate-500">
        Conecte o número que vai receber e enviar mensagens de clientes.
      </p>
    </div>

    <div v-if="!podeConfigurar" class="card flex items-start gap-3 p-6">
      <ShieldAlert class="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
      <div>
        <p class="text-sm font-medium text-slate-900">Acesso restrito</p>
        <p class="mt-1 text-sm text-slate-500">
          Só o administrador da conta pode ver ou alterar o número conectado.
        </p>
      </div>
    </div>

    <template v-else>
      <div v-if="carregando" class="card p-6 text-sm text-slate-500">Carregando...</div>

      <div v-else class="space-y-6">
        <!-- Status atual -->
        <div class="card p-6">
          <h3 class="text-sm font-semibold text-slate-900">Status atual</h3>

          <div v-if="configuracaoAtual?.configurado" class="mt-3 space-y-2 text-sm">
            <p class="text-green-700">✓ Número conectado</p>
            <p v-if="configuracaoAtual.numeroOrigem" class="text-slate-600">
              Número: {{ configuracaoAtual.numeroOrigem }}
            </p>
            <p class="text-slate-600">Phone Number ID: {{ configuracaoAtual.phoneNumberIdMascarado }}</p>
            <p v-if="configuracaoAtual.businessAccountIdMascarado" class="text-slate-600">
              Business Account ID: {{ configuracaoAtual.businessAccountIdMascarado }}
            </p>
          </div>
          <p v-else class="mt-3 text-sm text-slate-500">Nenhum número conectado ainda.</p>

          <div v-if="configuracaoAtual?.webhookUrl" class="mt-4 border-t border-slate-100 pt-4">
            <p class="label-field">URL do webhook (cole no painel da Meta)</p>
            <div class="flex items-center gap-2">
              <code class="flex-1 truncate rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700">
                {{ configuracaoAtual.webhookUrl }}
              </code>
              <button type="button" class="btn-secondary gap-1.5 px-3 py-2 text-xs" @click="copiarWebhookUrl">
                <Copy class="h-3.5 w-3.5" />
                {{ copiado ? 'Copiado!' : 'Copiar' }}
              </button>
            </div>
          </div>

          <p v-if="erroCarregamento" class="mt-3 text-sm text-red-600">{{ erroCarregamento }}</p>
        </div>

        <!-- Formulário -->
        <form class="card space-y-4 p-6" @submit="onSubmit" novalidate>
          <h3 class="text-sm font-semibold text-slate-900">
            {{ configuracaoAtual?.configurado ? 'Atualizar conexão' : 'Conectar número' }}
          </h3>

          <div>
            <label class="label-field">Phone Number ID *</label>
            <input v-model="phoneNumberId" v-bind="phoneNumberIdAttrs" type="text" class="input-field" />
            <p v-if="errors.phoneNumberId" class="mt-1 text-xs text-red-600">{{ errors.phoneNumberId }}</p>
          </div>

          <div>
            <label class="label-field">Access Token *</label>
            <input v-model="accessToken" v-bind="accessTokenAttrs" type="password" class="input-field" />
            <p v-if="errors.accessToken" class="mt-1 text-xs text-red-600">{{ errors.accessToken }}</p>
          </div>

          <div>
            <label class="label-field">Business Account ID</label>
            <input v-model="businessAccountId" v-bind="businessAccountIdAttrs" type="text" class="input-field" />
          </div>

          <div>
            <label class="label-field">Número (exibição)</label>
            <input
              v-model="numeroOrigem"
              v-bind="numeroOrigemAttrs"
              type="text"
              placeholder="+5511999998888"
              class="input-field"
            />
          </div>

          <div>
            <label class="label-field">Token de verificação do webhook *</label>
            <input
              v-model="webhookVerifyToken"
              v-bind="webhookVerifyTokenAttrs"
              type="text"
              placeholder="Uma string secreta à sua escolha"
              class="input-field"
            />
            <p v-if="errors.webhookVerifyToken" class="mt-1 text-xs text-red-600">
              {{ errors.webhookVerifyToken }}
            </p>
            <p class="mt-1 text-xs text-slate-400">
              Cole este mesmo valor no painel da Meta ao configurar o webhook.
            </p>
          </div>

          <p v-if="erroFormulario" class="text-sm text-red-600">{{ erroFormulario }}</p>
          <p v-if="sucessoFormulario" class="text-sm text-green-600">Configuração salva com sucesso.</p>

          <button type="submit" class="btn-primary" :disabled="enviando">
            {{ enviando ? 'Salvando...' : 'Salvar configuração' }}
          </button>
        </form>
      </div>
    </template>
  </div>
</template>
