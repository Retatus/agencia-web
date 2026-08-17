<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="flex min-h-full items-center justify-center">
          <div
            role="dialog"
            aria-modal="true"
            :aria-label="isEdit ? 'Editar precio base' : 'Nuevo precio base'"
            class="w-full max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ isEdit ? 'Editar precio base' : 'Nuevo precio base' }}
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Define el costo y precio base de una variante de servicio.
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                @click="close"
              >
                <X class="h-5 w-5" />
              </button>
            </header>

            <!-- BODY -->
            <div class="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
              <!-- ERROR -->
              <div
                v-if="error"
                class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
              >
                {{ error }}
              </div>

              <!-- FORM -->
              <div class="grid gap-4 md:grid-cols-2">
                <!-- SERVICE -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Servicio <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="selectedServiceUuid"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    @change="onServiceChange"
                  >
                    <option value="">Seleccione...</option>
                    <option v-for="service in services" :key="service.uuid" :value="service.uuid">
                      {{ service.name }}
                    </option>
                  </select>
                </div>

                <!-- VARIANT -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Variante <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.service_variant_id"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    :disabled="!selectedServiceUuid || loadingVariants"
                  >
                    <option :value="null">
                      {{ loadingVariants ? 'Cargando variantes...' : 'Seleccione...' }}
                    </option>
                    <option v-for="variant in variants" :key="variant.id" :value="variant.id">
                      {{ variant.name }}
                    </option>
                  </select>
                </div>

                <!-- CURRENCY -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Moneda <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.currency_id"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option :value="null">Seleccione...</option>
                    <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
                      {{ currency.code }} - {{ currency.name }}
                    </option>
                  </select>
                </div>

                <!-- ACTIVE -->
                <div class="flex items-end">
                  <label
                    class="flex w-full cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
                  >
                    <input
                      v-model="form.active"
                      type="checkbox"
                      class="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-600 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800"
                    />
                    <div>
                      <div class="text-sm font-medium text-slate-800 dark:text-slate-200">
                        Precio activo
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400">
                        Disponible para resolución de tarifas.
                      </div>
                    </div>
                  </label>
                </div>

                <!-- COST -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Costo <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-400 dark:text-slate-500"
                    >
                      {{ currencyCode }}
                    </span>
                    <input
                      v-model.number="form.cost"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-right text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                      placeholder="0.00"
                    />
                  </div>
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Costo real o costo del proveedor.
                  </p>
                </div>

                <!-- SALE PRICE -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Precio base <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-400 dark:text-slate-500"
                    >
                      {{ currencyCode }}
                    </span>
                    <input
                      v-model.number="form.sale_price"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-right text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                      placeholder="0.00"
                    />
                  </div>
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Precio de venta base antes de aplicar una lista comercial.
                  </p>
                </div>
              </div>

              <!-- SUMMARY -->
              <div
                class="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <div class="text-sm font-medium text-slate-700 dark:text-slate-300">Resumen</div>
                <div class="mt-3 grid gap-3 sm:grid-cols-3">
                  <!-- COST -->
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">Costo</div>
                    <div class="mt-1 font-semibold text-slate-900 dark:text-white">
                      {{ currencyCode }} {{ money(form.cost) }}
                    </div>
                  </div>

                  <!-- SALE -->
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">Precio base</div>
                    <div class="mt-1 font-semibold text-slate-900 dark:text-white">
                      {{ currencyCode }} {{ money(form.sale_price) }}
                    </div>
                  </div>

                  <!-- MARGIN -->
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">Margen</div>
                    <div class="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      {{ currencyCode }} {{ marginAmount }}
                      <span v-if="marginPercent !== null" class="ml-1 text-xs font-normal">
                        ({{ marginPercent }}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <footer
              class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-6"
            >
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                :disabled="saving"
                @click="close"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="saving || !canSave"
                @click="save"
              >
                <Plus v-if="!isEdit" class="mr-1.5 h-4 w-4" />
                <Pencil v-else class="mr-1.5 h-4 w-4" />
                {{ saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear precio base' }}
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { X, Plus, Pencil } from 'lucide-vue-next'

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },

  services: {
    type: Array,
    default: () => [],
  },

  variants: {
    type: Array,
    default: () => [],
  },

  currencies: {
    type: Array,
    default: () => [],
  },

  loadingVariants: {
    type: Boolean,
    default: false,
  },

  saving: {
    type: Boolean,
    default: false,
  },
})

/*
|--------------------------------------------------------------------------
| EMITS
|--------------------------------------------------------------------------
*/

const emit = defineEmits(['close', 'save', 'service-change'])

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const error = ref(null)

const selectedServiceUuid = ref('')

const form = reactive({
  service_variant_id: null,

  currency_id: null,

  cost: 0,

  sale_price: 0,

  active: true,
})

