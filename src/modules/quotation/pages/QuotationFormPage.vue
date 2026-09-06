<template>
  <section class="mx-auto max-w-[1600px]">
    <!-- ============================================================
         ENCABEZADO
    ============================================================= -->

    <div class="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div class="min-w-0">
        <div class="mb-2 flex flex-wrap items-center gap-2">
          <span
            class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
            :class="
              isEdit
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                : 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
            "
          >
            {{ isEdit ? 'Edición' : 'Nueva' }}
          </span>

          <span
            v-if="store.quotation.code"
            class="text-sm font-medium text-slate-500 dark:text-slate-400"
          >
            {{ store.quotation.code }}
          </span>
        </div>

        <h2 class="truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {{ pageTitle }}
        </h2>

        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Administra los datos generales, itinerarios, pasajeros y totales de la cotización.
        </p>
      </div>

      <router-link
        :to="{ name: 'quotations' }"
        class="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Volver al listado
      </router-link>
    </div>

    <!-- Indicador de guardado -->

    <div
      v-if="store.saving"
      class="mb-5 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"
    >
      <span
        class="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-300"
      />

      Guardando cotización...
    </div>

    <!-- ============================================================
         FORMULARIO
    ============================================================= -->

    <form class="min-w-0 space-y-7" @submit.prevent="save">
      <!-- Datos generales -->
      <fieldset class="min-w-0 space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800">
        <QuotationHeader
          :quotation="store.quotation"
          :customers="customers"
          :currencies="currencies"
          :statuses="statuses"
          :price-lists="priceLists"
          @create-customer="openCustomerModal"
        />
      </fieldset>

      <!-- Pasajeros -->
      <fieldset class="min-w-0 space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800">
        <QuotationPassengerManager
          :passengers="store.quotation.passengers"
          :passenger-types="passengerTypes"
          @add-passenger="openPassengerModal"
          @edit-passenger="openPassengerModal"
        />
      </fieldset>

      <!-- Itinerario -->
      <fieldset class="min-w-0 space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800">
        <QuotationItineraryManager
          :itineraries="store.quotation.itineraries"
          :selected-itinerary="store.selectedItinerary"
          @add-itinerary="store.addItinerary"
          @select-itinerary="store.selectItinerary"
          @duplicate-itinerary="store.duplicateItinerary"
          @remove-itinerary="store.removeItinerary"
          @move-itinerary-up="store.moveItineraryUp"
          @move-itinerary-down="store.moveItineraryDown"
          @add-service="openCatalogModal"
          @add-custom-item="openCustomModal"
          @edit-item="editItem"
          @duplicate-item="duplicateItem"
          @remove-item="removeItem"
        />
      </fieldset>
      <!-- Totales y Acciones -->
      <div
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
          <h3 class="font-semibold text-slate-900 dark:text-white">Totales y Acciones</h3>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Resumen de la cotización y acciones disponibles.
          </p>
        </div>

        <div class="p-5 sm:p-6">
          <div class="grid gap-6 lg:grid-cols-12">
            <!-- Totales -->
            <div class="lg:col-span-7">
              <QuotationTotals :quotation="store.quotation" />
            </div>

            <!-- Acciones -->
            <div class="lg:col-span-5">
              <div
                class="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                  <h4 class="text-sm font-semibold text-slate-900 dark:text-white">
                    Acciones de la cotización
                  </h4>
                </div>
                <div class="p-4 space-y-3">
                  <!-- Botones de acción -->
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      @click="duplicateQuotation"
                    >
                      <Copy class="mr-1.5 h-4 w-4" />
                      Duplicar
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      @click="printQuotation"
                    >
                      <Printer class="mr-1.5 h-4 w-4" />
                      Imprimir
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      @click="sendQuotation"
                    >
                      <Mail class="mr-1.5 h-4 w-4" />
                      Enviar Email
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      @click="exportPDF"
                    >
                      <FileText class="mr-1.5 h-4 w-4" />
                      PDF
                    </button>
                  </div>

                  <!-- Separador -->
                  <div class="border-t border-slate-200 dark:border-slate-700"></div>

                  <!-- Botones Guardar y Cancelar en una sola fila -->
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      @click="cancel"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="store.saving"
                    >
                      <Save class="mr-1.5 h-4 w-4" />
                      {{ store.saving ? 'Guardando...' : 'Guardar' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- ============================================================
         MODALES
    ============================================================= -->

    <ServiceSelectorModal
      v-if="showServiceModal"
      :item="editingItem"
      :currency-id="store.quotation.currency_id"
      :travel-date="store.quotation.travel_date"
      :itinerary-day-number="store.selectedItinerary?.day_number"
      :itinerary-travel-date="store.selectedItinerary?.travel_date"
      :passengers="store.quotation.passengers"
      :price-list-id="store.quotation.commercial_policy_id"
      @close="closeServiceModal"
      @save="handleItemSave"
    />

    <CustomItemModal
      v-if="showCustomModal"
      :item="editingItem"
      @close="closeCustomModal"
      @save="handleItemSave"
    />

    <CustomerQuickCreateModal
      v-if="showCustomerModal"
      :saving="customerStore.saving"
      @close="closeCustomerModal"
      @save="handleCustomerSave"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Copy, Printer, Mail, FileText, Save } from 'lucide-vue-next'

import { useQuotationStore } from '../stores/quotation.store'

import QuotationHeader from '../components/QuotationHeader.vue'
import QuotationItineraryManager from '../components/QuotationItineraryManager.vue'
import QuotationTotals from '../components/QuotationTotals.vue'
import QuotationActions from '../components/QuotationActions.vue'
import QuotationPassengerManager from '../components/QuotationPassengerManager.vue'
import ServiceSelectorModal from '../components/ServiceSelectorModal.vue'
import CustomItemModal from '../components/CustomItemModal.vue'

import CustomerQuickCreateModal from '../../crm/components/CustomerQuickCreateModal.vue'
import { useCustomerStore } from '../../crm/stores/customer.store'

import CurrencyService from '@/modules/catalog/service/currency.service'
import PassengerTypeService from '@/modules/catalog/service/passenger-type.service'
import QuotationStatusService from '@/modules/catalog/service/quotation-status.service'
import PriceListService from '@/modules/pricing/services/price-list.service'

/*
|--------------------------------------------------------------------------
| ROUTER
|--------------------------------------------------------------------------
*/

const route = useRoute()

const router = useRouter()

/*
|--------------------------------------------------------------------------
| STORES
|--------------------------------------------------------------------------
*/

const store = useQuotationStore()

const customerStore = useCustomerStore()

/*
|--------------------------------------------------------------------------
| ITEM EN EDICIÓN
|--------------------------------------------------------------------------
|
| Puede representar un ítem individual:
|
| {
|   id,
|   uuid,
|   service_id,
|   ...
| }
|
| O un grupo:
|
| {
|   type: 'group',
|   group_uuid,
|   calculation_type,
|   items: [...]
| }
|
*/

const editingItem = ref(null)

/*
|--------------------------------------------------------------------------
| MODALES
|--------------------------------------------------------------------------
*/

const showCustomModal = ref(false)

const showServiceModal = ref(false)

const showPassengerModal = ref(false)

const showCustomerModal = ref(false)

/*
|--------------------------------------------------------------------------
| COMPUTED
|--------------------------------------------------------------------------
*/

const isEdit = computed(() => {
  return Boolean(route.params.uuid)
})

const pageTitle = computed(() => {
  return isEdit.value ? 'Editar Cotización' : 'Nueva Cotización'
})

/*
|--------------------------------------------------------------------------
| DATOS AUXILIARES
|--------------------------------------------------------------------------
*/

const customers = computed(() => {
  return customerStore.customers
})

const currencies = ref([])

const statuses = ref([])

const passengerTypes = ref([])

const priceLists = ref([])

const loadingCatalogs = ref(false)

/*
|--------------------------------------------------------------------------
| CUSTOMERS
|--------------------------------------------------------------------------
*/

async function loadCustomers() {
  await customerStore.fetchCustomers({
    active: 1,
    per_page: 100,
  })
}

/*
|--------------------------------------------------------------------------
| DATOS AUXILIARES
|--------------------------------------------------------------------------
|
| PriceList ya no forma parte de la cabecera de Quotation.
|
*/

async function loadAuxiliaryData() {
  loadingCatalogs.value = true

  try {
    const [currenciesResponse, statusesResponse, passengerTypesResponse, priceListsResponse] =
      await Promise.all([
        CurrencyService.getAll({
          active: 1,
        }),

        QuotationStatusService.getAll({
          active: 1,
        }),

        PassengerTypeService.getAll({
          active: 1,
        }),

        PriceListService.getAll({
          active: 1,
          per_page: 100,
        }),
      ])

    currencies.value = currenciesResponse.data.data ?? []

    statuses.value = statusesResponse.data.data ?? []

    passengerTypes.value = passengerTypesResponse.data.data ?? []

    priceLists.value = priceListsResponse.data.data ?? []
  } finally {
    loadingCatalogs.value = false
  }
}

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  try {
    await Promise.all([loadCustomers(), loadAuxiliaryData()])

    if (isEdit.value) {
      await store.load(route.params.uuid)
    } else {
      store.newQuotation()
    }
  } catch (error) {
    console.error('Error inicializando cotización:', error)
  }
})

