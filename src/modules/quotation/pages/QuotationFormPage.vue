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

      <div class="flex flex-wrap gap-2">
        <button
          v-if="store.canEdit"
          type="button"
          class="inline-flex shrink-0 items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
          @click="showDestinationModal = true"
        >
          <MapPinned class="mr-1.5 h-4 w-4" />
          Usar destino
        </button>

        <router-link
          :to="{ name: 'quotations' }"
          class="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Volver al listado
        </router-link>
      </div>
    </div>

    <!-- Resultado del guardado -->

    <BaseAlert
      v-if="saveFeedback"
      ref="saveFeedbackElement"
      class="mb-5"
      :type="saveFeedback.type"
      :title="saveFeedback.title"
      dismissible
      @close="clearSaveFeedback"
    >
      <p>{{ saveFeedback.message }}</p>

      <ul v-if="saveFeedback.details.length" class="mt-2 list-disc space-y-1 pl-5">
        <li v-for="(detail, index) in saveFeedback.details" :key="`${index}-${detail}`">
          {{ detail }}
        </li>
      </ul>
    </BaseAlert>

    <BaseAlert
      v-if="store.calculationDirty"
      class="mb-5"
      type="warning"
      title="La cotización necesita recalcular servicios"
    >
      <p>
        Cambió información que interviene en las recomendaciones o tarifas. Los importes se
        conservan como referencia, pero no deben enviarse al cliente hasta revisar los
        {{ store.pendingCalculationCount }} servicios pendientes.
      </p>

      <button
        type="button"
        class="mt-3 rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700"
        @click="reviewNextPendingCalculation"
      >
        Revisar siguiente servicio
      </button>
    </BaseAlert>

    <BaseAlert
      v-if="!store.canEdit && !store.isNew"
      class="mb-5"
      type="info"
      title="Cotización bloqueada para edición"
    >
      <p>
        El estado {{ store.quotation.status?.name ?? store.statusCode }} protege los datos
        comerciales. Utilice una transición permitida para continuar.
      </p>
    </BaseAlert>

    <BaseAlert
      v-if="store.quotation.tourist_destination_name"
      class="mb-5"
      type="info"
      title="Itinerario iniciado desde una plantilla"
    >
      Destino de origen: {{ store.quotation.tourist_destination_name }}. Los textos e importes ya
      son copias independientes y pueden ajustarse libremente.
    </BaseAlert>

    <div
      v-if="store.canEdit"
      class="mb-5 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/30"
    >
      <div class="flex items-start gap-3">
        <MapPinned class="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
        <div class="min-w-0 flex-1">
          <h3 class="font-semibold text-slate-900 dark:text-white">
            Crear itinerario desde un destino turístico
          </h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Copia los títulos, descripciones y servicios aproximados en esta cotización.
          </p>

          <div class="mt-3 flex flex-col gap-2 sm:flex-row">
            <select
              v-model="selectedDestinationUuid"
              class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              :disabled="loadingDestinations"
            >
              <option value="">
                {{
                  loadingDestinations ? 'Cargando destinos...' : 'Seleccione un destino turístico'
                }}
              </option>
              <option
                v-for="destination in touristDestinations"
                :key="destination.uuid"
                :value="destination.uuid"
              >
                {{ destination.code }} · {{ destination.name }} ·
                {{ destination.duration_days }} días
              </option>
            </select>

            <button
              type="button"
              class="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!selectedDestinationUuid || applyingDestination"
              @click="applySelectedDestination"
            >
              {{ applyingDestination ? 'Aplicando...' : 'Aplicar plantilla' }}
            </button>
          </div>

          <p
            v-if="!loadingDestinations && !touristDestinations.length"
            class="mt-2 text-sm text-amber-700"
          >
            No existen destinos activos. Créelos desde el módulo Destinos turísticos.
          </p>
        </div>
      </div>
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
      <fieldset
        :disabled="!store.canEdit"
        class="min-w-0 space-y-5 border-t border-slate-200 pt-6 disabled:opacity-75 dark:border-slate-800"
      >
        <QuotationHeader
          :quotation="store.quotation"
          :customers="customers"
          :currencies="currencies"
          :statuses="statuses"
          @create-customer="openCustomerModal"
        />
      </fieldset>

      <!-- Pasajeros -->
      <fieldset
        :disabled="!store.canEdit"
        class="min-w-0 space-y-5 border-t border-slate-200 pt-6 disabled:opacity-75 dark:border-slate-800"
      >
        <QuotationPassengerManager
          :passengers="store.quotation.passengers"
          :passenger-types="passengerTypes"
          @add-passenger="openPassengerModal"
          @edit-passenger="openPassengerModal"
        />
      </fieldset>

      <!-- Itinerario -->
      <fieldset
        :disabled="!store.canEdit"
        class="min-w-0 space-y-5 border-t border-slate-200 pt-6 disabled:opacity-75 dark:border-slate-800"
      >
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
                      :disabled="!store.allowedActions.print"
                    >
                      <Printer class="mr-1.5 h-4 w-4" />
                      Imprimir
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      @click="sendQuotation"
                      :disabled="!store.allowedActions.send && !store.allowedActions.resend"
                    >
                      <Mail class="mr-1.5 h-4 w-4" />
                      Enviar Email
                    </button>

                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      @click="exportPDF"
                      :disabled="!store.allowedActions.export_pdf"
                    >
                      <FileText class="mr-1.5 h-4 w-4" />
                      PDF
                    </button>
                  </div>

                  <div v-if="!store.isNew" class="grid grid-cols-2 gap-2">
                    <button
                      v-if="store.allowedActions.mark_ready"
                      type="button"
                      class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      @click="changeWorkflowStatus('READY')"
                    >
                      Validar y dejar lista
                    </button>

                    <button
                      v-if="store.allowedActions.reopen"
                      type="button"
                      class="rounded-lg border border-blue-500 px-3 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300"
                      @click="changeWorkflowStatus('DRAFT')"
                    >
                      Reabrir borrador
                    </button>

                    <button
                      v-if="store.allowedActions.send"
                      type="button"
                      class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                      @click="registerAsSent"
                    >
                      Registrar como enviada
                    </button>

                    <button
                      v-if="store.allowedActions.confirm"
                      type="button"
                      class="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      @click="changeWorkflowStatus('CONFIRMED')"
                    >
                      Confirmar
                    </button>

                    <button
                      v-if="store.allowedActions.reject"
                      type="button"
                      class="rounded-lg border border-red-400 px-3 py-2 text-sm font-semibold text-red-700 dark:text-red-300"
                      @click="changeWorkflowStatusWithReason('REJECTED')"
                    >
                      Rechazar
                    </button>

                    <button
                      v-if="store.allowedActions.cancel"
                      type="button"
                      class="rounded-lg border border-red-400 px-3 py-2 text-sm font-semibold text-red-700 dark:text-red-300"
                      @click="changeWorkflowStatusWithReason('CANCELLED')"
                    >
                      Cancelar cotización
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
                      :disabled="store.saving || !store.canEdit"
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

    <TouristDestinationSelectorModal
      v-if="showDestinationModal"
      @close="showDestinationModal = false"
      @select="applyDestination"
    />
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Copy, Printer, Mail, FileText, Save, MapPinned } from 'lucide-vue-next'

