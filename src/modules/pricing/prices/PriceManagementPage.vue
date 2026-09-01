<template>
  <div class="space-y-6">
    <!-- ============================================================ -->
    <!-- HEADER -->
    <!-- ============================================================ -->

    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Administración de precios
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Consulta y actualiza las tarifas de los servicios.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- ====================================================== -->
        <!-- CAMBIOS PENDIENTES -->
        <!-- ====================================================== -->

        <div
          v-if="store.hasChanges"
          class="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
        >
          {{ store.changedCount }}
          {{ store.changedCount === 1 ? 'cambio pendiente' : 'cambios pendientes' }}
        </div>

        <!-- ====================================================== -->
        <!-- RECARGAR -->
        <!-- ====================================================== -->

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          :disabled="store.loading || store.saving"
          @click="reload"
        >
          <RefreshCw class="h-4 w-4" />
          Recargar
        </button>

        <!-- ====================================================== -->
        <!-- NUEVO PRECIO -->
        <!-- ====================================================== -->

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-teal-600 bg-white px-4 py-2.5 text-sm font-medium text-teal-600 shadow-sm transition hover:bg-teal-50 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-950/30"
          @click="openCreateModal"
        >
          <Plus class="h-4 w-4" />
          Nuevo precio
        </button>

        <!-- ====================================================== -->
        <!-- BULK SAVE -->
        <!-- ====================================================== -->

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-900"
          :disabled="!store.hasChanges || store.saving"
          @click="saveChanges"
        >
          <span
            v-if="store.saving"
            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          />
          <Save v-else class="h-4 w-4" />
          {{ store.saving ? 'Guardando...' : `Guardar ${store.changedCount || ''} cambios` }}
        </button>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- ERROR -->
    <!-- ============================================================ -->

    <div
      v-if="store.error"
      class="flex items-start justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
    >
      <div>
        <div class="font-semibold">No se pudo completar la operación</div>
        <div class="mt-1">{{ store.error }}</div>
      </div>
      <button
        type="button"
        class="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        @click="store.clearError()"
      >
        <X class="h-5 w-5" />
      </button>
    </div>

    <!-- ============================================================ -->
    <!-- FILTERS -->
    <!-- ============================================================ -->

    <PriceFilters
      v-model="filterValues"
      :price-lists="priceLists"
      :price-types="priceTypes"
      :passenger-types="passengerTypes"
      :services="services"
      @apply="handleFiltersApply"
      @reset="handleFiltersReset"
    />

    <!-- ============================================================ -->
    <!-- PRICE TABLE -->
    <!-- ============================================================ -->

    <div
      class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <!-- ======================================================== -->
      <!-- TABLE HEADER -->
      <!-- ======================================================== -->

      <div
        class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="font-semibold text-slate-900 dark:text-white">Tarifas</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Edita directamente costo, venta y estado.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-slate-500 dark:text-slate-400">Mostrar</label>
          <select
            :value="store.filters.per_page"
            class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            @change="changePerPage($event.target.value)"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- LOADING -->
      <!-- ======================================================== -->

      <div
        v-if="store.loading"
        class="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500"
      >
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600 dark:border-slate-700"
        ></div>
        <div class="text-sm dark:text-slate-400">Cargando precios...</div>
      </div>

      <!-- ======================================================== -->
      <!-- EMPTY -->
      <!-- ======================================================== -->

      <div
        v-else-if="store.isEmpty"
        class="flex min-h-64 flex-col items-center justify-center px-6 text-center"
      >
        <div
          class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800 dark:text-slate-400"
        >
          <DollarSign class="h-6 w-6" />
        </div>
        <div class="font-semibold text-slate-900 dark:text-white">No se encontraron precios</div>
        <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Prueba modificando los filtros de búsqueda.
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TABLE -->
      <!-- ======================================================== -->

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800/50">
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Servicio
              </th>
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Variante
              </th>
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Lista
              </th>
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Tipo
              </th>
              <th
                class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Pasajero
              </th>
              <th
                class="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Rango
              </th>
              <th
                class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Costo
              </th>
              <th
                class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Venta
              </th>
              <th
                class="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Estado
              </th>
              <th
                class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="price in store.items"
              :key="price.id"
              class="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/60 dark:border-slate-700 dark:hover:bg-slate-800/50"
              :class="{
                'bg-amber-50/50 dark:bg-amber-950/20': isChanged(price.id),
              }"
            >
              <!-- ================================================= -->
              <!-- SERVICE -->
              <!-- ================================================= -->

              <td class="px-3 py-2.5">
                <div class="font-medium text-slate-900 dark:text-white">
                  {{ price.service_variant?.service.description }}
                </div>
                <div
                  v-if="price.provider?.business_name"
                  class="mt-0.5 text-xs text-slate-500 dark:text-slate-400"
                >
                  {{ price.provider.business_name }}
                </div>
              </td>

              <!-- ================================================= -->
              <!-- VARIANT -->
              <!-- ================================================= -->

              <td class="px-3 py-2.5">
                <div class="font-medium text-slate-700 dark:text-slate-300">
                  {{ price.variant?.name ?? price.service_variant?.name ?? '-' }}
                </div>
                <div
                  v-if="price.variant?.code || price.service_variant?.code"
                  class="mt-0.5 text-xs text-slate-400 dark:text-slate-500"
                >
                  {{ price.variant?.code ?? price.service_variant?.code }}
                </div>
              </td>

              <!-- ================================================= -->
              <!-- PRICE LIST -->
              <!-- ================================================= -->

              <td class="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                {{ price.price_list?.name ?? '-' }}
              </td>

              <!-- ================================================= -->
              <!-- PRICE TYPE -->
              <!-- ================================================= -->

              <td class="px-3 py-2.5">
                <span
                  class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {{ price.price_type?.name ?? price.price_type?.code ?? '-' }}
                </span>
              </td>

              <!-- ================================================= -->
              <!-- PASSENGER -->
              <!-- ================================================= -->

              <td class="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                {{ price.passenger_type?.name ?? 'General' }}
              </td>

              <!-- ================================================= -->
              <!-- RANGE -->
              <!-- ================================================= -->

              <td class="px-3 py-2.5 text-center text-slate-700 dark:text-slate-300">
                {{ formatRange(price) }}
              </td>

              <!-- ================================================= -->
              <!-- COST -->
              <!-- ================================================= -->

              <td class="px-3 py-2.5 min-w-32">
                <input
                  :value="price.cost"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-right text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  @input="onCostInput(price, $event.target.value)"
                />
              </td>

              <!-- ================================================= -->
              <!-- SALE -->
              <!-- ================================================= -->

              <td class="px-3 py-2.5 min-w-32">
                <input
                  :value="price.sale_price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-right text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  @input="onSalePriceInput(price, $event.target.value)"
                />
              </td>

              <!-- ================================================= -->
              <!-- ACTIVE -->
              <!-- ================================================= -->

              <td class="px-3 py-2.5 text-center">
                <label class="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    class="peer sr-only"
                    :checked="Boolean(price.active)"
                    @change="onActiveChange(price, $event.target.checked)"
                  />
                  <div
                    class="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-teal-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full dark:bg-slate-600"
                  ></div>
                </label>
              </td>

              <!-- ================================================= -->
              <!-- ACTIONS -->
              <!-- ================================================= -->

              <td class="px-3 py-2.5 text-right">
                <div class="inline-flex items-center gap-1">
                  <button
                    type="button"
                    class="rounded-lg border border-blue-300 px-2 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                    title="Editar"
                    @click="editPrice(price)"
                  >
                    <Pencil class="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    class="rounded-lg border border-red-300 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                    title="Eliminar"
                    @click="removePrice(price)"
                  >
                    <Trash2 class="h-3 w-3" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ======================================================== -->
      <!-- PAGINATION -->
      <!-- ======================================================== -->

      <div
        v-if="!store.loading && store.items.length"
        class="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="text-sm text-slate-500 dark:text-slate-400">
          Mostrando
          <strong class="text-slate-700 dark:text-slate-300">{{
            store.pagination.from ?? 0
          }}</strong>
          a
          <strong class="text-slate-700 dark:text-slate-300">{{ store.pagination.to ?? 0 }}</strong>
          de
          <strong class="text-slate-700 dark:text-slate-300">{{ store.pagination.total }}</strong>
          registros
        </div>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            :disabled="store.pagination.current_page <= 1"
            @click="goToPage(store.pagination.current_page - 1)"
          >
            ‹
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            :class="
              page === store.pagination.current_page
                ? 'border-teal-600 bg-teal-600 text-white hover:bg-teal-600 dark:border-teal-500'
                : ''
            "
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            :disabled="store.pagination.current_page >= store.pagination.last_page"
            @click="goToPage(store.pagination.current_page + 1)"
          >
            ›
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- TEMPORAL MODAL PLACEHOLDER -->
    <!-- ============================================================ -->

    <PriceFormModal
      v-if="showPriceModal"
      :key="editingPrice?.id ?? 'new'"
      :item="editingPrice"
      :price-lists="priceLists"
      :price-types="priceTypes"
      :passenger-types="passengerTypes"
      :services="services"
      @close="closePriceModal"
      @save="handlePriceSave"
    />
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { usePriceStore } from '../stores/price.store'
import { Pencil, Trash2, RefreshCw, Plus } from 'lucide-vue-next'

