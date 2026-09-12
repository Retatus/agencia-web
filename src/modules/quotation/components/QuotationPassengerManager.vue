<template>
  <div
    class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
  >
    <!-- ============================================================ -->
    <!-- HEADER -->
    <!-- ============================================================ -->

    <div
      class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <div>
        <h3 class="font-semibold text-slate-900 dark:text-white">Pasajeros</h3>

        <div class="mt-1 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            {{ passengers.length }}
            pasajeros
          </span>

          <span class="text-emerald-600 dark:text-emerald-400">
            {{ completedCount }}
            completos
          </span>

          <span v-if="pendingCount" class="text-amber-600 dark:text-amber-400">
            {{ pendingCount }}
            pendientes
          </span>
        </div>
      </div>

      <!-- ========================================================== -->
      <!-- HEADER ACTIONS -->
      <!-- ========================================================== -->

      <div class="flex flex-wrap items-center gap-2">
        <!-- GENERAR -->

        <button
          type="button"
          class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="openGenerateModal"
        >
          <UsersRound class="mr-1.5 h-4 w-4" />

          Generar pasajeros
        </button>

        <!-- AGREGAR -->

        <button
          type="button"
          class="inline-flex items-center rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700"
          @click="newPassenger"
        >
          <Plus class="mr-1.5 h-4 w-4" />

          Agregar pasajero
        </button>

        <!-- GUARDAR BULK -->

        <button
          v-if="store.hasPassengerChanges"
          type="button"
          class="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          @click="saveBulkChanges"
        >
          Guardar
          {{ store.passengerChangedCount }}
          cambios
        </button>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- CONTENT -->
    <!-- ============================================================ -->

    <div class="p-5 sm:p-6">
      <!-- ========================================================== -->
      <!-- BULK ACTIONS -->
      <!-- ========================================================== -->

      <PassengerBulkActions
        :selected-count="selectedPassengers.size"
        :passenger-types="passengerTypes"
        class="mb-4"
        @apply="applyBulkChanges"
        @clear-selection="clearSelection"
      />

      <!-- ========================================================== -->
      <!-- EMPTY -->
      <!-- ========================================================== -->

      <div
        v-if="!passengers.length"
        class="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-950/50"
      >
        <UsersRound class="mx-auto h-10 w-10 text-slate-400" />

        <div class="mt-3 font-medium text-slate-700 dark:text-slate-300">
          No existen pasajeros registrados
        </div>

        <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Puedes agregarlos individualmente o generar el grupo por tipo de pasajero.
        </div>

        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            @click="openGenerateModal"
          >
            Generar pasajeros
          </button>

          <button
            type="button"
            class="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            @click="newPassenger"
          >
            + Agregar pasajero
          </button>
        </div>
      </div>

      <!-- ========================================================== -->
      <!-- TABLE -->
      <!-- ========================================================== -->

      <div
        v-else
        class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <!-- ==================================================== -->
            <!-- TABLE HEADER -->
            <!-- ==================================================== -->

            <thead
              class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
            >
              <tr>
                <!-- CHECK ALL -->

                <th class="w-10 px-3 py-2.5 text-center">
                  <input
                    type="checkbox"
                    :checked="allSelected"
                    @change="toggleSelectAll($event.target.checked)"
                  />
                </th>

                <!-- NUMBER -->

                <th class="table-header">#</th>

                <!-- NAME -->

                <th class="table-header">Pasajero</th>

                <!-- TYPE -->

                <th class="table-header">Tipo</th>

                <!-- NATIONALITY -->

                <th class="table-header">Nacionalidad</th>

                <!-- DOCUMENT -->

                <th class="table-header">Documento</th>

                <!-- COMPLETION -->

                <th class="table-header">Datos</th>

                <!-- ACTIVE -->

                <th class="table-header text-center">Activo</th>

                <!-- ACTIONS -->

                <th class="table-header text-right">Acciones</th>
              </tr>
            </thead>

            <!-- ==================================================== -->
            <!-- TABLE BODY -->
            <!-- ==================================================== -->

            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr
                v-for="(passenger, index) in passengers"
                :key="passenger.uuid"
                class="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                :class="{
                  'bg-blue-50/50 dark:bg-blue-950/20': selectedPassengers.has(passenger.uuid),
                }"
              >
                <!-- ================================================= -->
                <!-- SELECT -->
                <!-- ================================================= -->

                <td class="px-3 py-2.5 text-center">
                  <input
                    type="checkbox"
                    :checked="selectedPassengers.has(passenger.uuid)"
                    @change="toggleSelection(passenger.uuid)"
                  />
                </td>

                <!-- ================================================= -->
                <!-- INDEX -->
                <!-- ================================================= -->

                <td class="px-3 py-2.5 text-center text-sm text-slate-500 dark:text-slate-400">
                  {{ index + 1 }}
                </td>

                <!-- ================================================= -->
                <!-- PASSENGER -->
                <!-- ================================================= -->

                <td class="px-3 py-2.5 text-sm">
                  <div class="font-medium text-slate-800 dark:text-slate-200">
                    {{ passengerName(passenger) }}
                  </div>

                  <div v-if="passenger.email" class="mt-0.5 text-xs text-slate-500">
                    {{ passenger.email }}
                  </div>
                </td>

                <!-- ================================================= -->
                <!-- PASSENGER TYPE -->
                <!-- ================================================= -->

                <td class="min-w-40 px-3 py-2.5">
                  <select
                    :value="passenger.passenger_type_id"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-teal-400"
                    @change="
                      changeField(passenger, 'passenger_type_id', Number($event.target.value))
                    "
                  >
                    <option :value="null">Seleccione...</option>
                    <option v-for="type in passengerTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                </td>

                <!-- ================================================= -->
                <!-- NATIONALITY -->
                <!-- ================================================= -->

                <td class="min-w-40 px-3 py-2.5">
                  <input
                    :value="passenger.nationality"
                    type="text"
                    class="inline-control"
                    placeholder="-"
                    @change="changeField(passenger, 'nationality', $event.target.value)"
                  />
                  <CountryBadge :iso="passenger.nationality" :name="passenger.nationality" />
                </td>

                <!-- ================================================= -->
                <!-- DOCUMENT -->
                <!-- ================================================= -->

                <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
                  {{ passenger.document_number || '-' }}
                </td>

                <!-- ================================================= -->
                <!-- COMPLETION -->
                <!-- ================================================= -->

                <td class="px-3 py-2.5">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="
                      isComplete(passenger)
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    "
                  >
                    {{ isComplete(passenger) ? 'Completo' : 'Pendiente' }}
                  </span>
                </td>

                <!-- ================================================= -->
                <!-- ACTIVE -->
                <!-- ================================================= -->

                <td class="px-3 py-2.5 text-center">
                  <input
                    type="checkbox"
                    :checked="Boolean(passenger.active)"
                    @change="changeField(passenger, 'active', $event.target.checked)"
                  />
                </td>

                <!-- ================================================= -->
                <!-- ACTIONS -->
                <!-- ================================================= -->

                <td class="px-3 py-2.5 text-right">
                  <div class="inline-flex flex-wrap justify-end gap-1">
                    <!-- EDIT -->

                    <button
                      type="button"
                      class="inline-flex items-center rounded-lg border border-blue-300 px-2 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                      @click="editPassenger(passenger)"
                    >
                      <Pencil class="mr-1 h-3 w-3" />

                      Editar
                    </button>

                    <!-- DELETE -->

                    <button
                      type="button"
                      class="inline-flex items-center rounded-lg border border-red-300 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                      @click="removePassenger(passenger)"
                    >
                      <Trash2 class="mr-1 h-3 w-3" />

                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PASSENGER FORM MODAL -->
    <!-- ============================================================ -->

    <PassengerModal
      v-if="showModal"
      :passenger="editingPassenger"
      :passenger-types="passengerTypes"
      @close="closeModal"
    />

    <!-- ============================================================ -->
    <!-- GENERATE PASSENGERS -->
    <!-- ============================================================ -->

    <GeneratePassengersModal
      v-if="showGenerateModal"
      :passenger-types="passengerTypes"
      @close="closeGenerateModal"
      @save="handleGenerate"
    />
  </div>
