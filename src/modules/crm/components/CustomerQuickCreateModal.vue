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
        @click.self="close"
      >
        <div class="flex min-h-full items-center justify-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Nuevo cliente"
            class="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  Nuevo cliente
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Registra rápidamente un cliente para utilizarlo en la cotización.
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                @click="close"
              >
                <X class="h-5 w-5" />
              </button>
            </header>

            <!-- BODY -->
            <div class="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
              <!-- ERROR -->
              <div
                v-if="error"
                class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
              >
                {{ error }}
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <!-- DOCUMENT TYPE -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tipo de documento <span class="text-red-500">*</span>
                  </label>

                  <select
                    v-model="form.document_type_id"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    :disabled="loadingDocumentTypes"
                  >
                    <option :value="null">
                      {{ loadingDocumentTypes ? 'Cargando...' : 'Seleccione...' }}
                    </option>

                    <option
                      v-for="type in documentTypes"
                      :key="type.id"
                      :value="type.id"
                    >
                      {{ type.code }} - {{ type.name }}
                    </option>
                  </select>
                </div>

                <!-- DOCUMENT NUMBER -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Número de documento <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.trim="form.document_number"
                    type="text"
                    placeholder="Número de documento"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>

                <!-- FIRST NAME -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nombres <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.trim="form.first_name"
                    type="text"
                    placeholder="Nombres del cliente"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>

                <!-- LAST NAME -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Apellidos <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.trim="form.last_name"
                    type="text"
                    placeholder="Apellidos del cliente"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>

                <!-- NATIONALITY -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nacionalidad
                  </label>
                  <input
                    v-model.trim="form.nationality"
                    type="text"
                    placeholder="Nacionalidad"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>

                <!-- PHONE -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Teléfono
                  </label>
                  <input
                    v-model.trim="form.phone"
                    type="text"
                    placeholder="+34 600 000 000"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>

                <!-- EMAIL -->
                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    v-model.trim="form.email"
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>

                <!-- NOTES -->
                <div class="md:col-span-2">
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Observaciones
                  </label>
                  <textarea
                    v-model.trim="form.notes"
                    rows="3"
                    placeholder="Notas adicionales sobre el cliente..."
                    class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  />
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
                @click="close"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!canSave || saving"
                @click="save"
              >
                <UserPlus class="mr-1.5 h-4 w-4" />
                {{ saving ? 'Guardando...' : 'Crear cliente' }}
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { X, UserPlus } from 'lucide-vue-next'

import DocumentTypeService from '@/modules/catalog/service/document-type.service'

const props = defineProps({
  saving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const error = ref(null)

const documentTypes = ref([])

const loadingDocumentTypes = ref(false)

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const form = reactive({
  document_type_id: null,

  document_number: '',

  first_name: '',

  last_name: '',

  nationality: '',

  email: '',

  phone: '',

  notes: '',

  birth_date: null,

  gender: null,

  address: '',

  city: '',

  country: '',

  active: true,
})

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const canSave = computed(() => {
  return Boolean(form.document_type_id && form.document_number && form.first_name && form.last_name)
})

/*
|--------------------------------------------------------------------------
| Document Types
|--------------------------------------------------------------------------
*/

async function loadDocumentTypes() {
  loadingDocumentTypes.value = true

  try {
    const response = await DocumentTypeService.getAll({
      active: 1,
    })

    documentTypes.value = response.data.data ?? []
  } catch (err) {
    console.error('Error cargando tipos de documento:', err)

    documentTypes.value = []
  } finally {
    loadingDocumentTypes.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

function save() {
  error.value = null

  if (!canSave.value) {
    error.value = 'Complete los campos obligatorios.'

    return
  }

  emit('save', {
    ...form,
  })
}

function close() {
  emit('close')
}

/*
|--------------------------------------------------------------------------
| Init
|--------------------------------------------------------------------------
*/

onMounted(() => {
  loadDocumentTypes()
})
</script>
