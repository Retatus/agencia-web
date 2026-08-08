<script setup>
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useTheme } from '@/composables/useTheme'

const sidebarOpen = ref(false)
const { initializeTheme } = useTheme()

function closeSidebar() {
  sidebarOpen.value = false
}

onMounted(initializeTheme)
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <button
      v-if="sidebarOpen"
      type="button"
      aria-label="Cerrar menú"
      class="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
      @click="closeSidebar"
    />

    <AppSidebar :open="sidebarOpen" @close="closeSidebar" />

    <div class="lg:pl-64">
      <AppNavbar @open-sidebar="sidebarOpen = true" />

      <main class="p-4 sm:p-6 lg:p-8">
        <div class="mx-auto max-w-7xl">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

