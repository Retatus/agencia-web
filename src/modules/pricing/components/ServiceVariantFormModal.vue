<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div class="flex min-h-full items-center justify-center">
          <div
            role="dialog"
            aria-modal="true"
            :aria-label="isEdit ? 'Editar variante' : 'Nueva variante'"
            class="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ isEdit ? 'Editar variante' : 'Nueva variante' }}
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {{
                    isEdit
                      ? 'Actualice la presentación, capacidad o tipo de unidad.'
                      : 'Crea la presentación o capacidad del servicio antes de registrar su tarifa.'
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

            <!-- FORM -->
            <form class="max-h-[70vh] overflow-y-auto p-5 sm:p-6" @submit.prevent="save(false)">
              <!-- ERROR -->
              <div
                v-if="error"
                class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
              >
                {{ error }}
              </div>

              <!-- SERVICIO -->
              <div class="mb-5">
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Servicio <span class="text-red-500">*</span>
                </label>
                <select
                  v-model.number="form.service_id"
                  required
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option :value="null" disabled>Seleccione un servicio</option>
                  <option v-for="service in services" :key="service.id" :value="service.id">
                    {{ service.code }} · {{ service.name }}
                  </option>
                </select>
              </div>

              <!-- CÓDIGO Y NOMBRE -->
              <div class="mb-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Código <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.trim="form.code"
                    required
                    maxlength="10"
                    placeholder="HAB-DBL"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm uppercase text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  />
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Máximo 10 caracteres y único en todo el catálogo.
                  </p>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nombre <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.trim="form.name"
                    required
                    maxlength="150"
                    placeholder="Habitación doble"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>
              </div>

              <!-- UNIDAD Y DURACIÓN -->
              <div class="mb-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tipo de unidad <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.unit_type"
                    required
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="PERSON">Persona</option>
                    <option value="ROOM">Habitación</option>
                    <option value="VEHICLE">Vehículo</option>
                    <option value="GROUP">Grupo</option>
                    <option value="UNIT">Unidad</option>
                  </select>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Duración
                  </label>
                  <input
                    v-model.number="form.duration"
                    type="number"
                    min="1"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>
              </div>

              <!-- CAPACIDADES -->
              <div class="mb-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Capacidad mínima <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="form.min_capacity"
                    required
                    type="number"
                    min="1"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Capacidad máxima <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="form.max_capacity"
                    required
                    type="number"
                    :min="form.min_capacity"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Capacidad óptima <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="form.optimal_capacity"
                    required
                    type="number"
                    :min="form.min_capacity"
                    :max="form.max_capacity"
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <!-- ACTIVO -->
              <label
                class="mb-5 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <input
                  v-model="form.active"
                  type="checkbox"
                  class="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-600 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800"
                />
                <span>
                  <span class="block text-sm font-medium text-slate-800 dark:text-slate-200">
                    Variante activa
                  </span>
                  <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    Disponible para operaciones y precios.
                  </span>
                </span>
              </label>
            </form>

            <!-- FOOTER -->
            <footer
              class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-6"
            >
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/30 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                :disabled="saving"
                @click="emit('close')"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border border-teal-600 bg-white px-4 py-2.5 text-sm font-medium text-teal-700 shadow-sm transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed dark:border-teal-500 dark:bg-slate-900 dark:text-teal-400 dark:hover:bg-teal-950/30"
                :disabled="saving"
                @click="save(false)"
              >
                <Save v-if="!isEdit" class="mr-1.5 h-4 w-4" />
                <Pencil v-else class="mr-1.5 h-4 w-4" />
                {{ saving ? 'Guardando…' : isEdit ? 'Actualizar variante' : 'Guardar variante' }}
              </button>

              <button
                v-if="!isEdit"
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
                :disabled="saving"
                @click="save(true)"
              >
                <Plus class="mr-1.5 h-4 w-4" />
                Guardar y agregar tarifa
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import ServiceVariantService from '../services/service-variant.service'
import { X, Save, Pencil, Plus } from 'lucide-vue-next'

const props = defineProps({
  services: { type: Array, default: () => [] },
  item: { type: Object, default: null },
  initialServiceId: { type: Number, default: null },
})

const emit = defineEmits(['close', 'saved'])
const saving = ref(false)
const error = ref('')
const isEdit = computed(() => Boolean(props.item?.id))
const form = reactive({
  service_id: null,
  code: '',
  name: '',
  min_capacity: 1,
  max_capacity: 1,
  optimal_capacity: 1,
  unit_type: 'UNIT',
  duration: 1,
  active: true,
})

watch(
  () => [props.item, props.initialServiceId],
  () => {
    Object.assign(form, {
      service_id: props.item?.service_id ?? props.initialServiceId ?? null,
      code: props.item?.code ?? '',
      name: props.item?.name ?? '',
      min_capacity: Number(props.item?.min_capacity ?? 1),
      max_capacity: Number(props.item?.max_capacity ?? 1),
      optimal_capacity: Number(props.item?.optimal_capacity ?? 1),
      unit_type: props.item?.unit_type ?? 'UNIT',
      duration: props.item?.duration == null ? 1 : Number(props.item.duration),
      active: Boolean(props.item?.active ?? true),
    })
  },
  { immediate: true, deep: true },
)

function errorMessage(exception) {
  const errors = exception.response?.data?.errors
  if (errors) return Object.values(errors).flat().join(' ')
  return (
    exception.response?.data?.message ?? exception.message ?? 'No fue posible crear la variante.'
  )
}

async function save(createPrice) {
  if (saving.value) return

  error.value = ''

  if (Number(form.max_capacity) < Number(form.min_capacity)) {
    error.value = 'La capacidad máxima no puede ser menor que la mínima.'
    return
  }

  if (
    Number(form.optimal_capacity) < Number(form.min_capacity) ||
    Number(form.optimal_capacity) > Number(form.max_capacity)
  ) {
    error.value = 'La capacidad óptima debe estar entre la mínima y la máxima.'
    return
  }

  saving.value = true
  try {
    const payload = {
      ...form,
      code: form.code.toUpperCase(),
      duration: form.duration ? Number(form.duration) : null,
    }
    const response = isEdit.value
      ? await ServiceVariantService.update(props.item.id, payload)
      : await ServiceVariantService.create(payload)
    emit('saved', { variant: response.data.data, createPrice })
  } catch (exception) {
    error.value = errorMessage(exception)
  } finally {
    saving.value = false
  }
}
</script>
