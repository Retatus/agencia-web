<script setup>
defineOptions({ inheritAttrs: false })
const model = defineModel({ default: '' })
defineProps({ invalid: { type: Boolean, default: false } })
</script>
<template>
  <textarea
    v-model="model"
    v-bind="$attrs"
    class="w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-950 dark:text-white"
    :class="
      invalid
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700'
        : 'border-slate-300 focus:border-teal-500 focus:ring-teal-500/20 dark:border-slate-700'
    "
  />
</template>
