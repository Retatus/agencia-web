<script setup>
defineProps({
  label: { type: String, default: '' },
  forId: { type: String, default: '' },
  error: { type: [String, Array], default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: false },
})
</script>
<template>
  <div>
    <label
      v-if="label"
      :for="forId || undefined"
      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
      >{{ label }} <span v-if="required" class="text-red-500">*</span></label
    ><slot />
    <p v-if="error" class="mt-1.5 text-xs text-red-600 dark:text-red-400">
      {{ Array.isArray(error) ? error[0] : error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{{ hint }}</p>
  </div>
</template>
