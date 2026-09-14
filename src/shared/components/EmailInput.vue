<script setup>
import { computed } from 'vue'

const model = defineModel()

const isValid = computed(() => {
  if (!model.value) return true

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.value)
})
</script>

<template>
  <div>
    <input
      v-model="model"
      type="email"
      autocomplete="email"
      placeholder="correo@dominio.com"
      class="w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
      :class="{
        'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500': !isValid,
        'border-slate-300 focus:border-teal-500 focus:ring-teal-500/20 dark:border-slate-700':
          isValid,
      }"
    />

    <p v-if="!isValid" class="mt-1 text-sm text-red-500 dark:text-red-400">
      Correo electrónico no válido
    </p>
  </div>
</template>
