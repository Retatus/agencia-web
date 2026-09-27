<script setup>
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useTheme } from '@/composables/useTheme'

const sidebarOpen = ref(false)
const desktopSidebarOpen = ref(true)
const { initializeTheme } = useTheme()

function closeSidebar() {
  sidebarOpen.value = false
}

function toggleDesktopSidebar() {
  desktopSidebarOpen.value = !desktopSidebarOpen.value
}

onMounted(initializeTheme)
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100"
  >
    <!-- Overlay exclusivo para móvil/tablet -->
    <button
      v-if="sidebarOpen"
      type="button"
      aria-label="Cerrar menú"
      class="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
      @click="closeSidebar"
    />

    <AppSidebar :open="sidebarOpen" :desktop-open="desktopSidebarOpen" @close="closeSidebar" />

    <!-- En desktop el contenido recupera todo el ancho al ocultar el sidebar -->
    <div
      class="min-w-0 transition-[padding] duration-200 ease-in-out"
      :class="desktopSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'"
    >
      <AppNavbar
        :desktop-sidebar-open="desktopSidebarOpen"
        @open-sidebar="sidebarOpen = true"
        @toggle-desktop-sidebar="toggleDesktopSidebar"
      />

      <main class="min-w-0 p-4 sm:p-6 lg:p-8">
        <!-- El layout ya no limita globalmente el ancho de las páginas. -->
        <div class="w-full min-w-0">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
