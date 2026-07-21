<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Header -->

        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEdit ? 'Editar Servicio Personalizado' : 'Agregar Servicio Personalizado' }}
          </h5>

          <button
            type="button"
            class="btn-close"
            @click="cancel"
          >
            x
          </button>
        </div>

        <!-- Body -->

        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-12">
              <label class="form-label">Nombre *</label>

              <input
                v-model="form.name"
                class="form-control"
                placeholder="Ej. Compra de agua, Propina, Regalo..."
              />
            </div>

            <div class="col-md-12">
              <label class="form-label">Descripción</label>

              <textarea
                v-model="form.description"
                rows="2"
                class="form-control"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Duración</label>

              <input
                v-model="form.duration"
                class="form-control"
                placeholder="Ej. 2 Horas"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Cantidad</label>

              <input
                v-model.number="form.quantity"
                type="number"
                min="1"
                class="form-control"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Activo</label>

              <div class="form-check form-switch mt-2">
                <input
                  v-model="form.active"
                  class="form-check-input"
                  type="checkbox"
                />
              </div>
            </div>

            <div class="col-md-4">
              <label class="form-label">Costo Unitario</label>

              <input
                v-model.number="form.unit_cost"
                type="number"
                step="0.01"
                class="form-control text-end"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Precio Venta</label>

              <input
                v-model.number="form.unit_price"
                type="number"
                step="0.01"
                class="form-control text-end"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label">Subtotal</label>

              <input
                :value="money(subtotal)"
                readonly
                class="form-control text-end fw-bold"
              />
            </div>

            <div class="col-md-12">
              <label class="form-label">Notas</label>

              <textarea
                v-model="form.notes"
                rows="3"
                class="form-control"
              />
            </div>
          </div>
        </div>

        <!-- Footer -->

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
            {{ isEdit ? 'Actualizar' : 'Agregar' }}
          </button>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => !!props.item)

const form = reactive({
  service_id: props.item?.service_id ?? null,
  service_variant_id: props.item?.service_variant_id ?? null,

  item_type: props.item?.item_type ?? 'CUSTOM',

  name: props.item?.name ?? '',
  variant_name: props.item?.variant_name ?? '',
  description: props.item?.description ?? '',

  duration: props.item?.duration ?? 1,
  quantity: props.item?.quantity ?? 1,

  price_id: props.item?.price_id ?? null,

  unit_cost: props.item?.unit_cost ?? 0,
  unit_price: props.item?.unit_price ?? 0,

  subtotal: props.item?.subtotal ?? 0,

  sort_order: props.item?.sort_order ?? 1,

  notes: props.item?.notes ?? '',

  active: props.item?.active ?? true,
})

const subtotal = computed(() => {
  return Number(form.quantity || 0) * Number(form.unit_price || 0)
})

const canSave = computed(() => {
  return form.name.trim() !== '' && Number(form.quantity) > 0
})

function save() {
  if (!canSave.value) return

  emit('save', {
    ...form,
  })

  reset()

  emit('close')
}

function cancel() {
  reset()

  emit('close')
}

function reset() {
  form.service_id = null
  form.service_variant_id = null

  form.item_type = 'CUSTOM'

  form.name = ''
  form.variant_name = ''
  form.description = ''

  form.duration = 1
  form.quantity = 1

  form.price_id = null
  form.unit_cost = 0
  form.unit_price = 0

  form.subtotal = 0
  form.sort_order = 1

  form.notes = ''
  form.active = true
}

function money(value) {
  return Number(value || 0).toFixed(2)
}
</script>