import PriceFormModal from '../components/PriceFormModal.vue'

import PriceListService from '../services/price-list.service'

import PriceTypeService from '../services/price-type.service'

import PassengerTypeService from '../../passenger/services/passenger-type.service'

import ServiceService from '../../catalog/services/services/service.service'

import PriceFilters from '../components/PriceFilters.vue'

/*
|--------------------------------------------------------------------------
| STORE
|--------------------------------------------------------------------------
*/

const store = usePriceStore()

/*
|--------------------------------------------------------------------------
| MODAL
|--------------------------------------------------------------------------
*/

const showPriceModal = ref(false)

const editingPrice = ref(null)

/*
|--------------------------------------------------------------------------
| LOCAL FILTERS
|--------------------------------------------------------------------------
|
| No editamos directamente store.filters hasta presionar
| "Aplicar filtros".
|
*/

const localFilters = reactive({
  search: '',

  price_list_id: '',

  provider_id: '',

  service_category_id: '',

  service_id: '',

  price_type_id: '',

  passenger_type_id: '',

  active: '1',
})

const filterValues = ref({
  search: null,
  price_list_id: null,
  price_type_id: null,
  service_uuid: null,
  passenger_type_id: null,
  active: 1,
})
/*
|--------------------------------------------------------------------------
| VISIBLE PAGES
|--------------------------------------------------------------------------
|
| Mostramos como máximo 5 páginas alrededor de la actual.
|
*/

