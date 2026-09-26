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
            :aria-label="price?.id ? 'Editar tarifa' : 'Nueva tarifa'"
            class="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <form @submit.prevent="submit">
              <!-- HEADER -->
              <header
                class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
              >
                <div>
                  <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                    {{ price?.id ? 'Editar tarifa' : 'Nueva tarifa' }}
                  </h2>
                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {{ variant?.name }}
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

                <div class="grid gap-4 sm:grid-cols-2">
                  <!-- TIPO TARIFARIO -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Tipo tarifario <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="form.price_type_id"
                      required
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option :value="null">Seleccione</option>
                      <option v-for="item in priceTypes" :key="item.id" :value="item.id">
                        {{ item.name }} · {{ quantityBasisLabel(item.quantity_basis) }}
                      </option>
                    </select>
                    <p
                      v-if="selectedPriceType"
                      class="mt-1 text-xs text-slate-500 dark:text-slate-400"
                    >
                      La cantidad se resolverá
                      {{ quantityBasisDescription(selectedPriceType.quantity_basis) }}.
                    </p>
                  </div>

                  <!-- TIPO DE PASAJERO -->
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
                      <option :value="null">No aplica</option>
                      <option v-for="item in passengerTypes" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </option>
                    </select>
                  </div>

                  <!-- MONEDA -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Moneda <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="form.currency_id"
                      required
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option :value="null">Seleccione</option>
                      <option v-for="item in currencies" :key="item.id" :value="item.id">
                        {{ item.code }}
                      </option>
                    </select>
                  </div>

                  <!-- PRIORIDAD -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Prioridad <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model.number="form.priority"
                      type="number"
                      min="1"
                      required
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <!-- CANTIDAD MÍNIMA -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Cantidad mínima
                      <span class="text-slate-400 dark:text-slate-500">(opcional)</span>
                    </label>
                    <input
                      v-model.number="form.min_quantity"
                      type="number"
                      min="1"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                    />
                  </div>

                  <!-- CANTIDAD MÁXIMA -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Cantidad máxima
                      <span class="text-slate-400 dark:text-slate-500">(opcional)</span>
                    </label>
                    <input
                      v-model.number="form.max_quantity"
                      type="number"
                      min="1"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                    />
                  </div>

                  <!-- VIGENTE DESDE -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Vigente desde
                      <span class="text-slate-400 dark:text-slate-500">(opcional)</span>
                    </label>
                    <input
                      v-model="form.valid_from"
                      type="date"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
                    />
                  </div>

                  <!-- VIGENTE HASTA -->
                  <div>
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Vigente hasta
                      <span class="text-slate-400 dark:text-slate-500">(opcional)</span>
                    </label>
                    <input
                      v-model="form.valid_to"
                      type="date"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
                    />
                  </div>

                  <!-- COSTO -->
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
                        {{ selectedCurrencySymbol }}
                      </span>
                      <input
                        v-model.number="form.cost"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        class="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2.5 text-right text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <!-- PRECIO DE VENTA -->
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
                        {{ selectedCurrencySymbol }}
                      </span>
                      <input
                        v-model.number="form.sale_price"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        class="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2.5 text-right text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <!-- ACTIVA -->
                <label
                  class="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
                >
                  <input
                    v-model="form.active"
                    type="checkbox"
                    class="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-600 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <span>
                    <span class="block text-sm font-medium text-slate-800 dark:text-slate-200">
                      Activa
                    </span>
                    <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                      La tarifa estará disponible para ser utilizada.
                    </span>
                  </span>
                </label>
              </div>

              <!-- FOOTER -->
              <footer
                class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-6"
              >
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  @click="close"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="saving"
                >
                  <Save v-if="!price?.id" class="mr-1.5 h-4 w-4" />
                  <Pencil v-else class="mr-1.5 h-4 w-4" />
                  {{ saving ? 'Guardando...' : 'Guardar' }}
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { X, Save, Pencil } from 'lucide-vue-next'
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  price: { type: Object, default: null },
  variant: { type: Object, required: true },
  currencies: { type: Array, default: () => [] },
  priceTypes: { type: Array, default: () => [] },
  passengerTypes: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'save'])
const error = ref(null)

const form = reactive({
  price_type_id: null,
  passenger_type_id: null,
  currency_id: null,
  min_quantity: null,
  max_quantity: null,
  valid_from: '',
  valid_to: '',
  cost: 0,
  sale_price: 0,
  priority: 1,
  active: true,
})

const selectedPriceType = computed(() =>
  props.priceTypes.find((item) => Number(item.id) === Number(form.price_type_id)),
)

watch(
  () => props.price,
  (price) => {
    Object.assign(form, {
      price_type_id: price?.price_type_id ?? price?.price_type?.id ?? null,
      passenger_type_id: price?.passenger_type_id ?? price?.passenger_type?.id ?? null,
      currency_id: price?.currency_id ?? price?.currency?.id ?? props.currencies[0]?.id ?? null,
      min_quantity: price?.min_quantity ?? null,
      max_quantity: price?.max_quantity ?? null,
      valid_from: normalizeDate(price?.valid_from),
      valid_to: normalizeDate(price?.valid_to),
      cost: Number(price?.cost ?? 0),
      sale_price: Number(price?.sale_price ?? 0),
      priority: Number(price?.priority ?? 1),
      active: price?.active ?? true,
    })
  },
  { immediate: true },
)

function submit() {
  error.value = validate()

  if (error.value) return

  emit('save', {
    price_type_id: Number(form.price_type_id),
    passenger_type_id: form.passenger_type_id ? Number(form.passenger_type_id) : null,
    currency_id: Number(form.currency_id),
    min_quantity: nullableNumber(form.min_quantity),
    max_quantity: nullableNumber(form.max_quantity),
    valid_from: form.valid_from || null,
    valid_to: form.valid_to || null,
    cost: Number(form.cost),
    sale_price: Number(form.sale_price),
    priority: Number(form.priority),
    active: Boolean(form.active),
  })
}

function validate() {
  if (!form.price_type_id || !form.currency_id) return 'Tipo tarifario y moneda son obligatorios.'
  if (
    form.min_quantity &&
    form.max_quantity &&
    Number(form.max_quantity) < Number(form.min_quantity)
  ) {
    return 'La cantidad máxima no puede ser menor que la mínima.'
  }
  if (form.valid_from && form.valid_to && form.valid_to < form.valid_from) {
    return 'La fecha final no puede ser anterior a la inicial.'
  }
  return null
}

function nullableNumber(value) {
  return value === null || value === '' ? null : Number(value)
}

function normalizeDate(value) {
  return value ? String(value).slice(0, 10) : ''
}

function normalizedQuantityBasis(value) {
  return typeof value === 'object' ? value?.value : value
}

function quantityBasisLabel(value) {
  if (normalizedQuantityBasis(value) === 'PASSENGERS') return 'Por pasajeros'
  if (normalizedQuantityBasis(value) === 'UNITS') return 'Por unidades'

  return 'Base no definida'
}

function quantityBasisDescription(value) {
  if (normalizedQuantityBasis(value) === 'PASSENGERS') return 'según los pasajeros asignados'
  if (normalizedQuantityBasis(value) === 'UNITS') return 'según las unidades recomendadas'

  return 'sin una base tarifaria definida'
}

function close() {
  emit('close')
}
</script>
