<template>
  <div class="card shadow-sm mb-4">
    <div class="card-header">
      <h5 class="mb-0"> Datos Generales </h5>
    </div>

    <div class="card-body">
      <div class="row g-3">
        <!-- Código -->

        <div class="col-md-3">
          <label class="form-label"> Código </label>

          <input
            class="form-control"
            v-model="store.quotation.code"
            readonly
          />
        </div>

        <!-- Cliente -->

        <div class="col-md-9">
          <label class="form-label"> Cliente </label>

          <select
            class="form-select"
            v-model="store.quotation.customer_id"
          >
            <option :value="null"> Seleccione... </option>

            <option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.first_name }}
              {{ customer.last_name }}
            </option>
          </select>
        </div>

        <!-- Lista -->

        <div class="col-md-4">
          <label class="form-label"> Lista de Precios </label>

          <select
            class="form-select"
            v-model="store.quotation.price_list_id"
          >
            <option :value="null"> Seleccione... </option>

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

        <div class="col-md-2">
          <label class="form-label"> Moneda </label>

          <select
            class="form-select"
            v-model="store.quotation.currency_id"
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

        <div class="col-md-2">
          <label class="form-label"> T/C </label>

          <input
            type="number"
            step="0.0001"
            class="form-control"
            v-model.number="store.quotation.exchange_rate"
          />
        </div>

        <!-- Estado -->

        <div class="col-md-4">
          <label class="form-label"> Estado </label>

          <select
            class="form-select"
            v-model="store.quotation.quotation_status_id"
          >
            <option
              v-for="status in statuses"
              :key="status.id"
              :value="status.id"
            >
              {{ status.name }}
            </option>
          </select>
        </div>

        <!-- Fecha -->

        <div class="col-md-3">
          <label class="form-label"> Fecha Viaje </label>

          <input
            type="date"
            class="form-control"
            v-model="store.quotation.travel_date"
          />
        </div>

        <!-- Vigencia -->

        <div class="col-md-3">
          <label class="form-label"> Válido Hasta </label>

          <input
            type="date"
            class="form-control"
            v-model="store.quotation.valid_until"
          />
        </div>

        <!-- Observaciones -->

        <div class="col-md-12">
          <label class="form-label"> Observaciones </label>

          <textarea
            rows="3"
            class="form-control"
            v-model="store.quotation.notes"
          />
        </div>
      </div>
    </div>
  </div>
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