const visiblePages = computed(() => {
  const current = Number(store.pagination.current_page ?? 1)

  const last = Number(store.pagination.last_page ?? 1)

  const pages = []

  let start = Math.max(1, current - 2)

  let end = Math.min(last, start + 4)

  /*
    |--------------------------------------------------------------------------
    | Si estamos cerca del final intentamos conservar 5 páginas.
    |--------------------------------------------------------------------------
    */

  start = Math.max(1, end - 4)

  for (let page = start; page <= end; page++) {
    pages.push(page)
  }

  return pages
})

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  await Promise.all([loadPrices(), loadCatalogs()])
})

/*
|--------------------------------------------------------------------------
| LOAD
|--------------------------------------------------------------------------
*/

async function loadPrices() {
  try {
    await store.fetchPrices()
  } catch (error) {
    console.error('Error cargando precios:', error)
  }
}

/*
|--------------------------------------------------------------------------
| RELOAD
|--------------------------------------------------------------------------
|
| Si hay cambios locales pendientes, por ahora pedimos
| confirmación antes de descartarlos.
|
*/

async function reload() {
  if (
    store.hasChanges &&
    !window.confirm('Hay cambios pendientes. ¿Desea descartarlos y recargar los precios?')
  ) {
    return
  }

  await loadPrices()
}