</template>

<script setup>
import { computed, ref, toRaw } from 'vue'

import { Pencil, Plus, Trash2, UsersRound } from 'lucide-vue-next'

import { useQuotationStore } from '../stores/quotation.store'

import PassengerModal from './PassengerModal.vue'

import GeneratePassengersModal from './passengers/GeneratePassengersModal.vue'

import PassengerBulkActions from './passengers/PassengerBulkActions.vue'

import CountryBadge from '@/shared/components/CountryBadge.vue'

/*
|--------------------------------------------------------------------------
| STORE
|--------------------------------------------------------------------------
*/

const store = useQuotationStore()

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

const props = defineProps({
  /*
  |--------------------------------------------------------------------------
  | Soportamos passengers desde el padre.
  |--------------------------------------------------------------------------
  */

  passengers: {
    type: Array,
    default: null,
  },

  passengerTypes: {
    type: Array,
    default: () => [],
  },
})

/*
|--------------------------------------------------------------------------
| PASSENGERS
|--------------------------------------------------------------------------
|
| Normalmente QuotationFormPage envía:
|
| :passengers="store.quotation.passengers"
|
| Si por alguna razón no se envía, usamos el store como fallback.
|
*/

const passengers = computed(() => {
  return props.passengers ?? store.quotation.passengers ?? []
})

/*
|--------------------------------------------------------------------------
| MODALS
|--------------------------------------------------------------------------
*/

const showModal = ref(false)

const editingPassenger = ref(null)

const showGenerateModal = ref(false)

/*
|--------------------------------------------------------------------------
| SELECTION
|--------------------------------------------------------------------------
*/

const selectedPassengers = ref(new Set())

