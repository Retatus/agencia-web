<template>
  <div class="container-fluid">
    <!-- Encabezado -->

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
      <!-- =========================== -->
      <!-- Datos Generales             -->
      <!-- =========================== -->

      <QuotationHeader
        :quotation="store.quotation"
        :customers="customers"
        :currencies="currencies"
        :statuses="statuses"
        :priceLists="priceLists"
      />

      <!-- =========================== -->
      <!-- Itinerario                  -->
      <!-- =========================== -->

      <QuotationItineraryManager
        :itineraries="store.quotation.itineraries"
        :selected-itinerary="store.selectedItinerary"
        @add-itinerary="store.addItinerary"
        @select-itinerary="store.selectItinerary"
        @duplicate-itinerary="store.duplicateItinerary"
        @remove-itinerary="store.removeItinerary"
        @move-itinerary-up="store.moveItineraryUp"
        @move-itinerary-down="store.moveItineraryDown"
        @add-service="openServiceSelector"
        @add-custom-item="openCustomItem"
        @edit-item="editItem"
        @remove-item="store.removeItem"
      />

      <!-- =========================== -->
      <!-- Totales                     -->
      <!-- =========================== -->

      <QuotationTotals :quotation="store.quotation" />

      <!-- =========================== -->
      <!-- Pasajeros                   -->
      <!-- =========================== -->

      <QuotationPassengerManager
        :passengers="store.quotation.passengers"
        :passengerTypes="passengerTypesAux"
        @add-passenger="openPassengerModal"
      />

      <!-- =========================== -->
      <!-- Acciones                    -->
      <!-- =========================== -->

      <QuotationActions
        :loading="store.saving"
        @save="save"
        @cancel="cancel"
        @duplicate="duplicateQuotation"
        @print="printQuotation"
        @email="sendQuotation"
      />

      <ServiceSelectorModal
        v-if="showServiceSelector"
        @close="closeServiceSelector"
        @selected="serviceSelected"
      />

      <CustomItemModal
        v-if="showCustomItem"
        :item="editingCustomItem"
        @close="closeCustomItem"
        @save="customItemCreated"
      />
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

import { useRoute } from 'vue-router'

import { ref } from 'vue'

import { useQuotationStore } from '../stores/quotation.store'

import QuotationHeader from '../components/QuotationHeader.vue'

import QuotationItineraryManager from '../components/QuotationItineraryManager.vue'

import QuotationTotals from '../components/QuotationTotals.vue'

import QuotationActions from '../components/QuotationActions.vue'

import ServiceSelectorModal from '../components/ServiceSelectorModal.vue'

import CustomItemModal from '../components/CustomItemModal.vue'

import QuotationPassengerManager from '../components/QuotationPassengerManager.vue'

const showServiceSelector = ref(false)

const showCustomItem = ref(false)

const editingCustomItem = ref(null)

const showPassengerModal = ref(false)

const editingPassenger = ref(null)

const route = useRoute()

const store = useQuotationStore()

const isEdit = computed(() => !!route.params.uuid)

const pageTitle = computed(() => (route.params.uuid ? 'Editar Cotización' : 'Nueva Cotización'))

onMounted(() => {
  if (isEdit.value) {
    store.load(route.params.uuid)
  } else {
    store.newQuotation()
  }
})

async function save() {
  await store.save()
}

import { useRouter } from 'vue-router'

const router = useRouter()

function cancel() {
  router.push({
    name: 'quotations.index',
  })
}

function duplicateQuotation() {
  store.duplicate()
}

function printQuotation() {
  console.log('PDF')
}

function sendQuotation() {
  console.log('Email')
}

function openServiceSelector() {
  if (!store.selectedItinerary) {
    alert('Seleccione un día del itinerario.')

    return
  }

  showServiceSelector.value = true
}

function closeServiceSelector() {
  showServiceSelector.value = false
}

function openCustomItem() {
  if (!store.selectedItinerary) {
    alert('Seleccione un día del itinerario.')

    return
  }

  // Modo nuevo
  editingCustomItem.value = null

  showCustomItem.value = true
}

function editItem(item) {
  if (!item) {
    return
  }

  if (item.item_type === 'CUSTOM') {
    editingCustomItem.value = item

    showCustomItem.value = true

    return
  }

  console.warn('Tipo de item no soportado para edición:', item.item_type)
}

function closeCustomItem() {
  editingCustomItem.value = null
  showCustomItem.value = false
}

function customItemSaved(item) {
  if (!item) {
    return
  }

  if (item.uuid) {
    store.updateItem(item.uuid, item)
  } else {
    store.addCustomItem(item)
  }

  closeCustomItem()
}

function customItemCreated(item) {
  if (editingCustomItem.value) {
    store.updateItem(editingCustomItem.value.uuid, item)
  } else {
    store.addCustomItem(item)
  }

  closeCustomItem()
}

function serviceSelected(item) {
  store.addService(item)

  closeServiceSelector()
}

/**
 * passenger
 */

function openPassengerModal() {
  editingPassenger.value = null

  showPassengerModal.value = true
}

function closePassengerModal() {
  showPassengerModal.value = false
}
</script>
