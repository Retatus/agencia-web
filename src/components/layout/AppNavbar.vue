<script setup>
import { Menu, Moon, Sun } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

defineEmits(['open-sidebar'])
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
    <div class="flex items-center gap-3">
      <button type="button" aria-label="Abrir menú" class="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" @click="$emit('open-sidebar')">
        <Menu class="h-5 w-5" />
      </button>
      <div>
        <h1 class="text-base font-semibold sm:text-lg">Panel principal</h1>
        <p class="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">Gestión de tu operación</p>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
      <button type="button" :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'" class="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" @click="toggleTheme">
        <Sun v-if="isDark" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </button>
      <button type="button" class="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800">
        <span class="grid h-8 w-8 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-700 dark:bg-teal-900 dark:text-teal-200">RG</span>
        <span class="hidden text-left sm:block">
          <span class="block text-sm font-medium leading-tight">Renato</span>
          <span class="block text-xs text-slate-500 dark:text-slate-400">Administrador</span>
        </span>
      </button>
    </div>
  </header>
</template>

