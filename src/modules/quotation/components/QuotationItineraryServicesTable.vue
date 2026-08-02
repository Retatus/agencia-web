<template>
  <div class="card shadow-sm">
    <!-- Header -->

    <div class="card-header d-flex justify-content-between align-items-center">
      <h6 class="mb-0"> Servicios del Día </h6>
    </div>

    <!-- Tabla -->

    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th width="50"> # </th>

            <th> Id </th>

            <th> Servicio </th>

            <th width="180"> Variante </th>

            <th width="120"> Tipo </th>

            <th width="90"> Cant. </th>

            <th width="120"> Costo </th>

            <th width="120"> Venta </th>

            <th width="120"> Subtotal </th>

            <th width="80"> Estado </th>

            <th width="120"> Acciones </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="!itinerary.items.length">
            <td
              colspan="10"
              class="text-center py-5 text-muted"
            >
              No existen servicios registrados.
            </td>
          </tr>

          <tr
            v-for="(item, index) in itinerary.items"
            :key="item.uuid ?? index"
          >
            <td>
              {{ index + 1 }}
            </td>
            <td>
              {{ item.id }}
            </td>
            <td>
              <div class="fw-semibold">
                {{ item.name }}
              </div>

              <small class="text-muted">
                {{ item.description }}
              </small>
            </td>

            <td>
              {{ item.variant_name }}
            </td>

            <td>
              <span
                class="badge"
                :class="badge(item.item_type)"
              >
                {{ item.item_type }}
              </span>
            </td>

            <td>
              <input
                class="form-control form-control-sm text-end"
                type="number"
                min="1"
                v-model.number="item.quantity"
                @change="updateQuantity(item)"
              />
            </td>

            <td class="text-end">
              {{ money(item.unit_cost) }}
            </td>

            <td class="text-end">
              {{ money(item.unit_price) }}
            </td>

            <td class="text-end fw-bold">
              {{ money(item.subtotal) }}
            </td>

            <td class="text-center">
              <i
                class="bi bi-check-circle-fill text-success"
                v-if="item.active"
              >
                activo
              </i>

              <i
                class="bi bi-x-circle-fill text-danger"
                v-else
              >
                inactivo
              </i>
            </td>

            <td>
              <button
                type="button"
                class="btn btn-outline-primary btn-sm me-1"
                @click="$emit('edit-item', item)"
              >
                edit
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="$emit('duplicate-item', item.uuid)"
              >
                duplicar
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="moveUp(item.uuid)"
              >
                ↑
              </button>

              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="moveDown(item.uuid)"
              >
                ↓
              </button>

              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="remove(item)"
              >
                delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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

const emit = defineEmits(['edit-item', 'duplicate-item'])

function updateQuantity(item) {
  store.updateItem(item.uuid, {
    quantity: item.quantity,
  })
}

function moveUp(uuid) {
  store.moveItemUp(uuid)
}

function moveDown(uuid) {
  store.moveItemDown(uuid)
}

function remove(item) {
  store.removeItem(item.uuid)
}

function money(value) {
  return Number(value || 0).toFixed(2)
}

function badge(type) {
  switch (type) {
    case 'CATALOG':
      return 'bg-primary'

    case 'CUSTOM':
      return 'bg-secondary'

    default:
      return 'bg-dark'
  }
}
</script>

<!-- 
Mi siguiente mejora (sin implementarla todavía)

Más adelante quitaría incluso:

money()

badge()

y tendría un pequeño archivo:

utils/
    money.js
    badges.js
-->

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
