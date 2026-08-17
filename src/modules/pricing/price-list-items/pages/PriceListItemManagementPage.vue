<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <!-- ============================================================ -->
    <!-- HEADER -->
    <!-- ============================================================ -->

    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Reglas de listas de precios
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Administra los ajustes comerciales aplicados sobre los precios base de cada variante.
        </p>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PRICE LIST CONTEXT -->
    <!-- ============================================================ -->

    <div
      class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div class="p-5">
        <div class="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <!-- PRICE LIST -->
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Lista de precios
            </label>
            <select
              v-model="selectedPriceListUuid"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              :disabled="loadingPriceLists"
              @change="handlePriceListChange"
            >
              <option value="">
                {{ loadingPriceLists ? 'Cargando listas...' : 'Seleccione una lista de precios' }}
              </option>
              <option v-for="priceList in priceLists" :key="priceList.uuid" :value="priceList.uuid">
                {{ priceList.code }} - {{ priceList.name }}
              </option>
            </select>
            <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Las reglas mostradas pertenecen únicamente a la lista seleccionada.
            </p>
          </div>

          <!-- CREATE -->
          <div class="flex items-end">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
              :disabled="!selectedPriceListUuid || store.loading"
              @click="openCreateModal"
            >
              <Plus class="mr-1.5 h-4 w-4" />
              Nueva regla
            </button>
          </div>
        </div>

        <!-- SELECTED PRICE LIST SUMMARY -->
        <div
          v-if="selectedPriceList"
          class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50"
        >
          <div>
            <span class="text-slate-500 dark:text-slate-400">Lista:</span>
            <span class="ml-1 font-medium text-slate-900 dark:text-white">
              {{ selectedPriceList.name }}
            </span>
          </div>
          <div v-if="selectedPriceList.code">
            <span class="text-slate-500 dark:text-slate-400">Código:</span>
            <span class="ml-1 font-mono text-slate-700 dark:text-slate-300">
              {{ selectedPriceList.code }}
            </span>
          </div>
          <div v-if="selectedPriceList.currency">
            <span class="text-slate-500 dark:text-slate-400">Moneda:</span>
            <span class="ml-1 font-medium text-slate-700 dark:text-slate-300">
              {{ selectedPriceList.currency.code }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- ERROR -->
    <!-- ============================================================ -->

    <div
      v-if="store.error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
    >
      {{ store.error }}
    </div>

    <!-- ============================================================ -->
    <!-- NO PRICE LIST -->
    <!-- ============================================================ -->

    <div
      v-if="!selectedPriceListUuid"
      class="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900"
    >
      <div class="text-sm font-medium text-slate-700 dark:text-slate-300">
        Seleccione una lista de precios
      </div>
      <p class="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Una vez seleccionada se mostrarán sus reglas comerciales.
      </p>
    </div>

    <!-- ============================================================ -->
    <!-- TABLE -->
    <!-- ============================================================ -->

    <PriceListItemTable
      v-else
      :items="store.items"
      :loading="store.loading"
      @create="openCreateModal"
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <!-- ============================================================ -->
    <!-- MODAL -->
    <!-- ============================================================ -->

    <PriceListItemFormModal
      v-if="showModal"
      :key="selectedItem?.id ?? 'new'"
      :item="selectedItem"
      :price-list="selectedPriceList"
      :services="services"
      :variants="variants"
      :base-price="basePrice"
      :loading-variants="loadingVariants"
      :loading-base-price="loadingBasePrice"
      :saving="store.saving"
      @service-change="handleServiceChange"
      @variant-change="handleVariantChange"
      @save="handleSave"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import PriceListItemTable from '../components/PriceListItemTable.vue'

import PriceListItemFormModal from '../components/PriceListItemFormModal.vue'

import { usePriceListItemStore } from '../stores/price-list-item.store'

import PriceListService from '@/modules/catalog/service/price-list.service'

import ServiceService from '@/modules/catalog/services/services/service.service'

import ServiceVariantService from '@/modules/catalog/services/services/service-variant.service'

import BasePriceService from '@/modules/pricing/base-prices/services/base-price.service'

import { Plus } from 'lucide-vue-next'

/*
|--------------------------------------------------------------------------
| STORE
|--------------------------------------------------------------------------
*/

const store = usePriceListItemStore()

/*
|--------------------------------------------------------------------------
| PRICE LIST
|--------------------------------------------------------------------------
*/

const priceLists = ref([])

const selectedPriceListUuid = ref('')

const loadingPriceLists = ref(false)

const selectedPriceList = computed(() => {
  if (!selectedPriceListUuid.value) {
    return null
  }

  return priceLists.value.find((item) => item.uuid === selectedPriceListUuid.value) ?? null
})

/*
|--------------------------------------------------------------------------
| SERVICES
|--------------------------------------------------------------------------
*/

const services = ref([])

/*
|--------------------------------------------------------------------------
| VARIANTS
|--------------------------------------------------------------------------
*/

const variants = ref([])

const loadingVariants = ref(false)

/*
|--------------------------------------------------------------------------
| BASE PRICE
|--------------------------------------------------------------------------
*/

const basePrice = ref(null)

const loadingBasePrice = ref(false)

/*
|--------------------------------------------------------------------------
| MODAL
|--------------------------------------------------------------------------
*/

const showModal = ref(false)

const selectedItem = ref(null)

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  try {
    await Promise.all([loadPriceLists(), loadServices()])
  } catch (error) {
    console.error('Error inicializando reglas de precios:', error)
  }
})

