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
            :aria-label="isEdit ? 'Editar regla comercial' : 'Nueva regla comercial'"
            class="w-full max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ isEdit ? 'Editar regla comercial' : 'Nueva regla comercial' }}
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Define cómo esta lista de precios modifica el precio base de una variante.
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

              <!-- PRICE LIST CONTEXT -->
              <div
                v-if="priceList"
                class="mb-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <div class="text-xs text-slate-500 dark:text-slate-400">Lista de precios</div>
                <div class="mt-1 font-medium text-slate-900 dark:text-white">
                  {{ priceList.code }} - {{ priceList.name }}
                </div>
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
                    @change="onVariantChange"
                  >
                    <option :value="null">
                      {{ loadingVariants ? 'Cargando variantes...' : 'Seleccione...' }}
                    </option>
                    <option v-for="variant in variants" :key="variant.id" :value="variant.id">
                      {{ variant.name }}
                    </option>
                  </select>
                </div>

                <!-- ADJUSTMENT TYPE -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tipo de ajuste <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.adjustment_type"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="PERCENTAGE">Porcentaje</option>
                    <option value="FIXED">Importe fijo</option>
                    <option value="OVERRIDE">Precio fijo</option>
                  </select>
                </div>

                <!-- ADJUSTMENT VALUE -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Valor del ajuste <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="form.adjustment_value"
                      type="number"
                      step="0.01"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                      :placeholder="adjustmentPlaceholder"
                    />
                    <span
                      v-if="form.adjustment_type === 'PERCENTAGE'"
                      class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500"
                    >
                      %
                    </span>
                  </div>
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {{ adjustmentHelp }}
                  </p>
                </div>

                <!-- ACTIVE -->
                <div class="md:col-span-2">
                  <label
                    class="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
                  >
                    <input
                      v-model="form.active"
                      type="checkbox"
                      class="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-600 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800"
                    />
                    <div>
                      <div class="text-sm font-medium text-slate-800 dark:text-slate-200">
                        Regla activa
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400">
                        Disponible para el motor de precios.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- BASE PRICE -->
              <div
                class="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Precio base
                    </div>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Tarifa sobre la cual se aplicará esta regla.
                    </p>
                  </div>
                  <span v-if="loadingBasePrice" class="text-xs text-slate-400 dark:text-slate-500">
                    <span
                      class="inline-block h-3 w-3 animate-spin rounded-full border-2 border-teal-600 border-t-transparent mr-1"
                    ></span>
                    Consultando...
                  </span>
                </div>

                <!-- NO VARIANT -->
                <div
                  v-if="!form.service_variant_id"
                  class="mt-4 text-sm text-slate-400 dark:text-slate-500"
                >
                  Seleccione una variante.
                </div>

                <!-- NO BASE PRICE -->
                <div
                  v-else-if="!loadingBasePrice && !basePrice"
                  class="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                >
                  Esta variante no tiene un precio base activo.
                </div>

                <!-- BASE PRICE INFO -->
                <div v-else-if="basePrice" class="mt-4 grid gap-4 sm:grid-cols-4">
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">Costo</div>
                    <div class="mt-1 font-medium text-slate-900 dark:text-white">
                      {{ currencyCode }} {{ money(basePrice.cost) }}
                    </div>
                  </div>

                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">Precio base</div>
                    <div class="mt-1 font-medium text-slate-900 dark:text-white">
                      {{ currencyCode }} {{ money(basePrice.sale_price) }}
                    </div>
                  </div>

                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">Ajuste</div>
                    <div class="mt-1 font-medium text-slate-900 dark:text-white">
                      {{ adjustmentPreview }}
                    </div>
                  </div>

                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">Precio resultante</div>
                    <div class="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      {{ currencyCode }} {{ money(resultPrice) }}
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
                {{ saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear regla' }}
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

  priceList: {
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

  basePrice: {
    type: Object,
    default: null,
  },

  loadingVariants: {
    type: Boolean,
    default: false,
  },

  loadingBasePrice: {
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

const emit = defineEmits(['close', 'save', 'service-change', 'variant-change'])

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const error = ref(null)

const selectedServiceUuid = ref('')

const form = reactive({
  service_variant_id: null,

  adjustment_type: 'PERCENTAGE',

  adjustment_value: 0,

  active: true,
})

/*
|--------------------------------------------------------------------------
| MODE
|--------------------------------------------------------------------------
*/

const isEdit = computed(() => Boolean(props.item?.id))

/*
|--------------------------------------------------------------------------
| CURRENCY
|--------------------------------------------------------------------------
*/

const currencyCode = computed(() => {
  return props.basePrice?.currency?.code ?? ''
})

/*
|--------------------------------------------------------------------------
| PLACEHOLDER
|--------------------------------------------------------------------------
*/

const adjustmentPlaceholder = computed(() => {
  switch (form.adjustment_type) {
    case 'PERCENTAGE':
      return '-10'

    case 'FIXED':
      return '-15.00'

    case 'OVERRIDE':
      return '100.00'

    default:
      return '0'
  }
})

/*
|--------------------------------------------------------------------------
| HELP
|--------------------------------------------------------------------------
*/

const adjustmentHelp = computed(() => {
  switch (form.adjustment_type) {
    case 'PERCENTAGE':
      return '-10 aplica un descuento del 10%. ' + '10 incrementa el precio en 10%.'

    case 'FIXED':
      return '-15 resta 15 unidades monetarias. ' + '15 suma 15.'

    case 'OVERRIDE':
      return 'El valor ingresado será el precio final.'

    default:
      return ''
  }
})

/*
|--------------------------------------------------------------------------
| RESULT PRICE
|--------------------------------------------------------------------------
*/

const resultPrice = computed(() => {
  if (!props.basePrice) {
    return 0
  }

  const base = Number(props.basePrice.sale_price ?? 0)

  const adjustment = Number(form.adjustment_value ?? 0)

  switch (form.adjustment_type) {
    case 'PERCENTAGE':
      return base + (base * adjustment) / 100

    case 'FIXED':
      return base + adjustment

    case 'OVERRIDE':
      return adjustment

    default:
      return base
  }
})

/*
|--------------------------------------------------------------------------
| PREVIEW
|--------------------------------------------------------------------------
*/

const adjustmentPreview = computed(() => {
  const value = Number(form.adjustment_value ?? 0)

  switch (form.adjustment_type) {
    case 'PERCENTAGE':
      return `${signed(value)}%`

    case 'FIXED':
      return `${currencyCode.value} ` + signedMoney(value)

    case 'OVERRIDE':
      return `${currencyCode.value} ` + money(value)

    default:
      return '-'
  }
})

/*
|--------------------------------------------------------------------------
| CAN SAVE
|--------------------------------------------------------------------------
|
| IMPORTANTE:
|
| Ya no bloqueamos el botón por falta de BasePrice.
| BasePrice se valida dentro de save().
|
|--------------------------------------------------------------------------
*/

const canSave = computed(() => {
  if (!selectedServiceUuid.value) {
    return false
  }

  if (!form.service_variant_id) {
    return false
  }

  if (!form.adjustment_type) {
    return false
  }

  if (form.adjustment_value === null || form.adjustment_value === '') {
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
  form.service_variant_id = null

  emit('service-change', selectedServiceUuid.value)
}

/*
|--------------------------------------------------------------------------
| VARIANT CHANGE
|--------------------------------------------------------------------------
*/

function onVariantChange() {
  emit('variant-change', form.service_variant_id)
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

    form.adjustment_type = 'PERCENTAGE'

    form.adjustment_value = 0

    form.active = true

    return
  }

  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  */

  console.log('ITEM RECIBIDO PARA EDITAR:', item)

  /*
  |--------------------------------------------------------------------------
  | Service
  |--------------------------------------------------------------------------
  */

  selectedServiceUuid.value = item.service_variant?.service?.uuid ?? ''

  /*
  |--------------------------------------------------------------------------
  | Variant
  |--------------------------------------------------------------------------
  */

  form.service_variant_id = item.service_variant_id ?? item.service_variant?.id ?? null

  /*
  |--------------------------------------------------------------------------
  | Adjustment Type
  |--------------------------------------------------------------------------
  */

  form.adjustment_type = item.adjustment_type
    ? String(item.adjustment_type).toUpperCase()
    : 'PERCENTAGE'

  /*
  |--------------------------------------------------------------------------
  | Adjustment Value
  |--------------------------------------------------------------------------
  */

  form.adjustment_value =
    item.adjustment_value !== null && item.adjustment_value !== undefined
      ? Number(item.adjustment_value)
      : 0

  /*
  |--------------------------------------------------------------------------
  | Active
  |--------------------------------------------------------------------------
  */

  form.active = item.active === undefined ? true : Boolean(item.active)

  console.log('FORM CARGADO:', {
    service_variant_id: form.service_variant_id,

    adjustment_type: form.adjustment_type,

    adjustment_value: form.adjustment_value,

    active: form.active,
  })
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
  | Service
  |--------------------------------------------------------------------------
  */

  if (!selectedServiceUuid.value) {
    error.value = 'Seleccione un servicio.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Variant
  |--------------------------------------------------------------------------
  */

  if (!form.service_variant_id) {
    error.value = 'Seleccione una variante.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Esperar BasePrice
  |--------------------------------------------------------------------------
  */

  if (props.loadingBasePrice) {
    error.value = 'El precio base todavía se está cargando.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | BasePrice
  |--------------------------------------------------------------------------
  */

  if (!props.basePrice) {
    error.value = 'La variante seleccionada no tiene un precio base activo.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Adjustment
  |--------------------------------------------------------------------------
  */

  if (!form.adjustment_type) {
    error.value = 'Seleccione un tipo de ajuste.'

    return
  }

  if (form.adjustment_value === null || form.adjustment_value === '') {
    error.value = 'Ingrese el valor del ajuste.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Resultado negativo
  |--------------------------------------------------------------------------
  */

  if (resultPrice.value < 0) {
    error.value = 'El precio resultante no puede ser negativo.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | PAYLOAD
  |--------------------------------------------------------------------------
  |
  | No enviamos PriceList.
  |
  | El padre/store ya conoce el UUID de la lista seleccionada.
  |
  */

  const payload = {
    service_variant_id: Number(form.service_variant_id),

    adjustment_type: form.adjustment_type,

    adjustment_value: Number(form.adjustment_value),

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
| FORMATTERS
|--------------------------------------------------------------------------
*/

function money(value) {
  return Number(value ?? 0).toFixed(2)
}

function signed(value) {
  const number = Number(value ?? 0)

  if (number > 0) {
    return `+${number}`
  }

  return String(number)
}

function signedMoney(value) {
  const number = Number(value ?? 0)

  if (number > 0) {
    return `+${money(number)}`
  }

  return money(number)
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

<style scoped>
@reference "tailwindcss";

.form-label {
  @apply mb-1.5 block
  text-sm font-medium
  text-slate-700
  dark:text-slate-300;
}

.form-control {
  @apply w-full
  rounded-lg
  border border-slate-300
  bg-white
  px-3 py-2.5
  text-sm
  text-slate-900
  outline-none
  transition
  focus:border-teal-500
  focus:ring-2
  focus:ring-teal-100
  disabled:cursor-not-allowed
  disabled:bg-slate-100
  disabled:text-slate-400
  dark:border-slate-700
  dark:bg-slate-800
  dark:text-slate-100
  dark:focus:ring-teal-950
  dark:disabled:bg-slate-900;
}

.summary-label {
  @apply text-xs
  text-slate-500
  dark:text-slate-400;
}

.summary-value {
  @apply mt-1
  font-semibold
  text-slate-900
  dark:text-white;
}

.btn-primary {
  @apply inline-flex
  items-center
  justify-center
  rounded-lg
  bg-teal-600
  px-4 py-2.5
  text-sm font-medium
  text-white
  transition
  hover:bg-teal-700
  disabled:cursor-not-allowed
  disabled:bg-slate-300;
}

.btn-secondary {
  @apply inline-flex
  items-center
  justify-center
  rounded-lg
  border border-slate-300
  bg-white
  px-4 py-2.5
  text-sm font-medium
  text-slate-700
  transition
  hover:bg-slate-50
  disabled:cursor-not-allowed
  disabled:opacity-50
  dark:border-slate-700
  dark:bg-slate-800
  dark:text-slate-200;
}
</style>
