<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-for="itinerary in itineraries"
      :key="itinerary.uuid"
      type="button"
      class="inline-flex flex-col items-start rounded-lg px-4 py-2.5 text-sm transition"
      :class="
        selectedUuid === itinerary.uuid
          ? 'bg-teal-600 text-white shadow-sm'
          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
      "
      @click="select(itinerary.uuid)"
    >
      <span class="font-semibold"> Día {{ itinerary.day_number }} </span>
      <span
        class="text-xs"
        :class="
          selectedUuid === itinerary.uuid ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'
        "
      >
        <span v-if="itinerary.travel_date">
          {{ formatDate(itinerary.travel_date) }}
        </span>
        <span v-else>Sin fecha</span>
        · {{ itinerary.items?.length || 0 }} servicios
      </span>
    </button>

    <button
      type="button"
      class="inline-flex items-center rounded-lg border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 dark:border-slate-700 dark:text-slate-400 dark:hover:border-teal-500 dark:hover:text-teal-400 dark:hover:bg-teal-950/30"
      @click="add"
    >
      <span class="mr-1 text-lg leading-none">+</span>
      Agregar Día
    </button>
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
