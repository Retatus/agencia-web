<template>
  <div class="space-y-5">
    <!-- Header -->
    <div>
      <h3 class="text-sm font-semibold text-slate-900 dark:text-white"> Pasajeros </h3>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Personas que viajarán en la cotización.
      </p>
    </div>

    <!-- Contenido -->
    <div
      v-if="!store.quotation.passengers.length"
      class="rounded-lg border border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400"
    >
      No existen pasajeros registrados.
    </div>

    <div
      v-else
      class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead
            class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
          >
            <tr>
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                #
              </th>
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Id
              </th>
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Nombres
              </th>
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Apellidos
              </th>
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Documento
              </th>
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Nacionalidad
              </th>
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Acciones
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr
              v-for="(passenger, index) in store.quotation.passengers"
              :key="passenger.uuid"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td class="px-3 py-2.5 text-center text-sm text-slate-500 dark:text-slate-400">
                {{ index + 1 }}
              </td>
              <td class="px-3 py-2.5 text-center text-sm text-slate-600 dark:text-slate-300">
                {{ passenger.id }}
              </td>
              <td class="px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200">
                {{ passenger.first_name }}
              </td>
              <td class="px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200">
                {{ passenger.last_name }}
              </td>
              <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
                {{ passenger.document_number }}
              </td>
              <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
                {{ passenger.nationality }}
              </td>
              <td class="px-3 py-2.5">
                <div class="flex flex-wrap gap-1">
                  <button
                    type="button"
                    class="rounded-lg border border-blue-300 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                    @click="editPassenger(passenger)"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="rounded-lg border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                    @click="removePassenger(passenger)"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botón agregar pasajero -->
      <div class="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
        <button
          type="button"
          class="inline-flex items-center rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          @click="newPassenger"
        >
          <span class="mr-1 text-lg leading-none">+</span>
          Agregar Pasajero
        </button>
      </div>
    </div>

    <!-- Modal -->
    <PassengerModal
      v-if="showModal"
      :passenger="editingPassenger"
      :passenger-types="props.passengerTypes"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useQuotationStore } from '../stores/quotation.store'

import PassengerModal from './PassengerModal.vue'

const store = useQuotationStore()

const props = defineProps({
  passengerTypes: {
    type: Array,
    default: () => [],
  },
})

const showModal = ref(false)

const editingPassenger = ref(null)

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

function newPassenger() {
  editingPassenger.value = null

  showModal.value = true
}

function editPassenger(passenger) {
  editingPassenger.value = passenger

  showModal.value = true
}

function closeModal() {
  editingPassenger.value = null

  showModal.value = false
}

function removePassenger(passenger) {
  store.removePassenger(passenger.uuid)
}
</script>

<style scoped>
table {
  border-collapse: collapse; /* Une los bordes en una sola línea */
  width: 100%; /* Hace que la tabla ocupe todo el ancho */
}

table,
th,
td {
  border: 1px solid black; /* Define el grosor, tipo y color del borde */
}

th,
td {
  padding: 2px; /* Añade espacio interno para que no esté apretado */
}
</style>
