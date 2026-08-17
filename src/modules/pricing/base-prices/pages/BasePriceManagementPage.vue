<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <!-- ============================================================
         HEADER
    ============================================================= -->

    <div>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Precios base</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Administra los costos y precios base de las variantes de servicios.
      </p>
    </div>

    <!-- ============================================================
         ERROR
    ============================================================= -->

    <div
      v-if="store.error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
    >
      {{ store.error }}
    </div>

    <!-- ============================================================
         TABLE
    ============================================================= -->

    <BasePriceTable
      :items="store.items"
      :loading="store.loading"
      @create="openCreateModal"
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <!-- ============================================================
         MODAL
    ============================================================= -->

    <BasePriceFormModal
      v-if="showModal"
      :item="selectedItem"
      :services="services"
      :variants="variants"
      :currencies="currencies"
      :loading-variants="loadingVariants"
      :saving="store.saving"
      @service-change="handleServiceChange"
      @save="handleSave"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import BasePriceTable from '../components/BasePriceTable.vue'

import BasePriceFormModal from '../components/BasePriceFormModal.vue'

import { useBasePriceStore } from '../stores/base-price.store'

import ServiceService from '@/modules/catalog/services/services/service.service'

import ServiceVariantService from '@/modules/catalog/services/services/service-variant.service'

import CurrencyService from '@/modules/catalog/service/currency.service'

/*
|--------------------------------------------------------------------------
| STORE
|--------------------------------------------------------------------------
*/

const store = useBasePriceStore()

/*
|--------------------------------------------------------------------------
| MODAL
|--------------------------------------------------------------------------
*/

const showModal = ref(false)

const selectedItem = ref(null)

/*
|--------------------------------------------------------------------------
| CATALOG DATA
|--------------------------------------------------------------------------
*/

const services = ref([])

const variants = ref([])

const currencies = ref([])

const loadingVariants = ref(false)

/*
|--------------------------------------------------------------------------
| INITIALIZATION
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  try {
    await Promise.all([loadBasePrices(), loadServices(), loadCurrencies()])
  } catch (error) {
    console.error('Error inicializando precios base:', error)
  }
})

/*
|--------------------------------------------------------------------------
| BASE PRICES
|--------------------------------------------------------------------------
*/

async function loadBasePrices() {
  await store.fetchBasePrices()
}

/*
|--------------------------------------------------------------------------
| SERVICES
|--------------------------------------------------------------------------
*/

async function loadServices() {
  const response = await ServiceService.getAll({
    active: 1,
    per_page: 100,
  })

  services.value = response.data.data ?? []
}

/*
|--------------------------------------------------------------------------
| CURRENCIES
|--------------------------------------------------------------------------
*/

async function loadCurrencies() {
  const response = await CurrencyService.getAll({
    active: 1,
  })

  currencies.value = response.data.data ?? []
}

/*
|--------------------------------------------------------------------------
| SERVICE VARIANTS
|--------------------------------------------------------------------------
*/

async function handleServiceChange(serviceUuid) {
  variants.value = []

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
| CREATE
|--------------------------------------------------------------------------
*/

function openCreateModal() {
  selectedItem.value = null

  variants.value = []

  showModal.value = true
}

/*
|--------------------------------------------------------------------------
| EDIT
|--------------------------------------------------------------------------
*/

async function openEditModal(item) {
  selectedItem.value = item

  variants.value = []

  const serviceUuid = item.service_variant?.service?.uuid ?? item.service?.uuid ?? null

  /*
  |--------------------------------------------------------------------------
  | Primero cargamos las variantes.
  |--------------------------------------------------------------------------
  */

  if (serviceUuid) {
    await handleServiceChange(serviceUuid)
  }

  showModal.value = true
}

/*
|--------------------------------------------------------------------------
| CLOSE
|--------------------------------------------------------------------------
*/

function closeModal() {
  showModal.value = false

  selectedItem.value = null

  variants.value = []
}

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

async function handleSave(payload) {
  try {
    if (selectedItem.value?.id) {
      /*
      |--------------------------------------------------------------------------
      | UPDATE
      |--------------------------------------------------------------------------
      */

      await store.updateBasePrice(selectedItem.value.id, payload)
    } else {
      /*
      |--------------------------------------------------------------------------
      | CREATE
      |--------------------------------------------------------------------------
      */

      await store.createBasePrice(payload)
    }

    /*
    |--------------------------------------------------------------------------
    | Recargar para obtener las relaciones completas del Resource
    |--------------------------------------------------------------------------
    */

    await store.fetchBasePrices()

    closeModal()
  } catch (error) {
    console.error('Error guardando precio base:', error)
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
    await store.deleteBasePrice(item.id)
  } catch (error) {
    console.error('Error eliminando precio base:', error)
  }
}
</script>
