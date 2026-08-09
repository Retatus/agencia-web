<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <!-- HEADER -->
      <thead
        class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
      >
        <tr>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            #
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Id
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
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Tipo
          </th>
          <th
            class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Cant.
          </th>
          <th
            class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Costo
          </th>
          <th
            class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Venta
          </th>
          <th
            class="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Subtotal
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Estado
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Acciones
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
        <!-- SIN ITEMS -->
        <tr v-if="!itinerary.items?.length">
          <td
            colspan="11"
            class="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            No existen servicios registrados.
          </td>
        </tr>

        <!-- ITEMS -->
        <tr
          v-for="(item, index) in itinerary.items"
          :key="item.uuid ?? index"
          class="hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <!-- POSICIÓN LÓGICA -->
          <td
            v-if="shouldRenderGroupCell(item)"
            :rowspan="getRowspan(item)"
            class="px-3 py-2.5 text-center align-middle text-sm text-slate-500 dark:text-slate-400"
          >
            {{ item.sort_order ?? index + 1 }}
          </td>

          <!-- ID REAL -->
          <td class="px-3 py-2.5 text-center text-sm text-slate-600 dark:text-slate-300">
            {{ item.id ?? '-' }}
          </td>

          <!-- SERVICIO -->
          <td
            v-if="shouldRenderGroupCell(item)"
            :rowspan="getRowspan(item)"
            class="px-3 py-2.5 align-middle"
          >
            <div class="font-medium text-slate-900 dark:text-white">
              {{ item.name }}
            </div>
            <div
              v-if="item.description"
              class="mt-0.5 text-xs text-slate-500 dark:text-slate-400"
            >
              {{ item.description }}
            </div>

            <!-- Información del grupo -->
            <template v-if="item.group_uuid">
              <div class="mt-2">
                <span
                  class="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {{ getGroupLabel(item) }}
                </span>
              </div>
              <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {{ getGroupQuantity(item) }}
                {{ getGroupQuantityLabel(item) }}
              </div>
              <div
                v-if="item.calculation_type === 'accommodation'"
                class="text-xs text-slate-500 dark:text-slate-400"
              >
                {{ item.duration ?? 1 }} noches
              </div>
            </template>
          </td>

          <!-- VARIANTE -->
          <td class="px-3 py-2.5">
            <div class="font-medium text-slate-800 dark:text-slate-200">
              {{ item.variant_name || '-' }}
            </div>
            <div
              v-if="item.group_uuid"
              class="text-xs text-slate-500 dark:text-slate-400"
            >
              {{ getVariantPosition(item) }}
            </div>
          </td>

          <!-- TIPO -->
          <td
            v-if="shouldRenderGroupCell(item)"
            :rowspan="getRowspan(item)"
            class="px-3 py-2.5 text-center align-middle"
          >
            <span
              class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
              :class="badge(item.item_type)"
            >
              {{ item.item_type }}
            </span>
            <div
              v-if="item.group_uuid"
              class="mt-2"
            >
              <span
                class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                :class="calculationBadge(item.calculation_type)"
              >
                {{ calculationLabel(item.calculation_type) }}
              </span>
            </div>
          </td>

          <!-- CANTIDAD -->
          <td class="px-3 py-2.5 text-right">
            <template v-if="item.group_uuid">
              <span class="text-sm text-slate-700 dark:text-slate-300">
                {{ item.quantity }}
              </span>
            </template>
            <input
              v-else
              v-model.number="item.quantity"
              type="number"
              min="1"
              class="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-right text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              @change="updateQuantity(item)"
            />
          </td>

          <!-- COSTO -->
          <td class="px-3 py-2.5 text-right text-sm text-slate-700 dark:text-slate-300">
            {{ money(item.unit_cost) }}
          </td>

          <!-- VENTA -->
          <td class="px-3 py-2.5 text-right text-sm text-slate-700 dark:text-slate-300">
            {{ money(item.unit_price) }}
          </td>

          <!-- SUBTOTAL -->
          <td class="px-3 py-2.5 text-right text-sm font-semibold text-slate-900 dark:text-white">
            {{ money(item.subtotal) }}
          </td>

          <!-- ESTADO -->
          <td
            v-if="shouldRenderGroupCell(item)"
            :rowspan="getRowspan(item)"
            class="px-3 py-2.5 text-center align-middle"
          >
            <div class="flex flex-col items-center">
              <span
                class="inline-block h-2.5 w-2.5 rounded-full"
                :class="item.active ? 'bg-green-500' : 'bg-red-500'"
              ></span>
              <span
                class="mt-1 text-xs font-medium"
                :class="
                  item.active
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                "
              >
                {{ item.active ? 'activo' : 'inactivo' }}
              </span>
            </div>
          </td>

          <!-- ACCIONES -->
          <td
            v-if="shouldRenderGroupCell(item)"
            :rowspan="getRowspan(item)"
            class="px-3 py-2.5 align-middle"
          >
            <div class="flex flex-wrap gap-1">
              <!-- Editar -->
              <button
                type="button"
                class="rounded-lg border border-blue-300 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                @click="emit('edit-item', item)"
              >
                Editar
              </button>

              <!-- Duplicar -->
              <button
                type="button"
                class="rounded-lg border border-cyan-300 px-2 py-1 text-xs font-medium text-cyan-600 hover:bg-cyan-50 dark:border-cyan-700 dark:text-cyan-400 dark:hover:bg-cyan-950/30"
                @click="emit('duplicate-item', item)"
              >
                Duplicar
              </button>

              <!-- Subir -->
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                @click="moveUp(item)"
              >
                ↑
              </button>

              <!-- Bajar -->
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                @click="moveDown(item)"
              >
                ↓
              </button>

              <!-- Eliminar -->
              <button
                type="button"
                class="rounded-lg border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                @click="emit('remove-item', item)"
              >
                Eliminar
              </button>
            </div>

            <!-- RESUMEN DEL GRUPO -->
            <div
              v-if="item.group_uuid"
              class="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700"
            >
              <div class="flex justify-between text-xs">
                <span class="text-slate-500 dark:text-slate-400">Costo:</span>
                <strong class="text-slate-900 dark:text-white">
                  {{ money(getGroupTotalCost(item)) }}
                </strong>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-slate-500 dark:text-slate-400">Venta:</span>
                <strong class="text-slate-900 dark:text-white">
                  {{ money(getGroupTotalSale(item)) }}
                </strong>
              </div>
            </div>
          </td>
        </tr>
      </tbody>

      <!-- FOOTER / TOTAL ITINERARIO -->
      <tfoot
        v-if="itinerary.items?.length"
        class="border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
      >
        <tr>
          <td
            colspan="8"
            class="px-3 py-3 text-right text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Total del día
          </td>
          <td class="px-3 py-3 text-right text-sm font-bold text-slate-900 dark:text-white">
            {{ money(itinerary.subtotal) }}
          </td>
          <td colspan="2"></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { useQuotationStore } from '../stores/quotation.store'

