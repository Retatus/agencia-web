<template>
  <div
    v-if="itinerary"
    class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
  >
    <div class="flex flex-wrap items-start justify-between gap-4">
      <!-- Información del día -->
      <div class="min-w-0 flex-1 space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <h4 class="text-sm font-semibold text-slate-900 dark:text-white">
            Día {{ itinerary.day_number }}
          </h4>
          <span
            v-if="itinerary.title"
            class="text-sm text-slate-500 dark:text-slate-400"
          >
            - {{ itinerary.title }}
          </span>
        </div>

        <div class="grid gap-2 sm:grid-cols-3">
          <!-- Título -->
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Título
            </label>
            <input
              v-model="itinerary.title"
              type="text"
              placeholder="Título del día..."
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

          <!-- Fecha -->
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Fecha
            </label>
            <input
              v-model="itinerary.travel_date"
              type="date"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
            />
          </div>

          <!-- Descripción -->
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Descripción
            </label>
            <input
              v-model="itinerary.description"
              type="text"
              placeholder="Descripción corta..."
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Botones de agregar -->
        <div class="flex gap-2">
          <button
            type="button"
            class="inline-flex items-center rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            @click="$emit('add-service')"
          >
            <span class="mr-1 text-lg leading-none">+</span>
            Servicio
          </button>

          <button
            type="button"
            class="inline-flex items-center rounded-lg border border-teal-600 px-3 py-1.5 text-sm font-medium text-teal-600 hover:bg-teal-50 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-950/30"
            @click="$emit('add-custom-item')"
          >
            <span class="mr-1 text-lg leading-none">+</span>
            Item Libre
          </button>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            @click="duplicate"
          >
            Duplicar
          </button>

          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            @click="moveUp"
          >
            ↑
          </button>

          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            @click="moveDown"
          >
            ↓
          </button>

          <button
            type="button"
            class="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
            @click="remove"
          >
            Eliminar Día
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuotationStore } from '../stores/quotation.store'

const store = useQuotationStore()

const props = defineProps({
  itinerary: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['add-service', 'add-custom-item'])

function duplicate() {
  store.duplicateItinerary(props.itinerary.uuid)
}

function moveUp() {
  store.moveItineraryUp(props.itinerary.uuid)
}

function moveDown() {
  store.moveItineraryDown(props.itinerary.uuid)
}

function remove() {
  if (!confirm('¿Desea eliminar este día?')) {
    return
  }

  store.removeItinerary(props.itinerary.uuid)
}

function formatDate(date) {
  if (!date) return ''

  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.btn-toolbar {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem; /* separa los grupos */
}

.btn-group {
  display: flex;
  flex-wrap: nowrap;
}

.btn-group .btn {
  white-space: nowrap; /* evita que el texto rompa línea */
}

.btn-toolbar > .btn {
  white-space: nowrap;
}
</style>
