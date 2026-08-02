<template>
  <div class="card shadow-sm mb-4">
    <!-- Header -->

    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <h5 class="mb-0"> Pasajeros</h5>

        <small class="text-muted"> Personas que viajarán en la cotización. </small>
      </div>

      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="newPassenger"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Pasajero
      </button>
    </div>

    <!-- Body -->

    <div class="card-body">
      <div
        v-if="!store.quotation.passengers.length"
        class="text-center text-muted py-5"
      >
        No existen pasajeros registrados.
      </div>

      <div
        v-else
        class="table-responsive"
      >
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th width="50"> # </th>

              <th width="50"> Id </th>

              <!-- <th> Tipo </th> -->

              <th> Nombres </th>

              <th> Apellidos </th>

              <th> Documento </th>

              <th> Nacionalidad </th>

              <th width="120"> Acciones </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(passenger, index) in store.quotation.passengers"
              :key="passenger.uuid"
            >
              <td>
                {{ index + 1 }}
              </td>

              <td>
                {{ passenger.id }}
              </td>

              <td>
                {{ passenger.first_name }}
              </td>

              <td>
                {{ passenger.last_name }}
              </td>

              <td>
                {{ passenger.document_number }}
              </td>

              <td>
                {{ passenger.nationality }}
              </td>

              <td>
                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm me-1"
                  @click="editPassenger(passenger)"
                >
                  edit
                </button>

                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removePassenger(passenger)"
                >
                  delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
