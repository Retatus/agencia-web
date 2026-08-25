<template>
  <section class="space-y-5">
    <header>
      <h1 class="text-xl font-semibold">Tarifas</h1>
      <p>Seleccione un servicio y una variante para administrar sus tarifas.</p>
    </header>

    <p v-if="store.error" class="text-red-600">{{ store.error }}</p>

    <div class="grid gap-5 lg:grid-cols-3">
      <section>
        <h2 class="font-semibold">Servicios</h2>
        <input
          v-model.trim="store.serviceFilters.search"
          type="search"
          placeholder="Buscar servicio"
          class="my-2 w-full border p-2"
          @keyup.enter="reloadServices"
        />

        <p v-if="store.loadingServices">Cargando...</p>
        <button
          v-for="service in store.services"
          :key="service.id"
          type="button"
          class="mb-1 block w-full border p-2 text-left"
          @click="store.selectService(service)"
        >
          {{ service.code }} · {{ service.name }}
        </button>
      </section>

      <section>
        <h2 class="font-semibold">Variantes</h2>
        <p v-if="!store.selectedService">Seleccione un servicio.</p>
        <p v-else-if="store.loadingVariants">Cargando...</p>

        <button
          v-for="variant in store.variants"
          :key="variant.id"
          type="button"
          class="mb-1 block w-full border p-2 text-left"
          @click="store.selectVariant(variant)"
        >
          {{ variant.code }} · {{ variant.name }} · {{ variant.unit_type }}
        </button>
      </section>

      <section>
        <div class="flex items-center justify-between gap-3">
          <h2 class="font-semibold">Tarifas</h2>
          <button
            type="button"
            class="border px-3 py-2"
            :disabled="!store.selectedVariant"
            @click="openCreate"
          >
            Nueva
          </button>
        </div>

        <p v-if="!store.selectedVariant">Seleccione una variante.</p>
        <p v-else-if="store.loadingPrices">Cargando...</p>
        <p v-else-if="!store.prices.length">La variante no tiene tarifas.</p>

        <div v-for="price in store.prices" :key="price.id" class="mb-2 border p-3">
          <div>
            {{ price.price_type?.code }} · {{ price.currency?.code }}
            <span v-if="price.passenger_type">· {{ price.passenger_type.name }}</span>
          </div>
          <div>
            Cantidad: {{ range(price.min_quantity, price.max_quantity) }}
          </div>
          <div>
            Vigencia: {{ validity(price.valid_from, price.valid_to) }}
          </div>
          <div>
            Costo: {{ money(price.cost) }} · Venta: {{ money(price.sale_price) }} · Prioridad:
            {{ price.priority }}
          </div>
          <div class="mt-2 flex gap-2">
            <button type="button" class="border px-2 py-1" @click="openEdit(price)">
              Editar
            </button>
            <button type="button" class="border px-2 py-1" @click="remove(price)">
              Eliminar
            </button>
          </div>
        </div>
      </section>
    </div>

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
import { onMounted, reactive, ref } from 'vue'
import PricingCoreFormModal from '../components/PricingCoreFormModal.vue'
import PricingCatalogService from '../services/pricing-catalog.service'
import { usePricingManagementStore } from '../stores/pricing-management.store'

const store = usePricingManagementStore()
const showModal = ref(false)
const editingPrice = ref(null)

const catalogs = reactive({
  currencies: [],
  priceTypes: [],
  passengerTypes: [],
})

onMounted(async () => {
  try {
    const [catalogData] = await Promise.all([
      PricingCatalogService.getAll(),
      store.initialize(),
    ])

    catalogs.currencies = catalogData.currencies
    catalogs.priceTypes = catalogData.priceTypes
    catalogs.passengerTypes = catalogData.passengerTypes
  } catch (error) {
    console.error('No fue posible inicializar tarifas:', error)
  }
})

async function reloadServices() {
  store.serviceFilters.page = 1
  await store.fetchServices()
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
</script>
