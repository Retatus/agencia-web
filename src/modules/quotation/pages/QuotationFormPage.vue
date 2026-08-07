<template>
  <div class="container-fluid">
    <!-- ================================================= -->
    <!-- HEADER                                            -->
    <!-- ================================================= -->

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">
          {{ pageTitle }}
        </h2>

        <small class="text-muted"> Gestión de Cotizaciones </small>
      </div>

      <div class="d-flex gap-2">
        <router-link
          :to="{ name: 'quotations.index' }"
          class="btn btn-outline-secondary"
        >
          Volver
        </router-link>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- FORM                                              -->
    <!-- ================================================= -->

    <form @submit.prevent="save">
      <!-- ================================================= -->
      <!-- DATOS GENERALES                                  -->
      <!-- ================================================= -->

      <QuotationHeader
        :quotation="store.quotation"
        :customers="customersAux"
        :currencies="currenciesAux"
        :statuses="statusesAux"
        :price-lists="priceListsAux"
      />

      <!-- ================================================= -->
      <!-- ITINERARIO                                        -->
      <!-- ================================================= -->

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

      <!-- ================================================= -->
      <!-- TOTALES                                          -->
      <!-- ================================================= -->

      <QuotationTotals :quotation="store.quotation" />

      <!-- ================================================= -->
      <!-- PASAJEROS                                        -->
      <!-- ================================================= -->

      <QuotationPassengerManager
        :passengers="store.quotation.passengers"
        :passenger-types="passengerTypesAux"
        @add-passenger="openPassengerModal"
      />

      <!-- ================================================= -->
      <!-- ACCIONES                                          -->
      <!-- ================================================= -->

      <QuotationActions
        :loading="store.saving"
        @save="save"
        @cancel="cancel"
        @duplicate="duplicateQuotation"
        @print="printQuotation"
        @email="sendQuotation"
      />

      <!-- ================================================= -->
      <!-- MODAL SERVICIO CATALOGO                           -->
      <!-- ================================================= -->

      <ServiceSelectorModal
        v-if="showServiceModal"
        :item="editingItem"
        :price-list-id="store.quotation.price_list_id"
        :passengers="store.quotation.passengers"
        @close="closeServiceModal"
        @save="handleItemSave"
      />

      <!-- ================================================= -->
      <!-- MODAL CUSTOM                                      -->
      <!-- ================================================= -->

      <CustomItemModal
        v-if="showCustomModal"
        :item="editingItem"
        @close="closeCustomModal"
        @save="handleItemSave"
      />
    </form>
  </div>
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
