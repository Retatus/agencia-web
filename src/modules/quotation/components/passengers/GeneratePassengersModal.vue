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
            aria-label="Generar pasajeros"
            class="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  Generar pasajeros
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Define la cantidad de pasajeros por tipo.
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
            <div class="p-5 sm:p-6">
              <div class="space-y-3">
                <div
                  v-for="type in passengerTypes"
                  :key="type.id"
                  class="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div>
                    <div class="font-medium text-slate-900 dark:text-white">
                      {{ type.name }}
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">
                      {{ type.code }}
                    </div>
                  </div>

                  <input
                    v-model.number="quantities[type.id]"
                    type="number"
                    min="0"
                    step="1"
                    class="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-right text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <!-- NATIONALITY -->
              <div class="mt-5">
                <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nacionalidad común
                </label>
                <input
                  v-model.trim="nationality"
                  type="text"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  placeholder="Opcional"
                />
              </div>

              <!-- TOTAL -->
              <div
                class="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-500 dark:text-slate-400"> Total pasajeros </span>
                  <strong class="text-lg text-slate-900 dark:text-white">
                    {{ total }}
                  </strong>
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
                :disabled="total <= 0"
                @click="save"
              >
                <Users class="mr-1.5 h-4 w-4" />
                Generar {{ total }} pasajeros
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <QuotationPassengerFormModal
    v-if="showPassengerModal"
    :item="editingPassenger"
    :passenger-types="passengerTypes"
    @close="closePassengerModal"
    @save="handlePassengerSave"
  />
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

import QuotationPassengerFormModal from '../PassengerModal.vue'

const props = defineProps({
  passengerTypes: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'save'])

const nationality = ref('')

const quantities = reactive({})

const showPassengerModal = ref(false)

const editingPassenger = ref(null)

function openPassengerModal(passenger = null) {
  editingPassenger.value = passenger ? structuredClone(passenger) : null

  showPassengerModal.value = true
}

function closePassengerModal() {
  showPassengerModal.value = false

  editingPassenger.value = null
}

/*
|--------------------------------------------------------------------------
| TOTAL
|--------------------------------------------------------------------------
*/

const total = computed(() => {
  return Object.values(quantities).reduce(
    (total, value) => total + Number(value ?? 0),

    0,
  )
})

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

function save() {
  const groups = props.passengerTypes
    .map((type) => ({
      passenger_type_id: type.id,

      quantity: Number(quantities[type.id] ?? 0),
    }))
    .filter((group) => group.quantity > 0)

  if (!groups.length) {
    return
  }

  emit('save', {
    groups,

    nationality: nationality.value || null,
  })
}

/*
|--------------------------------------------------------------------------
| CLOSE
|--------------------------------------------------------------------------
*/

function close() {
  emit('close')
}
</script>
