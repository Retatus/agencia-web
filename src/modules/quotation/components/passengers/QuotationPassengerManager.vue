<template>
  <div class="space-y-4">
    <!-- ====================================================== -->
    <!-- HEADER -->
    <!-- ====================================================== -->

    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900"> Pasajeros </h2>

        <div class="mt-1 flex gap-3 text-sm text-slate-500">
          <span>
            {{ passengers.length }}
            pasajeros
          </span>

          <span>
            {{ completedCount }}
            completos
          </span>

          <span
            v-if="pendingCount"
            class="text-amber-600"
          >
            {{ pendingCount }}
            pendientes
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="btn-secondary"
          @click="showGenerateModal = true"
        >
          Generar pasajeros
        </button>

        <button
          type="button"
          class="btn-secondary"
          @click="$emit('add-passenger')"
        >
          + Pasajero
        </button>

        <button
          v-if="store.hasPassengerChanges"
          type="button"
          class="btn-primary"
          @click="saveBulkChanges"
        >
          Guardar
          {{ store.passengerChangedCount }}
          cambios
        </button>
      </div>
    </div>

    <!-- ====================================================== -->
    <!-- BULK ACTIONS -->
    <!-- ====================================================== -->

    <PassengerBulkActions
      :selected-count="selectedPassengers.size"
      :passenger-types="passengerTypes"
      @apply="applyBulkChanges"
      @clear-selection="clearSelection"
    />

    <!-- ====================================================== -->
    <!-- TABLE -->
    <!-- ====================================================== -->

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll($event.target.checked)"
                />
              </th>

              <th class="table-header"> Pasajero </th>

              <th class="table-header"> Tipo </th>

              <th class="table-header"> Nacionalidad </th>

              <th class="table-header"> Documento </th>

              <th class="table-header"> Estado datos </th>

              <th class="table-header text-center"> Activo </th>

              <th class="table-header text-right"> Acción </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="passenger in passengers"
              :key="passenger.uuid"
              class="border-t border-slate-100"
            >
              <!-- SELECT -->

              <td class="table-cell">
                <input
                  type="checkbox"
                  :checked="selectedPassengers.has(passenger.uuid)"
                  @change="toggleSelection(passenger.uuid)"
                />
              </td>

              <!-- NAME -->

              <td class="table-cell">
                <div class="font-medium text-slate-900">
                  {{ passenger.first_name }}
                  {{ passenger.last_name }}
                </div>
              </td>

              <!-- TYPE -->

              <td class="table-cell">
                <select
                  :value="passenger.passenger_type_id"
                  class="inline-control"
                  @change="changeField(passenger, 'passenger_type_id', Number($event.target.value))"
                >
                  <option
                    v-for="type in passengerTypes"
                    :key="type.id"
                    :value="type.id"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </td>

              <!-- NATIONALITY -->

              <td class="table-cell">
                <input
                  :value="passenger.nationality"
                  type="text"
                  class="inline-control"
                  @change="changeField(passenger, 'nationality', $event.target.value)"
                />
              </td>

              <!-- DOCUMENT -->

              <td class="table-cell">
                {{ passenger.document_number || '-' }}
              </td>

              <!-- COMPLETION -->

              <td class="table-cell">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="
                    isComplete(passenger)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  "
                >
                  {{ isComplete(passenger) ? 'Completo' : 'Pendiente' }}
                </span>
              </td>

              <!-- ACTIVE -->

              <td class="table-cell text-center">
                <input
                  type="checkbox"
                  :checked="passenger.active"
                  @change="changeField(passenger, 'active', $event.target.checked)"
                />
              </td>

              <!-- EDIT -->

              <td class="table-cell text-right">
                <button
                  type="button"
                  class="text-sm font-medium text-blue-600"
                  @click="$emit('edit-passenger', passenger)"
                >
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ====================================================== -->
    <!-- GENERATE MODAL -->
    <!-- ====================================================== -->

    <GeneratePassengersModal
      v-if="showGenerateModal"
      :passenger-types="passengerTypes"
      @close="showGenerateModal = false"
      @save="handleGenerate"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useQuotationStore } from '../../stores/quotation.store'

import PassengerBulkActions from './PassengerBulkActions.vue'

import GeneratePassengersModal from './GeneratePassengersModal.vue'

const props = defineProps({
  passengers: {
    type: Array,
    default: () => [],
  },

  passengerTypes: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['add-passenger', 'edit-passenger'])

const store = useQuotationStore()

const showGenerateModal = ref(false)

const selectedPassengers = ref(new Set())

/*
|--------------------------------------------------------------------------
| COMPLETE
|--------------------------------------------------------------------------
*/

function isComplete(passenger) {
  return Boolean(
    passenger.first_name &&
    passenger.last_name &&
    passenger.passenger_type_id &&
    passenger.document_number,
  )
}

const completedCount = computed(() => {
  return props.passengers.filter((passenger) => isComplete(passenger)).length
})

const pendingCount = computed(() => {
  return props.passengers.length - completedCount.value
})

/*
|--------------------------------------------------------------------------
| SELECTION
|--------------------------------------------------------------------------
*/

const allSelected = computed(() => {
  return props.passengers.length > 0 && selectedPassengers.value.size === props.passengers.length
})

function toggleSelection(uuid) {
  if (selectedPassengers.value.has(uuid)) {
    selectedPassengers.value.delete(uuid)
  } else {
    selectedPassengers.value.add(uuid)
  }
}

function toggleSelectAll(checked) {
  selectedPassengers.value.clear()

  if (!checked) {
    return
  }

  props.passengers.forEach((passenger) => {
    selectedPassengers.value.add(passenger.uuid)
  })
}

function clearSelection() {
  selectedPassengers.value.clear()
}

/*
|--------------------------------------------------------------------------
| CHANGE FIELD
|--------------------------------------------------------------------------
*/

function changeField(passenger, field, value) {
  store.markPassengerChanged(passenger, field, value)
}

/*
|--------------------------------------------------------------------------
| BULK APPLY
|--------------------------------------------------------------------------
*/

function applyBulkChanges(changes) {
  selectedPassengers.value.forEach((uuid) => {
    const passenger = store.findPassenger(uuid)

    if (!passenger) {
      return
    }

    Object.entries(changes).forEach(([field, value]) => {
      store.markPassengerChanged(passenger, field, value)
    })
  })
}

/*
|--------------------------------------------------------------------------
| BULK SAVE
|--------------------------------------------------------------------------
*/

async function saveBulkChanges() {
  try {
    await store.bulkUpdatePassengers()

    clearSelection()
  } catch (error) {
    console.error('Error actualizando pasajeros:', error)
  }
}

/*
|--------------------------------------------------------------------------
| GENERATE
|--------------------------------------------------------------------------
*/

async function handleGenerate(payload) {
  try {
    await store.generatePassengers(payload.groups, payload.nationality)

    showGenerateModal.value = false
  } catch (error) {
    console.error('Error generando pasajeros:', error)
  }
}
</script>
