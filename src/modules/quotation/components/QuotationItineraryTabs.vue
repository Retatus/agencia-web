<template>
  <div class="mb-4">
    <ul class="nav nav-pills itinerary-tabs">
      <li
        v-for="itinerary in itineraries"
        :key="itinerary.uuid"
        class="nav-item me-2 mb-2"
      >
        <button
          type="button"
          class="nav-link px-4"
          :class="{
            active: selectedUuid === itinerary.uuid,
          }"
          @click="select(itinerary.uuid)"
        >
          <div class="fw-bold"> Día {{ itinerary.day_number }} </div>

          <small
            v-if="itinerary.travel_date"
            class="d-block"
          >
            {{ formatDate(itinerary.travel_date) }}
          </small>
          &nbsp;
          <small class="d-block">
            {{ itinerary.items?.length || 0 }}
          </small>
          servicios
        </button>
      </li>

      <li class="nav-item">
        <button
          type="button"
          class="btn btn-outline-primary"
          @click="add"
        >
          <i class="bi bi-plus-lg me-1"></i>
          Agregar Día
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  itineraries: {
    type: Array,
    default: () => [],
  },

  selectedUuid: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['select-itinerary', 'add-itinerary'])

function select(uuid) {
  emit('select-itinerary', uuid)
}

function add() {
  emit('add-itinerary')
}

function formatDate(date) {
  if (!date) return ''

  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.itinerary-tabs {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  list-style: none; /* ← quita los puntos */
  padding-left: 0; /* ← elimina indentación */
  margin: 0;
}

.nav-link {
  min-width: 140px;
  text-align: center;
  border: 1px solid #dee2e6;
}

.nav-link.active {
  background: #0d6efd;
  color: #fff;
}
</style>