/*
|--------------------------------------------------------------------------
| STORE
|--------------------------------------------------------------------------
*/

const store = useQuotationStore()

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

const props = defineProps({
  itinerary: {
    type: Object,
    required: true,
  },
})

/*
|--------------------------------------------------------------------------
| EVENTS
|--------------------------------------------------------------------------
|
| Ahora todos los eventos reciben el ITEM COMPLETO.
|
| QuotationFormPage decidirá:
|
| item normal
|      ↓
| update/remove/duplicate item
|
| group_uuid
|      ↓
| update/remove/duplicate group
|
*/

const emit = defineEmits(['edit-item', 'duplicate-item', 'remove-item'])

/*
|--------------------------------------------------------------------------
| SHOULD RENDER GROUP CELL
|--------------------------------------------------------------------------
|
| Item normal:
|
| siempre devuelve true.
|
| Grupo:
|
| únicamente group_index === 1 genera las columnas
| con rowspan.
|
*/

function shouldRenderGroupCell(item) {
  if (!item.group_uuid) {
    return true
  }

  return Number(item.group_index) === 1
}

/*
|--------------------------------------------------------------------------
| GET GROUP ITEMS
|--------------------------------------------------------------------------
*/

function getGroupItems(item) {
  if (!item.group_uuid) {
    return [item]
  }

  return (props.itinerary.items ?? [])
    .filter((current) => current.group_uuid === item.group_uuid)
    .sort((a, b) => Number(a.group_index ?? 0) - Number(b.group_index ?? 0))
}

/*
|--------------------------------------------------------------------------
| ROWSPAN
|--------------------------------------------------------------------------
|
| Simple + Doble
|
| = rowspan 2
|
| Simple + Doble + Triple
|
| = rowspan 3
|
*/

function getRowspan(item) {
  if (!item.group_uuid) {
    return 1
  }

  return getGroupItems(item).length
}

/*
|--------------------------------------------------------------------------
| GROUP QUANTITY
|--------------------------------------------------------------------------
|
| 1 Simple
| 2 Dobles
| 1 Triple
|
| =
|
| 4 habitaciones
|
*/

function getGroupQuantity(item) {
  return getGroupItems(item).reduce((total, current) => total + Number(current.quantity ?? 0), 0)
}

/*
|--------------------------------------------------------------------------
| GROUP QUANTITY LABEL
|--------------------------------------------------------------------------
*/