/*
|--------------------------------------------------------------------------
| MODE
|--------------------------------------------------------------------------
*/

const isEdit = computed(() => {
  return Boolean(props.item?.id)
})

/*
|--------------------------------------------------------------------------
| CURRENCY
|--------------------------------------------------------------------------
*/

const selectedCurrency = computed(() => {
  if (!form.currency_id) {
    return null
  }

  return (
    props.currencies.find((currency) => Number(currency.id) === Number(form.currency_id)) ?? null
  )
})

const currencyCode = computed(() => {
  return selectedCurrency.value?.code ?? ''
})

/*
|--------------------------------------------------------------------------
| MARGIN
|--------------------------------------------------------------------------
*/

const marginAmount = computed(() => {
  const cost = Number(form.cost ?? 0)

  const sale = Number(form.sale_price ?? 0)

  return (sale - cost).toFixed(2)
})

const marginPercent = computed(() => {
  const cost = Number(form.cost ?? 0)

  const sale = Number(form.sale_price ?? 0)

  /*
    |--------------------------------------------------------------------------
    | Sin costo no podemos calcular porcentaje.
    |--------------------------------------------------------------------------
    */

  if (cost <= 0) {
    return null
  }

  return (((sale - cost) / cost) * 100).toFixed(2)
})

/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/

const canSave = computed(() => {
  /*
    |--------------------------------------------------------------------------
    | Service
    |--------------------------------------------------------------------------
    */

  if (!selectedServiceUuid.value) {
    return false
  }

  /*
    |--------------------------------------------------------------------------
    | Variant
    |--------------------------------------------------------------------------
    */

  if (!form.service_variant_id) {
    return false
  }

  /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    */

  if (!form.currency_id) {
    return false
  }

  /*
    |--------------------------------------------------------------------------
    | Prices
    |--------------------------------------------------------------------------
    */

  if (Number(form.cost) < 0) {
    return false
  }

  if (Number(form.sale_price) < 0) {
    return false
  }

  return true
})

/*
|--------------------------------------------------------------------------
| SERVICE CHANGE
|--------------------------------------------------------------------------
*/

function onServiceChange() {
  /*
  |--------------------------------------------------------------------------
  | Limpiar variante anterior.
  |--------------------------------------------------------------------------
  */

  form.service_variant_id = null

  /*
  |--------------------------------------------------------------------------
  | El padre cargará las variantes.
  |--------------------------------------------------------------------------
  */

  emit('service-change', selectedServiceUuid.value)
}

/*
|--------------------------------------------------------------------------
| LOAD FORM
|--------------------------------------------------------------------------
*/

function loadForm(item = null) {
  error.value = null

  /*
  |--------------------------------------------------------------------------
  | CREATE
  |--------------------------------------------------------------------------
  */

  if (!item) {
    selectedServiceUuid.value = ''

    form.service_variant_id = null

    form.currency_id = null

    form.cost = 0

    form.sale_price = 0

    form.active = true

    return
  }

  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  */

  selectedServiceUuid.value = item.service_variant?.service?.uuid ?? item.service?.uuid ?? ''

  form.service_variant_id = item.service_variant_id ?? item.service_variant?.id ?? null

  form.currency_id = item.currency_id ?? item.currency?.id ?? null

  form.cost = Number(item.cost ?? 0)

  form.sale_price = Number(item.sale_price ?? 0)

  form.active = Boolean(item.active ?? true)
}

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

function save() {
  error.value = null

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  if (!selectedServiceUuid.value) {
    error.value = 'Seleccione un servicio.'

    return
  }

  if (!form.service_variant_id) {
    error.value = 'Seleccione una variante.'

    return
  }

  if (!form.currency_id) {
    error.value = 'Seleccione una moneda.'

    return
  }

  if (Number(form.cost) < 0) {
    error.value = 'El costo no puede ser negativo.'

    return
  }

  if (Number(form.sale_price) < 0) {
    error.value = 'El precio base no puede ser negativo.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | PAYLOAD
  |--------------------------------------------------------------------------
  |
  | Coincide exactamente con BasePrice::$fillable:
  |
  | service_variant_id
  | currency_id
  | cost
  | sale_price
  | active
  |
  */

  const payload = {
    service_variant_id: Number(form.service_variant_id),

    currency_id: Number(form.currency_id),

    cost: Number(form.cost),

    sale_price: Number(form.sale_price),

    active: Boolean(form.active),
  }

  emit('save', payload)
}

/*
|--------------------------------------------------------------------------
| CLOSE
|--------------------------------------------------------------------------
*/

function close() {
  if (props.saving) {
    return
  }

  emit('close')
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
| WATCH ITEM
|--------------------------------------------------------------------------
*/

watch(
  () => props.item,

  (item) => {
    loadForm(item)
  },

  {
    immediate: true,
    deep: true,
  },
)
</script>
