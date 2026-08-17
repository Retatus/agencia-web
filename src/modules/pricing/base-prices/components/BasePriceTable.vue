<template>
  <div
    class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
  >
    <!-- HEADER -->
    <div
      class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 class="font-semibold text-slate-900 dark:text-white">Precios base</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ items.length }}
          registro{{ items.length === 1 ? '' : 's' }}
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        @click="$emit('create')"
      >
        <Plus class="mr-1.5 h-4 w-4" />
        Nuevo precio base
      </button>
    </div>

    <!-- LOADING -->
    <div
      v-if="loading"
      class="flex min-h-48 items-center justify-center text-sm text-slate-500 dark:text-slate-400"
    >
      <div class="flex items-center gap-3">
        <div
          class="h-5 w-5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
        ></div>
        Cargando precios base...
      </div>
    </div>

    <!-- EMPTY -->
    <div
      v-else-if="!items.length"
      class="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center"
    >
      <CircleDollarSign class="h-12 w-12 text-slate-400 dark:text-slate-500" />
      <div class="mt-3 font-medium text-slate-700 dark:text-slate-300">
        No hay precios base registrados
      </div>
      <p class="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Registra el costo y precio base de las variantes para poder resolver tarifas en las
        cotizaciones.
      </p>
      <button
        type="button"
        class="mt-5 inline-flex items-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        @click="$emit('create')"
      >
        <Plus class="mr-1.5 h-4 w-4" />
        Crear primer precio
      </button>
    </div>

    <!-- TABLE -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead
          class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <tr>
            <th
              class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Servicio
            </th>
            <th
              class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Variante
            </th>
            <th
              class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Moneda
            </th>
            <th
              class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Costo
            </th>
            <th
              class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Precio base
            </th>
            <th
              class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Margen
            </th>
            <th
              class="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Estado
            </th>
            <th
              class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Acciones
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr
            v-for="item in items"
            :key="item.id"
            class="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <!-- SERVICE -->
            <td class="px-3 py-2.5">
              <div class="font-medium text-slate-900 dark:text-white">
                {{ serviceName(item) }}
              </div>
              <div
                v-if="serviceCode(item)"
                class="mt-0.5 font-mono text-xs text-slate-400 dark:text-slate-500"
              >
                {{ serviceCode(item) }}
              </div>
            </td>

            <!-- VARIANT -->
            <td class="px-3 py-2.5">
              <div class="font-medium text-slate-700 dark:text-slate-300">
                {{ variantName(item) }}
              </div>
              <div
                v-if="item.service_variant?.code"
                class="mt-0.5 font-mono text-xs text-slate-400 dark:text-slate-500"
              >
                {{ item.service_variant.code }}
              </div>
            </td>

            <!-- CURRENCY -->
            <td class="px-3 py-2.5">
              <span
                class="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {{ currencyCode(item) }}
              </span>
            </td>

            <!-- COST -->
            <td class="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">
              {{ formatMoney(item.cost) }}
            </td>

            <!-- SALE -->
            <td class="px-3 py-2.5 text-right font-semibold text-slate-900 dark:text-white">
              {{ formatMoney(item.sale_price) }}
            </td>

            <!-- MARGIN -->
            <td class="px-3 py-2.5 text-right">
              <div class="font-medium text-emerald-600 dark:text-emerald-400">
                {{ formatMoney(marginAmount(item)) }}
              </div>
              <div class="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                {{ marginPercent(item) }}
              </div>
            </td>

            <!-- STATUS -->
            <td class="px-3 py-2.5 text-center">
              <span
                class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                :class="
                  item.active
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                "
              >
                {{ item.active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>

            <!-- ACTIONS -->
            <td class="px-3 py-2.5 text-right">
              <div class="inline-flex items-center justify-end gap-1">
                <button
                  type="button"
                  class="rounded-lg border border-blue-300 px-2 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                  title="Editar precio base"
                  @click="$emit('edit', item)"
                >
                  <Pencil class="h-3 w-3" />
                </button>

                <button
                  type="button"
                  class="rounded-lg border border-red-300 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                  title="Eliminar precio base"
                  @click="confirmDelete(item)"
                >
                  <Trash2 class="h-3 w-3" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { CircleDollarSign, Pencil, Plus, Trash2 } from 'lucide-vue-next'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },

  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['create', 'edit', 'delete'])

/*
|--------------------------------------------------------------------------
| SERVICE
|--------------------------------------------------------------------------
*/

function serviceName(item) {
  return item.service_variant?.service?.name ?? item.service?.name ?? '-'
}

function serviceCode(item) {
  return item.service_variant?.service?.code ?? item.service?.code ?? null
}

/*
|--------------------------------------------------------------------------
| VARIANT
|--------------------------------------------------------------------------
*/

function variantName(item) {
  return item.service_variant?.name ?? '-'
}

/*
|--------------------------------------------------------------------------
| CURRENCY
|--------------------------------------------------------------------------
*/

function currencyCode(item) {
  return item.currency?.code ?? '-'
}

/*
|--------------------------------------------------------------------------
| MONEY
|--------------------------------------------------------------------------
*/

function formatMoney(value) {
  return Number(value ?? 0).toFixed(2)
}

/*
|--------------------------------------------------------------------------
| MARGIN
|--------------------------------------------------------------------------
*/

function marginAmount(item) {
  const cost = Number(item.cost ?? 0)

  const sale = Number(item.sale_price ?? 0)

  return sale - cost
}

function marginPercent(item) {
  const cost = Number(item.cost ?? 0)

  const sale = Number(item.sale_price ?? 0)

  if (cost <= 0) {
    return '-'
  }

  const percent = ((sale - cost) / cost) * 100

  return `${percent.toFixed(2)}%`
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

function confirmDelete(item) {
  const confirmed = window.confirm(`¿Eliminar el precio base de "${variantName(item)}"?`)

  if (!confirmed) {
    return
  }

  emit('delete', item)
}
</script>