import BaseAlert from '@/components/ui/BaseAlert.vue'

import { useQuotationStore } from '../stores/quotation.store'

import QuotationHeader from '../components/QuotationHeader.vue'
import QuotationItineraryManager from '../components/QuotationItineraryManager.vue'
import QuotationTotals from '../components/QuotationTotals.vue'
import QuotationActions from '../components/QuotationActions.vue'
import QuotationPassengerManager from '../components/QuotationPassengerManager.vue'
import ServiceSelectorModal from '../components/ServiceSelectorModal.vue'
import CustomItemModal from '../components/CustomItemModal.vue'
import TouristDestinationSelectorModal from '../components/TouristDestinationSelectorModal.vue'

import CustomerQuickCreateModal from '../../crm/components/CustomerQuickCreateModal.vue'
import { useCustomerStore } from '../../crm/stores/customer.store'

import CurrencyService from '@/modules/catalog/service/currency.service'
import PassengerTypeService from '@/modules/catalog/service/passenger-type.service'
import QuotationStatusService from '@/modules/catalog/service/quotation-status.service'
import TouristDestinationService from '@/modules/destinations/services/tourist-destination.service'

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

const showDestinationModal = ref(false)

const saveFeedback = ref(null)

const saveFeedbackElement = ref(null)

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

const loadingCatalogs = ref(false)

const touristDestinations = ref([])

const selectedDestinationUuid = ref('')

const loadingDestinations = ref(false)

const applyingDestination = ref(false)

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
    const [currenciesResponse, statusesResponse, passengerTypesResponse] = await Promise.all([
      CurrencyService.getAll({
        active: 1,
      }),

      QuotationStatusService.getAll({
        active: 1,
      }),

      PassengerTypeService.getAll({
        active: 1,
      }),
    ])

    currencies.value = currenciesResponse.data.data ?? []

    statuses.value = statusesResponse.data.data ?? []

    passengerTypes.value = passengerTypesResponse.data.data ?? []
  } finally {
    loadingCatalogs.value = false
  }
}

