<template>
  <div
    v-if="selectedCount"
    class="overflow-hidden rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30"
  >
    <div class="mb-4 flex items-center justify-between">
      <div>
        <div class="font-semibold text-blue-900 dark:text-blue-300">
          {{ selectedCount }}
          pasajero{{ selectedCount > 1 ? 's' : '' }} seleccionado{{ selectedCount > 1 ? 's' : '' }}
        </div>
        <div class="mt-1 text-sm text-blue-700 dark:text-blue-400">
          Aplica datos comunes a la selección.
        </div>
      </div>

      <button
        type="button"
        class="text-sm font-medium text-blue-700 transition hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
        @click="$emit('clear-selection')"
      >
        <X class="mr-1 inline h-3.5 w-3.5" />
        Limpiar selección
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <!-- TYPE -->
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Tipo de pasajero
        </label>
        <select
          v-model="form.passenger_type_id"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="">Sin modificar</option>
          <option
            v-for="type in passengerTypes"
            :key="type.id"
            :value="type.id"
          >
            {{ type.name }}
          </option>
        </select>
      </div>

      <!-- NATIONALITY -->
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Nacionalidad
        </label>
        <input
          v-model.trim="form.nationality"
          type="text"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
          placeholder="Sin modificar"
        />
      </div>

      <!-- ACTIVE -->
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Estado
        </label>
        <select
          v-model="form.active"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="">Sin modificar</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>
    </div>

    <div class="mt-4 flex justify-end">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        @click="apply"
      >
        <CheckCircle class="mr-1.5 h-4 w-4" />
        Aplicar a seleccionados
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  selectedCount: {
    type: Number,
    default: 0,
  },

  passengerTypes: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['apply', 'clear-selection'])

const form = reactive({
  passenger_type_id: '',

  nationality: '',

  active: '',
})

function apply() {
  const changes = {}

  if (form.passenger_type_id !== '') {
    changes.passenger_type_id = Number(form.passenger_type_id)
  }

  if (form.nationality !== '') {
    changes.nationality = form.nationality
  }

  if (form.active !== '') {
    changes.active = form.active === '1'
  }

  if (!Object.keys(changes).length) {
    return
  }

  emit('apply', changes)
}
</script>

<style scoped>
@reference "tailwindcss";

.form-label {
  @apply mb-1.5 block
  text-sm font-medium
  text-slate-700;
}

.form-control {
  @apply w-full
  rounded-lg
  border border-slate-300
  bg-white
  px-3 py-2.5
  text-sm
  text-slate-900
  outline-none
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-100;
}
</style>
