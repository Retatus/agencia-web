<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- ===================================================== -->
        <!-- HEADER -->
        <!-- ===================================================== -->

        <div class="modal-header">
          <div>
            <h5 class="modal-title mb-1">
              {{ isEdit ? 'Editar Servicio' : 'Agregar Servicio' }}
            </h5>

            <small class="text-muted">
              {{
                isEdit
                  ? 'Modifique la configuración del servicio del itinerario.'
                  : 'Seleccione un servicio del catálogo para agregarlo al itinerario.'
              }}
            </small>
          </div>

          <button
            type="button"
            class="btn-close"
            @click="cancel"
          />
        </div>

        <!-- ===================================================== -->
        <!-- BODY -->
        <!-- ===================================================== -->

        <div class="modal-body">
          <!-- ================================================= -->
          <!-- ERROR -->
          <!-- ================================================= -->

          <div
            v-if="error"
            class="alert alert-danger"
          >
            {{ error }}

            <button
              type="button"
              class="btn btn-sm btn-outline-danger ms-2"
              @click="error = null"
            >
              Cerrar
            </button>
          </div>

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
                    placeholder="Nombre, código o proveedor..."
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
          <!-- LOADING SERVICIOS -->
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
                        <th>Servicio</th>
                        <th>Proveedor</th>
                        <th>Categoría</th>
                        <th>Variantes</th>
                        <th width="80"></th>
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
                          {{ service.provider?.business_name ?? '-' }}
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

                              {{
                                isEdit && Number(editBaseItem?.service_id) === Number(service.id)
                                  ? 'Seleccionado'
                                  : 'Seleccionar'
                              }}
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
                  <!-- LOADING DETALLE -->
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
                  <!-- SERVICIO SELECCIONADO -->
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

                        <div class="mt-2">
                          <span
                            class="badge"
                            :class="calculationBadgeClass"
                          >
                            {{ calculationTypeLabel }}
                          </span>
                        </div>
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

                    <!-- ================================================= -->
                    <!-- SERVICIO GENÉRICO -->
                    <!-- ================================================= -->

                    <template v-if="!isRecommendationType">
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

                      <!-- Tarifa -->

                      <div
                        v-if="selectedVariant"
                        class="mb-4"
                      >
                        <label class="form-label"> Tarifa * </label>

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

                        <select
                          v-else
                          v-model="form.price_id"
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

                      <!-- Precio seleccionado -->

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

                      <!-- Cantidad -->

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
                    </template>

                    <!-- ================================================= -->
                    <!-- ALOJAMIENTO / TRANSPORTE -->
                    <!-- ================================================= -->

                    <template v-else>
                      <!-- Noches -->

                      <div
                        v-if="calculationType === 'accommodation'"
                        class="mb-4"
                      >
                        <label class="form-label"> Noches * </label>

                        <input
                          v-model.number="form.duration"
                          type="number"
                          class="form-control"
                          min="1"
                          step="1"
                        />
                      </div>

                      <!-- Pasajeros -->

                      <div class="alert alert-light border mb-4">
                        <div class="d-flex justify-content-between">
                          <span> Pasajeros </span>

                          <strong>
                            {{ props.passengers.length }}
                          </strong>
                        </div>

                        <div class="small text-muted mt-1">
                          El cálculo utiliza los pasajeros actuales de la cotización.
                        </div>
                      </div>

                      <!-- ================================================= -->
                      <!-- DISTRIBUCIÓN ACTUAL - EDICIÓN -->
                      <!-- ================================================= -->

                      <div
                        v-if="isGroupEdit && !recommendations.length"
                        class="mb-4"
                      >
                        <label class="form-label fw-semibold"> Distribución actual </label>

                        <div class="border rounded p-3">
                          <div
                            v-for="item in currentGroupItems"
                            :key="item.uuid ?? item.id ?? item.group_index"
                            class="d-flex justify-content-between mb-2"
                          >
                            <div>
                              <strong> {{ item.quantity }} × </strong>

                              {{ item.variant_name }}
                            </div>

                            <div class="text-muted">
                              {{ money(item.subtotal) }}
                            </div>
                          </div>

                          <hr />

                          <div class="d-flex justify-content-between small">
                            <span> Cantidad total </span>

                            <strong>
                              {{ currentGroupSummary.quantity }}
                            </strong>
                          </div>

                          <div class="d-flex justify-content-between small">
                            <span> Costo total </span>

                            <strong>
                              {{ money(currentGroupSummary.total_cost) }}
                            </strong>
                          </div>

                          <div class="d-flex justify-content-between">
                            <span> Venta total </span>

                            <strong>
                              {{ money(currentGroupSummary.total_sale) }}
                            </strong>
                          </div>
                        </div>

                        <button
                          type="button"
                          class="btn btn-outline-primary w-100 mt-3"
                          :disabled="loadingRecommendations"
                          @click="loadRecommendations"
                        >
                          <span
                            v-if="loadingRecommendations"
                            class="spinner-border spinner-border-sm me-2"
                          />

                          <i
                            v-else
                            class="bi bi-arrow-repeat me-1"
                          ></i>

                          Buscar nuevas recomendaciones
                        </button>
                      </div>

                      <!-- ================================================= -->
                      <!-- CREAR: CARGAR RECOMENDACIONES -->
                      <!-- ================================================= -->

                      <div
                        v-if="!isGroupEdit && !recommendations.length && !loadingRecommendations"
                        class="mb-4"
                      >
                        <button
                          type="button"
                          class="btn btn-outline-primary w-100"
                          :disabled="!props.passengers.length"
                          @click="loadRecommendations"
                        >
                          <i class="bi bi-stars me-1"></i>

                          Generar recomendaciones
                        </button>
                      </div>

                      <!-- Loading -->

                      <div
                        v-if="loadingRecommendations"
                        class="text-center py-4"
                      >
                        <div
                          class="spinner-border text-primary"
                          role="status"
                        />

                        <div class="small text-muted mt-2"> Calculando recomendaciones... </div>
                      </div>

                      <!-- Sin resultados -->

                      <div
                        v-else-if="recommendationsLoaded && !recommendations.length"
                        class="alert alert-warning"
                      >
                        No se encontraron combinaciones disponibles para
                        {{ props.passengers.length }} pasajeros.
                      </div>

                      <!-- ================================================= -->
                      <!-- RECOMENDACIONES -->
                      <!-- ================================================= -->

                      <div
                        v-if="recommendations.length"
                        class="mb-4"
                      >
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <label class="form-label fw-semibold mb-0">
                            {{
                              calculationType === 'accommodation'
                                ? 'Distribuciones de habitaciones'
                                : 'Distribuciones de transporte'
                            }}
                          </label>

                          <button
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            @click="loadRecommendations"
                          >
                            <i class="bi bi-arrow-repeat"></i>
                          </button>
                        </div>

                        <div class="d-flex flex-column gap-3">
                          <div
                            v-for="recommendation in recommendations"
                            :key="recommendation.rank"
                            class="border rounded p-3"
                            :class="{
                              'border-primary bg-light':
                                selectedRecommendation?.rank === recommendation.rank,
                            }"
                            style="cursor: pointer"
                            @click="selectRecommendation(recommendation)"
                          >
                            <!-- Cabecera -->

                            <div class="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <strong> Opción {{ recommendation.rank }} </strong>

                                <span
                                  v-if="recommendation.recommended"
                                  class="badge bg-success ms-2"
                                >
                                  Recomendada
                                </span>
                              </div>

                              <input
                                type="radio"
                                :checked="selectedRecommendation?.rank === recommendation.rank"
                                @change="selectRecommendation(recommendation)"
                              />
                            </div>

                            <!-- Habitaciones -->

                            <template v-if="calculationType === 'accommodation'">
                              <div
                                v-for="room in recommendation.rooms"
                                :key="room.service_variant_id"
                                class="small mb-1"
                              >
                                <strong> {{ room.quantity }} × </strong>

                                {{ room.name }}

                                <span class="text-muted">
                                  · capacidad {{ room.total_capacity }}
                                </span>
                              </div>

                              <div class="small text-muted mt-2">
                                {{ recommendation.total_rooms }}
                                habitaciones · capacidad
                                {{ recommendation.total_capacity }}

                                · libres
                                {{ recommendation.unused_capacity }}
                              </div>
                            </template>

                            <!-- Vehículos -->

                            <template v-else>
                              <div
                                v-for="vehicle in recommendation.vehicles"
                                :key="vehicle.service_variant_id"
                                class="small mb-1"
                              >
                                <strong> {{ vehicle.quantity }} × </strong>

                                {{ vehicle.name }}

                                <span class="text-muted">
                                  · capacidad {{ vehicle.total_capacity }}
                                </span>
                              </div>

                              <div class="small text-muted mt-2">
                                {{ recommendation.total_vehicles }}
                                vehículos · capacidad
                                {{ recommendation.total_capacity }}

                                · libres
                                {{ recommendation.unused_capacity }}
                              </div>
                            </template>

                            <!-- Totales -->

                            <div class="row mt-3 small">
                              <div class="col-6">
                                <span class="text-muted"> Costo </span>

                                <div class="fw-semibold">
                                  {{ money(recommendation.total_cost) }}
                                </div>
                              </div>

                              <div class="col-6">
                                <span class="text-muted"> Venta </span>

                                <div class="fw-semibold">
                                  {{ money(recommendation.total_sale) }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- ================================================= -->
                    <!-- NOTAS -->
                    <!-- ================================================= -->

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
        <!-- FOOTER -->
        <!-- ===================================================== -->

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="cancel"
          >
            Cancelar
          </button>

          <button
            type="button"
            class="btn btn-primary"
            :disabled="!canSave"
            @click="save"
          >
            <i :class="isEdit ? 'bi bi-check-circle me-1' : 'bi bi-plus-circle me-1'"></i>

            {{ isEdit ? 'Actualizar' : 'Agregar servicio' }}
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

// ==========================================================================
// AJUSTAR LA RUTA SEGÚN TU ESTRUCTURA
// ==========================================================================
import { useQuotationCalculationStore } from '../stores/quotation-calculation.store'

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
|
| item puede ser:
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
|   group_uuid,
|   calculation_type,
|   items: [...]
| }
|
*/