async function loadTouristDestinations() {
  loadingDestinations.value = true

  try {
    const response = await TouristDestinationService.getAll({
      active: 1,
      per_page: 100,
    })

    touristDestinations.value = response.data.data ?? []
  } finally {
    loadingDestinations.value = false
  }
}

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  try {
    await Promise.all([loadCustomers(), loadAuxiliaryData(), loadTouristDestinations()])

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
  clearSaveFeedback()

  const wasNew = store.isNew

  try {
    const response = await store.save()

    showSaveFeedback({
      type: 'success',
      title: wasNew ? 'Cotización creada' : 'Cotización actualizada',
      message:
        response?.data?.message ??
        (wasNew
          ? 'La cotización fue creada correctamente.'
          : 'La cotización fue actualizada correctamente.'),
      details: [],
    })

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

    const responseData = error?.response?.data

    showSaveFeedback({
      type: 'danger',
      title: 'No fue posible guardar la cotización',
      message:
        responseData?.message ??
        error?.message ??
        'Ocurrió un error inesperado al comunicarse con el servidor.',
      details: validationMessages(responseData?.errors),
    })
  }
}

function validationMessages(errors) {
  if (!errors || typeof errors !== 'object') {
    return []
  }

  return Object.values(errors)
    .flatMap((messages) => (Array.isArray(messages) ? messages : [messages]))
    .filter(Boolean)
    .map(String)
}

function clearSaveFeedback() {
  saveFeedback.value = null
}

async function showSaveFeedback(feedback) {
  saveFeedback.value = feedback

  await nextTick()

  saveFeedbackElement.value?.$el?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
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
  window.alert(
    'El envío de correo todavía no está conectado. Cuando el correo se envíe correctamente, registre la cotización como enviada.',
  )
}

async function changeWorkflowStatus(statusCode, reason = null) {
  clearSaveFeedback()

  try {
    const response = await store.changeStatus(statusCode, reason)

    showSaveFeedback({
      type: 'success',
      title: 'Estado actualizado',
      message: response?.data?.message ?? 'El estado fue actualizado correctamente.',
      details: [],
    })
  } catch (error) {
    showSaveFeedback({
      type: 'danger',
      title: 'No fue posible cambiar el estado',
      message: error?.response?.data?.message ?? error?.message ?? 'Ocurrió un error inesperado.',
      details: validationMessages(error?.response?.data?.errors),
    })
  }
}

function changeWorkflowStatusWithReason(statusCode) {
  const reason = window.prompt('Indique el motivo de esta operación:')

  if (!reason?.trim()) return

  changeWorkflowStatus(statusCode, reason.trim())
}

function registerAsSent() {
  const confirmed = window.confirm(
    'Esta acción solo registra que la cotización ya fue enviada por un medio externo. ¿Desea continuar?',
  )

  if (confirmed) changeWorkflowStatus('SENT')
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
    payload.items = (payload.items ?? []).map((item) => ({
      ...item,
      calculated_at: new Date().toISOString(),
    }))
    /*
    |--------------------------------------------------------------------------
    | Editar grupo
    |--------------------------------------------------------------------------
    */

    if (editingItem.value?.group_uuid) {
      store.updateItemGroup(payload)
      store.markItemRecalculated(editingItem.value.group_uuid)
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

    store.updateItem(editingItem.value.uuid, {
      ...payload,
      calculated_at: new Date().toISOString(),
    })
    store.markItemRecalculated(editingItem.value.uuid)
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

function reviewNextPendingCalculation() {
  const pending = store.firstPendingCalculationItem()

  if (!pending) return

  store.selectItinerary(pending.itinerary.uuid)
  editItem(pending.item)
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

function applyDestination(destination) {
  const hasContent = store.quotation.itineraries.some(
    (itinerary) => itinerary.title || itinerary.description || (itinerary.items?.length ?? 0) > 0,
  )

  if (
    hasContent &&
    !window.confirm(
      'La plantilla reemplazará el itinerario actual. Los pasajeros y datos de cabecera se conservarán. ¿Desea continuar?',
    )
  ) {
    return
  }

  store.applyTouristDestination(destination)
  showDestinationModal.value = false
  selectedDestinationUuid.value = destination.uuid

  showSaveFeedback({
    type: 'success',
    title: 'Destino aplicado',
    message:
      'Se copiaron los días y servicios aproximados. Revise los importes antes de enviar la cotización.',
    details: [],
  })
}

async function applySelectedDestination() {
  if (!selectedDestinationUuid.value) return

  applyingDestination.value = true

  try {
    const response = await TouristDestinationService.show(selectedDestinationUuid.value)
    applyDestination(response.data.data)
  } catch (error) {
    showSaveFeedback({
      type: 'danger',
      title: 'No fue posible aplicar el destino',
      message:
        error?.response?.data?.message ??
        error?.message ??
        'No se pudo recuperar la plantilla seleccionada.',
      details: [],
    })
  } finally {
    applyingDestination.value = false
  }
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
