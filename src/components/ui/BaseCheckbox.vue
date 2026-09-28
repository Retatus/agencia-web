<script setup>
const model = defineModel({ default: false })
defineProps({
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  value: { default: undefined },
})
</script>
<template>
  <label class="flex cursor-pointer items-start gap-3"
    ><input
      v-model="model"
      :value="value"
      type="checkbox"
      class="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950" /><span
      v-if="label || description"
      ><span v-if="label" class="block text-sm font-medium text-slate-700 dark:text-slate-300">{{
        label
      }}</span
      ><span v-if="description" class="block text-xs text-slate-500 dark:text-slate-400">{{
        description
      }}</span></span
    ><slot
  /></label>
</template>
