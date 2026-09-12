<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="flex min-h-full items-center justify-center">
          <div
            role="dialog"
            aria-modal="true"
            :aria-label="isEdit ? 'Editar Pasajero' : 'Agregar Pasajero'"
            class="w-full max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ isEdit ? 'Editar Pasajero' : 'Agregar Pasajero' }}
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {{
                    isEdit
                      ? 'Modifique la información del pasajero.'
                      : 'Registre un nuevo pasajero en la cotización.'
                  }}
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                @click="emit('close')"
              >
                <X class="h-5 w-5" />
              </button>
            </header>

            <!-- BODY -->
            <div class="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
              <div class="grid gap-5 md:grid-cols-12">
                <!-- Tipo -->
                <div class="md:col-span-4">
                  <label
                    for="passenger-type"
                    class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Tipo <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="passenger-type"
                    v-model="form.passenger_type_id"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option :value="null">Seleccione...</option>
                    <option v-for="type in passengerTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                </div>

                <!-- Nombres -->
                <div class="md:col-span-4">
                  <label
                    for="passenger-first-name"
                    class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Nombres <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="passenger-first-name"
                    v-model="form.first_name"
                    type="text"
                    required
                    placeholder="Nombres del pasajero"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <!-- Apellidos -->
                <div class="md:col-span-4">
                  <label
                    for="passenger-last-name"
                    class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Apellidos <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="passenger-last-name"
                    v-model="form.last_name"
                    type="text"
                    required
                    placeholder="Apellidos del pasajero"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <!-- Documento -->
                <div class="md:col-span-4">
                  <label
                    for="passenger-document"
                    class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Documento
                  </label>
                  <input
                    id="passenger-document"
                    v-model="form.document_number"
                    type="text"
                    placeholder="Número de documento"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <!-- Fecha Nacimiento -->
                <div class="md:col-span-4">
                  <label
                    for="passenger-birth-date"
                    class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Fecha Nacimiento
                  </label>
                  <input
                    id="passenger-birth-date"
                    v-model="form.birth_date"
                    type="date"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:scheme-dark"
                  />
                </div>

                <!-- Nacionalidad -->
                <div class="md:col-span-4">
                  <label
                    for="passenger-nationality"
                    class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Nacionalidad
                  </label>
                  <CountrySelect v-model="form.nationality" />
                </div>

                <!-- Email -->
                <div class="md:col-span-6">
                  <label
                    for="passenger-email"
                    class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email
                  </label>
                  <input
                    id="passenger-email"
                    v-model="form.email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <!-- Teléfono -->
                <div class="md:col-span-4">
                  <label
                    for="passenger-phone"
                    class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Teléfono
                  </label>
                  <PhoneInput v-model="form.phone" :country-iso="form.nationality" />
                </div>

                <!-- Activo -->
                <div class="md:col-span-2">
                  <label
                    for="passenger-active"
                    class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Activo
                  </label>
                  <label
                    class="mt-1 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50"
                  >
                    <input
                      id="passenger-active"
                      v-model="form.active"
                      type="checkbox"
                      class="h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-600 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800"
                    />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {{ form.active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <footer
              class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-6"
            >
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                @click="emit('close')"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!canSave"
                @click="save"
              >
                <Save class="mr-1.5 h-4 w-4" />
                {{ isEdit ? 'Actualizar' : 'Agregar' }}
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, reactive } from 'vue'

import { useQuotationStore } from '../stores/quotation.store'
import { X, Save } from 'lucide-vue-next'
import CountrySelect from '@/shared/components/CountrySelect.vue'
import PhoneInput from '@/shared/components/PhoneInput.vue'

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
  id: props.passenger?.id ?? null,

  uuid: props.passenger?.uuid ?? crypto.randomUUID(),

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
