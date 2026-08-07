<template>
  <div class="card shadow-sm">
    <!-- ===================================================== -->
    <!-- HEADER                                                -->
    <!-- ===================================================== -->

    <div class="card-header d-flex justify-content-between align-items-center">
      <h6 class="mb-0"> Servicios del Día </h6>
    </div>

    <!-- ===================================================== -->
    <!-- TABLE                                                 -->
    <!-- ===================================================== -->

    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th width="50"> # </th>

            <th width="70"> Id </th>

            <th> Servicio </th>

            <th width="180"> Variante </th>

            <th width="120"> Tipo </th>

            <th width="90"> Cant. </th>

            <th width="120"> Costo </th>

            <th width="120"> Venta </th>

            <th width="120"> Subtotal </th>

            <th width="100"> Estado </th>

            <th width="220"> Acciones </th>
          </tr>
        </thead>

        <tbody>
          <!-- ================================================= -->
          <!-- SIN ITEMS                                         -->
          <!-- ================================================= -->

          <tr v-if="!itinerary.items?.length">
            <td
              colspan="11"
              class="text-center py-5 text-muted"
            >
              No existen servicios registrados.
            </td>
          </tr>

          <!-- ================================================= -->
          <!-- ITEMS                                             -->
          <!-- ================================================= -->

          <tr
            v-for="(item, index) in itinerary.items"
            :key="item.uuid ?? index"
          >
            <!-- ================================================= -->
            <!-- POSICIÓN LÓGICA                                   -->
            <!-- ================================================= -->
            <!--
              ITEM NORMAL:
              rowspan = 1

              GRUPO:
              únicamente la primera fila genera este <td>.
            -->

            <td
              v-if="shouldRenderGroupCell(item)"
              :rowspan="getRowspan(item)"
              class="text-center align-middle"
            >
              {{ item.sort_order ?? index + 1 }}
            </td>

            <!-- ================================================= -->
            <!-- ID REAL                                           -->
            <!-- ================================================= -->
            <!--
              El ID NO se agrupa.

              Cada QuotationItem sigue siendo una fila real
              e independiente en base de datos.
            -->

            <td class="text-center">
              {{ item.id ?? '-' }}
            </td>

            <!-- ================================================= -->
            <!-- SERVICIO                                          -->
            <!-- ================================================= -->

            <td
              v-if="shouldRenderGroupCell(item)"
              :rowspan="getRowspan(item)"
              class="align-middle"
            >
              <div class="fw-semibold">
                {{ item.name }}
              </div>

              <small
                v-if="item.description"
                class="text-muted d-block"
              >
                {{ item.description }}
              </small>

              <!-- Información del grupo -->

              <template v-if="item.group_uuid">
                <div class="mt-2">
                  <span class="badge bg-light text-dark border">
                    {{ getGroupLabel(item) }}
                  </span>
                </div>

                <div class="small text-muted mt-1">
                  {{ getGroupQuantity(item) }}
                  {{ getGroupQuantityLabel(item) }}
                </div>

                <div
                  v-if="item.calculation_type === 'accommodation'"
                  class="small text-muted"
                >
                  {{ item.duration ?? 1 }}
                  noches
                </div>
              </template>
            </td>

            <!-- ================================================= -->
            <!-- VARIANTE                                          -->
            <!-- ================================================= -->

            <td>
              <div class="fw-semibold">
                {{ item.variant_name || '-' }}
              </div>

              <small
                v-if="item.group_uuid"
                class="text-muted"
              >
                {{ getVariantPosition(item) }}
              </small>
            </td>

            <!-- ================================================= -->
            <!-- TIPO                                              -->
            <!-- ================================================= -->

            <td
              v-if="shouldRenderGroupCell(item)"
              :rowspan="getRowspan(item)"
              class="text-center align-middle"
            >
              <span
                class="badge"
                :class="badge(item.item_type)"
              >
                {{ item.item_type }}
              </span>

              <div
                v-if="item.group_uuid"
                class="small mt-2"
              >
                <span
                  class="badge"
                  :class="calculationBadge(item.calculation_type)"
                >
                  {{ calculationLabel(item.calculation_type) }}
                </span>
              </div>
            </td>

            <!-- ================================================= -->
            <!-- CANTIDAD                                          -->
            <!-- ================================================= -->

            <td class="text-end">
              <!--
                Para grupos mostramos la cantidad real de la
                variante pero no permitimos modificarla directamente.

                La distribución se modifica desde el modal.
              -->

              <template v-if="item.group_uuid">
                {{ item.quantity }}
              </template>

              <!-- Item normal -->

              <input
                v-else
                v-model.number="item.quantity"
                class="form-control form-control-sm text-end"
                type="number"
                min="1"
                @change="updateQuantity(item)"
              />
            </td>

            <!-- ================================================= -->
            <!-- COSTO                                             -->
            <!-- ================================================= -->

            <td class="text-end">
              {{ money(item.unit_cost) }}
            </td>

            <!-- ================================================= -->
            <!-- VENTA                                             -->
            <!-- ================================================= -->

            <td class="text-end">
              {{ money(item.unit_price) }}
            </td>

            <!-- ================================================= -->
            <!-- SUBTOTAL                                          -->
            <!-- ================================================= -->

            <td class="text-end fw-bold">
              {{ money(item.subtotal) }}
            </td>

            <!-- ================================================= -->
            <!-- ESTADO                                            -->
            <!-- ================================================= -->

            <td
              v-if="shouldRenderGroupCell(item)"
              :rowspan="getRowspan(item)"
              class="text-center align-middle"
            >
              <template v-if="item.active">
                <i class="bi bi-check-circle-fill text-success"></i>

                <div class="small text-success"> activo </div>
              </template>

              <template v-else>
                <i class="bi bi-x-circle-fill text-danger"></i>

                <div class="small text-danger"> inactivo </div>
              </template>
            </td>

            <!-- ================================================= -->
            <!-- ACCIONES                                          -->
            <!-- ================================================= -->
            <!--
              En un grupo solamente aparecen UNA VEZ.

              El rowspan cubre Simple + Doble + Triple.
            -->

            <td
              v-if="shouldRenderGroupCell(item)"
              :rowspan="getRowspan(item)"
              class="align-middle"
            >
              <div class="d-flex flex-wrap gap-1">
                <!-- Editar -->

                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm"
                  @click="emit('edit-item', item)"
                >
                  <i class="bi bi-pencil"></i>

                  Editar
                </button>

                <!-- Duplicar -->

                <button
                  type="button"
                  class="btn btn-outline-info btn-sm"
                  @click="emit('duplicate-item', item)"
                >
                  <i class="bi bi-copy"></i>

                  Duplicar
                </button>

                <!-- Subir -->

                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click="moveUp(item)"
                >
                  ↑
                </button>

                <!-- Bajar -->

                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click="moveDown(item)"
                >
                  ↓
                </button>

                <!-- Eliminar -->

                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="emit('remove-item', item)"
                >
                  <i class="bi bi-trash"></i>

                  Eliminar
                </button>
              </div>

              <!-- ================================================= -->
              <!-- RESUMEN DEL GRUPO                                 -->
              <!-- ================================================= -->

              <div
                v-if="item.group_uuid"
                class="small border-top mt-2 pt-2"
              >
                <div class="d-flex justify-content-between">
                  <span class="text-muted"> Costo: </span>

                  <strong>
                    {{ money(getGroupTotalCost(item)) }}
                  </strong>
                </div>

                <div class="d-flex justify-content-between">
                  <span class="text-muted"> Venta: </span>

                  <strong>
                    {{ money(getGroupTotalSale(item)) }}
                  </strong>
                </div>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- ===================================================== -->
        <!-- FOOTER / TOTAL ITINERARIO                             -->
        <!-- ===================================================== -->

        <tfoot v-if="itinerary.items?.length">
          <tr>
            <td
              colspan="8"
              class="text-end fw-semibold"
            >
              Total del día
            </td>

            <td class="text-end fw-bold">
              {{ money(itinerary.subtotal) }}
            </td>

            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>
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
