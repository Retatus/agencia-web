<template>
  <div
    class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
  >
    <!-- HEADER -->
    <div
      class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 class="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <Filter class="h-5 w-5 text-slate-400 dark:text-slate-500" />
          Filtros
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400"
          >Filtra las tarifas disponibles</p
        >
      </div>

      <div class="flex items-center gap-2">
        <span
          v-if="activeFiltersCount > 0"
          class="text-xs text-slate-400 dark:text-slate-500"
        >
          {{ activeFiltersCount }} filtro{{ activeFiltersCount > 1 ? 's' : '' }} activo{{
            activeFiltersCount > 1 ? 's' : ''
          }}
        </span>
        <button
          type="button"
          class="flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:text-slate-200"
          :disabled="activeFiltersCount === 0"
          @click="reset"
        >
          <RotateCcw class="h-4 w-4" />
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- BODY -->
    <div class="p-5">
      <form @submit.prevent="apply">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <!-- SEARCH -->
          <div class="xl:col-span-2">
            <label
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              for="search-input"
            >
              Buscar
            </label>
            <div class="relative">
              <span
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500"
              >
                <Search class="h-4 w-4" />
              </span>
              <input
                id="search-input"
                v-model="form.search"
                type="text"
                class="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                placeholder="Servicio, variante, proveedor..."
                @keyup.enter="apply"
                @input="debouncedApply"
              />
            </div>
          </div>

          <!-- PRICE LIST -->
          <div>
            <label
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              for="price-list-select"
            >
              Lista de precios
            </label>
            <select
              id="price-list-select"
              v-model="form.price_list_id"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              @change="apply"
            >
              <option value="">Todas</option>
              <option
                v-for="item in priceLists"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </option>
            </select>
          </div>

          <!-- PRICE TYPE -->
          <div>
            <label
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              for="price-type-select"
            >
              Tipo de precio
            </label>
            <select
              id="price-type-select"
              v-model="form.price_type_id"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              @change="apply"
            >
              <option value="">Todos</option>
              <option
                v-for="item in priceTypes"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </option>
            </select>
          </div>

          <!-- SERVICE -->
          <div>
            <label
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              for="service-select"
            >
              Servicio
            </label>
            <select
              id="service-select"
              v-model="form.service_uuid"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              @change="apply"
            >
              <option value="">Todos</option>
              <option
                v-for="service in services"
                :key="service.uuid"
                :value="service.uuid"
              >
                {{ service.name }}
              </option>
            </select>
          </div>

          <!-- PASSENGER -->
          <div>
            <label
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              for="passenger-type-select"
            >
              Tipo de pasajero
            </label>
            <select
              id="passenger-type-select"
              v-model="form.passenger_type_id"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              @change="apply"
            >
              <option value="">Todos</option>
              <option
                v-for="item in passengerTypes"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </option>
            </select>
          </div>

          <!-- ACTIVE -->
          <div>
            <label
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              for="active-select"
            >
              Estado
            </label>
            <select
              id="active-select"
              v-model="form.active"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              @change="apply"
            >
              <option value="">Todos</option>
              <option value="1">Activos</option>
              <option value="0">Inactivos</option>
            </select>
          </div>
        </div>

        <!-- ACTIONS -->
        <div
          class="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:justify-end"
        >
          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
            @click="reset"
          >
            <RotateCcw class="h-4 w-4" />
            Limpiar todo
          </button>

          <button
            type="submit"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 active:scale-95 sm:w-auto"
          >
            <Filter class="h-4 w-4" />
            Aplicar filtros
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
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

const emit = defineEmits(['update:modelValue', 'apply', 'reset'])

const form = reactive({
  search: '',
  price_list_id: '',
  price_type_id: '',
  service_uuid: '',
  passenger_type_id: '',
  active: '1',
})

watch(
  () => props.modelValue,

  (value) => {
    Object.assign(form, {
      search: value.search ?? '',

      price_list_id: value.price_list_id ?? '',

      price_type_id: value.price_type_id ?? '',

      service_uuid: value.service_uuid ?? '',

      passenger_type_id: value.passenger_type_id ?? '',

      active: value.active ?? '1',
    })
  },

  {
    immediate: true,
    deep: true,
  },
)

function apply() {
  const values = {
    search: form.search?.trim() || null,

    price_list_id: normalizeNumber(form.price_list_id),

    price_type_id: normalizeNumber(form.price_type_id),

    service_uuid: form.service_uuid || null,

    passenger_type_id: normalizeNumber(form.passenger_type_id),

    active: form.active === '' ? null : Number(form.active),
  }

  emit('update:modelValue', values)

  emit('apply', values)
}

function reset() {
  const values = {
    search: null,
    price_list_id: null,
    price_type_id: null,
    service_uuid: null,
    passenger_type_id: null,
    active: 1,
  }

  Object.assign(form, {
    search: '',
    price_list_id: '',
    price_type_id: '',
    service_uuid: '',
    passenger_type_id: '',
    active: '1',
  })

  emit('update:modelValue', values)

  emit('reset')
}

function normalizeNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  return Number(value)
}
</script>

<style scoped>
@reference "tailwindcss";

.form-label {
  @apply mb-1.5 block
  text-sm font-medium
  text-slate-700;
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
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-100;
}
</style>
