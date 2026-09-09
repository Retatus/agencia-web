<template>
  <div
    class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
  >
    <div class="overflow-x-auto">
      <table class="w-full min-w-[950px] text-left text-sm">
        <thead
          class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50 dark:text-slate-400"
        >
          <tr>
            <th class="px-5 py-3 font-medium">Código</th>

            <th class="px-5 py-3 font-medium">Nombre</th>

            <th class="px-5 py-3 font-medium">Proveedor</th>

            <th class="px-5 py-3 font-medium">Categoría</th>

            <th class="px-5 py-3 font-medium">Descripción</th>

            <th class="px-5 py-3 font-medium">Estado</th>

            <th class="px-5 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <!-- Estado de carga -->

          <tr v-if="loading">
            <td colspan="7" class="px-5 py-14 text-center">
              <RefreshCw class="mx-auto mb-3 h-6 w-6 animate-spin text-teal-600" />

              <p class="text-sm text-slate-500 dark:text-slate-400">Cargando servicios...</p>
            </td>
          </tr>

          <!-- Estado vacío -->

          <tr v-else-if="items.length === 0">
            <td colspan="7" class="px-5 py-14 text-center">
              <BriefcaseBusiness
                class="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600"
              />

              <p class="font-medium text-slate-700 dark:text-slate-300">
                No existen servicios registrados
              </p>

              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Registra un servicio para comenzar a construir tu catálogo.
              </p>
            </td>
          </tr>

          <!-- Servicios -->

          <template v-else>
            <tr
              v-for="service in items"
              :key="service.uuid"
              class="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
            >
              <td class="whitespace-nowrap px-5 py-4">
                <span class="font-semibold text-teal-700 dark:text-teal-300">
                  {{ service.code }}
                </span>
              </td>

              <td class="px-5 py-4">
                <p class="font-medium text-slate-900 dark:text-white">
                  {{ service.name }}
                </p>
              </td>

              <td class="px-5 py-4 text-slate-600 dark:text-slate-300">
                {{ service.provider?.business_name || 'Sin proveedor' }}
              </td>

              <td class="px-5 py-4">
                <span
                  class="inline-flex whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                >
                  {{ service.service_category?.name || 'Sin categoría' }}
                </span>
              </td>

              <td class="max-w-xs px-5 py-4 text-slate-500 dark:text-slate-400">
                <p class="truncate" :title="service.description || ''">
                  {{ service.description || 'Sin descripción' }}
                </p>
              </td>

              <td class="whitespace-nowrap px-5 py-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="
                    service.active
                      ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                  "
                >
                  {{ service.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <td class="whitespace-nowrap px-5 py-4">
                <div class="flex justify-end gap-1">
                  <button
                    class="inline-flex items-center rounded-lg border border-blue-300 px-2.5 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                    @click="$emit('edit', service.uuid)"
                  >
                    <Pencil class="mr-1 h-3 w-3" />
                    Editar
                  </button>
                  <button
                    class="inline-flex items-center rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                    @click="$emit('delete', service.uuid)"
                  >
                    <Trash2 class="mr-1 h-3 w-3" />
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      v-if="!loading && items.length > 0"
      class="border-t border-slate-200 px-5 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400"
    >
      {{ items.length }}
      servicio{{ items.length === 1 ? '' : 's' }} registrado{{ items.length === 1 ? '' : 's' }}
    </div>
  </div>
</template>

<script setup>
import { BriefcaseBusiness, Pencil, RefreshCw, Trash2 } from 'lucide-vue-next'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },

  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit', 'delete'])
</script>
