<script setup>
import { Settings, X } from 'lucide-vue-next'
import { navigationItems } from '@/config/navigation'

defineProps({ open: { type: Boolean, default: false } })
defineEmits(['close'])
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex h-16 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800">
      <span class="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 font-bold text-white">T</span>
      <div class="min-w-0 flex-1">
        <p class="truncate font-semibold leading-tight">Travel ERP</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">Gestión turística</p>
      </div>
      <button type="button" aria-label="Cerrar menú" class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" @click="$emit('close')">
        <X class="h-5 w-5" />
      </button>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Navegación principal">
      <p class="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Principal</p>
      <RouterLink
        v-for="item in navigationItems"
        :key="item.route"
        :to="{ name: item.route }"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        active-class="!bg-teal-50 !text-teal-700 dark:!bg-teal-950/50 dark:!text-teal-300"
        @click="$emit('close')"
      >
        <component :is="item.icon" class="h-5 w-5" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="border-t border-slate-200 p-3 dark:border-slate-800">
      <RouterLink to="/settings" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
        <Settings class="h-5 w-5" /> Configuración
      </RouterLink>
    </div>
  </aside>
</template>

