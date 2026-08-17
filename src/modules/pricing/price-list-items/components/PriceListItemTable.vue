<template>
  <div
    class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
  >
    <!-- HEADER -->
    <div
      class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 class="font-semibold text-slate-900 dark:text-white">Reglas de lista de precios</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ items.length }}
          regla{{ items.length === 1 ? '' : 's' }} registrada{{ items.length === 1 ? '' : 's' }}
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        @click="$emit('create')"
      >
        <Plus class="mr-1.5 h-4 w-4" />
        Nueva regla
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
        Cargando reglas...
      </div>
    </div>

    <!-- EMPTY -->
    <div
      v-else-if="!items.length"
      class="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center"
    >
      <BadgeDollarSign class="h-12 w-12 text-slate-400 dark:text-slate-500" />
      <div class="mt-3 font-medium text-slate-700 dark:text-slate-300">
        No hay reglas comerciales registradas
      </div>
      <p class="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Agrega reglas para modificar el precio base según la lista comercial seleccionada.
      </p>
      <button
        type="button"
        class="mt-5 inline-flex items-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        @click="$emit('create')"
      >
        <Plus class="mr-1.5 h-4 w-4" />
        Crear primera regla
      </button>
    </div>

    <!-- TABLE -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <!-- HEADER -->
        <thead
          class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <tr>
            <th
              class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Lista
            </th>
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
              class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Precio base
            </th>
            <th
              class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Ajuste
            </th>
            <th
              class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Precio final
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

        <!-- BODY -->
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr
            v-for="item in items"
            :key="item.id"
            class="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <!-- PRICE LIST -->
            <td class="px-3 py-2.5">
              <div class="font-medium text-slate-900 dark:text-white">
                {{ item.price_list?.name ?? '-' }}
              </div>
              <div
                v-if="item.price_list?.code"
                class="mt-0.5 font-mono text-xs text-slate-400 dark:text-slate-500"
              >
                {{ item.price_list.code }}
              </div>
            </td>

            <!-- SERVICE -->
            <td class="px-3 py-2.5">
              <div class="font-medium text-slate-700 dark:text-slate-300">
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

            <!-- BASE PRICE -->
            <td class="px-3 py-2.5 text-right">
              <template v-if="basePrice(item) !== null">
                <div class="font-semibold text-slate-900 dark:text-white">
                  {{ currencyCode(item) }} {{ money(basePrice(item)) }}
                </div>
                <div
                  v-if="baseCost(item) !== null"
                  class="mt-0.5 text-xs text-slate-400 dark:text-slate-500"
                >
                  Costo: {{ currencyCode(item) }} {{ money(baseCost(item)) }}
                </div>
              </template>
              <span v-else class="text-xs text-amber-600 dark:text-amber-400">
                Sin precio base
              </span>
            </td>

            <!-- ADJUSTMENT -->
            <td class="px-3 py-2.5">
              <div class="flex flex-col items-start gap-1">
                <span
                  class="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {{ adjustmentTypeLabel(item.adjustment_type) }}
                </span>
                <span class="text-sm font-medium" :class="adjustmentValueClass(item)">
                  {{ adjustmentLabel(item) }}
                </span>
              </div>
            </td>

            <!-- RESULT -->
            <td class="px-3 py-2.5 text-right">
              <template v-if="resultPrice(item) !== null">
                <div class="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                  {{ currencyCode(item) }} {{ money(resultPrice(item)) }}
                </div>
                <div
                  v-if="savingAmount(item) !== null"
                  class="mt-0.5 text-xs text-slate-400 dark:text-slate-500"
                >
                  Dif: {{ signedMoney(savingAmount(item)) }}
                </div>
              </template>
              <span v-else class="text-xs text-slate-400 dark:text-slate-500">-</span>
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
                  title="Editar regla"
                  @click="$emit('edit', item)"
                >
                  <Pencil class="h-3 w-3" />
                </button>

                <button
                  type="button"
                  class="rounded-lg border border-red-300 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                  title="Eliminar regla"
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
import { BadgeDollarSign, Pencil, Plus, Trash2 } from 'lucide-vue-next'

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| EMITS
|--------------------------------------------------------------------------
*/

const emit = defineEmits(['create', 'edit', 'delete'])

/*
|--------------------------------------------------------------------------
| SERVICE
|--------------------------------------------------------------------------
*/

function serviceName(item) {
  return item.service_variant?.service?.name ?? '-'
}

