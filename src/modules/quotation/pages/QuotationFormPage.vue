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

    <form
      class="space-y-7"
      @submit.prevent="save"
    >
      <!-- Datos generales -->
      <fieldset class="space-y-5">
        <legend class="text-sm font-semibold text-slate-900 dark:text-white">
          Datos Generales
        </legend>

        <QuotationHeader
          :quotation="store.quotation"
          :customers="customersAux"
          :currencies="currenciesAux"
          :statuses="statusesAux"
          :price-lists="priceListsAux"
        />
      </fieldset>

      <!-- Itinerario -->
      <fieldset class="space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800">
        <legend class="px-1 text-sm font-semibold text-slate-900 dark:text-white">
          Itinerario
        </legend>

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

      <!-- Pasajeros y Totales -->
      <fieldset class="space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800">
        <legend class="px-1 text-sm font-semibold text-slate-900 dark:text-white">
          Pasajeros y Totales
        </legend>

        <div class="grid gap-6 xl:grid-cols-12">
          <!-- Pasajeros -->
          <div class="xl:col-span-7">
            <QuotationPassengerManager
              :passengers="store.quotation.passengers"
              :passenger-types="passengerTypesAux"
              @add-passenger="openPassengerModal"
            />
          </div>

          <!-- Totales -->
          <div class="xl:col-span-5">
            <QuotationTotals :quotation="store.quotation" />
          </div>
        </div>
      </fieldset>

      <!-- Acciones -->
      <div
        class="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end"
      >
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="cancel"
        >
          Cancelar
        </button>

        <button
          type="button"
          class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="duplicateQuotation"
        >
          Duplicar
        </button>

        <button
          type="button"
          class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="printQuotation"
        >
          Imprimir
        </button>

        <button
          type="button"
          class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="sendQuotation"
        >
          Enviar Email
        </button>

        <button
          type="submit"
          class="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          :disabled="store.saving"
        >
          {{ store.saving ? 'Guardando...' : 'Guardar Cotización' }}
        </button>
      </div>
    </form>

    <!-- ============================================================
         MODALES
    ============================================================= -->

    <ServiceSelectorModal
      v-if="showServiceModal"
      :item="editingItem"
      :price-list-id="store.quotation.price_list_id"
      :passengers="store.quotation.passengers"
      @close="closeServiceModal"
      @save="handleItemSave"
    />

    <CustomItemModal
      v-if="showCustomModal"
      :item="editingItem"
      @close="closeCustomModal"
      @save="handleItemSave"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

/*
|--------------------------------------------------------------------------
| STORES
|--------------------------------------------------------------------------
*/

import { useQuotationStore } from '../stores/quotation.store'

import { useQuotationCalculationStore } from '../stores/quotation-calculation.store'

/*
|--------------------------------------------------------------------------
| COMPONENTS
|--------------------------------------------------------------------------
*/

import QuotationHeader from '../components/QuotationHeader.vue'

import QuotationItineraryManager from '../components/QuotationItineraryManager.vue'

import QuotationTotals from '../components/QuotationTotals.vue'

import QuotationActions from '../components/QuotationActions.vue'

import QuotationPassengerManager from '../components/QuotationPassengerManager.vue'

import ServiceSelectorModal from '../components/ServiceSelectorModal.vue'

import CustomItemModal from '../components/CustomItemModal.vue'

/*
|--------------------------------------------------------------------------
| MOCKS
|--------------------------------------------------------------------------
|
| Solo para pruebas.
|
*/

import mockPassengers from '../mocks/passengers.mock.json'

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

const calculationStore = useQuotationCalculationStore()

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Item o grupo actualmente en edición.
|--------------------------------------------------------------------------
|
| Puede contener:
|
| ITEM NORMAL
|
| {
|   id,
|   uuid,
|   service_id,
|   ...
| }
|
| GRUPO
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

/*
|--------------------------------------------------------------------------
| COMPUTED
|--------------------------------------------------------------------------
*/

const isEdit = computed(() => {
  return !!route.params.uuid
})

const pageTitle = computed(() => {
  return isEdit.value ? 'Editar Cotización' : 'Nueva Cotización'
})

/*
|--------------------------------------------------------------------------
| AUXILIARY DATA
|--------------------------------------------------------------------------
*/