/*
|--------------------------------------------------------------------------
| SAVE QUOTATION
|--------------------------------------------------------------------------
*/

async function save() {
  try {
    await store.save()

    /*
    |--------------------------------------------------------------------------
    | La redirección puede habilitarse cuando se defina
    | el nombre definitivo de la ruta de listado.
    |--------------------------------------------------------------------------
    */

    // router.push({
    //   name: 'quotations.index',
    // })
  } catch (error) {
    console.error('Error guardando cotización:', error)
  }
}

/*
|--------------------------------------------------------------------------
| CANCEL
|--------------------------------------------------------------------------
*/

function cancel() {
  router.push({
    name: 'quotations.index',
  })
}

/*
|--------------------------------------------------------------------------
| DUPLICATE
|--------------------------------------------------------------------------
*/

function duplicateQuotation() {
  store.duplicate()
}

/*
|--------------------------------------------------------------------------
| PRINT
|--------------------------------------------------------------------------
*/

function printQuotation() {
  window.print()
}

/*
|--------------------------------------------------------------------------
| SEND
|--------------------------------------------------------------------------
*/

function sendQuotation() {
  console.info('Envío de cotización pendiente de implementar.')
}

/*
|--------------------------------------------------------------------------
| CUSTOM ITEM
|--------------------------------------------------------------------------
*/

