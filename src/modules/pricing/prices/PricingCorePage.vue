<template>
  <section class="mx-auto max-w-7xl space-y-6">
    <!-- HEADER -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tarifas</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Seleccione un servicio y una variante para administrar sus tarifas.
      </p>
    </div>

    <!-- ERROR -->
    <div
      v-if="store.error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
    >
      {{ store.error }}
    </div>

    <!-- GRID -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- SERVICIOS -->
      <section
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2 class="font-semibold text-slate-900 dark:text-white">Servicios</h2>
        </div>

        <div class="p-4">
          <input
            v-model.trim="store.serviceFilters.search"
            type="search"
            maxlength="100"
            placeholder="Nombre, código o proveedor..."
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            @keyup.enter.prevent="reloadServices"
          />

          <!-- LOADING -->
          <div
            v-if="store.loadingServices"
            class="mt-4 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400"
          >
            <div class="flex items-center gap-3">
              <div
                class="h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
              ></div>
              Cargando servicios...
            </div>
          </div>

          <!-- LISTA -->
          <div v-else class="mt-4 space-y-1.5">
            <button
              v-for="service in store.services"
              :key="service.id"
              type="button"
              class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 hover:border-teal-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-teal-600"
              :class="{
                'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-950/30':
                  store.selectedService?.id === service.id,
              }"
              @click="store.selectService(service)"
            >
              <span class="font-medium text-slate-900 dark:text-white">
                {{ service.code }}
              </span>
              <span class="text-slate-600 dark:text-slate-400">·</span>
              <span class="text-slate-700 dark:text-slate-300">
                {{ service.name }}
              </span>

              <div
                v-if="service?.provider?.business_name"
                class="mt-0.5 text-xs text-slate-500 dark:text-slate-400"
              >
                {{ service.provider.business_name }}
              </div>
            </button>

            <p
              v-if="!store.services.length"
              class="py-4 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              No hay servicios disponibles.
            </p>

            <!-- PAGINACIÓN: solo se renderiza cuando existen metadatos -->
            <template v-if="store.serviceMeta">
              <div
                v-if="Number(store.serviceMeta.last_page) > 1"
                class="mt-4 flex items-center justify-between gap-2"
              >
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/30 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  :disabled="store.loadingServices || Number(store.serviceMeta.current_page) <= 1"
                  @click="changeServicesPage(Number(store.serviceMeta.current_page) - 1)"
                >
                  <ChevronLeft class="mr-1.5 h-4 w-4" />
                  Anterior
                </button>

                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {{ store.serviceMeta.current_page }}
                  <span class="text-slate-400 dark:text-slate-500">/</span>
                  {{ store.serviceMeta.last_page }}
                </span>

                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/30 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  :disabled="
                    store.loadingServices ||
                    Number(store.serviceMeta.current_page) >= Number(store.serviceMeta.last_page)
                  "
                  @click="changeServicesPage(Number(store.serviceMeta.current_page) + 1)"
                >
                  Siguiente
                  <ChevronRight class="ml-1.5 h-4 w-4" />
                </button>
              </div>

              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {{ store.serviceMeta.total ?? 0 }} servicios encontrados
              </p>
            </template>
          </div>
        </div>
      </section>

      <!-- VARIANTES -->
      <section
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2 class="font-semibold text-slate-900 dark:text-white">Variantes</h2>
        </div>

        <div class="p-4">
          <!-- SIN SERVICIO -->
          <div
            v-if="!store.selectedService"
            class="py-8 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            Seleccione un servicio.
          </div>

          <!-- LOADING -->
          <div
            v-else-if="store.loadingVariants"
            class="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400"
          >
            <div class="flex items-center gap-3">
              <div
                class="h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
              ></div>
              Cargando variantes...
            </div>
          </div>

          <!-- LISTA -->
          <div v-else class="space-y-1.5">
            <button
              v-for="variant in store.variants"
              :key="variant.id"
              type="button"
              class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-left transition hover:bg-slate-50 hover:border-teal-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-teal-600"
              :class="{
                'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-950/30':
                  store.selectedVariant?.id === variant.id,
              }"
              @click="store.selectVariant(variant)"
            >
              <div class="font-medium text-slate-900 dark:text-white">
                {{ variant.code }} · {{ variant.name }}
                <span class="ml-1 font-normal text-slate-500 dark:text-slate-400"
                  >· {{ variant.unit_type }}</span
                >
              </div>
              <div class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Capacidad: {{ variant.min_capacity }}–{{ variant.max_capacity }}
                <template v-if="variant.optimal_capacity">
                  · óptima {{ variant.optimal_capacity }}
                </template>
              </div>
            </button>

            <p
              v-if="!store.variants.length"
              class="py-4 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              No hay variantes para este servicio.
            </p>
          </div>
        </div>
      </section>

      <!-- TARIFAS -->
      <section
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div
          class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700"
        >
          <h2 class="font-semibold text-slate-900 dark:text-white">Tarifas</h2>
          <button
            type="button"
            class="inline-flex items-center rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
            :disabled="!store.selectedVariant"
            @click="openCreate"
          >
            <Plus class="mr-1 h-4 w-4" />
            Nueva
          </button>
        </div>

        <div class="p-4">
          <!-- SIN VARIANTE -->
          <div
            v-if="!store.selectedVariant"
            class="py-8 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            Seleccione una variante.
          </div>

          <!-- LOADING -->
          <div
            v-else-if="store.loadingPrices"
            class="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400"
          >
            <div class="flex items-center gap-3">
              <div
                class="h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
              ></div>
              Cargando tarifas...
            </div>
          </div>

          <!-- SIN TARIFAS -->
          <p
            v-else-if="!store.prices.length"
            class="py-8 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            La variante no tiene tarifas.
          </p>

          <!-- LISTA DE TARIFAS -->
          <div v-else class="space-y-3">
            <div
              v-for="price in store.prices"
              :key="price.id"
              class="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
            >
              <!-- Cabecera -->
              <div class="flex items-start justify-between">
                <div>
                  <div class="font-medium text-slate-900 dark:text-white">
                    {{ price.price_type?.code }}
                    <span class="font-normal text-slate-500 dark:text-slate-400"
                      >· {{ price.currency?.code }}</span
                    >
                    <span
                      v-if="price.passenger_type"
                      class="font-normal text-slate-500 dark:text-slate-400"
                    >
                      · {{ price.passenger_type.name }}
                    </span>
                  </div>
                  <div class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Base tarifaria: {{ quantityBasisLabel(price.price_type?.quantity_basis) }}
                  </div>
                </div>
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="
                    price.active
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  "
                >
                  {{ price.active ? 'Activo' : 'Inactivo' }}
                </span>
              </div>

              <!-- Detalles -->
              <div class="mt-2 grid grid-cols-2 gap-1 text-sm">
                <div>
                  <span class="text-slate-500 dark:text-slate-400">Cantidad:</span>
                  <span class="ml-1 font-medium text-slate-700 dark:text-slate-300">{{
                    range(price.min_quantity, price.max_quantity)
                  }}</span>
                </div>
                <div>
                  <span class="text-slate-500 dark:text-slate-400">Prioridad:</span>
                  <span class="ml-1 font-medium text-slate-700 dark:text-slate-300">{{
                    price.priority
                  }}</span>
                </div>
                <div>
                  <span class="text-slate-500 dark:text-slate-400">Costo:</span>
                  <span class="ml-1 font-medium text-slate-700 dark:text-slate-300">{{
                    money(price.cost)
                  }}</span>
                </div>
                <div>
                  <span class="text-slate-500 dark:text-slate-400">Venta:</span>
                  <span class="ml-1 font-medium text-slate-700 dark:text-slate-300">{{
                    money(price.sale_price)
                  }}</span>
                </div>
                <div class="col-span-2">
                  <span class="text-slate-500 dark:text-slate-400">Vigencia:</span>
                  <span class="ml-1 text-slate-700 dark:text-slate-300">{{
                    validity(price.valid_from, price.valid_to)
                  }}</span>
                </div>
              </div>

              <!-- Acciones -->
              <div class="mt-3 flex gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg border border-blue-300 px-2.5 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                  @click="openEdit(price)"
                >
                  <Pencil class="mr-1 h-3 w-3" />
                  Editar
                </button>
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                  @click="remove(price)"
                >
                  <Trash2 class="mr-1 h-3 w-3" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- MODAL -->
    <PricingCoreFormModal
      v-if="showModal && store.selectedVariant"
      :price="editingPrice"
      :variant="store.selectedVariant"
      :currencies="catalogs.currencies"
      :price-types="catalogs.priceTypes"
      :passenger-types="catalogs.passengerTypes"
      :saving="store.savingPrice"
      @close="closeModal"
      @save="save"
    />
  </section>