const priceListsAux = [
  {
    id: 1,
    name: 'publico general',
  },
  {
    id: 2,
    name: 'agencia mayorista',
  },
  {
    id: 3,
    name: 'cooperativa',
  },
  {
    id: 4,
    name: 'black friday',
  },
]

const customersAux = [
  {
    id: 1,
    first_name: 'Cliente 1',
    last_name: 'Apellido 1',
  },
  {
    id: 2,
    first_name: 'Cliente 2',
    last_name: 'Apellido 2',
  },
  {
    id: 3,
    first_name: 'Cliente 3',
    last_name: 'Apellido 3',
  },
]

const currenciesAux = [
  {
    id: 1,
    code: 'USD',
  },
  {
    id: 2,
    code: 'EUR',
  },
  {
    id: 3,
    code: 'MXN',
  },
]

const statusesAux = [
  {
    id: 1,
    name: 'Draft',
  },
  {
    id: 2,
    name: 'Pending',
  },
  {
    id: 3,
    name: 'Sent',
  },
  {
    id: 4,
    name: 'Approved',
  },
  {
    id: 5,
    name: 'Rejected',
  },
  {
    id: 6,
    name: 'Expired',
  },
  {
    id: 7,
    name: 'Confirmed',
  },
  {
    id: 8,
    name: 'Cancelled',
  },
]

const passengerTypesAux = [
  {
    id: 1,
    code: 'ADT',
    name: 'Adulto',
  },
  {
    id: 2,
    code: 'CHD',
    name: 'Niño',
  },
  {
    id: 3,
    code: 'STD',
    name: 'Estudiante',
  },
  {
    id: 4,
    code: 'INF',
    name: 'Infante',
  },
]

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  /*
  |--------------------------------------------------------------------------
  | EDITAR
  |--------------------------------------------------------------------------
  */

  if (isEdit.value) {
    await store.load(route.params.uuid)
  } else {
    /*
    |--------------------------------------------------------------------------
    | NUEVO
    |--------------------------------------------------------------------------
    */

    store.newQuotation()
  }

  /*
  |--------------------------------------------------------------------------
  | PASAJEROS MOCK
  |--------------------------------------------------------------------------
  |
  | SOLO PARA PRUEBAS.
  |
  | Importante:
  |
  | se ejecuta DESPUÉS de load().
  |
  */

  if (!store.quotation.passengers?.length) {
    store.quotation.passengers = JSON.parse(JSON.stringify(mockPassengers))
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
    | Opcional
    |--------------------------------------------------------------------------
    |
    | Puedes redirigir después de guardar.
    |
    */

    // router.push({
    //   name: 'quotations',
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
    name: 'quotations',
  })
}

/*
|--------------------------------------------------------------------------
| DUPLICATE QUOTATION
|--------------------------------------------------------------------------
*/

function duplicateQuotation() {
  store.duplicate()

  router.push({
    name: 'quotations.create',
  })
}

/*
|--------------------------------------------------------------------------
| PRINT
|--------------------------------------------------------------------------
*/

function printQuotation() {
  console.log('PDF')
}

/*
|--------------------------------------------------------------------------
| EMAIL
|--------------------------------------------------------------------------
*/

