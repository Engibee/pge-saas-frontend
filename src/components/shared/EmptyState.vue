<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  description: string
}>()
</script>

<template>
  <div class="card flex flex-col items-center justify-center px-6 py-16 text-center">
    <component :is="icon" class="mb-4 h-10 w-10 text-slate-300" />
    <h3 class="text-sm font-semibold text-slate-900">{{ title }}</h3>
    <p class="mt-1 max-w-sm text-sm text-slate-500">{{ description }}</p>
  </div>
</template>