async function handleFiltersApply(filters) {
  if (store.hasChanges) {
    const confirmed = window.confirm(
      'Hay cambios pendientes. ¿Desea descartarlos y aplicar los filtros?',
    )

    if (!confirmed) {
      return
    }
  }

  store.setFilters(filters)

  await store.fetchPrices()
}

async function handleFiltersReset() {
  if (store.hasChanges) {
    const confirmed = window.confirm(
      'Hay cambios pendientes. ¿Desea descartarlos y limpiar los filtros?',
    )

    if (!confirmed) {
      return
    }
  }

  store.resetFilters()

  filterValues.value = {
    search: null,
    price_list_id: null,
    price_type_id: null,
    service_uuid: null,
    passenger_type_id: null,
    active: 1,
  }

  await store.fetchPrices()
}

/*
|--------------------------------------------------------------------------
| APPLY FILTERS
|--------------------------------------------------------------------------
*/

async function applyFilters() {
  if (
    store.hasChanges &&
    !window.confirm('Hay cambios pendientes. Al aplicar filtros se descartarán. ¿Desea continuar?')
  ) {
    return
  }

  store.setFilters({
    search: normalizeFilter(localFilters.search),

    price_list_id: normalizeNumericFilter(localFilters.price_list_id),

    provider_id: normalizeNumericFilter(localFilters.provider_id),

    service_category_id: normalizeNumericFilter(localFilters.service_category_id),

    service_id: normalizeNumericFilter(localFilters.service_id),

    price_type_id: normalizeNumericFilter(localFilters.price_type_id),

    passenger_type_id: normalizeNumericFilter(localFilters.passenger_type_id),

    active: localFilters.active === '' ? null : Number(localFilters.active),
  })

  await loadPrices()
}

/*
|--------------------------------------------------------------------------
| RESET FILTERS
|--------------------------------------------------------------------------
*/

async function resetFilters() {
  if (
    store.hasChanges &&
    !window.confirm('Hay cambios pendientes. ¿Desea descartarlos y limpiar los filtros?')
  ) {
    return
  }

  store.resetFilters()

  localFilters.search = ''

  localFilters.price_list_id = ''

  localFilters.provider_id = ''

  localFilters.service_category_id = ''

  localFilters.service_id = ''

  localFilters.price_type_id = ''

  localFilters.passenger_type_id = ''

  localFilters.active = '1'

  await loadPrices()
}

/*
|--------------------------------------------------------------------------
| INLINE COST
|--------------------------------------------------------------------------
*/

function onCostInput(price, value) {
  const parsed = Number(value)

  if (Number.isNaN(parsed)) {
    return
  }

  store.updateLocalCost(price, parsed)
}

/*
|--------------------------------------------------------------------------
| INLINE SALE PRICE
|--------------------------------------------------------------------------
*/

function onSalePriceInput(price, value) {
  const parsed = Number(value)

  if (Number.isNaN(parsed)) {
    return
  }

  store.updateLocalSalePrice(price, parsed)
}

/*
|--------------------------------------------------------------------------
| INLINE ACTIVE
|--------------------------------------------------------------------------
*/

function onActiveChange(price, value) {
  store.updateLocalActive(price, value)
}

/*
|--------------------------------------------------------------------------
| BULK SAVE
|--------------------------------------------------------------------------
*/

async function saveChanges() {
  if (!store.hasChanges) {
    return
  }

  try {
    await store.bulkUpdatePrices()
  } catch (error) {
    console.error('Error actualizando precios:', error)
  }
}

/*
|--------------------------------------------------------------------------
| IS CHANGED
|--------------------------------------------------------------------------
*/

