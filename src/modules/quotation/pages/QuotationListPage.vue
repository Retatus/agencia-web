<template>
  <section>
    <!-- ============================================================
         ENCABEZADO
    ============================================================= -->

    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Cotizaciones
        </h2>

        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestión de cotizaciones</p>
      </div>

      <router-link
        :to="{ name: 'quotations.create' }"
        class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
      >
        <Plus class="mr-1.5 h-4 w-4" />
        Nueva cotización
      </router-link>
    </div>

    <!-- ============================================================
         TABLA
    ============================================================= -->

    <BaseTable
      :items="store.items"
      :loading="store.loading"
      :columns="9"
      empty-text="No existen cotizaciones registradas."
    >
      <template #header>
        <tr>
          <th>Código</th>

          <th>Cliente</th>

          <th>Viaje</th>

          <th>Válida hasta</th>

          <th>Notas</th>

          <th>Moneda</th>

          <th class="text-right!">Total</th>

          <th>Estado</th>

          <th class="text-right!">Acciones</th>
        </tr>
      </template>
      <template #body="{ items }"
        ><tr v-for="quotation in items" :key="quotation.uuid">
          <td class="whitespace-nowrap">
            <span class="font-semibold text-teal-700 dark:text-teal-300">
              {{ quotation.code }}
            </span>
          </td>
          <td class="min-w-44 font-medium text-slate-900! dark:text-white!">
            {{
              [quotation.customer?.first_name, quotation.customer?.last_name]
                .filter(Boolean)
                .join(' ') || 'Sin cliente'
            }}
          </td>
          <td class="whitespace-nowrap">
            {{ quotation.travel_date || 'Sin fecha' }}
          </td>
          <td class="whitespace-nowrap">
            {{ quotation.valid_until || 'Sin fecha' }}
          </td>
          <td>
            <p
              class="max-w-52 truncate text-slate-500 dark:text-slate-400"
              :title="quotation.notes || ''"
            >
              {{ quotation.notes || 'Sin notas' }}
            </p>
          </td>
          <td class="whitespace-nowrap">
            <span
              class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {{ quotation.currency?.code || '—' }}
            </span>
            {{ money(quotation.total) }}
          </td>
          <td class="whitespace-nowrap">
            <span
              class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="statusClass(quotation.status?.code)"
            >
              {{ quotation.status?.name || 'Sin estado' }}
            </span>
          </td>

          <td>
            <BaseBadge :variant="quotation.active ? 'success' : 'danger'">
              {{ quotation.active ? 'Activo' : 'Inactivo' }}
            </BaseBadge>
          </td>

          <td class="whitespace-nowrap">
            <div class="flex justify-end gap-1">
              <button
                class="inline-flex items-center rounded-lg border border-blue-300 px-2.5 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                @click="edit(quotation.uuid)"
              >
                <Pencil class="mr-1 h-3 w-3" />
                Editar
              </button>
              <button
                class="inline-flex items-center rounded-lg border border-blue-300 px-2.5 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                @click="viewHistory(quotation)"
              >
                <Eye class="mr-1 h-3 w-3" />
                Historial
              </button>
              <button
                class="inline-flex items-center rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                @click="remove(quotation.uuid)"
              >
                <Trash2 class="mr-1 h-3 w-3" />
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      </template>
      <template #footer>
        <BasePagination
          :current-page="currentPage"
          :last-page="lastPage"
          :total="store.items.length"
          :per-page="perPage"
          @change="currentPage = $event"
        />
      </template>
    </BaseTable>

    <!-- ============================================================
         MODAL DE HISTORIAL
    ============================================================= -->

    <QuotationHistoryModal
      v-if="showHistory"
      :quotation="selectedQuotation"
      @close="closeHistory"
    />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
//import BaseTable from '@/shared/components/BaseTable.vue'
import { useQuotationStore } from '../stores/quotation.store'
import QuotationHistoryModal from '../components/QuotationHistoryModal.vue'
import quotationService from '../services/quotation.service.js'

import { Plus, Pencil, Eye, Trash2 } from 'lucide-vue-next'
import { BaseBadge, BasePagination, BaseTable } from '@/components/ui'

const router = useRouter()
const store = useQuotationStore()

/*
|--------------------------------------------------------------------------
| History
|--------------------------------------------------------------------------
*/

const showHistory = ref(false)
const selectedQuotation = ref(null)

function openHistory(quotation) {
  selectedQuotation.value = quotation
  showHistory.value = true
}

function closeHistory() {
  showHistory.value = false
  selectedQuotation.value = null
}

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

function viewHistory(quotation) {
  selectedQuotation.value = quotation
  showHistory.value = true
}

async function remove(uuid) {
  if (!confirm('¿Desea eliminar esta cotización?')) return
  await store.destroy(uuid)
  await load()
}

function money(value) {
  return Number(value || 0).toFixed(2)
}

function statusClass(statusCode) {
  const classes = {
    DRAFT: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',

    PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',

    SENT: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',

    APPROVED: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300',

    CONFIRMED: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300',

    REJECTED: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',

    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
  }

  return classes[statusCode] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
}
</script>
