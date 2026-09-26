<template>
  <section class="mx-auto max-w-[1600px] space-y-6">
    <!-- HEADER -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Destinos turísticos
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Plantillas editables para preparar rápidamente el primer borrador de una cotización.
        </p>
      </div>
      <button
        class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        @click="newDestination"
      >
        <Plus class="mr-1.5 h-4 w-4" />
        Nuevo destino
      </button>
    </div>

    <!-- ALERTA con referencia -->
    <BaseAlert
      v-if="feedback"
      ref="feedbackElement"
      :type="feedback.type"
      :title="feedback.title"
      dismissible
      @close="feedback = null"
    >
      {{ feedback.message }}
    </BaseAlert>

    <!-- GRID PRINCIPAL -->
    <div class="grid min-w-0 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <!-- PANEL LATERAL -->
      <aside
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <h2 class="font-semibold text-slate-900 dark:text-white">Destinos</h2>
        </div>

        <div class="p-4">
          <input
            v-model.trim="filters.search"
            type="search"
            placeholder="Buscar destino"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            @keyup.enter="loadDestinations(1)"
          />
          <button
            class="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            @click="loadDestinations(1)"
          >
            <Search class="mr-1.5 h-4 w-4" />
            Buscar
          </button>

          <div class="mt-4 space-y-2">
            <button
              v-for="destination in destinations"
              :key="destination.uuid"
              type="button"
              class="w-full rounded-lg border p-3 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
              :class="
                destination.uuid === form.uuid
                  ? 'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-950/30'
                  : 'border-slate-200 dark:border-slate-700'
              "
              @click="editDestination(destination.uuid)"
            >
              <span class="block font-semibold text-slate-900 dark:text-white">
                {{ destination.code }} · {{ destination.name }}
              </span>
              <span class="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                {{ destination.duration_days }} días
              </span>
            </button>

            <p
              v-if="!loading && !destinations.length"
              class="py-5 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              No se encontraron destinos.
            </p>
          </div>

          <!-- PAGINACIÓN -->
          <div v-if="meta.last_page > 1" class="mt-4 flex items-center justify-between text-sm">
            <button
              class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              :disabled="meta.current_page <= 1"
              @click="loadDestinations(meta.current_page - 1)"
            >
              <ChevronLeft class="mr-1 h-4 w-4" />
              Anterior
            </button>
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
              {{ meta.current_page }} <span class="text-slate-400 dark:text-slate-500">/</span>
              {{ meta.last_page }}
            </span>
            <button
              class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              :disabled="meta.current_page >= meta.last_page"
              @click="loadDestinations(meta.current_page + 1)"
            >
              Siguiente
              <ChevronRight class="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <!-- FORMULARIO -->
      <form class="min-w-0 space-y-6" @submit.prevent="saveDestination">
        <!-- INFORMACIÓN GENERAL -->
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <h2 class="font-semibold text-slate-900 dark:text-white">Información general</h2>
          </div>

          <div class="p-5">
            <div class="grid gap-4 md:grid-cols-12">
              <div class="md:col-span-2">
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Código <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.trim="form.code"
                  maxlength="10"
                  required
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                />
              </div>

              <div class="md:col-span-6">
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nombre <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.trim="form.name"
                  required
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                />
              </div>

              <div class="md:col-span-2">
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Moneda <span class="text-red-500">*</span>
                </label>
                <select
                  v-model.number="form.currency_id"
                  required
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option :value="null">Seleccione</option>
                  <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
                    {{ currency.code }}
                  </option>
                </select>
              </div>

              <div class="flex items-end pb-2 md:col-span-2">
                <label
                  class="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50"
                >
                  <input
                    v-model="form.active"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-600 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Activo</span>
                </label>
              </div>

              <div class="md:col-span-12">
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Descripción comercial
                </label>
                <textarea
                  v-model.trim="form.description"
                  rows="3"
                  class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- DÍAS DEL ITINERARIO -->
        <div
          v-for="(day, dayIndex) in form.days"
          :key="day.local_id"
          class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <div
            class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700"
          >
            <h2 class="font-semibold text-slate-900 dark:text-white">Día {{ dayIndex + 1 }}</h2>
            <button
              v-if="form.days.length > 1"
              type="button"
              class="inline-flex items-center rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
              @click="removeDay(dayIndex)"
            >
              <Trash2 class="mr-1 h-3 w-3" />
              Eliminar día
            </button>
          </div>

          <div class="p-5">
            <div class="grid gap-4 md:grid-cols-2">
              <input
                v-model.trim="day.title"
                required
                placeholder="Título del día"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
              <textarea
                v-model.trim="day.description"
                rows="2"
                placeholder="Descripción del itinerario"
                class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              ></textarea>
            </div>

            <!-- TABLA DE SERVICIOS CON SCROLL HORIZONTAL -->
            <div class="mt-4 overflow-x-auto -mx-4 sm:mx-0">
              <div class="inline-block min-w-full align-middle">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table class="min-w-[900px] w-full text-sm">
                    <thead
                      class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
                    >
                      <tr>
                        <th
                          class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap"
                        >
                          Servicio libre
                        </th>
                        <th
                          class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap"
                        >
                          Descripción
                        </th>
                        <th
                          class="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap"
                        >
                          Cant.
                        </th>
                        <th
                          class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap"
                        >
                          Costo aprox.
                        </th>
                        <th
                          class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap"
                        >
                          Venta aprox.
                        </th>
                        <th
                          class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap"
                        ></th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr
                        v-for="(item, itemIndex) in day.items"
                        :key="item.local_id"
                        class="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td class="px-3 py-2.5">
                          <input
                            v-model.trim="item.name"
                            required
                            class="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          />
                        </td>
                        <td class="px-3 py-2.5">
                          <input
                            v-model.trim="item.description"
                            class="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          />
                        </td>
                        <td class="px-3 py-2.5 text-center">
                          <input
                            v-model.number="item.quantity"
                            type="number"
                            min="0.01"
                            step="0.01"
                            class="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-right text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          />
                        </td>
                        <td class="px-3 py-2.5 text-right">
                          <input
                            v-model.number="item.estimated_cost"
                            type="number"
                            min="0"
                            step="0.01"
                            class="w-28 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-right text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          />
                        </td>
                        <td class="px-3 py-2.5 text-right">
                          <input
                            v-model.number="item.estimated_price"
                            type="number"
                            min="0"
                            step="0.01"
                            class="w-28 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-right text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          />
                        </td>
                        <td class="px-3 py-2.5 text-right">
                          <button
                            v-if="day.items.length > 1"
                            type="button"
                            class="inline-flex items-center rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                            @click="removeItem(day, itemIndex)"
                          >
                            <Trash2 class="mr-1 h-3 w-3" />
                            Quitar
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="mt-3 inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="addItem(day)"
            >
              <Plus class="mr-1.5 h-4 w-4" />
              Agregar servicio
            </button>
          </div>
        </div>

        <!-- ACCIONES -->
        <div class="flex flex-wrap justify-between gap-3">
          <button
            type="button"
            class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            @click="addDay"
          >
            <Plus class="mr-1.5 h-4 w-4" />
            Agregar día
          </button>

          <div class="flex gap-2">
            <button
              v-if="form.uuid"
              type="button"
              class="inline-flex items-center rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
              @click="deleteDestination"
            >
              <Trash2 class="mr-1.5 h-4 w-4" />
              Eliminar
            </button>

            <button
              type="submit"
              :disabled="saving"
              class="inline-flex items-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
            >
              <Save class="mr-1.5 h-4 w-4" />
              {{ saving ? 'Guardando...' : 'Guardar destino' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import CurrencyService from '@/modules/catalog/service/currency.service'
import TouristDestinationService from '../services/tourist-destination.service'
import { Plus, Search, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const destinations = ref([])
const currencies = ref([])
const loading = ref(false)
const saving = ref(false)
const feedback = ref(null)
const feedbackElement = ref(null)
const filters = reactive({ search: '' })
const meta = reactive({ current_page: 1, last_page: 1, total: 0 })
const form = reactive(emptyDestination())

function emptyItem() {
  return {
    local_id: crypto.randomUUID(),
    name: '',
    description: '',
    duration: 1,
    quantity: 1,
    estimated_cost: 0,
    estimated_price: 0,
    sort_order: 1,
    active: true,
  }
}

function emptyDay(index = 0) {
  return {
    local_id: crypto.randomUUID(),
    day_number: index + 1,
    title: '',
    description: '',
    sort_order: index + 1,
    items: [emptyItem()],
  }
}

function emptyDestination() {
  return {
    uuid: null,
    code: '',
    name: '',
    description: '',
    currency_id: null,
    duration_days: 1,
    active: true,
    days: [emptyDay()],
  }
}

function replaceForm(data) {
  Object.assign(form, emptyDestination(), JSON.parse(JSON.stringify(data)))
  form.days = (data.days ?? []).map((day, index) => ({
    ...day,
    local_id: crypto.randomUUID(),
    items: (day.items ?? []).map((item) => ({ ...item, local_id: crypto.randomUUID() })),
  }))
}

function newDestination() {
  replaceForm(emptyDestination())
}
function addDay() {
  form.days.push(emptyDay(form.days.length))
  renumber()
}
function removeDay(index) {
  form.days.splice(index, 1)
  renumber()
}
function addItem(day) {
  day.items.push(emptyItem())
  renumber()
}
function removeItem(day, index) {
  day.items.splice(index, 1)
  renumber()
}

function renumber() {
  form.days.forEach((day, dayIndex) => {
    day.day_number = dayIndex + 1
    day.sort_order = dayIndex + 1
    day.items.forEach((item, itemIndex) => {
      item.sort_order = itemIndex + 1
    })
  })
  form.duration_days = form.days.length
}

async function loadDestinations(page = 1) {
  loading.value = true
  try {
    const response = await TouristDestinationService.getAll({
      search: filters.search || undefined,
      page,
      per_page: 15,
    })
    destinations.value = response.data.data ?? []
    Object.assign(
      meta,
      response.data.meta ?? { current_page: 1, last_page: 1, total: destinations.value.length },
    )
  } finally {
    loading.value = false
  }
}

async function editDestination(uuid) {
  const response = await TouristDestinationService.show(uuid)
  replaceForm(response.data.data)
}

async function saveDestination() {
  saving.value = true
  feedback.value = null
  renumber()
  try {
    const payload = JSON.parse(JSON.stringify(form))
    const response = form.uuid
      ? await TouristDestinationService.update(form.uuid, payload)
      : await TouristDestinationService.create(payload)
    replaceForm(response.data.data)
    await loadDestinations(meta.current_page)
    await showFeedback({
      type: 'success',
      title: 'Destino guardado',
      message: 'La plantilla quedó disponible para crear cotizaciones.',
    })
  } catch (error) {
    await showFeedback({
      type: 'danger',
      title: 'No fue posible guardar',
      message: error?.response?.data?.message ?? error.message,
    })
  } finally {
    saving.value = false
  }
}

async function showFeedback(value) {
  feedback.value = value

  await nextTick()

  const element = feedbackElement.value?.$el ?? feedbackElement.value

  if (!element) return

  element.setAttribute('tabindex', '-1')
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
  element.focus({ preventScroll: true })
}

async function deleteDestination() {
  if (!window.confirm(`¿Eliminar la plantilla ${form.name}?`)) return
  await TouristDestinationService.remove(form.uuid)
  newDestination()
  await loadDestinations(1)
}

onMounted(async () => {
  const [currencyResponse] = await Promise.all([
    CurrencyService.getAll({ active: 1 }),
    loadDestinations(),
  ])
  currencies.value = currencyResponse.data.data ?? []
  if (!form.currency_id && currencies.value.length) form.currency_id = currencies.value[0].id
})
</script>
