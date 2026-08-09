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

        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400"> Gestión de cotizaciones </p>
      </div>

      <router-link
        :to="{ name: 'quotations.create' }"
        class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
      >
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
      <!-- Encabezado -->

      <template #header>
        <tr>
          <th> Código </th>

          <th> Cliente </th>

          <th> Viaje </th>

          <th> Válida hasta </th>

          <th> Notas </th>

          <th> Moneda </th>

          <th class="!text-right"> Total </th>

          <th> Estado </th>

          <th class="!text-right"> Acciones </th>
        </tr>
      </template>

      <!-- Registros -->

      <template #body="{ items }">
        <tr
          v-for="quotation in items"
          :key="quotation.uuid"
        >
          <!-- Código -->

          <td class="whitespace-nowrap">
            <span class="font-semibold text-teal-700 dark:text-teal-300">
              {{ quotation.code }}
            </span>
          </td>

          <!-- Cliente -->

          <td>
            <div class="min-w-44">
              <p class="font-medium text-slate-900 dark:text-white">
                {{
                  [quotation.customer?.first_name, quotation.customer?.last_name]
                    .filter(Boolean)
                    .join(' ') || 'Sin cliente'
                }}
              </p>
            </div>
          </td>

          <!-- Fecha de viaje -->

          <td class="whitespace-nowrap">
            {{ quotation.travel_date || 'Sin fecha' }}
          </td>

          <!-- Válida hasta -->

          <td class="whitespace-nowrap">
            {{ quotation.valid_until || 'Sin fecha' }}
          </td>

          <!-- Notas -->

          <td>
            <p
              class="max-w-52 truncate text-slate-500 dark:text-slate-400"
              :title="quotation.notes || ''"
            >
              {{ quotation.notes || 'Sin notas' }}
            </p>
          </td>

          <!-- Moneda -->

          <td class="whitespace-nowrap">
            <span
              class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {{ quotation.currency?.code || '—' }}
            </span>
          </td>

          <!-- Total -->

          <td class="whitespace-nowrap !text-right">
            <span class="font-semibold text-slate-900 dark:text-white">
              {{ money(quotation.total) }}
            </span>
          </td>

          <!-- Estado -->

          <td class="whitespace-nowrap">
            <span
              class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="statusClass(quotation.status?.code)"
            >
              {{ quotation.status?.name || 'Sin estado' }}
            </span>
          </td>

          <!-- Acciones -->

          <td class="whitespace-nowrap">
            <div class="flex justify-end gap-1">
              <button
                type="button"
                class="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 transition hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:text-slate-400 dark:hover:bg-teal-950/60 dark:hover:text-teal-300"
                @click="edit(quotation.uuid)"
              >
                <Pencil class="h-4 w-4" />
                <span class="hidden xl:inline"> Editar </span>
              </button>

              <button
                type="button"
                class="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-slate-400 dark:hover:bg-blue-950/60 dark:hover:text-blue-300"
                @click="viewHistory(quotation)"
              >
                <Eye class="h-4 w-4" />
                <span class="hidden xl:inline"> Historial </span>
              </button>

              <button
                type="button"
                class="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:text-slate-400 dark:hover:bg-red-950/60 dark:hover:text-red-300"
                @click="remove(quotation.uuid)"
              >
                <Trash2 class="h-4 w-4" />
                <span class="hidden xl:inline"> Eliminar </span>
              </button>
            </div>
          </td>
        </tr>
      </template>

      <!-- Pie -->

      <template #footer>
        <div
          class="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            {{ store.items.length }}
            cotización{{ store.items.length === 1 ? '' : 'es' }}
          </span>

          <span v-if="store.items.length"> Mostrando registros disponibles </span>
        </div>
      </template>
    </BaseTable>

    <BaseTable
      :items="store.items"
      :loading="store.loading"
      :columns="9"
      empty-text="No existen cotizaciones registradas."
    >
      <template #header>
        <tr>
          <th> Código </th>

          <th> Cliente </th>

          <th> Viaje </th>

          <th> Válida hasta </th>

          <th> Notas </th>

          <th> Moneda </th>

          <th class="!text-right"> Total </th>

          <th> Estado </th>

          <th class="!text-right"> Acciones </th>
        </tr>
      </template>
      <template #body="{ items }"
        ><tr
          v-for="quotation in items"
          :key="quotation.uuid"
        >
          <td class="whitespace-nowrap">
            <span class="font-semibold text-teal-700 dark:text-teal-300">
              {{ quotation.code }}
            </span>
          </td>
          <td class="min-w-44 font-medium !text-slate-900 dark:!text-white">
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
                type="button"
                class="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 transition hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:text-slate-400 dark:hover:bg-teal-950/60 dark:hover:text-teal-300"
                @click="edit(quotation.uuid)"
              >
                <Pencil class="h-4 w-4" />
                <span class="hidden xl:inline"> Editar </span>
              </button>

              <button
                type="button"
                class="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-slate-400 dark:hover:bg-blue-950/60 dark:hover:text-blue-300"
                @click="viewHistory(quotation)"
              >
                <Eye class="h-4 w-4" />
                <span class="hidden xl:inline"> Historial </span>
              </button>

              <button
                type="button"
                class="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:text-slate-400 dark:hover:bg-red-950/60 dark:hover:text-red-300"
                @click="remove(quotation.uuid)"
              >
                <Trash2 class="h-4 w-4" />
                <span class="hidden xl:inline"> Eliminar </span>
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

import { BriefcaseBusiness, Pencil, Eye, Trash2 } from 'lucide-vue-next'
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
