<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="close">
    <form class="w-full max-w-2xl space-y-4 bg-white p-5 dark:bg-slate-900" @submit.prevent="submit">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold">{{ price?.id ? 'Editar tarifa' : 'Nueva tarifa' }}</h2>
        <button type="button" @click="close">✕</button>
      </div>

      <p>{{ variant?.name }}</p>

      <p v-if="error" class="text-red-600">{{ error }}</p>

      <div class="grid gap-3 sm:grid-cols-2">
        <label>
          <span>Tipo tarifario</span>
          <select v-model="form.price_type_id" required class="w-full border p-2">
            <option :value="null">Seleccione</option>
            <option v-for="item in priceTypes" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </label>

        <label>
          <span>Tipo de pasajero</span>
          <select v-model="form.passenger_type_id" class="w-full border p-2">
            <option :value="null">No aplica</option>
            <option v-for="item in passengerTypes" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </label>

        <label>
          <span>Moneda</span>
          <select v-model="form.currency_id" required class="w-full border p-2">
            <option :value="null">Seleccione</option>
            <option v-for="item in currencies" :key="item.id" :value="item.id">
              {{ item.code }}
            </option>
          </select>
        </label>

        <label>
          <span>Prioridad</span>
          <input v-model.number="form.priority" type="number" min="1" required class="w-full border p-2" />
        </label>

        <label>
          <span>Cantidad mínima (opcional)</span>
          <input v-model.number="form.min_quantity" type="number" min="1" class="w-full border p-2" />
        </label>

        <label>
          <span>Cantidad máxima (opcional)</span>
          <input v-model.number="form.max_quantity" type="number" min="1" class="w-full border p-2" />
        </label>

        <label>
          <span>Vigente desde (opcional)</span>
          <input v-model="form.valid_from" type="date" class="w-full border p-2" />
        </label>

        <label>
          <span>Vigente hasta (opcional)</span>
          <input v-model="form.valid_to" type="date" class="w-full border p-2" />
        </label>

        <label>
          <span>Costo</span>
          <input v-model.number="form.cost" type="number" min="0" step="0.01" required class="w-full border p-2" />
        </label>

        <label>
          <span>Precio de venta</span>
          <input v-model.number="form.sale_price" type="number" min="0" step="0.01" required class="w-full border p-2" />
        </label>
      </div>

      <label class="flex gap-2">
        <input v-model="form.active" type="checkbox" />
        Activa
      </label>

      <div class="flex justify-end gap-2">
        <button type="button" class="border px-4 py-2" @click="close">Cancelar</button>
        <button type="submit" class="border px-4 py-2" :disabled="saving">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

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
  if (form.min_quantity && form.max_quantity && Number(form.max_quantity) < Number(form.min_quantity)) {
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

function close() {
  emit('close')
}
</script>
