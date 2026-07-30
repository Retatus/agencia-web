<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">
          {{ pageTitle }}
        </h2>
        <small class="text-muted"> Gestión de Cotizaciones </small>
      </div>

      <router-link
        :to="{ name: 'quotations.index' }"
        class="btn btn-outline-secondary"
      >
        Volver
      </router-link>
    </div>

    <form @submit.prevent="save">
      <!-- ================================================= -->
      <!-- DATOS GENERALES                                  -->
      <!-- ================================================= -->

      <QuotationHeader
        :quotation="store.quotation"
        :customers="customers"
        :currencies="currencies"
        :statuses="statuses"
        :price-lists="priceLists"
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
        @duplicate-item="store.duplicateItem"
        @remove-item="store.removeItem"
      />

      <!-- ================================================= -->
      <!-- TOTALES                                          -->
      <!-- ================================================= -->

      <QuotationTotals :quotation="store.quotation" />

      <!-- ================================================= -->
      <!-- PASAJEROS                                         -->
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
      <!-- MODAL SERVICIO CATALOG                            -->
      <!-- ================================================= -->

      <ServiceSelectorModal
        v-if="showServiceModal"
        :item="editingItem"
        :price-list-id="store.quotation.price_list_id"
        @close="closeServiceModal"
        @save="handleItemSave"
      />

      <!-- ================================================= -->
      <!-- MODAL SERVICIO CUSTOM                             -->
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

import { useQuotationStore } from '../stores/quotation.store'

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
| STORE
|--------------------------------------------------------------------------
*/

const store = useQuotationStore()

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const editingItem = ref(null)

/*
| Modal CUSTOM.
*/

const showCustomModal = ref(false)

/*
| Modal CATALOG.
*/

const showServiceModal = ref(false)

/*
| Modal pasajeros.
*/

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
| INIT
|--------------------------------------------------------------------------
*/

onMounted(() => {
  if (isEdit.value) {
    store.load(route.params.uuid)
  } else {
    store.newQuotation()
  }
})

/*
|--------------------------------------------------------------------------
| SAVE QUOTATION
|--------------------------------------------------------------------------
*/

async function save() {
  await store.save()
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

function duplicateQuotation() {
  store.duplicate()

  router.push({
    name: 'quotations.create',
  })
}

function printQuotation() {
  console.log('PDF')
}

function sendQuotation() {
  console.log('Email')
}

function openCustomModal() {
  if (!store.selectedItinerary) {
    alert('Seleccione un día del itinerario.')

    return
  }

  /*
  | Nuevo item.
  */

  editingItem.value = null

  /*
  | Abrir modal.
  */

  showCustomModal.value = true
}

function openCatalogModal() {
  if (!store.selectedItinerary) {
    alert('Seleccione un día del itinerario.')

    return
  }

  /*
  | Nuevo item.
  */

  editingItem.value = null

  /*
  | Abrir modal.
  */

  showServiceModal.value = true
}

function editItem(item) {
  if (!item) {
    return
  }

  /*
  |--------------------------------------------------------------------------
  | Guardamos el item que estamos editando.
  |--------------------------------------------------------------------------
  */

  editingItem.value = item

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
| HANDLE ITEM SAVE
|--------------------------------------------------------------------------
*/

function handleItemSave(item) {
  if (!item) {
    return
  }

  /*
  |--------------------------------------------------------------------------
  | EDITAR
  |--------------------------------------------------------------------------
  */

  if (editingItem.value) {
    store.updateItem(editingItem.value.uuid, item)
  } else {
    store.addItem(item)
  }

  closeItemModal()
}

/*
|--------------------------------------------------------------------------
| CLOSE ITEM MODAL
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
| PASSENGER MODAL
|--------------------------------------------------------------------------
*/

function openPassengerModal() {
  showPassengerModal.value = true
}

function closePassengerModal() {
  showPassengerModal.value = false
}
</script>
