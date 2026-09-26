<template>
  <div
    class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
  >
    <!-- Header -->
    <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
      <h3 class="font-semibold text-slate-900 dark:text-white">Itinerario del Viaje</h3>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Organice los servicios por día.</p>
    </div>

    <!-- Contenido -->
    <div class="space-y-6 p-5 sm:p-6">
      <!-- Tabs -->
      <QuotationItineraryTabs
        :itineraries="store.quotation.itineraries"
        :selected-uuid="store.selectedItineraryUuid"
        @select-itinerary="selectItinerary"
        @add-itinerary="addItinerary"
      />

      <!-- Toolbar -->
      <QuotationItineraryToolbar
        v-if="store.selectedItinerary"
        :itinerary="store.selectedItinerary"
        @add-service="$emit('add-service')"
        @add-custom-item="$emit('add-custom-item')"
      />

      <!-- Tabla -->
      <div
        v-if="store.selectedItinerary"
        class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <QuotationItineraryServicesTable
          :itinerary="store.selectedItinerary"
          @edit-item="$emit('edit-item', $event)"
          @duplicate-item="$emit('duplicate-item', $event)"
          @remove-item="$emit('remove-item', $event)"
        />
      </div>

      <div
        v-else
        class="rounded-lg border border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400"
      >
        No existe ningún día en el itinerario.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuotationStore } from '../stores/quotation.store'

import QuotationItineraryTabs from './QuotationItineraryTabs.vue'
import QuotationItineraryToolbar from './QuotationItineraryToolbar.vue'
import QuotationItineraryServicesTable from './QuotationItineraryServicesTable.vue'

const store = useQuotationStore()

defineEmits(['add-service', 'add-custom-item', 'edit-item', 'duplicate-item', 'remove-item'])

function selectItinerary(uuid) {
  store.selectItinerary(uuid)
}

function addItinerary() {
  store.addItinerary()
}
</script>
