<template>
  <form
    class="space-y-7"
    @submit.prevent="submitForm"
  >
    <!-- Datos Generales -->
    <fieldset class="space-y-5">
      <legend class="text-sm font-semibold text-slate-900 dark:text-white">
        Datos Generales
      </legend>

      <div class="grid gap-5 md:grid-cols-12">
        <!-- Código -->
        <div class="md:col-span-3">
          <label
            for="quotation-code"
            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Código</label
          >
          <input
            id="quotation-code"
            v-model="store.quotation.code"
            readonly
            class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          />
        </div>

        <!-- Cliente -->
        <div class="md:col-span-9">
          <label
            for="quotation-customer"
            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Cliente</label
          >
          <select
            id="quotation-customer"
            v-model="store.quotation.customer_id"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option :value="null">Seleccione...</option>
            <option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.first_name }} {{ customer.last_name }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        <!-- Lista de Precios -->
        <div>
          <label
            for="quotation-price-list"
            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Lista de Precios</label
          >
          <select
            id="quotation-price-list"
            v-model="store.quotation.price_list_id"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option :value="null">Seleccione...</option>
            <option
              v-for="item in priceLists"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
        </div>

        <!-- Moneda -->
        <div>
          <label
            for="quotation-currency"
            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Moneda</label
          >
          <select
            id="quotation-currency"
            v-model="store.quotation.currency_id"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option
              v-for="currency in currencies"
              :key="currency.id"
              :value="currency.id"
            >
              {{ currency.code }}
            </option>
          </select>
        </div>

        <!-- Tipo Cambio -->
        <div>
          <label
            for="quotation-exchange-rate"
            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >T/C</label
          >
          <input
            id="quotation-exchange-rate"
            v-model.number="store.quotation.exchange_rate"
            type="number"
            step="0.0001"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>
    </fieldset>

    <!-- Estado y Fechas -->
    <fieldset class="space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800">
      <legend class="px-1 text-sm font-semibold text-slate-900 dark:text-white">
        Estado y Fechas
      </legend>

      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <!-- Estado -->
        <div>
          <label
            for="quotation-status"
            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Estado</label
          >
          <select
            id="quotation-status"
            v-model="store.quotation.quotation_status_id"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option :value="null">Seleccione...</option>
            <option
              v-for="status in statuses"
              :key="status.id"
              :value="status.id"
            >
              {{ status.name }}
            </option>
          </select>
        </div>

        <!-- Fecha Viaje -->
        <div>
          <label
            for="quotation-travel-date"
            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Fecha Viaje</label
          >
          <input
            id="quotation-travel-date"
            v-model="store.quotation.travel_date"
            type="date"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
          />
        </div>

        <!-- Válido Hasta -->
        <div>
          <label
            for="quotation-valid-until"
            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Válido Hasta</label
          >
          <input
            id="quotation-valid-until"
            v-model="store.quotation.valid_until"
            type="date"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
          />
        </div>

        <!-- Observaciones (columna extra) -->
        <div>
          <label
            for="quotation-notes"
            class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Observaciones</label
          >
          <input
            id="quotation-notes"
            v-model="store.quotation.notes"
            type="text"
            placeholder="Notas rápidas..."
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>

      <!-- Observaciones (textarea completo) -->
      <div>
        <label
          for="quotation-notes-full"
          class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >Observaciones detalladas</label
        >
        <textarea
          id="quotation-notes-full"
          v-model="store.quotation.notes"
          rows="3"
          placeholder="Notas adicionales..."
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </div>
    </fieldset>
  </form>
</template>

<script setup>
import { watch } from 'vue'
import { useQuotationStore } from '../stores/quotation.store'

defineProps({
  customers: { type: Array, default: () => [] },
  priceLists: { type: Array, default: () => [] },
  currencies: { type: Array, default: () => [] },
  statuses: { type: Array, default: () => [] },
})

const store = useQuotationStore()

watch(
  () => store.quotation.travel_date,
  () => store.updateTravelDates(),
)

watch(
  () => [store.quotation.exchange_rate, store.quotation.discount, store.quotation.tax],
  () => store.calculateQuotation(),
)
</script>
