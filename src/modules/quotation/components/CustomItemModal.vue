<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- ===================================================== -->
        <!-- HEADER -->
        <!-- ===================================================== -->

        <div class="modal-header">
          <div>
            <h5 class="modal-title mb-1">
              {{ isEdit ? 'Editar Servicio Personalizado' : 'Agregar Servicio Personalizado' }}
            </h5>

            <small class="text-muted">
              {{
                isEdit
                  ? 'Modifique la información del servicio personalizado.'
                  : 'Agregue un servicio que no pertenece al catálogo.'
              }}
            </small>
          </div>

          <button
            type="button"
            class="btn-close"
            @click="cancel"
          />
        </div>

        <!-- ===================================================== -->
        <!-- BODY -->
        <!-- ===================================================== -->

        <div class="modal-body">
          <!-- ================================================= -->
          <!-- INFORMACIÓN GENERAL -->
          <!-- ================================================= -->

          <div class="card border-0 bg-light mb-4">
            <div class="card-body">
              <div class="row g-3">
                <!-- Nombre -->

                <div class="col-md-12">
                  <label class="form-label fw-semibold"> Nombre * </label>

                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    placeholder="Ej. Compra de agua, Propina, Regalo..."
                  />
                </div>

                <!-- Descripción -->

                <div class="col-md-12">
                  <label class="form-label"> Descripción </label>

                  <textarea
                    v-model="form.description"
                    rows="2"
                    class="form-control"
                    placeholder="Descripción opcional del servicio..."
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ================================================= -->
          <!-- CONFIGURACIÓN -->
          <!-- ================================================= -->

          <div class="card shadow-sm mb-4">
            <div class="card-header">
              <strong> Configuración </strong>
            </div>

            <div class="card-body">
              <div class="row g-3">
                <!-- Duración -->

                <div class="col-md-4">
                  <label class="form-label"> Duración </label>

                  <input
                    v-model.number="form.duration"
                    type="number"
                    min="1"
                    step="1"
                    class="form-control"
                  />
                </div>

                <!-- Cantidad -->

                <div class="col-md-4">
                  <label class="form-label"> Cantidad * </label>

                  <input
                    v-model.number="form.quantity"
                    type="number"
                    min="1"
                    step="1"
                    class="form-control"
                  />
                </div>

                <!-- Activo -->

                <div class="col-md-4">
                  <label class="form-label"> Estado </label>

                  <div class="form-check form-switch mt-2">
                    <input
                      v-model="form.active"
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                    />

                    <label class="form-check-label">
                      {{ form.active ? 'Activo' : 'Inactivo' }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ================================================= -->
          <!-- COSTOS -->
          <!-- ================================================= -->

          <div class="card shadow-sm mb-4">
            <div class="card-header">
              <strong> Costos y venta </strong>
            </div>

            <div class="card-body">
              <div class="row g-3">
                <!-- Costo -->

                <div class="col-md-4">
                  <label class="form-label"> Costo unitario </label>

                  <input
                    v-model.number="form.unit_cost"
                    type="number"
                    min="0"
                    step="0.01"
                    class="form-control text-end"
                  />
                </div>

                <!-- Venta -->

                <div class="col-md-4">
                  <label class="form-label"> Precio de venta </label>

                  <input
                    v-model.number="form.unit_price"
                    type="number"
                    min="0"
                    step="0.01"
                    class="form-control text-end"
                  />
                </div>

                <!-- Subtotal -->

                <div class="col-md-4">
                  <label class="form-label"> Subtotal </label>

                  <input
                    :value="money(subtotal)"
                    readonly
                    class="form-control text-end fw-bold"
                  />
                </div>
              </div>

              <!-- Resumen -->

              <div class="alert alert-light border mt-3 mb-0">
                <div class="row small">
                  <div class="col-md-4">
                    <span class="text-muted"> Cantidad </span>

                    <div class="fw-semibold">
                      {{ form.quantity }}
                    </div>
                  </div>

                  <div class="col-md-4">
                    <span class="text-muted"> Venta unitaria </span>

                    <div class="fw-semibold">
                      {{ money(form.unit_price) }}
                    </div>
                  </div>

                  <div class="col-md-4">
                    <span class="text-muted"> Venta total </span>

                    <div class="fw-semibold">
                      {{ money(subtotal) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ================================================= -->
          <!-- OBSERVACIONES -->
          <!-- ================================================= -->

          <div class="mb-2">
            <label class="form-label"> Observaciones </label>

            <textarea
              v-model="form.notes"
              rows="3"
              class="form-control"
              placeholder="Notas adicionales..."
            />
          </div>
        </div>

        <!-- ===================================================== -->
        <!-- FOOTER -->
        <!-- ===================================================== -->

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="cancel"
          >
            Cancelar
          </button>

          <button
            type="button"
            class="btn btn-primary"
            :disabled="!canSave"
            @click="save"
          >
            <i :class="isEdit ? 'bi bi-check-circle me-1' : 'bi bi-plus-circle me-1'"></i>

            {{ isEdit ? 'Actualizar' : 'Agregar servicio' }}
          </button>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
})

/*
|--------------------------------------------------------------------------
| EVENTS
|--------------------------------------------------------------------------
*/

const emit = defineEmits(['close', 'save'])

/*
|--------------------------------------------------------------------------
| MODE
|--------------------------------------------------------------------------
*/

const isEdit = computed(() => {
  return !!props.item
})

/*
|--------------------------------------------------------------------------
| FORM
|--------------------------------------------------------------------------
|
| Un servicio CUSTOM siempre es:
|
| calculation_type = generic
| group_uuid = null
| group_index = null
|
*/

const form = reactive({
  /*
  |--------------------------------------------------------------------------
  | Identidad
  |--------------------------------------------------------------------------
  |
  | Se conservan en edición.
  |
  */

  id: props.item?.id ?? null,

  uuid: props.item?.uuid ?? null,

  /*
  |--------------------------------------------------------------------------
  | Relaciones
  |--------------------------------------------------------------------------
  |
  | CUSTOM no pertenece al catálogo.
  |
  */

  service_id: null,

  service_variant_id: null,

  price_id: null,

  /*
  |--------------------------------------------------------------------------
  | Tipo
  |--------------------------------------------------------------------------
  */

  item_type: 'CUSTOM',

  calculation_type: 'generic',

  /*
  |--------------------------------------------------------------------------
  | Sin agrupación
  |--------------------------------------------------------------------------
  */

  group_uuid: null,

  group_index: null,

  /*
  |--------------------------------------------------------------------------
  | Información
  |--------------------------------------------------------------------------
  */

  name: props.item?.name ?? '',

  variant_name: null,

  description: props.item?.description ?? '',

  /*
  |--------------------------------------------------------------------------
  | Valores
  |--------------------------------------------------------------------------
  */

  duration: Number(props.item?.duration ?? 1),

  quantity: Number(props.item?.quantity ?? 1),

  unit_cost: Number(props.item?.unit_cost ?? 0),

  unit_price: Number(props.item?.unit_price ?? 0),

  subtotal: Number(props.item?.subtotal ?? 0),

  /*
  |--------------------------------------------------------------------------
  | Orden
  |--------------------------------------------------------------------------
  */

  sort_order: props.item?.sort_order ?? 1,

  /*
  |--------------------------------------------------------------------------
  | Otros
  |--------------------------------------------------------------------------
  */

  notes: props.item?.notes ?? '',

  active: props.item?.active ?? true,
})

/*
|--------------------------------------------------------------------------
| SUBTOTAL
|--------------------------------------------------------------------------
|
| CUSTOM utiliza el cálculo genérico:
|
| cantidad × precio venta
|
*/

const subtotal = computed(() => {
  if (!form.active) {
    return 0
  }

  return Number(form.quantity ?? 0) * Number(form.unit_price ?? 0)
})

/*
|--------------------------------------------------------------------------
| TOTAL COST
|--------------------------------------------------------------------------
*/

const totalCost = computed(() => {
  if (!form.active) {
    return 0
  }

  return Number(form.quantity ?? 0) * Number(form.unit_cost ?? 0)
})

/*
|--------------------------------------------------------------------------
| CAN SAVE
|--------------------------------------------------------------------------
*/

const canSave = computed(() => {
  if (!form.name?.trim()) {
    return false
  }

  if (Number(form.quantity) <= 0) {
    return false
  }

  if (Number(form.unit_cost) < 0) {
    return false
  }

  if (Number(form.unit_price) < 0) {
    return false
  }

  return true
})

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

function save() {
  if (!canSave.value) {
    return
  }

  const item = {
    /*
    |--------------------------------------------------------------------------
    | Identidad
    |--------------------------------------------------------------------------
    */

    id: form.id,

    uuid: form.uuid,

    /*
    |--------------------------------------------------------------------------
    | Relaciones
    |--------------------------------------------------------------------------
    */

    service_id: null,

    service_variant_id: null,

    price_id: null,

    /*
    |--------------------------------------------------------------------------
    | Tipos
    |--------------------------------------------------------------------------
    */

    item_type: 'CUSTOM',

    calculation_type: 'generic',

    group_uuid: null,

    group_index: null,

    /*
    |--------------------------------------------------------------------------
    | Información
    |--------------------------------------------------------------------------
    */

    name: form.name.trim(),

    variant_name: null,

    description: form.description?.trim() ?? '',

    /*
    |--------------------------------------------------------------------------
    | Valores
    |--------------------------------------------------------------------------
    */

    duration: Number(form.duration ?? 1),

    quantity: Number(form.quantity ?? 1),

    unit_cost: Number(form.unit_cost ?? 0),

    unit_price: Number(form.unit_price ?? 0),

    subtotal: Number(subtotal.value),

    /*
    |--------------------------------------------------------------------------
    | Orden
    |--------------------------------------------------------------------------
    */

    sort_order: form.sort_order,

    /*
    |--------------------------------------------------------------------------
    | Otros
    |--------------------------------------------------------------------------
    */

    notes: form.notes?.trim() ?? '',

    active: Boolean(form.active),
  }

  emit('save', item)

  close()
}

/*
|--------------------------------------------------------------------------
| CLOSE
|--------------------------------------------------------------------------
*/

function close() {
  emit('close')
}

/*
|--------------------------------------------------------------------------
| CANCEL
|--------------------------------------------------------------------------
*/

function cancel() {
  close()
}

/*
|--------------------------------------------------------------------------
| MONEY
|--------------------------------------------------------------------------
*/

function money(value) {
  return Number(value ?? 0).toFixed(2)
}
</script>
