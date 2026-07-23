<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <!-- ===================================================== -->
        <!-- HEADER                                                -->
        <!-- ===================================================== -->

        <div class="modal-header">
          <div>
            <h5 class="modal-title mb-1"> Agregar Servicio </h5>

            <small class="text-muted">
              Seleccione un servicio del catálogo para agregarlo al itinerario.
            </small>
          </div>

          <button
            type="button"
            class="btn-close"
            @click="close"
          />
        </div>

        <!-- ===================================================== -->
        <!-- BODY                                                  -->
        <!-- ===================================================== -->

        <div class="modal-body">
          <!-- ================================================= -->
          <!-- FILTROS -->
          <!-- ================================================= -->

          <div class="card border-0 bg-light mb-4">
            <div class="card-body">
              <div class="row g-3">
                <!-- Buscar -->

                <div class="col-md-6">
                  <label class="form-label"> Buscar servicio </label>

                  <input
                    v-model="filters.search"
                    type="text"
                    class="form-control"
                    placeholder="Nombre o código del servicio..."
                  />
                </div>

                <!-- Categoría -->

                <div class="col-md-4">
                  <label class="form-label"> Categoría </label>

                  <select
                    v-model="filters.category"
                    class="form-select"
                  >
                    <option value=""> Todas las categorías </option>

                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <!-- Limpiar -->

                <div class="col-md-2 d-flex align-items-end">
                  <button
                    type="button"
                    class="btn btn-outline-secondary w-100"
                    @click="clearFilters"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ================================================= -->
          <!-- LOADING -->
          <!-- ================================================= -->

          <div
            v-if="loading"
            class="text-center py-5"
          >
            <div
              class="spinner-border text-primary"
              role="status"
            />

            <div class="mt-2 text-muted"> Cargando servicios... </div>
          </div>

          <!-- ================================================= -->
          <!-- ERROR -->
          <!-- ================================================= -->

          <div
            v-else-if="error"
            class="alert alert-danger"
          >
            {{ error }}

            <button
              type="button"
              class="btn btn-sm btn-outline-danger ms-2"
              @click="loadServices"
            >
              Reintentar
            </button>
          </div>

          <!-- ================================================= -->
          <!-- CONTENIDO -->
          <!-- ================================================= -->

          <div
            v-else
            class="row g-4"
          >
            <!-- =============================================== -->
            <!-- LISTA DE SERVICIOS -->
            <!-- =============================================== -->

            <div class="col-lg-7">
              <div class="card shadow-sm">
                <div class="card-header d-flex justify-content-between">
                  <strong> Servicios </strong>

                  <span class="badge bg-secondary">
                    {{ filteredServices.length }}
                  </span>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th> Servicio </th>

                        <th> Proveedor </th>

                        <th> Categoría </th>

                        <th> Variantes </th>

                        <th width="80"> </th>
                      </tr>
                    </thead>

                    <tbody>
                      <!-- Sin resultados -->

                      <tr v-if="!filteredServices.length">
                        <td
                          colspan="5"
                          class="text-center text-muted py-5"
                        >
                          No se encontraron servicios.
                        </td>
                      </tr>

                      <!-- Servicios -->

                      <tr
                        v-for="service in filteredServices"
                        :key="service.uuid"
                        :class="{
                          'table-primary': selectedService?.uuid === service.uuid,
                        }"
                        style="cursor: pointer"
                        @click="selectService(service)"
                      >
                        <!-- Servicio -->

                        <td>
                          <div class="fw-semibold">
                            {{ service.name }}
                          </div>

                          <small class="text-muted">
                            {{ service.code }}
                          </small>
                        </td>

                        <!-- Proveedor -->

                        <td>
                          <div>
                            {{ service.provider?.business_name ?? '-' }}
                          </div>
                        </td>

                        <!-- Categoría -->

                        <td>
                          <span class="badge bg-light text-dark border">
                            {{ service.service_category?.name ?? '-' }}
                          </span>
                        </td>

                        <!-- Variantes -->

                        <td>
                          <span class="badge bg-secondary">
                            {{ service.variants?.length ?? 0 }}
                          </span>
                        </td>

                        <!-- Seleccionar -->

                        <td>
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-primary"
                            :disabled="loadingDetail && selectedService?.uuid === service.uuid"
                            @click.stop="selectService(service)"
                          >
                            <span
                              v-if="loadingDetail && selectedService?.uuid === service.uuid"
                              class="spinner-border spinner-border-sm"
                              role="status"
                            />

                            <template v-else>
                              <i class="bi bi-chevron-right"></i>
                              Select
                            </template>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- =============================================== -->
            <!-- CONFIGURACIÓN -->
            <!-- =============================================== -->

            <div class="col-lg-5">
              <div class="card shadow-sm">
                <div class="card-header">
                  <strong> Configuración del servicio </strong>
                </div>

                <div class="card-body">
                  <!-- ========================================= -->
                  <!-- SIN SERVICIO -->
                  <!-- ========================================= -->

                  <div
                    v-if="!selectedService"
                    class="text-center text-muted py-5"
                  >
                    <i class="bi bi-box-seam fs-1"></i>

                    <p class="mt-3 mb-0"> Seleccione un servicio de la lista. </p>
                  </div>

                  <!-- ========================================= -->
                  <!-- CARGANDO DETALLE                           -->
                  <!-- ========================================= -->

                  <div
                    v-else-if="loadingDetail"
                    class="text-center py-5"
                  >
                    <div
                      class="spinner-border text-primary"
                      role="status"
                    />

                    <div class="mt-2 text-muted"> Cargando información del servicio... </div>
                  </div>

                  <!-- ========================================= -->
                  <!-- SERVICIO SELECCIONADO                      -->
                  <!-- ========================================= -->

                  <div v-else>
                    <!-- Servicio -->

                    <div class="mb-4">
                      <label class="form-label"> Servicio </label>

                      <div class="border rounded p-3">
                        <div class="fw-semibold">
                          {{ selectedService.name }}
                        </div>

                        <small class="text-muted">
                          {{ selectedService.provider?.business_name ?? '-' }}
                        </small>
                      </div>
                    </div>

                    <!-- Categoría -->

                    <div class="mb-4">
                      <label class="form-label"> Categoría </label>

                      <input
                        :value="selectedService.service_category?.name ?? ''"
                        class="form-control"
                        disabled
                      />
                    </div>

                    <!-- Variante -->

                    <div class="mb-4">
                      <label class="form-label"> Variante * </label>

                      <div
                        v-if="loadingVariants"
                        class="text-muted"
                      >
                        <span
                          class="spinner-border spinner-border-sm me-2"
                          role="status"
                        />

                        Cargando variantes...
                      </div>

                      <select
                        v-else
                        v-model="form.service_variant_id"
                        class="form-select"
                        :disabled="!variants.length"
                        @change="onVariantChange"
                      >
                        <option :value="null">
                          {{
                            variants.length
                              ? 'Seleccione una variante...'
                              : 'No hay variantes disponibles'
                          }}
                        </option>

                        <option
                          v-for="variant in variants"
                          :key="variant.id"
                          :value="variant.id"
                        >
                          {{ variant.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Información variante -->

                    <div
                      v-if="selectedVariant"
                      class="alert alert-info"
                    >
                      <div class="fw-semibold mb-2">
                        {{ selectedVariant.name }}
                      </div>

                      <div class="small">
                        <div v-if="selectedVariant.code">
                          Código:
                          {{ selectedVariant.code }}
                        </div>

                        <div
                          v-if="
                            selectedVariant.min_capacity !== null &&
                            selectedVariant.max_capacity !== null
                          "
                        >
                          Capacidad:
                          {{ selectedVariant.min_capacity }}
                          -
                          {{ selectedVariant.max_capacity }}
                        </div>

                        <div v-if="selectedVariant.unit_type">
                          Unidad:
                          {{ selectedVariant.unit_type }}
                        </div>
                      </div>
                    </div>

                    <!-- ======================================= -->
                    <!-- PRECIO / TARIFA                         -->
                    <!-- ======================================= -->

                    <div
                      v-if="selectedVariant"
                      class="mb-4"
                    >
                      <label class="form-label"> Tarifa * </label>

                      <!-- Loading -->

                      <div
                        v-if="loadingPrices"
                        class="text-muted"
                      >
                        <span
                          class="spinner-border spinner-border-sm me-2"
                          role="status"
                        />

                        Cargando tarifas...
                      </div>

                      <!-- Select -->

                      <select
                        v-else
                        v-model="form.service_price_id"
                        class="form-select"
                        :disabled="!prices.length"
                      >
                        <option :value="null">
                          {{
                            prices.length
                              ? 'Seleccione una tarifa...'
                              : 'No hay tarifas disponibles'
                          }}
                        </option>

                        <option
                          v-for="price in prices"
                          :key="price.id"
                          :value="price.id"
                        >
                          {{ price.name ?? 'Tarifa' }}
                          -
                          {{ price.sale_price }}
                          {{ price.currency?.code ?? '' }}
                        </option>
                      </select>
                    </div>

                    <!-- ======================================= -->
                    <!-- PRECIO SELECCIONADO                     -->
                    <!-- ======================================= -->

                    <div
                      v-if="selectedPrice"
                      class="alert alert-success"
                    >
                      <div class="fw-semibold"> Tarifa seleccionada </div>

                      <div class="small mt-1">
                        <div>
                          Precio:
                          {{ selectedPrice.sale_price }}
                          {{ selectedPrice.currency?.code ?? '' }}
                        </div>

                        <div v-if="selectedPrice.name">
                          Tarifa:
                          {{ selectedPrice.name }}
                        </div>
                      </div>
                    </div>

                    <!-- ======================================= -->
                    <!-- CANTIDAD                                -->
                    <!-- ======================================= -->

                    <div class="mb-4">
                      <label class="form-label"> Cantidad * </label>

                      <input
                        v-model.number="form.quantity"
                        type="number"
                        min="1"
                        step="1"
                        class="form-control"
                      />
                    </div>

                    <!-- Notas -->

                    <div class="mb-3">
                      <label class="form-label"> Observaciones </label>

                      <textarea
                        v-model="form.notes"
                        class="form-control"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================== -->
        <!-- FOOTER                                                -->
        <!-- ===================================================== -->

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="close"
          >
            Cancelar
          </button>

          <button
            type="button"
            class="btn btn-primary"
            :disabled="!canSave"
            @click="addService"
          >
            <i class="bi bi-plus-circle me-1"></i>

            Agregar Servicio
          </button>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

import ServiceService from '../../catalog/services/services/service.service'

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
|
| priceListId viene desde QuotationFormPage / QuotationItineraryManager.
|
| Es necesario para consultar los precios correspondientes
| a la lista de precios seleccionada en la cotización.
|
*/

const props = defineProps({
  priceListId: {
    type: [Number, String],
    required: true,
  },
})

/*
|--------------------------------------------------------------------------
| EVENTS
|--------------------------------------------------------------------------
*/

const emit = defineEmits(['close', 'selected'])

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

/*
| Loading del listado general.
*/

const loading = ref(false)

/*
| Loading del detalle del servicio.
*/

const loadingDetail = ref(false)

/*
| Loading de las variantes.
*/

const loadingVariants = ref(false)

/*
| Loading de los precios.
*/

const loadingPrices = ref(false)

/*
| Error general.
*/

const error = ref(null)

/*
| Listado de servicios.
*/

const services = ref([])

/*
| Servicio seleccionado.
*/

const selectedService = ref(null)

/*
| Variantes del servicio seleccionado.
*/

const variants = ref([])

/*
| Precios disponibles para la variante seleccionada.
*/

const prices = ref([])

/*
|--------------------------------------------------------------------------
| FILTERS
|--------------------------------------------------------------------------
*/

const filters = reactive({
  search: '',

  category: '',
})

/*
|--------------------------------------------------------------------------
| FORM
|--------------------------------------------------------------------------
*/

const form = reactive({
  service_variant_id: null,

  service_price_id: null,

  quantity: 1,

  notes: '',
})

/*
|--------------------------------------------------------------------------
| CATEGORIES
|--------------------------------------------------------------------------
*/

const categories = computed(() => {
  const map = new Map()

  services.value.forEach((service) => {
    const category = service.service_category

    if (!category) {
      return
    }

    if (!map.has(category.id)) {
      map.set(category.id, category)
    }
  })

  return Array.from(map.values())
})

/*
|--------------------------------------------------------------------------
| FILTERED SERVICES
|--------------------------------------------------------------------------
*/

const filteredServices = computed(() => {
  const search = filters.search.trim().toLowerCase()

  return services.value.filter((service) => {
    /*
    |--------------------------------------------------------------------------
    | Buscar
    |--------------------------------------------------------------------------
    */

    const matchesName = service.name?.toLowerCase().includes(search)

    /*
      |--------------------------------------------------------------------------
      | Buscar por código
      |--------------------------------------------------------------------------
      */

    const matchesCode = service.code?.toLowerCase().includes(search)

    /*
      |--------------------------------------------------------------------------
      | Buscar por proveedor
      |--------------------------------------------------------------------------
      */

    const matchesProvider = service.provider?.business_name?.toLowerCase().includes(search)

    /*
      |--------------------------------------------------------------------------
      | Resultado búsqueda
      |--------------------------------------------------------------------------
      */

    const matchesSearch = !search || matchesName || matchesCode || matchesProvider

    /*
    |--------------------------------------------------------------------------
    | Categoría
    |--------------------------------------------------------------------------
    */

    const matchesCategory =
      !filters.category || Number(service.service_category?.id) === Number(filters.category)

    return matchesSearch && matchesCategory
  })
})

/*
|--------------------------------------------------------------------------
| SELECTED VARIANT
|--------------------------------------------------------------------------
*/

const selectedVariant = computed(() => {
  if (!form.service_variant_id) {
    return null
  }

  return (
    variants.value.find((variant) => Number(variant.id) === Number(form.service_variant_id)) ?? null
  )
})

/*
|--------------------------------------------------------------------------
| SELECTED PRICE
|--------------------------------------------------------------------------
*/

const selectedPrice = computed(() => {
  if (!form.service_price_id) {
    return null
  }

  return prices.value.find((price) => Number(price.id) === Number(form.service_price_id)) ?? null
})

/*
|--------------------------------------------------------------------------
| CAN SAVE
|--------------------------------------------------------------------------
*/

const canSave = computed(() => {
  return Boolean(
    selectedService.value &&
    selectedVariant.value &&
    selectedPrice.value &&
    Number(form.quantity) > 0,
  )
})

/*
|--------------------------------------------------------------------------
| LOAD SERVICES
|--------------------------------------------------------------------------
*/

async function loadServices() {
  loading.value = true

  error.value = null

  try {
    const response = await ServiceService.getAll({
      active: 1,

      per_page: 15,
    })

    services.value = response.data.data ?? []
  } catch (err) {
    console.error('Error cargando servicios:', err)

    error.value = 'No fue posible cargar los servicios.'
  } finally {
    loading.value = false
  }
}

/*
|--------------------------------------------------------------------------
| SELECT SERVICE
|--------------------------------------------------------------------------
|
| 1. GET /services/{uuid}
| 2. GET /services/{uuid}/variants
|
*/

async function selectService(service) {
  loadingDetail.value = true

  error.value = null

  /*
  |--------------------------------------------------------------------------
  | Reset estado anterior
  |--------------------------------------------------------------------------
  */

  selectedService.value = null

  variants.value = []

  prices.value = []

  form.service_variant_id = null

  form.service_price_id = null

  try {
    /*
    |--------------------------------------------------------------------------
    | Obtener detalle del servicio
    |--------------------------------------------------------------------------
    */

    const response = await ServiceService.get(service.uuid)

    selectedService.value = response.data.data

    /*
    |--------------------------------------------------------------------------
    | Obtener variantes
    |--------------------------------------------------------------------------
    */

    await loadVariants()
  } catch (err) {
    console.error('Error cargando detalle del servicio:', err)

    error.value = 'No fue posible cargar el servicio seleccionado.'

    selectedService.value = null
  } finally {
    loadingDetail.value = false
  }
}

/*
|--------------------------------------------------------------------------
| LOAD VARIANTS
|--------------------------------------------------------------------------
|
| GET /services/{uuid}/variants
|
*/

async function loadVariants() {
  if (!selectedService.value) {
    return
  }

  loadingVariants.value = true

  try {
    const response = await ServiceService.getVariants(selectedService.value.uuid)

    variants.value = response.data.data ?? []
  } catch (err) {
    console.error('Error cargando variantes:', err)

    variants.value = []

    error.value = 'No fue posible cargar las variantes del servicio.'
  } finally {
    loadingVariants.value = false
  }
}

/*
|--------------------------------------------------------------------------
| VARIANT CHANGE
|--------------------------------------------------------------------------
|
| Al seleccionar una variante:
|
| 1. Se limpia el precio anterior.
| 2. Se obtienen los precios de la variante.
|
*/

async function onVariantChange() {
  /*
  |--------------------------------------------------------------------------
  | Limpiar precio anterior
  |--------------------------------------------------------------------------
  */

  form.service_price_id = null

  prices.value = []

  /*
  |--------------------------------------------------------------------------
  | Validar variante
  |--------------------------------------------------------------------------
  */

  if (!selectedVariant.value) {
    return
  }

  /*
  |--------------------------------------------------------------------------
  | Cargar precios
  |--------------------------------------------------------------------------
  */

  await loadPrices()
}

/*
|--------------------------------------------------------------------------
| LOAD PRICES
|--------------------------------------------------------------------------
|
| GET /services/{uuid}/prices
|
| Parámetros:
|
| service_variant_id
| price_list_id
|
*/

async function loadPrices() {
  if (!selectedService.value || !selectedVariant.value) {
    return
  }

  loadingPrices.value = true

  error.value = null

  try {
    const response = await ServiceService.getPrices(
      selectedService.value.uuid,
      selectedVariant.value.id,
      {
        price_list_id: props.priceListId,
      },
    )

    prices.value = response.data.data ?? []
  } catch (err) {
    console.error('Error cargando precios:', err)

    prices.value = []

    error.value = 'No fue posible cargar las tarifas disponibles.'
  } finally {
    loadingPrices.value = false
  }
}

/*
|--------------------------------------------------------------------------
| ADD SERVICE
|--------------------------------------------------------------------------
|
| Construye el item que será enviado a:
|
| QuotationItineraryManager
|       ↓
| quotationStore.addService()
|       ↓
| quotation.itineraries[x].items[]
|
*/

function addService() {
  if (!canSave.value) {
    return
  }

  const item = {
    service_id: selectedService.value.id,
    service_variant_id: selectedVariant.value.id,

    item_type: 'CATALOG',

    name: selectedService.value.name,
    variant_name: selectedVariant.value.name,
    description: selectedService.value.description ?? '',

    duration: 1,
    quantity: Number(form.quantity),

    price_id: selectedPrice.value.id,

    unit_cost: Number(selectedPrice.value.cost ?? 0),
    unit_price: Number(selectedPrice.value.sale_price ?? 0),

    subtotal: Number(form.quantity) * Number(selectedPrice.value.sale_price ?? 0),

    sort_order: 1,

    notes: form.notes,

    active: true,
  }

  /*
  |--------------------------------------------------------------------------
  | Emitir
  |--------------------------------------------------------------------------
  */

  emit('selected', item)
}

/*
|--------------------------------------------------------------------------
| CLOSE
|--------------------------------------------------------------------------
*/

function close() {
  emit('close')
}

/*
|--------------------------------------------------------------------------
| CLEAR FILTERS
|--------------------------------------------------------------------------
*/

function clearFilters() {
  filters.search = ''

  filters.category = ''
}

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(() => {
  loadServices()
})
</script>