const props = defineProps({
  priceListId: {
    type: [Number, String],
    required: true,
  },

  passengers: {
    type: Array,
    default: () => [],
  },

  item: {
    type: Object,
    default: null,
  },
})

/*
|--------------------------------------------------------------------------
| EVENTS
|--------------------------------------------------------------------------
|
| GENERIC:
|
| emit('save', item)
|
| AGRUPADO:
|
| emit('save', {
|   type: 'group',
|   group_uuid,
|   calculation_type,
|   items: [...]
| })
|
*/

const emit = defineEmits(['close', 'save'])

/*
|--------------------------------------------------------------------------
| STORES
|--------------------------------------------------------------------------
*/

const calculationStore = useQuotationCalculationStore()

/*
|--------------------------------------------------------------------------
| MODE
|--------------------------------------------------------------------------
*/

const isEdit = computed(() => {
  return !!props.item
})

const isGroupEdit = computed(() => {
  return Boolean(props.item?.group_uuid && Array.isArray(props.item?.items))
})

/*
|--------------------------------------------------------------------------
| EDIT BASE ITEM
|--------------------------------------------------------------------------
|
| Para grupos utilizamos el primer item para recuperar
| servicio, notas, duración, sort_order, etc.
|
*/

const editBaseItem = computed(() => {
  if (!props.item) {
    return null
  }

  if (isGroupEdit.value) {
    return props.item.items?.[0] ?? null
  }

  return props.item
})

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const loading = ref(false)

