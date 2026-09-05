<template>
  <form class="space-y-7" @submit.prevent="submitForm">
    <!-- Datos Generales -->
    <div
      class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
        <h3 class="font-semibold text-slate-900 dark:text-white">Datos Generales</h3>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Los campos marcados con <span class="text-red-500">*</span> son obligatorios.
        </p>
      </div>

      <div class="space-y-6 p-5 sm:p-6">
        <div class="grid gap-5 md:grid-cols-12">
          <!-- Código -->
          <div class="md:col-span-3">
            <label
              for="quotation-code"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Código
            </label>
            <input
              id="quotation-code"
              v-model="store.quotation.code"
              readonly
              class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            />
          </div>

          <!-- Cliente -->
          <div class="md:col-span-9">
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Cliente <span class="text-red-500">*</span>
            </label>

            <div class="flex gap-2">
              <select
                v-model="store.quotation.customer_id"
                required
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option :value="null">Seleccione...</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                  {{ customer.first_name }} {{ customer.last_name }}
                </option>
              </select>

              <button
                type="button"
                class="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border border-teal-600 bg-white px-4 py-2.5 text-sm font-medium text-teal-600 shadow-sm transition hover:bg-teal-50 hover:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-950/30"
                @click="$emit('create-customer')"
              >
                <Plus class="h-4 w-4" />
                Nuevo
              </button>
            </div>
          </div>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <!-- Moneda -->
          <div>
            <label
              for="quotation-currency"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Moneda <span class="text-red-500">*</span>
            </label>
            <select
              id="quotation-currency"
              v-model="store.quotation.currency_id"
              required
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
                {{ currency.code }}
              </option>
            </select>
          </div>

          <!-- Política comercial opcional -->
          <div>
            <label
              for="quotation-commercial-policy"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Temporada o promoción
            </label>
            <select
              id="quotation-commercial-policy"
              v-model="store.quotation.commercial_policy_id"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option :value="null">Precio base</option>
              <option
                v-for="priceList in availablePriceLists"
                :key="priceList.id"
                :value="priceList.id"
              >
                {{ priceList.name }}
              </option>
            </select>
            <p class="mt-1 text-xs text-slate-500">
              Solo afecta servicios incluidos en la lista.
            </p>
          </div>

          <!-- Tipo Cambio -->
          <div>
            <label
              for="quotation-exchange-rate"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              T/C
            </label>
            <input
              id="quotation-exchange-rate"
              v-model.number="store.quotation.exchange_rate"
              type="number"
              step="0.0001"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Estado y Fechas -->
    <div
      class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
        <h3 class="font-semibold text-slate-900 dark:text-white">Estado y Fechas</h3>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Configure el estado y las fechas de la cotización.
        </p>
      </div>

      <div class="space-y-6 p-5 sm:p-6">
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <!-- Estado -->
          <div>
            <label
              for="quotation-status"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Estado <span class="text-red-500">*</span>
            </label>
            <select
              id="quotation-status"
              v-model="store.quotation.quotation_status_id"
              required
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option :value="null">Seleccione...</option>
              <option v-for="status in statuses" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>
          </div>

          <!-- Fecha Viaje -->
          <div>
            <label
              for="quotation-travel-date"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Fecha Viaje
            </label>
            <input
              id="quotation-travel-date"
              v-model="store.quotation.travel_date"
              type="date"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:scheme-dark"
            />
          </div>

          <!-- Válido Hasta -->
          <div>
            <label
              for="quotation-valid-until"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Válido Hasta
            </label>
            <input
              id="quotation-valid-until"
              v-model="store.quotation.valid_until"
              type="date"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:scheme-dark"
            />
          </div>

          <!-- Observaciones (columna extra) -->
          <!-- <div>
            <label
              for="quotation-notes"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Observaciones
            </label>
            <input
              id="quotation-notes"
              v-model="store.quotation.notes"
              type="text"
              placeholder="Notas rápidas..."
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </div> -->
        </div>

        <!-- Observaciones (textarea completo) -->
        <div>
          <label
            for="quotation-notes-full"
            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Observaciones detalladas
          </label>
          <textarea
            id="quotation-notes-full"
            v-model="store.quotation.notes"
            rows="3"
            placeholder="Notas adicionales..."
            class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useQuotationStore } from '../stores/quotation.store'

const props = defineProps({
  customers: { type: Array, default: () => [] },
  currencies: { type: Array, default: () => [] },
  statuses: { type: Array, default: () => [] },
  priceLists: { type: Array, default: () => [] },
})

const store = useQuotationStore()

const availablePriceLists = computed(() => {
  const currencyId = Number(store.quotation.currency_id)
  const travelDate = store.quotation.travel_date

  return props.priceLists.filter((priceList) => {
    if (!priceList.active || Number(priceList.currency_id) !== currencyId) {
      return false
    }

    if (!travelDate) {
      return true
    }

    const from = String(priceList.valid_from).slice(0, 10)
    const to = String(priceList.valid_to).slice(0, 10)

    return from <= travelDate && to >= travelDate
  })
})

watch(
  () => [store.quotation.currency_id, store.quotation.travel_date],
  () => {
    const selectedId = Number(store.quotation.commercial_policy_id)

    if (
      selectedId &&
      !availablePriceLists.value.some((priceList) => Number(priceList.id) === selectedId)
    ) {
      store.quotation.commercial_policy_id = null
    }
  },
)

watch(
  () => store.quotation.travel_date,
  () => store.updateTravelDates(),
)

watch(
  () => [store.quotation.exchange_rate, store.quotation.discount, store.quotation.tax],
  () => store.calculateQuotation(),
)
</script>
