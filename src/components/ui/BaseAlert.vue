<script setup>
import { computed } from 'vue'
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-vue-next'

const props = defineProps({
  type: { type: String, default: 'info' },
  title: { type: String, default: '' },
  dismissible: { type: Boolean, default: false },
})

defineEmits(['close'])

const styles = {
  success: { icon: CheckCircle2, box: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-200' },
  warning: { icon: TriangleAlert, box: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200' },
  danger: { icon: AlertCircle, box: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200' },
  info: { icon: Info, box: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200' },
}

const current = computed(() => styles[props.type] || styles.info)
</script>

<template>
  <div role="alert" class="flex gap-3 rounded-lg border p-4" :class="current.box">
    <component :is="current.icon" class="mt-0.5 h-5 w-5 shrink-0" />
    <div class="min-w-0 flex-1">
      <p v-if="title" class="font-semibold">{{ title }}</p>
      <div class="text-sm" :class="{ 'mt-1': title }"><slot /></div>
    </div>
    <button v-if="dismissible" type="button" aria-label="Cerrar alerta" class="rounded p-1 opacity-70 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10" @click="$emit('close')">
      <X class="h-4 w-4" />
    </button>
  </div>
</template>