/*
|--------------------------------------------------------------------------
| LOAD PRICE LISTS
|--------------------------------------------------------------------------
*/

async function loadPriceLists() {
  loadingPriceLists.value = true

  try {
    const response = await PriceListService.getAll({
      active: 1,
      per_page: 100,
    })

    priceLists.value = response.data.data ?? []
  } catch (error) {
    console.error('Error cargando listas de precios:', error)

    throw error
  } finally {
    loadingPriceLists.value = false
  }
}

/*
|--------------------------------------------------------------------------
| LOAD SERVICES
|--------------------------------------------------------------------------
*/

async function loadServices() {
  try {
    const response = await ServiceService.getAll({
      active: 1,
      per_page: 100,
    })

    services.value = response.data.data ?? []
  } catch (error) {
    console.error('Error cargando servicios:', error)

    throw error
  }
}

/*
|--------------------------------------------------------------------------
| PRICE LIST CHANGE
|--------------------------------------------------------------------------
*/

async function handlePriceListChange() {
  /*
  |--------------------------------------------------------------------------
  | Cerrar modal si estaba abierto.
  |--------------------------------------------------------------------------
  */

  closeModal()

  /*
  |--------------------------------------------------------------------------
  | Limpiar store anterior.
  |--------------------------------------------------------------------------
  */

  store.setPriceList(selectedPriceListUuid.value)

  if (!selectedPriceListUuid.value) {
    return
  }

  /*
  |--------------------------------------------------------------------------
  | Cargar reglas de esta PriceList.
  |--------------------------------------------------------------------------
  */

  try {
    await store.fetchItems()
  } catch (error) {
    console.error('Error cargando reglas de la lista:', error)
  }
}

/*
|--------------------------------------------------------------------------
| SERVICE CHANGE
|--------------------------------------------------------------------------
*/

async function handleServiceChange(serviceUuid) {
  /*
  |--------------------------------------------------------------------------
  | Reset dependencias
  |--------------------------------------------------------------------------
  */

  variants.value = []

  basePrice.value = null

  if (!serviceUuid) {
    return
  }

  loadingVariants.value = true

  try {
    const response = await ServiceVariantService.getByService(serviceUuid)

    variants.value = response.data.data ?? []
  } catch (error) {
    console.error('Error cargando variantes:', error)
  } finally {
    loadingVariants.value = false
  }
}

