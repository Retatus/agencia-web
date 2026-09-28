<script setup>
defineOptions({ inheritAttrs: false })
const model = defineModel({ default: '' })
defineProps({
  options: { type: Array, default: () => [] },
  valueKey: { type: String, default: 'value' },
  labelKey: { type: String, default: 'label' },
  placeholder: { type: String, default: 'Seleccione...' },
  invalid: { type: Boolean, default: false },
})
</script>
<template>
  <select
    v-model="model"
    v-bind="$attrs"
    class="w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 dark:bg-slate-950 dark:text-white"
    :class="
      invalid
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700'
        : 'border-slate-300 focus:border-teal-500 focus:ring-teal-500/20 dark:border-slate-700'
    "
  >
    <option value="">{{ placeholder }}</option>
    <option
      v-for="option in options"
      :key="option[valueKey] ?? option"
      :value="option[valueKey] ?? option"
    >
      {{ option[labelKey] ?? option }}
    </option>
    <slot />
  </select>
</template>
