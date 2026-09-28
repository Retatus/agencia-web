<script setup>
import { computed, useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const model = defineModel({ default: '' })
const props = defineProps({ invalid: { type: Boolean, default: false } })
const cls = computed(() =>
  props.invalid
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700'
    : 'border-slate-300 focus:border-teal-500 focus:ring-teal-500/20 dark:border-slate-700',
)
</script>
<template>
  <input
    v-model="model"
    v-bind="attrs"
    class="w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
    :class="cls"
  />
</template>
