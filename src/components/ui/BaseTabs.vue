<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  tabs: { type: Array, default: () => [] },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <div class="mb-4 overflow-x-auto border-b border-slate-200 dark:border-slate-700">
      <div class="flex min-w-max gap-1" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          role="tab"
          class="inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition"
          :class="
            tab.value === modelValue
              ? 'border-teal-600 text-teal-700 dark:text-teal-300'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          "
          :aria-selected="tab.value === modelValue"
          :disabled="tab.disabled"
          @click="$emit('update:modelValue', tab.value)"
        >
          {{ tab.label }}
          <span
            v-if="tab.count !== undefined"
            class="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <slot :name="modelValue" />
  </div>
</template>
