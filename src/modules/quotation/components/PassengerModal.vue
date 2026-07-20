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
            {{ isEdit ? 'Editar Pasajero' : 'Agregar Pasajero' }}
          </h5>

          <button
            class="btn-close"
            @click="emit('close')"
          />
        </div>

        <!-- Body -->

        <div class="modal-body">
          <div class="row g-3">
            <!-- Tipo -->

            <div class="col-md-4">
              <label class="form-label"> Tipo * </label>

              <select
                v-model="form.passenger_type_id"
                class="form-select"
              >
                <option :value="null"> Seleccione... </option>

                <option
                  v-for="type in passengerTypes"
                  :key="type.id"
                  :value="type.id"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>

            <!-- Nombre -->

            <div class="col-md-4">
              <label class="form-label"> Nombres * </label>

              <input
                v-model="form.first_name"
                class="form-control"
              />
            </div>

            <!-- Apellidos -->

            <div class="col-md-4">
              <label class="form-label"> Apellidos * </label>

              <input
                v-model="form.last_name"
                class="form-control"
              />
            </div>

            <!-- Documento -->

            <div class="col-md-4">
              <label class="form-label"> Documento </label>

              <input
                v-model="form.document_number"
                class="form-control"
              />
            </div>

            <!-- Fecha -->

            <div class="col-md-4">
              <label class="form-label"> Fecha Nacimiento </label>

              <input
                v-model="form.birth_date"
                type="date"
                class="form-control"
              />
            </div>

            <!-- Nacionalidad -->

            <div class="col-md-4">
              <label class="form-label"> Nacionalidad </label>

              <input
                v-model="form.nationality"
                class="form-control"
              />
            </div>

            <!-- Email -->

            <div class="col-md-6">
              <label class="form-label"> Email </label>

              <input
                v-model="form.email"
                class="form-control"
              />
            </div>

            <!-- Teléfono -->

            <div class="col-md-4">
              <label class="form-label"> Teléfono </label>

              <input
                v-model="form.phone"
                class="form-control"
              />
            </div>

            <!-- Activo -->

            <div class="col-md-2">
              <label class="form-label"> Activo </label>

              <div class="form-check form-switch mt-2">
                <input
                  v-model="form.active"
                  class="form-check-input"
                  type="checkbox"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="emit('close')"
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

import { useQuotationStore } from '../stores/quotation.store'

const store = useQuotationStore()

const props = defineProps({
  passenger: {
    type: Object,
    default: null,
  },

  passengerTypes: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close'])

const isEdit = computed(() => !!props.passenger)

const form = reactive({
  passenger_type_id: props.passenger?.passenger_type_id ?? null,

  first_name: props.passenger?.first_name ?? '',

  last_name: props.passenger?.last_name ?? '',

  birth_date: props.passenger?.birth_date ?? null,

  document_number: props.passenger?.document_number ?? '',

  nationality: props.passenger?.nationality ?? '',

  email: props.passenger?.email ?? '',

  phone: props.passenger?.phone ?? '',

  notes: props.passenger?.notes ?? '',

  active: props.passenger?.active ?? true,
})

const canSave = computed(() => {
  return (
    form.first_name.trim() !== '' && form.last_name.trim() !== '' && form.passenger_type_id !== null
  )
})

function save() {
  const data = { ...form }

  if (isEdit.value) {
    store.updatePassenger(props.passenger.uuid, data)
  } else {
    store.addPassenger(data)
  }

  emit('close')
}
</script>