function openCustomModal() {
  if (!store.selectedItinerary) {
    alert('Seleccione un día del itinerario.')

    return
  }

  editingItem.value = null

  showCustomModal.value = true
}

/*
|--------------------------------------------------------------------------
| CATALOG ITEM
|--------------------------------------------------------------------------
*/

function openCatalogModal() {
  if (!store.selectedItinerary) {
    alert('Seleccione un día del itinerario.')

    return
  }

  editingItem.value = null

  showServiceModal.value = true
}

/*
|--------------------------------------------------------------------------
| EDIT ITEM / GROUP
|--------------------------------------------------------------------------
*/

function editItem(item) {
  if (!item) {
    return
  }

  /*
  |--------------------------------------------------------------------------
  | ITEM AGRUPADO
  |--------------------------------------------------------------------------
  |
  | Si la fila pertenece a un group_uuid,
  | recuperamos todas las filas reales del grupo.
  |
  */

  if (item.group_uuid) {
    const groupItems = store.findItemGroup(item.group_uuid)

    if (!groupItems.length) {
      console.warn('No se encontraron items para el grupo:', item.group_uuid)

      return
    }

    /*
    |--------------------------------------------------------------------------
    | El modal recibe el agregado lógico
    |--------------------------------------------------------------------------
    */

    editingItem.value = {
      type: 'group',

      group_uuid: item.group_uuid,

      calculation_type: item.calculation_type,

      items: JSON.parse(JSON.stringify(groupItems)),
    }

    showServiceModal.value = true

    return
  }

  /*
  |--------------------------------------------------------------------------
  | ITEM INDIVIDUAL
  |--------------------------------------------------------------------------
  */

  editingItem.value = JSON.parse(JSON.stringify(item))

  /*
  |--------------------------------------------------------------------------
  | CUSTOM
  |--------------------------------------------------------------------------
  */

  if (item.item_type === 'CUSTOM') {
    showCustomModal.value = true

    return
  }

  /*
  |--------------------------------------------------------------------------
  | CATALOG
  |--------------------------------------------------------------------------
  */

  if (item.item_type === 'CATALOG') {
    showServiceModal.value = true

    return
  }

  console.warn('Tipo de item no soportado para edición:', item.item_type)
}

