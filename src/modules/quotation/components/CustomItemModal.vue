<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Header -->

        <div class="modal-header">
          <h5 class="modal-title"> Agregar Ítem Libre </h5>

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
            :disabled="!form.name"
            @click="save"
          >
            Agregar Ítem
          </button>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'

const emit = defineEmits(['save', 'close'])

const form = reactive({
  name: '',

  description: '',

  duration: '',

  quantity: 1,

  unit_cost: 0,

  unit_price: 0,

  notes: '',

  active: true,
})

const subtotal = computed(() => {
  return Number(form.quantity || 0) * Number(form.unit_price || 0)
})

function save() {
  emit('save', {
    item_type: 'CUSTOM',

    name: form.name,

    variant_name: null,

    description: form.description,

    duration: form.duration,

    quantity: Number(form.quantity),

    unit_cost: Number(form.unit_cost),

    unit_price: Number(form.unit_price),

    subtotal: subtotal.value,

    notes: form.notes,

    active: form.active,
  })

  reset()

  emit('close')
}

function cancel() {
  reset()

  emit('close')
}

function reset() {
  form.name = ''

  form.description = ''

  form.quantity = 1

  form.unit_cost = 0

  form.unit_price = 0

  form.notes = ''

  form.active = true
}

function money(value) {
  return Number(value || 0).toFixed(2)
}
</script>