</template>

<script setup>
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import PricingCoreFormModal from '../components/PricingCoreFormModal.vue'
import PricingCatalogService from '../services/pricing-catalog.service'
import { usePricingManagementStore } from '../stores/pricing-management.store'

const store = usePricingManagementStore()
let searchTimeout = null
const showModal = ref(false)
const editingPrice = ref(null)

const catalogs = reactive({
  currencies: [],
  priceTypes: [],
  passengerTypes: [],
})

onMounted(async () => {
  try {
    const [catalogData] = await Promise.all([PricingCatalogService.getAll(), store.initialize()])

    catalogs.currencies = catalogData.currencies
    catalogs.priceTypes = catalogData.priceTypes
    catalogs.passengerTypes = catalogData.passengerTypes
  } catch (error) {
    console.error('No fue posible inicializar tarifas:', error)
  }
})

watch(
  () => store.serviceFilters.search,
  () => {
    clearTimeout(searchTimeout)

    searchTimeout = setTimeout(() => {
      reloadServices()
    }, 300)
  },
)

onBeforeUnmount(() => {
  clearTimeout(searchTimeout)
})

async function reloadServices() {
  clearTimeout(searchTimeout)

  store.serviceFilters.page = 1

  try {
    await store.fetchServices()
  } catch (error) {
    // El store ya muestra el mensaje en store.error.
    console.error('Error buscando servicios:', error)
  }
}

