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
            aria-label="Pasajeros de la cotización"
            class="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  Pasajeros de la cotización
                </h2>
                <div
                  v-if="quotation"
                  class="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
                >
                  <span class="font-medium text-slate-700 dark:text-slate-300">
                    {{ quotation.code }}
                  </span>
                  <span>•</span>
                  <span>{{ customerName }}</span>
                </div>
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

            <!-- SUMMARY -->
            <div
              class="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/50 sm:grid-cols-3 sm:px-6"
            >
              <!-- TOTAL -->
              <div
                class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div
                  class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Total pasajeros
                </div>
                <div class="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                  {{ passengers.length }}
                </div>
              </div>

              <!-- COMPLETE -->
              <div
                class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div
                  class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Completos
                </div>
                <div class="mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                  {{ completedCount }}
                </div>
              </div>

              <!-- PENDING -->
              <div
                class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div
                  class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Pendientes
                </div>
                <div class="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400">
                  {{ pendingCount }}
                </div>
              </div>
            </div>

            <!-- BODY -->
            <div class="flex-1 overflow-y-auto p-5 sm:p-6">
              <!-- LOADING -->
              <div v-if="loading" class="flex min-h-48 items-center justify-center">
                <div class="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <div
                    class="h-5 w-5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
                  ></div>
                  Cargando pasajeros...
                </div>
              </div>

              <!-- ERROR -->
              <div
                v-else-if="error"
                class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
              >
                {{ error }}
              </div>

              <!-- EMPTY -->
              <div
                v-else-if="!passengers.length"
                class="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50"
              >
                <div class="text-base font-medium text-slate-700 dark:text-slate-300">
                  Esta cotización no tiene pasajeros
                </div>
                <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Puedes agregarlos desde la administración de la cotización.
                </div>
              </div>

              <!-- TABLE -->
              <div
                v-else
                class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <div class="overflow-x-auto">
                  <table class="min-w-full text-sm">
                    <!-- HEADER -->
                    <thead class="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th
                          class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                        >
                          #
                        </th>
                        <th
                          class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                        >
                          Pasajero
                        </th>
                        <th
                          class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                        >
                          Tipo
                        </th>
                        <th
                          class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                        >
                          Nacionalidad
                        </th>
                        <th
                          class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                        >
                          Documento
                        </th>
                        <th
                          class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                        >
                          Estado
                        </th>
                      </tr>
                    </thead>

                    <!-- BODY -->
                    <tbody>
                      <tr
                        v-for="(passenger, index) in passengers"
                        :key="passenger.uuid ?? passenger.id"
                        class="border-t border-slate-100 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                      >
                        <!-- INDEX -->
                        <td class="px-3 py-2.5 text-sm text-slate-500 dark:text-slate-400">
                          {{ index + 1 }}
                        </td>

                        <!-- PASSENGER -->
                        <td class="px-3 py-2.5">
                          <div class="font-medium text-slate-900 dark:text-white">
                            {{ passengerName(passenger) }}
                          </div>
                          <div
                            v-if="passenger.email"
                            class="mt-0.5 text-xs text-slate-500 dark:text-slate-400"
                          >
                            {{ passenger.email }}
                          </div>
                        </td>

                        <!-- TYPE -->
                        <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
                          {{ passengerTypeName(passenger) }}
                        </td>

                        <!-- NATIONALITY -->
                        <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
                          <CountryBadge
                            :iso="passenger.nationality"
                            :name="passenger.country?.name"
                          />
                        </td>

                        <!-- DOCUMENT -->
                        <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
                          {{ passenger.document_number || '-' }}
                        </td>

                        <!-- COMPLETION -->
                        <td class="px-3 py-2.5">
                          <span
                            class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                            :class="
                              isComplete(passenger)
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            "
                          >
                            {{ isComplete(passenger) ? 'Completo' : 'Pendiente' }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <footer
              class="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div class="text-sm text-slate-500 dark:text-slate-400">
                {{ passengers.length }} pasajero{{ passengers.length === 1 ? '' : 's' }}
              </div>

              <div class="flex flex-col-reverse gap-2 sm:flex-row sm:gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
                  @click="close"
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                  @click="managePassengers"
                >
                  <Users class="mr-1.5 h-4 w-4" />
                  Administrar pasajeros
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Users, X } from 'lucide-vue-next'

import { useRouter } from 'vue-router'

import QuotationPassengerService from '../../services/quotation-passenger.service'
import CountryBadge from '@/shared/components/CountryBadge.vue'

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

const props = defineProps({
  quotation: {
    type: Object,
    required: true,
  },
})

/*
|--------------------------------------------------------------------------
| EMITS
|--------------------------------------------------------------------------
*/

const emit = defineEmits(['close'])

/*
|--------------------------------------------------------------------------
| ROUTER
|--------------------------------------------------------------------------
*/

const router = useRouter()

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const passengers = ref([])

const loading = ref(false)

const error = ref(null)

/*
|--------------------------------------------------------------------------
| CUSTOMER
|--------------------------------------------------------------------------
*/

const customerName = computed(() => {
  const customer = props.quotation?.customer

  if (!customer) {
    return 'Sin cliente'
  }

  const firstName = customer.first_name ?? ''

  const lastName = customer.last_name ?? ''

  return `${firstName} ${lastName}`.trim() || 'Sin cliente'
})

/*
|--------------------------------------------------------------------------
| COMPLETION
|--------------------------------------------------------------------------
*/

function isComplete(passenger) {
  return Boolean(
    passenger.first_name &&
    passenger.last_name &&
    passenger.passenger_type_id &&
    passenger.document_number,
  )
}

const completedCount = computed(() => {
  return passengers.value.filter((passenger) => isComplete(passenger)).length
})

const pendingCount = computed(() => {
  return passengers.value.length - completedCount.value
})

/*
|--------------------------------------------------------------------------
| PASSENGER NAME
|--------------------------------------------------------------------------
*/

function passengerName(passenger) {
  const firstName = passenger.first_name ?? ''

  const lastName = passenger.last_name ?? ''

  const name = `${firstName} ${lastName}`.trim()

  return name || 'Pendiente'
}

/*
|--------------------------------------------------------------------------
| PASSENGER TYPE
|--------------------------------------------------------------------------
*/

function passengerTypeName(passenger) {
  /*
   * Preferimos la relación devuelta
   * por QuotationPassengerResource.
   */

  if (passenger.passenger_type?.name) {
    return passenger.passenger_type.name
  }

  /*
   * Por compatibilidad si el Resource
   * usa camelCase.
   */

  if (passenger.passengerType?.name) {
    return passenger.passengerType.name
  }

  return '-'
}

/*
|--------------------------------------------------------------------------
| LOAD
|--------------------------------------------------------------------------
*/

async function loadPassengers() {
  if (!props.quotation?.uuid) {
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await QuotationPassengerService.getAll(props.quotation.uuid)

    passengers.value = response.data.data ?? []
  } catch (err) {
    console.error('Error cargando pasajeros:', err)

    error.value = 'No se pudieron cargar los pasajeros de la cotización.'
  } finally {
    loading.value = false
  }
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
| MANAGE
|--------------------------------------------------------------------------
*/

function managePassengers() {
  close()

  router.push({
    name: 'quotation.edit',

    params: {
      uuid: props.quotation.uuid,
    },

    query: {
      tab: 'passengers',
    },
  })
}

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(() => {
  loadPassengers()
})
</script>