/*
|--------------------------------------------------------------------------
| HANDLE ITEM SAVE
|--------------------------------------------------------------------------
|
| El modal puede devolver:
|
| 1. QuotationItem individual.
|
| {
|   uuid,
|   service_variant_id,
|   price_id,
|   ...
| }
|
| 2. Grupo de alojamiento o transporte.
|
| {
|   type: 'group',
|   group_uuid,
|   calculation_type,
|   items: [...]
| }
|
*/

function handleItemSave(payload) {
  if (!payload) {
    return
  }

  /*
  |--------------------------------------------------------------------------
  | GRUPO
  |--------------------------------------------------------------------------
  */

  if (payload.type === 'group') {
    /*
    |--------------------------------------------------------------------------
    | Editar grupo
    |--------------------------------------------------------------------------
    */

    if (editingItem.value?.group_uuid) {
      store.updateItemGroup(payload)
    } else {
      /*
      |--------------------------------------------------------------------------
      | Crear grupo
      |--------------------------------------------------------------------------
      */

      store.addItemGroup(payload)
    }

    closeItemModal()

    return
  }

  /*
  |--------------------------------------------------------------------------
  | ITEM INDIVIDUAL
  |--------------------------------------------------------------------------
  */

  if (editingItem.value?.uuid) {
    /*
    |--------------------------------------------------------------------------
    | Actualizar
    |--------------------------------------------------------------------------
    */

    store.updateItem(editingItem.value.uuid, payload)
  } else {
    /*
    |--------------------------------------------------------------------------
    | Crear
    |--------------------------------------------------------------------------
    */

    store.addItem(payload)
  }

  closeItemModal()
}

/*
|--------------------------------------------------------------------------
| REMOVE ITEM / GROUP
|--------------------------------------------------------------------------
*/

function removeItem(item) {
  if (!item) {
    return
  }

  if (item.group_uuid) {
    store.removeItemGroup(item.group_uuid)

    return
  }

  store.removeItem(item.uuid)
}

/*
|--------------------------------------------------------------------------
| DUPLICATE ITEM / GROUP
|--------------------------------------------------------------------------
*/

function duplicateItem(item) {
  if (!item) {
    return
  }

  if (item.group_uuid) {
    store.duplicateItemGroup(item.group_uuid)

    return
  }

  store.duplicateItem(item.uuid)
}

/*
|--------------------------------------------------------------------------
| CLOSE ITEM MODALS
|--------------------------------------------------------------------------
*/

function closeItemModal() {
  editingItem.value = null

  showCustomModal.value = false

  showServiceModal.value = false
}

function closeCustomModal() {
  closeItemModal()
}

function closeServiceModal() {
  closeItemModal()
}

/*
|--------------------------------------------------------------------------
| PASSENGER MODAL
|--------------------------------------------------------------------------
*/

function openPassengerModal() {
  showPassengerModal.value = true
}

function closePassengerModal() {
  showPassengerModal.value = false
}

/*
|--------------------------------------------------------------------------
| CUSTOMER MODAL
|--------------------------------------------------------------------------
*/

function openCustomerModal() {
  showCustomerModal.value = true
}

function closeCustomerModal() {
  showCustomerModal.value = false
}

async function handleCustomerSave(payload) {
  try {
    const customer = await customerStore.createCustomer(payload)

    /*
    |--------------------------------------------------------------------------
    | customerStore ya incorpora el cliente creado
    | a su colección reactiva.
    |--------------------------------------------------------------------------
    */

    store.quotation.customer_id = customer.id

    closeCustomerModal()
  } catch (error) {
    console.error('Error creando cliente:', error)
  }
}
</script>
