import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**'],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    name: 'app/custom-rules',
    rules: {
      // Times de TCC costumam ter membros iniciando em Vue — regra mais didática
      // que 'error' para não travar o desenvolvimento por nomes de componente.
      'vue/multi-word-component-names': 'off',
    },
  },

  // Deve vir por último: desliga regras de formatação que conflitam com o Prettier.
  skipFormatting,
)