const loadingDetail = ref(false)

const loadingVariants = ref(false)

const loadingPrices = ref(false)

const loadingRecommendations = ref(false)

const recommendationsLoaded = ref(false)

const error = ref(null)

const services = ref([])

const selectedService = ref(null)

const variants = ref([])

const prices = ref([])

const variantPrices = ref({})

const recommendations = ref([])

const selectedRecommendation = ref(null)

const currentGroupItems = ref([])

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
  service_id: editBaseItem.value?.service_id ?? null,

  service_variant_id: editBaseItem.value?.service_variant_id ?? null,

  item_type: editBaseItem.value?.item_type ?? 'CATALOG',

  name: editBaseItem.value?.name ?? '',

  variant_name: editBaseItem.value?.variant_name ?? '',

  description: editBaseItem.value?.description ?? '',

  duration: editBaseItem.value?.duration ?? 1,

  quantity: editBaseItem.value?.quantity ?? 1,

  price_id: editBaseItem.value?.price_id ?? null,

  unit_cost: editBaseItem.value?.unit_cost ?? 0,

  unit_price: editBaseItem.value?.unit_price ?? 0,

  subtotal: editBaseItem.value?.subtotal ?? 0,

  sort_order: editBaseItem.value?.sort_order ?? 1,

  notes: editBaseItem.value?.notes ?? '',

  active: editBaseItem.value?.active ?? true,
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
    const matchesName = service.name?.toLowerCase().includes(search)

    const matchesCode = service.code?.toLowerCase().includes(search)

    const matchesProvider = service.provider?.business_name?.toLowerCase().includes(search)

    const matchesSearch = !search || matchesName || matchesCode || matchesProvider

    const matchesCategory =
      !filters.category || Number(service.service_category?.id) === Number(filters.category)

    return matchesSearch && matchesCategory
  })
})