async function changeServicesPage(page) {
  const lastPage = Number(store.serviceMeta.last_page ?? 1)

  if (store.loadingServices || page < 1 || page > lastPage) {
    return
  }

  clearTimeout(searchTimeout)

  try {
    await store.fetchServices({ page })

    store.serviceFilters.page = page
  } catch (error) {
    console.error('Error cambiando la página de servicios:', error)
  }
}

function openCreate() {
  editingPrice.value = null
  showModal.value = true
}

function openEdit(price) {
  editingPrice.value = price
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingPrice.value = null
}

async function save(payload) {
  try {
    if (editingPrice.value) {
      await store.updatePrice(editingPrice.value, payload)
    } else {
      await store.createPrice(payload)
    }
    closeModal()
  } catch (error) {
    console.error('No fue posible guardar la tarifa:', error)
  }
}

async function remove(price) {
  if (!window.confirm('¿Eliminar esta tarifa?')) return

  try {
    await store.deletePrice(price)
  } catch (error) {
    console.error('No fue posible eliminar la tarifa:', error)
  }
}

function range(min, max) {
  if (!min && !max) return 'Cualquier cantidad'
  return `${min ?? 'sin mínimo'} – ${max ?? 'sin máximo'}`
}

function validity(from, to) {
  if (!from && !to) return 'Permanente'
  return `${normalizeDate(from) || 'sin inicio'} – ${normalizeDate(to) || 'sin fin'}`
}

function normalizeDate(value) {
  return value ? String(value).slice(0, 10) : ''
}

function money(value) {
  return Number(value ?? 0).toFixed(2)
}

function quantityBasisLabel(value) {
  const normalized = typeof value === 'object' ? value?.value : value

  if (normalized === 'PASSENGERS') return 'Por pasajeros'
  if (normalized === 'UNITS') return 'Por unidades'

  return 'No definida'
}
</script>
