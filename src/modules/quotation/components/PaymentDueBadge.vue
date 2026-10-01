<template>
  <div class="flex min-w-32 flex-col items-start gap-1">
    <span
      class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
      :class="presentation.classes"
    >
      {{ presentation.label }}
    </span>
    <span v-if="dueDate" class="text-xs text-slate-500 dark:text-slate-400">
      Límite {{ shortDate(dueDate) }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'NOT_REQUIRED',
  },
  dueDate: {
    type: String,
    default: '',
  },
})

const presentation = computed(() => {
  if (props.status === 'PAID') {
    return badge('Pagado', 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300')
  }

  if (props.status === 'NOT_REQUIRED') {
    return badge('No requerido', 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
  }

  const prefix = props.status === 'PARTIAL' ? 'Pago parcial · ' : ''

  if (!props.dueDate) {
    return badge(
      `${prefix}Sin fecha límite`,
      'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    )
  }

  const days = daysUntil(props.dueDate)

  if (days < 0) {
    return badge(
      `${prefix}Vencido hace ${Math.abs(days)} ${dayLabel(Math.abs(days))}`,
      'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    )
  }

  if (days === 0) {
    return badge(
      `${prefix}Vence hoy`,
      'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    )
  }

  if (days <= 3) {
    return badge(
      `${prefix}Vence en ${days} ${dayLabel(days)}`,
      'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
    )
  }

  if (days <= 7) {
    return badge(
      `${prefix}Faltan ${days} días`,
      'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    )
  }

  return badge(
    `${prefix}Faltan ${days} días`,
    'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  )
})

function badge(label, classes) {
  return { label, classes }
}

function daysUntil(value) {
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
  const due = new Date(year, month - 1, day)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return Math.round((due.getTime() - today.getTime()) / 86400000)
}

function dayLabel(days) {
  return days === 1 ? 'día' : 'días'
}

function shortDate(value) {
  const [year, month, day] = String(value).slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}
</script>