/*
|--------------------------------------------------------------------------
| COMPLETION
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
  return passengers.value.filter((passenger) => isComplete(passenger)).length
})

const pendingCount = computed(() => {
  return passengers.value.length - completedCount.value
})

/*
|--------------------------------------------------------------------------
| NAME
|--------------------------------------------------------------------------
*/

function passengerName(passenger) {
  const firstName = passenger.first_name ?? ''

  const lastName = passenger.last_name ?? ''

  const name = `${firstName} ${lastName}`.trim()

  return name || 'Pendiente'
}

/*
|--------------------------------------------------------------------------
| NEW PASSENGER
|--------------------------------------------------------------------------
*/

function newPassenger() {
  editingPassenger.value = null

  showModal.value = true
}

/*
|--------------------------------------------------------------------------
| EDIT PASSENGER
|--------------------------------------------------------------------------
*/

function editPassenger(passenger) {
  /*
  |--------------------------------------------------------------------------
  | Evitamos editar directamente el objeto antes de guardar.
  |--------------------------------------------------------------------------
  */

  editingPassenger.value = structuredClone(toRaw(passenger))

  showModal.value = true
}

/*
|--------------------------------------------------------------------------
| CLOSE PASSENGER MODAL
|--------------------------------------------------------------------------
*/

function closeModal() {
  editingPassenger.value = null

  showModal.value = false
}

/*
|--------------------------------------------------------------------------
| REMOVE
|--------------------------------------------------------------------------
*/

function removePassenger(passenger) {
  if (!passenger?.uuid) {
    return
  }

  const confirmed = window.confirm(`¿Eliminar a ${passengerName(passenger)}?`)

  if (!confirmed) {
    return
  }

  store.removePassenger(passenger.uuid)

  selectedPassengers.value.delete(passenger.uuid)
}

/*
|--------------------------------------------------------------------------
| GENERATE MODAL
|--------------------------------------------------------------------------
*/

function openGenerateModal() {
  showGenerateModal.value = true
}

function closeGenerateModal() {
  showGenerateModal.value = false
}

/*
|--------------------------------------------------------------------------
| GENERATE
|--------------------------------------------------------------------------
*/

async function handleGenerate(payload) {
  try {
    await store.generatePassengers(payload.groups, payload.nationality)

    closeGenerateModal()
  } catch (error) {
    console.error('Error generando pasajeros:', error)
  }
}

/*
|--------------------------------------------------------------------------
| SELECT ALL
|--------------------------------------------------------------------------
*/

const allSelected = computed(() => {
  return passengers.value.length > 0 && selectedPassengers.value.size === passengers.value.length
})

function toggleSelectAll(checked) {
  selectedPassengers.value.clear()

  if (!checked) {
    return
  }

  passengers.value.forEach((passenger) => {
    if (passenger.uuid) {
      selectedPassengers.value.add(passenger.uuid)
    }
  })
}

/*
|--------------------------------------------------------------------------
| SELECT ONE
|--------------------------------------------------------------------------
*/

function toggleSelection(uuid) {
  if (!uuid) {
    return
  }

  if (selectedPassengers.value.has(uuid)) {
    selectedPassengers.value.delete(uuid)
  } else {
    selectedPassengers.value.add(uuid)
  }
}

/*
|--------------------------------------------------------------------------
| CLEAR SELECTION
|--------------------------------------------------------------------------
*/

function clearSelection() {
  selectedPassengers.value.clear()
}

/*
|--------------------------------------------------------------------------
| INLINE CHANGE
|--------------------------------------------------------------------------
*/

function changeField(passenger, field, value) {
  /*
  |--------------------------------------------------------------------------
  | Cotización nueva:
  |
  | El pasajero todavía no existe en BD.
  | Cambiamos solamente el objeto local.
  |--------------------------------------------------------------------------
  */

  if (!store.quotation.uuid) {
    passenger[field] = value

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Cotización existente:
  |
  | Registramos el cambio para bulk update.
  |--------------------------------------------------------------------------
  */

  store.markPassengerChanged(passenger, field, value)
}

/*
|--------------------------------------------------------------------------
| BULK APPLY
|--------------------------------------------------------------------------
*/

function applyBulkChanges(changes) {
  selectedPassengers.value.forEach((uuid) => {
    const passenger = passengers.value.find((item) => item.uuid === uuid)

    if (!passenger) {
      return
    }

    Object.entries(changes).forEach(([field, value]) => {
      changeField(passenger, field, value)
    })
  })
}

/*
|--------------------------------------------------------------------------
| BULK SAVE
|--------------------------------------------------------------------------
*/

async function saveBulkChanges() {
  /*
  |--------------------------------------------------------------------------
  | Una cotización nueva todavía no requiere PATCH.
  |
  | Sus pasajeros se guardarán junto con la cotización.
  |--------------------------------------------------------------------------
  */

  if (!store.quotation.uuid) {
    return
  }

  try {
    await store.bulkUpdatePassengers()

    clearSelection()
  } catch (error) {
    console.error('Error actualizando pasajeros:', error)
  }
}
</script>
