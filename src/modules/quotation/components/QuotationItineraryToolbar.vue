<template>
  <div
    class="card mb-3 border-0 bg-light"
    v-if="itinerary"
  >
    <div class="card-body py-3">
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <!-- Información del día -->

        <div>
          <h6 class="mb-1">
            Día {{ itinerary.day_number }}

            <span
              v-if="itinerary.title"
              class="text-muted"
            >
              - {{ itinerary.title }}
            </span>
          </h6>

          <small class="text-muted">
            {{ formatDate(itinerary.travel_date) }}
          </small>
        </div>

        <!-- Botones -->

        <div class="btn-toolbar">
          <div class="btn-group me-2">
            <button
              type="button"
              class="btn btn-success"
              @click="$emit('add-service')"
            >
              <i class="bi bi-plus-circle me-1"></i>
              Servicio
            </button>

            <button
              type="button"
              class="btn btn-outline-success"
              @click="$emit('add-custom-item')"
            >
              Item Libre
            </button>
          </div>

          <div class="btn-group me-2">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="duplicate"
            >
              Duplicar
            </button>

            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="moveUp"
            >
              ↑
            </button>

            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="moveDown"
            >
              ↓
            </button>
          </div>

          <button
            type="button"
            class="btn btn-outline-danger"
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