function isChanged(id) {
  return store.changedPrices.has(Number(id))
}

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

function openCreateModal() {
  editingPrice.value = null

  showPriceModal.value = true
}

/*
|--------------------------------------------------------------------------
| EDIT
|--------------------------------------------------------------------------
*/

function editPrice(price) {
  debugger
  editingPrice.value = JSON.parse(JSON.stringify(price))

  showPriceModal.value = true
}

/*
|--------------------------------------------------------------------------
| CLOSE MODAL
|--------------------------------------------------------------------------
*/

function closePriceModal() {
  showPriceModal.value = false

  editingPrice.value = null
}

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

async function handlePriceSave(payload) {
  try {
    /*
    |--------------------------------------------------------------------------
    | EDITAR
    |--------------------------------------------------------------------------
    */

    if (editingPrice.value?.id) {
      await store.updatePrice(editingPrice.value.id, payload)

      closePriceModal()

      return
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR
    |--------------------------------------------------------------------------
    */

    await store.createPrice(payload)

    closePriceModal()
  } catch (error) {
    console.error('Error guardando precio:', error)
  }
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

async function removePrice(price) {
  if (!price?.id) {
    return
  }

  const confirmed = window.confirm(`¿Desea eliminar el precio #${price.id}?`)

  if (!confirmed) {
    return
  }

  try {
    await store.deletePrice(price.id)
  } catch (error) {
    console.error('Error eliminando precio:', error)
  }
}

/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
*/

async function goToPage(page) {
  if (store.hasChanges) {
    const confirmed = window.confirm(
      'Hay cambios pendientes. ¿Desea descartarlos y cambiar de página?',
    )

    if (!confirmed) {
      return
    }
  }

  await store.setPage(page)
}

/*
|--------------------------------------------------------------------------
| PER PAGE
|--------------------------------------------------------------------------
*/

async function changePerPage(value) {
  if (store.hasChanges) {
    const confirmed = window.confirm(
      'Hay cambios pendientes. ¿Desea descartarlos y cambiar la cantidad de registros?',
    )

    if (!confirmed) {
      return
    }
  }

  await store.setPerPage(Number(value))
}

/*
|--------------------------------------------------------------------------
| RANGE
|--------------------------------------------------------------------------
*/

function formatRange(price) {
  const min = price.min_quantity

  const max = price.max_quantity

  if (min === null && max === null) {
    return '-'
  }

  if (min !== null && max === null) {
    return `${min}+`
  }

  if (min === null && max !== null) {
    return `≤ ${max}`
  }

  if (Number(min) === Number(max)) {
    return `${min}`
  }

  return `${min} - ${max}`
}

/*
|--------------------------------------------------------------------------
| FILTER HELPERS
|--------------------------------------------------------------------------
*/

function normalizeFilter(value) {
  const normalized = String(value ?? '').trim()

  return normalized || null
}

function normalizeNumericFilter(value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const number = Number(value)

  return Number.isNaN(number) ? null : number
}

const priceLists = ref([])
const priceTypes = ref([])
const passengerTypes = ref([])
const services = ref([])

const loadingCatalogs = ref(false)
async function loadCatalogs() {
  loadingCatalogs.value = true

  try {
    const [priceListsResponse, priceTypesResponse, passengerTypesResponse, servicesResponse] =
      await Promise.all([
        PriceListService.getAll({
          active: 1,
          per_page: 100,
        }),

        PriceTypeService.getAll({
          active: 1,
        }),

        PassengerTypeService.getAll({
          active: 1,
        }),

        ServiceService.getAll({
          active: 1,
          per_page: 100,
        }),
      ])

    priceLists.value = priceListsResponse.data.data ?? []

    priceTypes.value = priceTypesResponse.data.data ?? []

    passengerTypes.value = passengerTypesResponse.data.data ?? []

    services.value = servicesResponse.data.data ?? []
  } finally {
    loadingCatalogs.value = false
  }
}
</script>
