<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0"> Cotizaciones </h2>
        <small class="text-muted"> Gestión de Cotizaciones </small>
      </div>
      <router-link
        :to="{ name: 'quotations.create' }"
        class="btn btn-primary"
      >
        Nueva Cotización
      </router-link>
    </div>
    <div class="card">
      <div class="card-body p-0">
        <BaseTable
          :items="store.items"
          :loading="store.loading"
          :columns="8"
        >
          <template #header>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Viaje</th>
              <th>Válida Hasta</th>
              <th>Moneda</th>
              <th class="text-end"> Total </th>
              <th>Estado</th>
              <th width="170"> Acciones </th>
            </tr>
          </template>
          <template #body="{ items }">
            <tr
              v-for="quotation in items"
              :key="quotation.uuid"
            >
              <td>
                {{ quotation.code }}
              </td>
              <td> {{ quotation.customer?.first_name }} {{ quotation.customer?.last_name }} </td>
              <td>
                {{ quotation.travel_date }}
              </td>
              <td>
                {{ quotation.valid_until }}
              </td>
              <td>
                {{ quotation.currency?.code }}
              </td>
              <td class="text-end">
                {{ money(quotation.total) }}
              </td>
              <td>
                <span
                  class="badge"
                  :class="statusClass(quotation.status?.code)"
                >
                  {{ quotation.status?.name }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-warning btn-sm me-2"
                  @click="edit(quotation.uuid)"
                >
                  Editar
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="remove(quotation.uuid)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </template>
        </BaseTable>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseTable from '@/shared/components/BaseTable.vue'
import { useQuotationStore } from '../stores/quotation.store'
import { storeToRefs } from 'pinia'
const router = useRouter()
const store = useQuotationStore()

onMounted(load)
async function load() {
  await store.fetchQuotations()
}
function edit(uuid) {
  router.push({
    name: 'quotations.edit',
    params: {
      uuid,
    },
  })
}
async function remove(uuid) {
  if (!confirm('¿Desea eliminar esta cotización?')) return
  await store.destroy(uuid)
  await load()
}
function money(value) {
  return Number(value || 0).toFixed(2)
}
function statusClass(code) {
  switch (code) {
    case 'DRAFT':
      return 'bg-secondary'
    case 'SENT':
      return 'bg-primary'
    case 'APPROVED':
      return 'bg-success'
    case 'REJECTED':
      return 'bg-danger'
    default:
      return 'bg-light text-dark'
  }
}
</script>