function getGroupQuantityLabel(item) {
  if (item.calculation_type === 'accommodation') {
    return 'habitaciones'
  }

  if (item.calculation_type === 'transport') {
    return 'vehículos'
  }

  return 'unidades'
}

/*
|--------------------------------------------------------------------------
| GROUP LABEL
|--------------------------------------------------------------------------
|
| Importante:
|
| No usamos cantidad total aquí.
|
| getRowspan representa número de VARIANTES.
|
*/

function getGroupLabel(item) {
  const variants = getRowspan(item)

  if (item.calculation_type === 'accommodation') {
    return variants === 1 ? '1 tipo de habitación' : `${variants} tipos de habitación`
  }

  if (item.calculation_type === 'transport') {
    return variants === 1 ? '1 tipo de vehículo' : `${variants} tipos de vehículo`
  }

  return variants === 1 ? '1 componente' : `${variants} componentes`
}

/*
|--------------------------------------------------------------------------
| VARIANT POSITION
|--------------------------------------------------------------------------
*/

function getVariantPosition(item) {
  if (!item.group_uuid) {
    return ''
  }

  return `${item.group_index}/${getRowspan(item)}`
}

/*
|--------------------------------------------------------------------------
| GROUP TOTAL COST
|--------------------------------------------------------------------------
|
| Accommodation:
|
| quantity
| × unit_cost
| × duration
|
| Transport:
|
| quantity
| × unit_cost
|
*/

function getGroupTotalCost(item) {
  return getGroupItems(item).reduce((total, current) => {
    const quantity = Number(current.quantity ?? 0)

    const unitCost = Number(current.unit_cost ?? 0)

    const duration =
      current.calculation_type === 'accommodation' ? Number(current.duration ?? 1) : 1

    return total + quantity * unitCost * duration
  }, 0)
}

/*
|--------------------------------------------------------------------------
| GROUP TOTAL SALE
|--------------------------------------------------------------------------
|
| Como cada quotation_item ya tiene su subtotal correcto,
| simplemente sumamos.
|
*/

function getGroupTotalSale(item) {
  return getGroupItems(item).reduce((total, current) => total + Number(current.subtotal ?? 0), 0)
}

/*
|--------------------------------------------------------------------------
| UPDATE QUANTITY
|--------------------------------------------------------------------------
|
| Solo se utiliza para items normales.
|
| Los agrupados se modifican desde ServiceSelectorModal.
|
*/

function updateQuantity(item) {
  if (item.group_uuid) {
    return
  }

  store.updateItem(item.uuid, {
    quantity: item.quantity,
  })
}

/*
|--------------------------------------------------------------------------
| MOVE UP
|--------------------------------------------------------------------------
|
| El store ya sabe que si pertenece a un grupo
| debe mover todo el bloque.
|
*/

function moveUp(item) {
  if (!item?.uuid) {
    return
  }

  store.moveItemUp(item.uuid)
}

/*
|--------------------------------------------------------------------------
| MOVE DOWN
|--------------------------------------------------------------------------
*/

function moveDown(item) {
  if (!item?.uuid) {
    return
  }

  store.moveItemDown(item.uuid)
}

/*
|--------------------------------------------------------------------------
| MONEY
|--------------------------------------------------------------------------
*/

function money(value) {
  return Number(value ?? 0).toFixed(2)
}

/*
|--------------------------------------------------------------------------
| BADGE ITEM TYPE
|--------------------------------------------------------------------------
*/

function badge(type) {
  switch (type) {
    case 'CATALOG':
      return 'bg-primary'

    case 'CUSTOM':
      return 'bg-secondary'

    default:
      return 'bg-dark'
  }
}

/*
|--------------------------------------------------------------------------
| CALCULATION BADGE
|--------------------------------------------------------------------------
*/

function calculationBadge(type) {
  switch (type) {
    case 'accommodation':
      return 'bg-info text-dark'

    case 'transport':
      return 'bg-warning text-dark'

    default:
      return 'bg-secondary'
  }
}

/*
|--------------------------------------------------------------------------
| CALCULATION LABEL
|--------------------------------------------------------------------------
*/

function calculationLabel(type) {
  switch (type) {
    case 'accommodation':
      return 'Alojamiento'

    case 'transport':
      return 'Transporte'

    default:
      return 'Servicio'
  }
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

table,
th,
td {
  border: 1px solid black;
}

th,
td {
  padding: 4px;
}

/*
|--------------------------------------------------------------------------
| ROWSPAN
|--------------------------------------------------------------------------
|
| valign middle ya lo da Bootstrap mediante align-middle,
| pero lo dejamos explícito para tablas agrupadas.
|
*/

td[rowspan] {
  vertical-align: middle;
}
</style>