function sendQuotation() {
  console.log('Email')
}

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| CUSTOM ITEM
|--------------------------------------------------------------------------
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
|--------------------------------------------------------------------------
| CATALOG ITEM
|--------------------------------------------------------------------------
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
|--------------------------------------------------------------------------
| EDIT ITEM / GROUP
|--------------------------------------------------------------------------
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
  | recuperamos TODAS las filas reales.
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
    | El modal recibe el agregado lógico.
    |--------------------------------------------------------------------------
    */

    editingItem.value = {
      type: 'group',

      group_uuid: item.group_uuid,

      calculation_type: item.calculation_type,

      items: JSON.parse(JSON.stringify(groupItems)),
    }

    /*
    |--------------------------------------------------------------------------
    | Los grupos actuales son de catálogo:
    | accommodation / transport.
    |--------------------------------------------------------------------------
    */

    showServiceModal.value = true

    return
  }

  /*
  |--------------------------------------------------------------------------
  | ITEM NORMAL
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

  /*
  |--------------------------------------------------------------------------
  | Tipo desconocido
  |--------------------------------------------------------------------------
  */

  console.warn('Tipo de item no soportado para edición:', item.item_type)
}

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| HANDLE ITEM SAVE
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
|
| El modal puede devolver:
|
| 1. QuotationItem normal
|
| {
|   uuid,
|   service_variant_id,
|   ...
| }
|
| 2. Grupo
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
  console.log('handleItemSave:', payload)

  if (!payload) {
    return
  }

  /*
  |--------------------------------------------------------------------------
  | GROUP
  |--------------------------------------------------------------------------
  */

  if (payload.type === 'group') {
    /*
    |--------------------------------------------------------------------------
    | EDITAR GRUPO
    |--------------------------------------------------------------------------
    */

    if (editingItem.value?.group_uuid) {
      store.updateItemGroup(payload)
    } else {
      /*
      |--------------------------------------------------------------------------
      | CREAR GRUPO
      |--------------------------------------------------------------------------
      */

      store.addItemGroup(payload)
    }

    closeItemModal()

    return
  }

  /*
  |--------------------------------------------------------------------------
  | ITEM NORMAL
  |--------------------------------------------------------------------------
  */

  /*
  |--------------------------------------------------------------------------
  | EDITAR
  |--------------------------------------------------------------------------
  */

  if (editingItem.value?.uuid) {
    store.updateItem(editingItem.value.uuid, payload)
  } else {
    /*
    |--------------------------------------------------------------------------
    | CREAR
    |--------------------------------------------------------------------------
    */

    store.addItem(payload)
  }

  closeItemModal()
}

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| REMOVE ITEM / GROUP
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
*/

function removeItem(item) {
  if (!item) {
    return
  }

  /*
  |--------------------------------------------------------------------------
  | GROUP
  |--------------------------------------------------------------------------
  */

  if (item.group_uuid) {
    store.removeItemGroup(item.group_uuid)

    return
  }

  /*
  |--------------------------------------------------------------------------
  | NORMAL
  |--------------------------------------------------------------------------
  */

  store.removeItem(item.uuid)
}

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| DUPLICATE ITEM / GROUP
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
*/

function duplicateItem(item) {
  if (!item) {
    return
  }

  /*
  |--------------------------------------------------------------------------
  | GROUP
  |--------------------------------------------------------------------------
  */

  if (item.group_uuid) {
    store.duplicateItemGroup(item.group_uuid)

    return
  }

  /*
  |--------------------------------------------------------------------------
  | NORMAL
  |--------------------------------------------------------------------------
  */

  store.duplicateItem(item.uuid)
}

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| CLOSE ITEM MODAL
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
*/

function closeItemModal() {
  editingItem.value = null

  showCustomModal.value = false

  showServiceModal.value = false
}

/*
|--------------------------------------------------------------------------
| CLOSE CUSTOM MODAL
|--------------------------------------------------------------------------
*/

function closeCustomModal() {
  closeItemModal()
}

/*
|--------------------------------------------------------------------------
| CLOSE SERVICE MODAL
|--------------------------------------------------------------------------
*/

function closeServiceModal() {
  closeItemModal()
}

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| PASSENGER MODAL
|--------------------------------------------------------------------------
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
|--------------------------------------------------------------------------
| TEST CALCULATION
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
|
| Temporal.
|
| Puedes eliminar esta función cuando terminemos
| la integración del motor.
|
*/

async function testCalculation() {
  try {
    /*
    |--------------------------------------------------------------------------
    | Ejemplo simple
    |--------------------------------------------------------------------------
    */

    const payload = {
      itineraries: [
        {
          day_number: 1,

          items: [
            {
              name: 'Hotel Demo',

              calculation_type: 'accommodation',

              duration: 2,

              passengers: store.quotation.passengers,

              room_types: [
                {
                  id: 1,

                  name: 'Simple',

                  min_capacity: 1,

                  max_capacity: 1,

                  unit_cost: 60,

                  unit_price: 80,
                },

                {
                  id: 2,

                  name: 'Doble',

                  min_capacity: 1,

                  max_capacity: 2,

                  unit_cost: 90,

                  unit_price: 120,
                },

                {
                  id: 3,

                  name: 'Triple',

                  min_capacity: 1,

                  max_capacity: 3,

                  unit_cost: 160,

                  unit_price: 200,
                },
              ],
            },
          ],
        },
      ],
    }

    const result = await calculationStore.calculate(payload)

    console.log('Calculation result:', result)
  } catch (error) {
    console.error('Error probando cálculo:', error)
  }
}
</script>
