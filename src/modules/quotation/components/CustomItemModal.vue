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
        @click.self="cancel"
      >
        <div class="flex min-h-full items-center justify-center">
          <div
            role="dialog"
            aria-modal="true"
            :aria-label="
              isEdit ? 'Editar Servicio Personalizado' : 'Agregar Servicio Personalizado'
            "
            class="w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ isEdit ? 'Editar Servicio Personalizado' : 'Agregar Servicio Personalizado' }}
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {{
                    isEdit
                      ? 'Modifique la información del servicio personalizado.'
                      : 'Agregue un servicio que no pertenece al catálogo.'
                  }}
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                @click="cancel"
              >
                <X class="h-5 w-5" />
              </button>
            </header>

            <!-- BODY -->
            <div class="p-5 sm:p-6">
              <!-- INFORMACIÓN GENERAL -->
              <div
                class="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <div class="grid gap-4 sm:grid-cols-12">
                  <!-- Nombre -->
                  <div class="sm:col-span-8">
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Nombre <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      placeholder="Ej. Compra de agua, Propina, Regalo..."
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                    />
                  </div>

                  <!-- Duración -->
                  <div class="sm:col-span-4">
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Duración
                    </label>
                    <input
                      v-model.number="form.duration"
                      type="number"
                      min="1"
                      step="1"
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <!-- Descripción -->
                  <div class="sm:col-span-12">
                    <label
                      class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Descripción
                    </label>
                    <textarea
                      v-model="form.description"
                      rows="2"
                      placeholder="Descripción opcional del servicio..."
                      class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <!-- CONFIGURACIÓN Y COSTOS -->
              <div class="mb-6 grid gap-6 lg:grid-cols-2">
                <!-- CONFIGURACIÓN -->
                <div
                  class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                    <h3 class="font-semibold text-slate-900 dark:text-white"> Configuración </h3>
                  </div>
                  <div class="p-4">
                    <div class="grid gap-4">
                      <!-- Cantidad -->
                      <div>
                        <label
                          class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Cantidad <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model.number="form.quantity"
                          type="number"
                          min="1"
                          step="1"
                          required
                          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                      </div>

                      <!-- Activo -->
                      <div>
                        <label
                          class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Estado
                        </label>
                        <label
                          class="mt-1 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50"
                        >
                          <input
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
                </div>

                <!-- COSTOS Y VENTA -->
                <div
                  class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                    <h3 class="font-semibold text-slate-900 dark:text-white"> Costos y venta </h3>
                  </div>
                  <div class="p-4">
                    <div class="grid gap-4">
                      <!-- Costo unitario -->
                      <div>
                        <label
                          class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Costo unitario
                        </label>
                        <input
                          v-model.number="form.unit_cost"
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-right text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                      </div>

                      <!-- Precio de venta -->
                      <div>
                        <label
                          class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Precio de venta
                        </label>
                        <input
                          v-model.number="form.unit_price"
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-right text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                      </div>

                      <!-- Subtotal -->
                      <div>
                        <label
                          class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Subtotal
                        </label>
                        <input
                          :value="money(subtotal)"
                          readonly
                          class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-right text-sm font-bold text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- RESUMEN Y OBSERVACIONES -->
              <div class="mb-6 grid gap-6 lg:grid-cols-2">
                <!-- Resumen -->
                <div
                  class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
                >
                  <h4 class="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                    Resumen
                  </h4>
                  <div class="grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <span class="text-slate-500 dark:text-slate-400">Cantidad</span>
                      <div class="font-semibold text-slate-900 dark:text-white">
                        {{ form.quantity || 0 }}
                      </div>
                    </div>
                    <div>
                      <span class="text-slate-500 dark:text-slate-400">Venta unitaria</span>
                      <div class="font-semibold text-slate-900 dark:text-white">
                        {{ money(form.unit_price) }}
                      </div>
                    </div>
                    <div>
                      <span class="text-slate-500 dark:text-slate-400">Venta total</span>
                      <div class="font-semibold text-slate-900 dark:text-white">
                        {{ money(subtotal) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Observaciones -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Observaciones
                  </label>
                  <textarea
                    v-model="form.notes"
                    rows="3"
                    placeholder="Notas adicionales..."
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
                @click="cancel"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!canSave"
                @click="save"
              >
                <Pencil
                  v-if="isEdit"
                  class="mr-1 h-4 w-4"
                />
                <Plus
                  v-else
                  class="mr-1 h-4 w-4"
                />
                {{ isEdit ? 'Actualizar' : 'Agregar servicio' }}
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
import { X, Pencil, Plus } from 'lucide-vue-next'

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
