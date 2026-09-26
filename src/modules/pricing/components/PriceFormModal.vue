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
        @click.self="cancel"
      >
        <div class="flex min-h-full items-center justify-center">
          <div
            role="dialog"
            aria-modal="true"
            :aria-label="isEdit ? 'Editar precio' : 'Nuevo precio'"
            class="w-full max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ isEdit ? 'Editar precio' : 'Nuevo precio' }}
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {{
                    isEdit
                      ? 'Modifique la configuración de la tarifa seleccionada.'
                      : 'Registre una nueva tarifa para una variante del servicio.'
                  }}
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                @click="cancel"
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

              <!-- CONTEXTO -->
              <div
                class="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <div class="mb-4 flex items-center justify-between">
                  <div>
                    <h3 class="font-semibold text-slate-900 dark:text-white">Contexto de tarifa</h3>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Seleccione lista, variante y tipo de precio.
                    </p>
                  </div>
                  <span
                    class="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    Pricing
                  </span>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <!-- PRICE LIST -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Lista de precios <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="form.price_list_id"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option :value="null">Seleccione...</option>
                      <option v-for="item in priceLists" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>

                  <!-- PRICE TYPE -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Tipo de precio <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="form.price_type_id"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option :value="null">Seleccione...</option>
                      <option v-for="item in priceTypes" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>

                  <!-- SERVICE -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Servicio
                    </label>
                    <select
                      v-model="selectedServiceId"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      @change="onServiceChange"
                    >
                      <option :value="null">Seleccione...</option>
                      <option v-for="service in services" :key="service.uuid" :value="service.uuid">
                        {{ service.name }}
                      </option>
                    </select>
                  </div>

                  <!-- VARIANT -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Variante <span class="text-red-500">*</span>
                      {{ availableVariants.length }}
                    </label>
                    <select
                      v-model="form.service_variant_id"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      :disabled="!availableVariants.length"
                    >
                      <option :value="null">
                        {{ availableVariants.length ? 'Seleccione...' : 'No hay variantes' }}
                      </option>
                      <option
                        v-for="variant in availableVariants"
                        :key="variant.id"
                        :value="variant.id"
                      >
                        {{ variant.name }}
                      </option>
                    </select>
                  </div>

                  <!-- PASSENGER TYPE -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Tipo de pasajero
                    </label>
                    <select
                      v-model="form.passenger_type_id"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option :value="null">General / No aplica</option>
                      <option v-for="type in passengerTypes" :key="type.id" :value="type.id">
                        {{ type.name }}
                      </option>
                    </select>
                  </div>

                  <!-- ACTIVE -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Estado
                    </label>
                    <div
                      class="flex h-[42px] items-center rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
                    >
                      <label class="relative inline-flex cursor-pointer items-center">
                        <input v-model="form.active" type="checkbox" class="peer sr-only" />
                        <div
                          class="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-teal-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full dark:bg-slate-600"
                        ></div>
                      </label>
                      <span class="ml-3 text-sm text-slate-700 dark:text-slate-300">
                        {{ form.active ? 'Activo' : 'Inactivo' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- RANGO -->
              <div
                class="mb-6 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div class="mb-4">
                  <h3 class="font-semibold text-slate-900 dark:text-white">Rango de cantidad</h3>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Define el rango sobre el que aplica esta tarifa.
                  </p>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Cantidad mínima
                    </label>
                    <input
                      v-model.number="form.min_quantity"
                      type="number"
                      min="1"
                      step="1"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Cantidad máxima
                    </label>
                    <input
                      v-model.number="form.max_quantity"
                      type="number"
                      min="1"
                      step="1"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <!-- PRICING -->
              <div
                class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div class="mb-4">
                  <h3 class="font-semibold text-slate-900 dark:text-white">Valores económicos</h3>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Configure costo y precio de venta.
                  </p>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <!-- COST -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Costo <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <span
                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-400 dark:text-slate-500"
                      >
                        $
                      </span>
                      <input
                        v-model.number="form.cost"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full rounded-lg border border-slate-300 bg-white pl-7 pr-3 py-2.5 text-right text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <!-- SALE PRICE -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Precio de venta <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <span
                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-400 dark:text-slate-500"
                      >
                        $
                      </span>
                      <input
                        v-model.number="form.sale_price"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full rounded-lg border border-slate-300 bg-white pl-7 pr-3 py-2.5 text-right text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <!-- SUMMARY -->
                <div
                  class="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50 md:grid-cols-3"
                >
                  <div>
                    <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Costo
                    </div>
                    <div class="mt-1 font-semibold text-slate-900 dark:text-white">
                      {{ money(form.cost) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Venta
                    </div>
                    <div class="mt-1 font-semibold text-slate-900 dark:text-white">
                      {{ money(form.sale_price) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Margen
                    </div>
                    <div
                      class="mt-1 font-semibold"
                      :class="
                        margin >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      "
                    >
                      {{ money(margin) }}
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
                @click="cancel"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!canSave"
                @click="save"
              >
                <Plus v-if="!isEdit" class="mr-1.5 h-4 w-4" />
                <Pencil v-else class="mr-1.5 h-4 w-4" />
                {{ isEdit ? 'Actualizar precio' : 'Crear precio' }}
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
import { Plus, Pencil, X } from 'lucide-vue-next'

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

  priceLists: {
    type: Array,
    default: () => [],
  },

  priceTypes: {
    type: Array,
    default: () => [],
  },

  passengerTypes: {
    type: Array,
    default: () => [],
  },

  services: {
    type: Array,
    default: () => [],
  },
})

/*
|--------------------------------------------------------------------------
| EMITS
|--------------------------------------------------------------------------
*/
const emit = defineEmits(['close', 'save'])

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const error = ref(null)

const selectedServiceId = ref(null)

/*
|--------------------------------------------------------------------------
| MODE
|--------------------------------------------------------------------------
*/

const isEdit = computed(() => {
  return !!props.item?.id
})

/*
|--------------------------------------------------------------------------
| FORM
|--------------------------------------------------------------------------
|
| No inicializamos directamente desde props.item.
|
| loadForm() se encarga tanto de CREATE como de EDIT.
|
*/

const form = reactive({
  price_list_id: null,

  service_variant_id: null,

  price_type_id: null,

  passenger_type_id: null,

  min_quantity: 1,

  max_quantity: 1,

  cost: 0,

  sale_price: 0,

  active: true,
})

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
    form.price_list_id = null

    form.service_variant_id = null

    form.price_type_id = null

    form.passenger_type_id = null

    form.min_quantity = 1

    form.max_quantity = 1

    form.cost = 0

    form.sale_price = 0

    form.active = true

    selectedServiceId.value = null

    return
  }

  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  |
  | Soportamos tanto IDs planos:
  |
  | price_list_id
  |
  | como relaciones devueltas por Resource:
  |
  | price_list.id
  |
  */

  form.price_list_id = item.price_list_id ?? item.price_list?.id ?? null

  form.service_variant_id =
    item.service_variant_id ?? item.variant?.id ?? item.service_variant?.id ?? null

  form.price_type_id = item.price_type_id ?? item.price_type?.id ?? null

  form.passenger_type_id = item.passenger_type_id ?? item.passenger_type?.id ?? null

  form.min_quantity = item.min_quantity ?? 1

  form.max_quantity = item.max_quantity ?? 1

  form.cost = Number(item.cost ?? 0)

  form.sale_price = Number(item.sale_price ?? 0)

  form.active = Boolean(item.active ?? true)

  /*
  |--------------------------------------------------------------------------
  | Resolver Service desde ServiceVariant
  |--------------------------------------------------------------------------
  */

  resolveSelectedService()
}

/*
|--------------------------------------------------------------------------
| AVAILABLE VARIANTS
|--------------------------------------------------------------------------
|
| Price NO tiene service_id.
|
| Service solamente funciona como selector auxiliar.
|
*/

const availableVariants = computed(() => {
  if (!selectedServiceId.value) {
    return []
  }

  const service = props.services.find((service) => service.uuid === selectedServiceId.value)

  return service?.variants ?? []
})

/*
|--------------------------------------------------------------------------
| SELECTED SERVICE
|--------------------------------------------------------------------------
|
| Buscamos qué Service contiene el service_variant_id actual.
|
| Se espera:
|
| services = [
|   {
|     id,
|     name,
|     variants: [...]
|   }
| ]
|
*/

function resolveSelectedService() {
  debugger
  if (!form.service_variant_id) {
    selectedServiceId.value = null

    return
  }

  const service = props.services.find((service) =>
    service.variants?.some((variant) => Number(variant.id) === Number(form.service_variant_id)),
  )

  selectedServiceId.value = service?.uuid ?? null
}

/*
|--------------------------------------------------------------------------
| SERVICE CHANGE
|--------------------------------------------------------------------------
|
| Si cambia el servicio, la variante anterior deja de ser válida.
|
*/

function onServiceChange() {
  form.service_variant_id = null
}

/*
|--------------------------------------------------------------------------
| MARGIN
|--------------------------------------------------------------------------
*/

const margin = computed(() => {
  return Number(form.sale_price ?? 0) - Number(form.cost ?? 0)
})

/*
|--------------------------------------------------------------------------
| MARGIN PERCENTAGE
|--------------------------------------------------------------------------
|
| No es obligatorio para guardar.
| Solo queda disponible si luego quieres mostrarlo.
|
*/

const marginPercentage = computed(() => {
  const cost = Number(form.cost ?? 0)

  const sale = Number(form.sale_price ?? 0)

  if (cost <= 0) {
    return 0
  }

  return ((sale - cost) / cost) * 100
})

/*
|--------------------------------------------------------------------------
| CAN SAVE
|--------------------------------------------------------------------------
*/

const canSave = computed(() => {
  /*
    |--------------------------------------------------------------------------
    | PriceList
    |--------------------------------------------------------------------------
    */

  if (!form.price_list_id) {
    return false
  }

  /*
    |--------------------------------------------------------------------------
    | ServiceVariant
    |--------------------------------------------------------------------------
    */

  if (!form.service_variant_id) {
    return false
  }

  /*
    |--------------------------------------------------------------------------
    | PriceType
    |--------------------------------------------------------------------------
    */

  if (!form.price_type_id) {
    return false
  }

  /*
    |--------------------------------------------------------------------------
    | Cost
    |--------------------------------------------------------------------------
    */

  if (
    form.cost === '' ||
    form.cost === null ||
    Number.isNaN(Number(form.cost)) ||
    Number(form.cost) < 0
  ) {
    return false
  }

  /*
    |--------------------------------------------------------------------------
    | Sale price
    |--------------------------------------------------------------------------
    */

  if (
    form.sale_price === '' ||
    form.sale_price === null ||
    Number.isNaN(Number(form.sale_price)) ||
    Number(form.sale_price) < 0
  ) {
    return false
  }

  /*
    |--------------------------------------------------------------------------
    | Min quantity
    |--------------------------------------------------------------------------
    */

  if (form.min_quantity !== null && form.min_quantity !== '' && Number(form.min_quantity) < 1) {
    return false
  }

  /*
    |--------------------------------------------------------------------------
    | Max quantity
    |--------------------------------------------------------------------------
    */

  if (form.max_quantity !== null && form.max_quantity !== '' && Number(form.max_quantity) < 1) {
    return false
  }

  /*
    |--------------------------------------------------------------------------
    | Range
    |--------------------------------------------------------------------------
    */

  if (
    form.min_quantity !== null &&
    form.min_quantity !== '' &&
    form.max_quantity !== null &&
    form.max_quantity !== '' &&
    Number(form.min_quantity) > Number(form.max_quantity)
  ) {
    return false
  }

  return true
})

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

function save() {
  error.value = null

  if (!canSave.value) {
    error.value = 'Complete correctamente los campos obligatorios.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | Validación explícita del rango
  |--------------------------------------------------------------------------
  */

  if (
    form.min_quantity !== null &&
    form.min_quantity !== '' &&
    form.max_quantity !== null &&
    form.max_quantity !== '' &&
    Number(form.min_quantity) > Number(form.max_quantity)
  ) {
    error.value = 'La cantidad máxima debe ser mayor o igual a la mínima.'

    return
  }

  /*
  |--------------------------------------------------------------------------
  | PAYLOAD
  |--------------------------------------------------------------------------
  |
  | Exactamente las propiedades fillable de Price:
  |
  | price_list_id
  | service_variant_id
  | price_type_id
  | passenger_type_id
  | min_quantity
  | max_quantity
  | cost
  | sale_price
  | active
  |
  */

  const payload = {
    price_list_id: Number(form.price_list_id),

    service_variant_id: Number(form.service_variant_id),

    price_type_id: Number(form.price_type_id),

    passenger_type_id:
      form.passenger_type_id !== null && form.passenger_type_id !== ''
        ? Number(form.passenger_type_id)
        : null,

    min_quantity:
      form.min_quantity !== null && form.min_quantity !== '' ? Number(form.min_quantity) : null,

    max_quantity:
      form.max_quantity !== null && form.max_quantity !== '' ? Number(form.max_quantity) : null,

    cost: Number(form.cost ?? 0),

    sale_price: Number(form.sale_price ?? 0),

    active: Boolean(form.active),
  }

  emit('save', payload)
}

/*
|--------------------------------------------------------------------------
| CANCEL
|--------------------------------------------------------------------------
*/

function cancel() {
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
|
| Esta es la corrección importante para EDIT.
|
| immediate:
| carga al abrir el modal.
|
| deep:
| detecta modificaciones del objeto recibido.
|
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

/*
|--------------------------------------------------------------------------
| WATCH SERVICES
|--------------------------------------------------------------------------
|
| Puede ocurrir:
|
| 1. Se abre modal
| 2. Price ya está cargado
| 3. services todavía está vacío
| 4. después llega services desde API
|
| En ese caso volvemos a resolver el Service.
|
*/

watch(
  () => props.services,

  () => {
    if (form.service_variant_id) {
      resolveSelectedService()
    }
  },

  {
    deep: true,
  },
)
</script>