/*
|--------------------------------------------------------------------------
| CALCULATION TYPE
|--------------------------------------------------------------------------
|
| Idealmente después debe venir del backend.
|
*/

const calculationType = computed(() => {
  /*
  |--------------------------------------------------------------------------
  | En edición de grupo confiamos primero en lo persistido
  |--------------------------------------------------------------------------
  */

  if (isGroupEdit.value && props.item?.calculation_type) {
    return props.item.calculation_type
  }

  const category = selectedService.value?.service_category

  const code = category?.code?.toUpperCase()

  const name = category?.name?.toUpperCase()

  if (
    code === 'HOTEL' ||
    code === 'ACCOMMODATION' ||
    name?.includes('HOTEL') ||
    name?.includes('HABIT')
  ) {
    return 'accommodation'
  }

  if (code === 'TRANSPORT' || code === 'TRANSPORTATION' || name?.includes('TRANSPORT')) {
    return 'transport'
  }

  return 'generic'
})

const isRecommendationType = computed(() => {
  return ['accommodation', 'transport'].includes(calculationType.value)
})

const calculationTypeLabel = computed(() => {
  switch (calculationType.value) {
    case 'accommodation':
      return 'Alojamiento'

    case 'transport':
      return 'Transporte'

    default:
      return 'Servicio'
  }
})

const calculationBadgeClass = computed(() => {
  switch (calculationType.value) {
    case 'accommodation':
      return 'bg-info text-dark'

    case 'transport':
      return 'bg-warning text-dark'

    default:
      return 'bg-secondary'
  }
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
  if (!form.price_id) {
    return null
  }

  return prices.value.find((price) => Number(price.id) === Number(form.price_id)) ?? null
})

/*
|--------------------------------------------------------------------------
| CURRENT GROUP SUMMARY
|--------------------------------------------------------------------------
*/

const currentGroupSummary = computed(() => {
  const items = currentGroupItems.value

  const quantity = items.reduce((total, item) => total + Number(item.quantity ?? 0), 0)

  const totalCost = items.reduce((total, item) => {
    const duration = calculationType.value === 'accommodation' ? Number(item.duration ?? 1) : 1

    return total + Number(item.quantity ?? 0) * Number(item.unit_cost ?? 0) * duration
  }, 0)

  const totalSale = items.reduce((total, item) => total + Number(item.subtotal ?? 0), 0)

  return {
    quantity,
    total_cost: totalCost,
    total_sale: totalSale,
  }
})

/*
|--------------------------------------------------------------------------
| CAN SAVE
|--------------------------------------------------------------------------
*/