/*
|--------------------------------------------------------------------------
| VARIANT CHANGE
|--------------------------------------------------------------------------
*/

async function handleVariantChange(variantId) {
  basePrice.value = null

  if (!variantId) {
    return
  }

  loadingBasePrice.value = true

  try {
    /*
    |--------------------------------------------------------------------------
    | BasePrice
    |--------------------------------------------------------------------------
    |
    | Actualmente tu BasePrice es único por variante/moneda
    | y todavía no maneja vigencias.
    |
    */

    const response = await BasePriceService.getAll({
      service_variant_id: variantId,

      active: 1,

      per_page: 1,
    })

    basePrice.value = response.data.data?.[0] ?? null
  } catch (error) {
    console.error('Error cargando precio base:', error)
  } finally {
    loadingBasePrice.value = false
  }
}

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

function openCreateModal() {
  if (!selectedPriceList.value) {
    return
  }

  selectedItem.value = null

  variants.value = []

  basePrice.value = null

  showModal.value = true
}

/*
|--------------------------------------------------------------------------
| EDIT
|--------------------------------------------------------------------------
*/

async function openEditModal(item) {
  if (!selectedPriceList.value) {
    return
  }

  selectedItem.value = item

  variants.value = []

  basePrice.value = null

  /*
  |--------------------------------------------------------------------------
  | Recuperar contexto del item
  |--------------------------------------------------------------------------
  */

  const serviceUuid = item.service_variant?.service?.uuid ?? null

  const variantId = item.service_variant_id ?? item.service_variant?.id ?? null

  /*
  |--------------------------------------------------------------------------
  | Primero cargar variantes
  |--------------------------------------------------------------------------
  */

  if (serviceUuid) {
    await handleServiceChange(serviceUuid)
  }

  /*
  |--------------------------------------------------------------------------
  | Luego cargar BasePrice
  |--------------------------------------------------------------------------
  */

  if (variantId) {
    await handleVariantChange(variantId)
  }

  /*
  |--------------------------------------------------------------------------
  | Finalmente abrir modal
  |--------------------------------------------------------------------------
  */

  showModal.value = true
}

/*
|--------------------------------------------------------------------------
| CLOSE MODAL
|--------------------------------------------------------------------------
*/

function closeModal() {
  showModal.value = false

  selectedItem.value = null

  variants.value = []

  basePrice.value = null

  loadingVariants.value = false

  loadingBasePrice.value = false
}

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

async function handleSave(payload) {
  /*
  |--------------------------------------------------------------------------
  | El payload YA NO contiene PriceList.
  |--------------------------------------------------------------------------
  |
  | Ejemplo:
  |
  | {
  |   service_variant_id: 10,
  |   adjustment_type: 'PERCENT',
  |   adjustment_value: -10,
  |   active: true
  | }
  |
  | El store conoce currentPriceListUuid.
  |
  */

  try {
    if (selectedItem.value?.id) {
      /*
      |--------------------------------------------------------------------------
      | UPDATE
      |--------------------------------------------------------------------------
      */

      await store.updateItem(selectedItem.value.id, payload)
    } else {
      /*
      |--------------------------------------------------------------------------
      | CREATE
      |--------------------------------------------------------------------------
      */

      await store.createItem(payload)
    }

    /*
    |--------------------------------------------------------------------------
    | Recargar listado desde backend
    |--------------------------------------------------------------------------
    |
    | Esto asegura que recibimos las relaciones completas:
    |
    | priceList
    | serviceVariant.service
    | serviceVariant.basePrice.currency
    |
    */

    await store.fetchItems()

    closeModal()
  } catch (error) {
    console.error('Error guardando regla comercial:', error)
  }
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

async function handleDelete(item) {
  if (!item?.id) {
    return
  }

  try {
    await store.deleteItem(item.id)
  } catch (error) {
    console.error('Error eliminando regla:', error)
  }
}
</script>
