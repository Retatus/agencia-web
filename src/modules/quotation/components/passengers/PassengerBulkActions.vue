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
        class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        @click="$emit('clear-selection')"
      >
        <X class="mr-1 h-3.5 w-3.5" />
        Limpiar selección
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-4">
      <!-- TYPE -->
      <div>
        <label class="mb-2 block text-xs font-medium text-slate-700 dark:text-slate-300">
          Tipo de pasajero
        </label>
        <select
          v-model="form.passenger_type_id"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="">Sin modificar</option>
          <option v-for="type in passengerTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
      </div>

      <!-- NATIONALITY -->
      <div>
        <label class="mb-2 block text-xs font-medium text-slate-700 dark:text-slate-300">
          Nacionalidad
        </label>
        <CountrySelect v-model="form.nationality" placeholder="Seleccionar pais" />
      </div>

      <!-- ACTIVE -->
      <div>
        <label class="mb-2 block text-xs font-medium text-slate-700 dark:text-slate-300">
          Estado
        </label>
        <select
          v-model="form.active"
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="">Sin modificar</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>
      <!-- BUTTON -->
      <div>
        <label class="mb-2 block text-xs font-medium text-slate-700 dark:text-slate-300"
          >&nbsp;</label
        >
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          @click="apply"
        >
          <CheckCircle class="mr-1 h-3.5 w-3.5" />
          Aplicar a seleccionados
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { CheckCircle, X } from 'lucide-vue-next'
import CountrySelect from '@/shared/components/CountrySelect.vue'

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
