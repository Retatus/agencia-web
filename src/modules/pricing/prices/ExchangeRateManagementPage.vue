<template>
  <section class="mx-auto max-w-7xl space-y-6">
    <!-- HEADER -->
    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Tipos de cambio
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          La tasa expresa cuántas unidades de la moneda destino equivalen a una unidad de origen.
        </p>
      </div>
    </div>

    <!-- MENSAJE -->
    <div
      v-if="message.text"
      tabindex="-1"
      class="rounded-xl border px-4 py-3 text-sm"
      :class="
        message.type === 'error'
          ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
      "
    >
      {{ message.text }}
    </div>

    <!-- FORMULARIO -->
    <form
      class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      @submit.prevent="save"
    >
      <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <h2 class="font-semibold text-slate-900 dark:text-white">
          {{ form.id ? 'Editar tipo de cambio' : 'Nuevo tipo de cambio' }}
        </h2>
      </div>

      <div class="p-5">
        <div class="grid gap-4 md:grid-cols-6">
          <!-- MONEDA ORIGEN -->
          <div class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Moneda origen <span class="text-red-500">*</span>
            </label>
            <select
              v-model.number="form.from_currency_id"
              required
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option :value="null" disabled>Seleccione</option>
              <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
                {{ currency.code }} · {{ currency.name }}
              </option>
            </select>
          </div>

          <!-- MONEDA DESTINO -->
          <div class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Moneda destino <span class="text-red-500">*</span>
            </label>
            <select
              v-model.number="form.to_currency_id"
              required
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option :value="null" disabled>Seleccione</option>
              <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
                {{ currency.code }} · {{ currency.name }}
              </option>
            </select>
          </div>

          <!-- TASA -->
          <div class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Tasa <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.rate"
              required
              type="number"
              min="0.00000001"
              step="0.00000001"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-right text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <!-- FECHA -->
          <div class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Fecha efectiva <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.effective_date"
              required
              type="date"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
            />
          </div>

          <!-- FUENTE -->
          <div class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Fuente
            </label>
            <input
              v-model.trim="form.source"
              maxlength="30"
              placeholder="Opcional"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

          <!-- ACCIONES -->
          <div class="flex items-end gap-2 md:col-span-1">
            <button
              :disabled="saving"
              type="submit"
              class="inline-flex w-full items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
            >
              <Save class="mr-1.5 h-4 w-4" />
              {{ saving ? 'Guardando…' : form.id ? 'Actualizar' : 'Guardar' }}
            </button>
            <button
              v-if="form.id"
              type="button"
              class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="resetForm"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </form>

    <!-- LOADING -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"
      ></div>
      <span class="ml-3 text-sm text-slate-500 dark:text-slate-400"
        >Cargando tipos de cambio...</span
      >
    </div>

    <!-- TABLA -->
    <BaseTable v-else-if="rates.length" :items="rates" :loading="loading" :columns="6">
      <template #header>
        <tr>
          <th class="table-header whitespace-nowrap">Conversión</th>
          <th class="table-header-right whitespace-nowrap">Tasa</th>
          <th class="table-header whitespace-nowrap">Fecha</th>
          <th class="table-header whitespace-nowrap">Fuente</th>
          <th class="table-header-center whitespace-nowrap">Estado</th>
          <th class="table-header-center whitespace-nowrap">Acciones</th>
        </tr>
      </template>

      <template #body="{ items }">
        <tr v-for="rate in items" :key="rate.id" class="table-row-hover">
          <td class="table-cell whitespace-nowrap">
            <span class="font-medium text-slate-900 dark:text-white">
              {{ rate.from_currency?.code }}
            </span>
            <span class="mx-1 text-slate-400">→</span>
            <span class="font-medium text-slate-900 dark:text-white">
              {{ rate.to_currency?.code }}
            </span>
          </td>
          <td
            class="table-cell-right whitespace-nowrap font-mono text-slate-700 dark:text-slate-300"
          >
            {{ rate.rate }}
          </td>
          <td class="table-cell whitespace-nowrap text-slate-600 dark:text-slate-400">
            {{ shortDate(rate.effective_date) }}
          </td>
          <td class="table-cell whitespace-nowrap text-slate-600 dark:text-slate-400">
            {{ rate.source || '—' }}
          </td>
          <td class="table-cell-center whitespace-nowrap">
            <span
              class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="
                rate.active
                  ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
              "
            >
              {{ rate.active ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="px-3 py-2.5 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <button
                class="inline-flex items-center rounded-lg border border-blue-300 px-2.5 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                @click="edit(rate)"
              >
                <Pencil class="mr-1 h-3 w-3" />
                Editar
              </button>
              <button
                class="inline-flex items-center rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                @click="remove(rate)"
              >
                <Trash2 class="mr-1 h-3 w-3" />
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      </template>

      <template #footer>
        <BasePagination
          :current-page="meta.current_page"
          :last-page="meta.last_page"
          :total="meta.total"
          :per-page="meta.per_page"
          @change="load"
        />
      </template>
    </BaseTable>

    <!-- SIN DATOS -->
    <div
      v-else
      class="rounded-lg border border-slate-200 bg-slate-50 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50"
    >
      <p class="text-sm text-slate-500 dark:text-slate-400">No existen tipos de cambio.</p>
    </div>
  </section>
</template>

<script setup>
import { BasePagination, BaseTable } from '@/components/ui'
import { onMounted, reactive, ref } from 'vue'
import CurrencyService from '@/modules/catalog/service/currency.service'
import ExchangeRateService from '../services/exchange-rate.service'
import { Save, X, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const currencies = ref([])
const rates = ref([])
const loading = ref(false)
const saving = ref(false)
const meta = reactive({ current_page: 1, last_page: 1, total: 0 })
const message = reactive({ type: '', text: '' })

const emptyForm = () => ({
  id: null,
  from_currency_id: null,
  to_currency_id: null,
  rate: null,
  effective_date: new Date().toISOString().slice(0, 10),
  source: 'MANUAL',
  active: true,
})

const form = reactive(emptyForm())

function resetForm() {
  Object.assign(form, emptyForm())
}

function apiMessage(error) {
  const errors = error.response?.data?.errors
  if (errors) return Object.values(errors).flat().join(' ')
  return error.response?.data?.message || 'No fue posible completar la operación.'
}

async function load(page = 1) {
  loading.value = true
  try {
    const response = await ExchangeRateService.getAll({ page, per_page: 20 })
    rates.value = response.data?.data ?? []
    Object.assign(
      meta,
      response.data?.meta ?? { current_page: 1, last_page: 1, total: rates.value.length },
    )
  } finally {
    loading.value = false
  }
}

async function save() {
  message.text = ''
  saving.value = true
  try {
    const payload = { ...form }
    delete payload.id
    if (form.id) await ExchangeRateService.update(form.id, payload)
    else await ExchangeRateService.create(payload)
    message.type = 'success'
    message.text = 'Tipo de cambio guardado correctamente.'
    resetForm()
    await load(meta.current_page)
  } catch (error) {
    message.type = 'error'
    message.text = apiMessage(error)
  } finally {
    saving.value = false
  }
}

function edit(rate) {
  Object.assign(form, {
    id: rate.id,
    from_currency_id: Number(rate.from_currency_id),
    to_currency_id: Number(rate.to_currency_id),
    rate: Number(rate.rate),
    effective_date: rate.effective_date,
    source: rate.source,
    active: Boolean(rate.active),
  })
}

async function remove(rate) {
  if (!window.confirm('¿Eliminar este tipo de cambio?')) return
  try {
    await ExchangeRateService.destroy(rate.id)
    message.type = 'success'
    message.text = 'Tipo de cambio eliminado correctamente.'
    await load(meta.current_page)
  } catch (error) {
    message.type = 'error'
    message.text = apiMessage(error)
  }
}

function shortDate(value) {
  if (!value) return '-'
  const [year, month, day] = String(value).slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}

onMounted(async () => {
  const [currencyResponse] = await Promise.all([
    CurrencyService.getAll({ active: 1, per_page: 100 }),
    load(),
  ])
  currencies.value = currencyResponse.data?.data ?? []
})
</script>