const canSave = computed(() => {
  if (!selectedService.value) {
    return false
  }

  /*
  |--------------------------------------------------------------------------
  | Compuesto
  |--------------------------------------------------------------------------
  */

  if (isRecommendationType.value) {
    /*
    |--------------------------------------------------------------------------
    | Si se seleccionó nueva recomendación
    |--------------------------------------------------------------------------
    */

    if (selectedRecommendation.value) {
      return true
    }

    /*
    |--------------------------------------------------------------------------
    | Edición sin recalcular
    |--------------------------------------------------------------------------
    */

    if (isGroupEdit.value && currentGroupItems.value.length) {
      return true
    }

    return false
  }

  /*
  |--------------------------------------------------------------------------
  | Generic
  |--------------------------------------------------------------------------
  */

  return Boolean(selectedVariant.value && selectedPrice.value && Number(form.quantity) > 0)
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
*/

async function selectService(service, options = {}) {
  const { autoRecommendations = true } = options

  if (loadingDetail.value && selectedService.value?.uuid === service.uuid) {
    return
  }

  loadingDetail.value = true

  error.value = null

  selectedService.value = null

  variants.value = []

  prices.value = []

  variantPrices.value = {}

  recommendations.value = []

  selectedRecommendation.value = null

  recommendationsLoaded.value = false

  form.service_id = null

  form.service_variant_id = null

  form.price_id = null

  try {
    /*
    |--------------------------------------------------------------------------
    | Servicio
    |--------------------------------------------------------------------------
    */

    const response = await ServiceService.get(service.uuid)

    selectedService.value = response.data.data

    form.service_id = selectedService.value.id

    /*
    |--------------------------------------------------------------------------
    | Variantes
    |--------------------------------------------------------------------------
    */

    await loadVariants()

    /*
    |--------------------------------------------------------------------------
    | Crear servicio compuesto
    |--------------------------------------------------------------------------
    |
    | Al crear podemos calcular automáticamente.
    |
    | En edición NO.
    |
    */

    if (isRecommendationType.value && autoRecommendations && !isGroupEdit.value) {
      await loadRecommendations()
    }
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
*/

async function onVariantChange() {
  form.price_id = null

  prices.value = []

  if (!selectedVariant.value) {
    return
  }

  await loadPrices()
}

/*
|--------------------------------------------------------------------------
| LOAD PRICES
|--------------------------------------------------------------------------
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
| LOAD ALL VARIANT PRICES
|--------------------------------------------------------------------------
*/

async function loadAllVariantPrices() {
  if (!selectedService.value) {
    return
  }

  variantPrices.value = {}

  const requests = variants.value.map(async (variant) => {
    try {
      const response = await ServiceService.getPrices(
        selectedService.value.uuid,

        variant.id,

        {
          price_list_id: props.priceListId,
        },
      )

      const list = response.data.data ?? []

      /*
          |--------------------------------------------------------------------------
          | MVP
          |--------------------------------------------------------------------------
          |
          | Usamos la primera tarifa válida.
          |
          */

      variantPrices.value[variant.id] = list[0] ?? null
    } catch (err) {
      console.error(`Error cargando precio variante ${variant.id}:`, err)

      variantPrices.value[variant.id] = null
    }
  })

  await Promise.all(requests)
}

/*
|--------------------------------------------------------------------------
| BUILD VARIANT OPTIONS
|--------------------------------------------------------------------------
*/

function buildVariantOptions() {
  return variants.value
    .map((variant) => {
      const price = variantPrices.value[variant.id]

      if (!price) {
        return null
      }

      return {
        id: variant.id,

        service_variant_id: variant.id,

        name: variant.name,

        min_capacity: Number(variant.min_capacity ?? 1),

        max_capacity: Number(variant.max_capacity ?? 1),

        unit_cost: Number(price.cost ?? 0),

        unit_price: Number(price.sale_price ?? 0),

        /*
        |--------------------------------------------------------------------------
        | Importante
        |--------------------------------------------------------------------------
        |
        | El algoritmo puede no devolver price_id.
        |
        | Lo conservamos aquí para recuperarlo al crear
        | cada QuotationItem.
        |
        */

        price_id: price.id,
      }
    })
    .filter(Boolean)
}

/*
|--------------------------------------------------------------------------
| LOAD RECOMMENDATIONS
|--------------------------------------------------------------------------
*/

async function loadRecommendations() {
  if (!isRecommendationType.value) {
    return
  }

  recommendationsLoaded.value = false

  selectedRecommendation.value = null

  if (!props.passengers.length) {
    recommendations.value = []

    error.value = 'La cotización no tiene pasajeros.'

    return
  }

  loadingRecommendations.value = true

  error.value = null

  try {
    /*
    |--------------------------------------------------------------------------
    | Precios
    |--------------------------------------------------------------------------
    */

    await loadAllVariantPrices()

    const options = buildVariantOptions()

    if (!options.length) {
      recommendations.value = []

      error.value = 'No existen variantes con tarifas disponibles.'

      return
    }

    /*
    |--------------------------------------------------------------------------
    | Item temporal
    |--------------------------------------------------------------------------
    */

    const item = {
      service_id: selectedService.value.id,

      name: selectedService.value.name,

      calculation_type: calculationType.value,

      duration: Number(form.duration ?? 1),

      passengers: props.passengers,
    }

    /*
    |--------------------------------------------------------------------------
    | Accommodation
    |--------------------------------------------------------------------------
    */

    if (calculationType.value === 'accommodation') {
      item.room_types = options
    }

    /*
    |--------------------------------------------------------------------------
    | Transport
    |--------------------------------------------------------------------------
    */

    if (calculationType.value === 'transport') {
      item.vehicle_types = options
    }

    /*
    |--------------------------------------------------------------------------
    | Motor
    |--------------------------------------------------------------------------
    */

    const result = await calculationStore.calculate({
      itineraries: [
        {
          day_number: 1,

          items: [item],
        },
      ],
    })

    const calculatedItem = result.items?.[0]

    recommendations.value = calculatedItem?.metadata?.recommendations ?? []

    /*
    |--------------------------------------------------------------------------
    | Recomendación #1
    |--------------------------------------------------------------------------
    */

    selectedRecommendation.value = recommendations.value[0] ?? null
  } catch (err) {
    console.error('Error calculando recomendaciones:', err)

    recommendations.value = []

    selectedRecommendation.value = null

    error.value = 'No fue posible generar las recomendaciones.'
  } finally {
    recommendationsLoaded.value = true

    loadingRecommendations.value = false
  }
}

/*
|--------------------------------------------------------------------------
| SELECT RECOMMENDATION
|--------------------------------------------------------------------------
*/

function selectRecommendation(recommendation) {
  selectedRecommendation.value = recommendation
}

/*
|--------------------------------------------------------------------------
| FIND PRICE FOR VARIANT
|--------------------------------------------------------------------------
*/

function getVariantPrice(serviceVariantId) {
  return variantPrices.value[serviceVariantId] ?? null
}

/*
|--------------------------------------------------------------------------
| INITIALIZE EDIT
|--------------------------------------------------------------------------
*/

async function initializeEdit() {
  if (!props.item) {
    return
  }

  const baseItem = editBaseItem.value

  if (!baseItem?.service_id) {
    error.value = 'El item no tiene un servicio asociado.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Buscar servicio
  |--------------------------------------------------------------------------
  */

  const service = services.value.find(
    (service) => Number(service.id) === Number(baseItem.service_id),
  )

  if (!service) {
    error.value = 'No se encontró el servicio en el catálogo.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Grupo
  |--------------------------------------------------------------------------
  */

  if (isGroupEdit.value) {
    currentGroupItems.value = clonePlain(props.item.items ?? [])

    form.duration = baseItem.duration ?? 1

    form.notes = baseItem.notes ?? ''

    /*
    |--------------------------------------------------------------------------
    | Cargar servicio sin recalcular
    |--------------------------------------------------------------------------
    */

    await selectService(service, {
      autoRecommendations: false,
    })

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Item normal
  |--------------------------------------------------------------------------
  */

  await selectService(service, {
    autoRecommendations: false,
  })

  const variantExists = variants.value.some(
    (variant) => Number(variant.id) === Number(baseItem.service_variant_id),
  )

  if (!variantExists) {
    error.value = 'La variante del servicio ya no está disponible.'

    return
  }

  form.service_variant_id = baseItem.service_variant_id

  await loadPrices()

  const priceExists = prices.value.some((price) => Number(price.id) === Number(baseItem.price_id))

  if (baseItem.price_id && priceExists) {
    form.price_id = baseItem.price_id
  } else if (baseItem.price_id) {
    error.value = 'La tarifa utilizada anteriormente ya no está disponible.'
  }

  form.quantity = baseItem.quantity ?? 1

  form.notes = baseItem.notes ?? ''
}

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

function save() {
  if (!canSave.value) {
    return
  }

  /*
  |--------------------------------------------------------------------------
  | SERVICIO COMPUESTO
  |--------------------------------------------------------------------------
  */

  if (isRecommendationType.value) {
    /*
    |--------------------------------------------------------------------------
    | Si estamos editando y NO se seleccionó una nueva recomendación,
    | mantenemos la distribución actual.
    |--------------------------------------------------------------------------
    */

    if (isGroupEdit.value && !selectedRecommendation.value) {
      saveExistingGroup()

      return
    }

    /*
    |--------------------------------------------------------------------------
    | Nueva recomendación
    |--------------------------------------------------------------------------
    */

    saveRecommendedGroup()

    return
  }

  /*
  |--------------------------------------------------------------------------
  | GENERIC
  |--------------------------------------------------------------------------
  */

  saveGenericItem()
}

/*
|--------------------------------------------------------------------------
| SAVE GENERIC ITEM
|--------------------------------------------------------------------------
*/

function saveGenericItem() {
  const item = {
    /*
    |--------------------------------------------------------------------------
    | Mantener identidad si estamos editando
    |--------------------------------------------------------------------------
    */

    id: editBaseItem.value?.id ?? undefined,

    uuid: editBaseItem.value?.uuid ?? undefined,

    service_id: selectedService.value.id,

    service_variant_id: selectedVariant.value.id,

    item_type: 'CATALOG',

    name: selectedService.value.name,

    variant_name: selectedVariant.value.name,

    description: selectedService.value.description ?? '',

    calculation_type: 'generic',

    group_uuid: null,

    group_index: null,

    duration: selectedVariant.value.duration ?? 1,

    quantity: Number(form.quantity),

    price_id: selectedPrice.value.id,

    unit_cost: Number(selectedPrice.value.cost ?? 0),

    unit_price: Number(selectedPrice.value.sale_price ?? 0),

    subtotal: Number(form.quantity) * Number(selectedPrice.value.sale_price ?? 0),

    sort_order: editBaseItem.value?.sort_order ?? 1,

    notes: form.notes,

    active: editBaseItem.value?.active ?? true,
  }

  emit('save', item)

  close()
}

/*
|--------------------------------------------------------------------------
| SAVE EXISTING GROUP
|--------------------------------------------------------------------------
|
| El usuario abrió el grupo pero no solicitó
| una nueva combinación.
|
| Conservamos IDs/UUIDs reales.
|
*/

function saveExistingGroup() {
  const items = currentGroupItems.value.map((item, index) => ({
    ...clonePlain(item),

    group_uuid: props.item.group_uuid,

    group_index: index + 1,

    calculation_type: calculationType.value,

    duration: calculationType.value === 'accommodation' ? Number(form.duration ?? 1) : 1,

    notes: form.notes,
  }))

  emit('save', {
    type: 'group',

    group_uuid: props.item.group_uuid,

    calculation_type: calculationType.value,

    items,
  })

  close()
}

/*
|--------------------------------------------------------------------------
| SAVE RECOMMENDED GROUP
|--------------------------------------------------------------------------
*/

function saveRecommendedGroup() {
  const selected = selectedRecommendation.value

  /*
  |--------------------------------------------------------------------------
  | UUID
  |--------------------------------------------------------------------------
  |
  | Si editamos mantenemos group_uuid.
  |
  | Si creamos generamos uno nuevo.
  |
  */

  const groupUuid = isGroupEdit.value ? props.item.group_uuid : crypto.randomUUID()

  /*
  |--------------------------------------------------------------------------
  | Componentes elegidos
  |--------------------------------------------------------------------------
  */

  const selectedParts =
    calculationType.value === 'accommodation' ? (selected.rooms ?? []) : (selected.vehicles ?? [])

  /*
  |--------------------------------------------------------------------------
  | Items anteriores por service_variant_id
  |--------------------------------------------------------------------------
  |
  | Esto permite conservar id/uuid si una variante
  | continúa existiendo en la nueva distribución.
  |
  */

  const existingByVariant = new Map()

  if (isGroupEdit.value) {
    currentGroupItems.value.forEach((item) => {
      existingByVariant.set(Number(item.service_variant_id), item)
    })
  }

  /*
  |--------------------------------------------------------------------------
  | Construir N QuotationItem
  |--------------------------------------------------------------------------
  */

  const items = selectedParts.map((part, index) => {
    const variantId = Number(part.service_variant_id)

    const existing = existingByVariant.get(variantId)

    /*
        |--------------------------------------------------------------------------
        | Tarifa
        |--------------------------------------------------------------------------
        */

    const price = getVariantPrice(variantId)

    const quantity = Number(part.quantity ?? 0)

    const unitCost = Number(part.unit_cost ?? price?.cost ?? 0)

    const unitPrice = Number(part.unit_price ?? price?.sale_price ?? 0)

    const duration = calculationType.value === 'accommodation' ? Number(form.duration ?? 1) : 1

    /*
        |--------------------------------------------------------------------------
        | Cada fila guarda SU subtotal real.
        |--------------------------------------------------------------------------
        */

    const subtotal = quantity * unitPrice * duration

    return {
      /*
          |--------------------------------------------------------------------------
          | Identidad existente
          |--------------------------------------------------------------------------
          */

      id: existing?.id ?? undefined,

      uuid: existing?.uuid ?? undefined,

      /*
          |--------------------------------------------------------------------------
          | Agrupación
          |--------------------------------------------------------------------------
          */

      group_uuid: groupUuid,

      group_index: index + 1,

      calculation_type: calculationType.value,

      /*
          |--------------------------------------------------------------------------
          | Relaciones reales
          |--------------------------------------------------------------------------
          */

      service_id: selectedService.value.id,

      service_variant_id: variantId,

      price_id: price?.id ?? existing?.price_id ?? null,

      /*
          |--------------------------------------------------------------------------
          | Datos descriptivos
          |--------------------------------------------------------------------------
          */

      item_type: 'CATALOG',

      name: selectedService.value.name,

      variant_name: part.name,

      description: selectedService.value.description ?? '',

      /*
          |--------------------------------------------------------------------------
          | Economía
          |--------------------------------------------------------------------------
          */

      duration,

      quantity,

      unit_cost: unitCost,

      unit_price: unitPrice,

      subtotal,

      /*
          |--------------------------------------------------------------------------
          | Todos comparten sort_order del servicio lógico.
          |--------------------------------------------------------------------------
          */

      sort_order: editBaseItem.value?.sort_order ?? 1,

      notes: form.notes,

      active: existing?.active ?? true,
    }
  })

  /*
  |--------------------------------------------------------------------------
  | Emitir grupo
  |--------------------------------------------------------------------------
  */

  emit('save', {
    type: 'group',

    group_uuid: groupUuid,

    calculation_type: calculationType.value,

    /*
      |--------------------------------------------------------------------------
      | Los items que desaparecieron NO vienen aquí.
      |
      | El update/backend podrá compararlos contra
      | los existentes del group_uuid y eliminarlos.
      |--------------------------------------------------------------------------
      */

    items,
  })

  close()
}

/*
|--------------------------------------------------------------------------
| CLONE PLAIN
|--------------------------------------------------------------------------
|
| Evitamos structuredClone sobre proxies Vue.
|
*/

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value))
}

/*
|--------------------------------------------------------------------------
| MONEY
|--------------------------------------------------------------------------
*/

function money(value) {
  return Number(value ?? 0).toFixed(2)
}

/*
|--------------------------------------------------------------------------
| CANCEL / CLOSE
|--------------------------------------------------------------------------
*/

function cancel() {
  close()
}

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

onMounted(async () => {
  await loadServices()

  if (isEdit.value) {
    await initializeEdit()
  }
})
</script>
