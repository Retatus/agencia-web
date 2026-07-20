<template>
  <div class="card shadow-sm mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <h5 class="mb-0"> Pasajeros </h5>

        <small class="text-muted"> Personas que viajarán en la cotización. </small>
      </div>

      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="$emit('add')"
      >
        <i class="bi bi-plus-circle me-1"></i>

        Agregar pasajero
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover mb-0 align-middle">
        <thead class="table-light">
          <tr>
            <th>#</th>

            <th>Tipo</th>

            <th>Nombres</th>

            <th>Apellidos</th>

            <th>Documento</th>

            <th>Nacionalidad</th>

            <th width="130"> Acciones </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="!passengers.length">
            <td
              colspan="6"
              class="text-center text-muted py-4"
            >
              No existen pasajeros.
            </td>
          </tr>

          <tr
            v-for="(passenger, index) in passengers"
            :key="passenger.uuid ?? index"
          >
            <td>{{ index + 1 }}</td>

            <td>{{ passenger.passenger_type_id }}</td>

            <td>{{ passenger.first_name }}</td>

            <td>{{ passenger.last_name }}</td>

            <td>{{ passenger.document_number }}</td>

            <td>{{ passenger.nationality }}</td>

            <td>
              <button
                class="btn btn-outline-primary btn-sm me-1"
                @click="$emit('edit', passenger)"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <button
                class="btn btn-outline-danger btn-sm"
                @click="$emit('remove', passenger.uuid)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  passengers: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['add', 'edit', 'remove'])
</script>