function serviceCode(item) {
  return item.service_variant?.service?.code ?? null
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
| BASE PRICE
|--------------------------------------------------------------------------
|
| Soportamos temporalmente varias formas
| de respuesta del Resource.
|
*/

function getBasePriceObject(item) {
  return (
    item.base_price ?? item.service_variant?.base_price ?? item.service_variant?.basePrice ?? null
  )
}

function basePrice(item) {
  const base = getBasePriceObject(item)

  if (!base) {
    return null
  }

  const value = base.sale_price ?? base.base_price ?? null

  if (value === null || value === undefined) {
    return null
  }

  return Number(value)
}

function baseCost(item) {
  const base = getBasePriceObject(item)

  if (!base) {
    return null
  }

  const value = base.cost ?? base.base_cost ?? null

  if (value === null || value === undefined) {
    return null
  }

  return Number(value)
}

/*
|--------------------------------------------------------------------------
| CURRENCY
|--------------------------------------------------------------------------
*/

function currencyCode(item) {
  const base = getBasePriceObject(item)

  return base?.currency?.code ?? item.currency?.code ?? ''
}

/*
|--------------------------------------------------------------------------
| ADJUSTMENT TYPE
|--------------------------------------------------------------------------
*/

function adjustmentTypeLabel(type) {
  const labels = {
    PERCENTAGE: 'Porcentaje',

    FIXED: 'Importe fijo',

    OVERRIDE: 'Precio fijo',
  }

  return labels[type] ?? type ?? '-'
}

/*
|--------------------------------------------------------------------------
| ADJUSTMENT LABEL
|--------------------------------------------------------------------------
*/

function adjustmentLabel(item) {
  const value = Number(item.adjustment_value ?? 0)

  switch (item.adjustment_type) {
    case 'PERCENTAGE':
      return `${signedNumber(value)}%`

    case 'FIXED':
      return `${signedNumber(value)}`

    case 'OVERRIDE':
      return money(value)

    default:
      return '-'
  }
}

/*
|--------------------------------------------------------------------------
| ADJUSTMENT COLOR
|--------------------------------------------------------------------------
*/

function adjustmentValueClass(item) {
  const value = Number(item.adjustment_value ?? 0)

  if (item.adjustment_type === 'OVERRIDE') {
    return ''
  }

  if (value < 0) {
    return 'text-emerald-600 ' + 'dark:text-emerald-400'
  }

  if (value > 0) {
    return 'text-amber-600 ' + 'dark:text-amber-400'
  }

  return ''
}

/*
|--------------------------------------------------------------------------
| RESULT PRICE
|--------------------------------------------------------------------------
*/

function resultPrice(item) {
  const base = basePrice(item)

  if (base === null) {
    return null
  }

  const adjustment = Number(item.adjustment_value ?? 0)

  switch (item.adjustment_type) {
    /*
    |--------------------------------------------------------------------------
    | PERCENTAGE
    |--------------------------------------------------------------------------
    */

    case 'PERCENTAGE':
      return base + (base * adjustment) / 100

    /*
    |--------------------------------------------------------------------------
    | FIXED AMOUNT
    |--------------------------------------------------------------------------
    */

    case 'FIXED':
      return base + adjustment

    /*
    |--------------------------------------------------------------------------
    | FIXED PRICE
    |--------------------------------------------------------------------------
    */

    case 'OVERRIDE':
      return adjustment

    default:
      return base
  }
}

/*
|--------------------------------------------------------------------------
| DIFFERENCE
|--------------------------------------------------------------------------
*/

function savingAmount(item) {
  const base = basePrice(item)

  const result = resultPrice(item)

  if (base === null || result === null) {
    return null
  }

  return result - base
}

/*
|--------------------------------------------------------------------------
| MONEY
|--------------------------------------------------------------------------
*/

function money(value) {
  return Number(value ?? 0).toFixed(2)
}

function signedMoney(value) {
  const number = Number(value ?? 0)

  if (number > 0) {
    return `+${money(number)}`
  }

  return money(number)
}

function signedNumber(value) {
  const number = Number(value ?? 0)

  if (number > 0) {
    return `+${number}`
  }

  return String(number)
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

function confirmDelete(item) {
  const variant = variantName(item)

  const priceList = item.price_list?.name ?? 'la lista'

  const confirmed = window.confirm(`¿Eliminar la regla de "${variant}" para "${priceList}"?`)

  if (!confirmed) {
    return
  }

  emit('delete', item)
}
</script>
