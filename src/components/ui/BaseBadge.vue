<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'neutral' },
})

const variants = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
}

const badgeClass = computed(() => variants[props.variant] || variants.neutral)
</script>

<template>
  <span class="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold" :class="badgeClass">
    <slot />
  </span>
</template>

