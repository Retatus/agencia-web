<template>
  <div class="card shadow-sm mb-4">
    <!-- Header -->

    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <h5 class="mb-0"> Itinerario del Viaje </h5>

        <small class="text-muted"> Organice los servicios por día. </small>
      </div>
    </div>

    <!-- Body -->

    <div class="card-body">
      <!-- Tabs -->

      <QuotationItineraryTabs
        :itineraries="store.quotation.itineraries"
        :selected-uuid="store.selectedItineraryUuid"
        @select-itinerary="selectItinerary"
        @add-itinerary="addItinerary"
      />

      <!-- Toolbar -->

      <QuotationItineraryToolbar
        :itinerary="store.selectedItinerary"
        @add-service="$emit('add-service')"
        @add-custom-item="$emit('add-custom-item')"
      />

      <!-- Tabla -->

      <QuotationItineraryServicesTable
        v-if="store.selectedItinerary"
        :itinerary="store.selectedItinerary"
        @edit-item="$emit('edit-item', $event)"
        @remove-item="$emit('remove-item', $event)"
      />

      <div
        v-else
        class="text-center py-5 text-muted"
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

defineEmits(['add-service', 'add-custom-item', 'edit-item', 'remove-item'])

function selectItinerary(uuid) {
  store.selectItinerary(uuid)
}

function addItinerary() {
  store.addItinerary()
}
</script>
