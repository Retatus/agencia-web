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
        @click.self="emit('close')"
      >
        <div class="flex min-h-full items-center justify-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Historial de cambios"
            class="w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  Historial de cambios
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {{ quotation?.code }}
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
              <!-- Loading -->
              <div
                v-if="store.loading"
                class="py-8 text-center"
              >
                <div
                  class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"
                ></div>
                <div class="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Cargando historial...
                </div>
              </div>

              <!-- Sin registros -->
              <div
                v-else-if="!store.items.length"
                class="py-8 text-center"
              >
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  No existen cambios registrados.
                </p>
              </div>

              <!-- Timeline -->
              <div
                v-else
                class="space-y-6"
              >
                <div
                  v-for="batch in historyGroups"
                  :key="batch.batch_uuid"
                  class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <!-- Batch Header -->
                  <div
                    class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <div>
                      <h6 class="text-sm font-semibold text-slate-900 dark:text-white">
                        {{ batch.title }}
                      </h6>
                      <span class="text-xs text-slate-500 dark:text-slate-400">
                        {{ formatDate(batch.created_at) }}
                      </span>
                    </div>
                    <span
                      class="inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    >
                      {{ batch.totalChanges }} cambios
                    </span>
                  </div>

                  <!-- Tabla -->
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead
                        class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"
                      >
                        <tr>
                          <th
                            class="whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            style="min-width: 100px"
                          >
                            Hora
                          </th>
                          <th
                            class="whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            style="min-width: 130px"
                          >
                            Entidad
                          </th>
                          <th
                            class="whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            style="min-width: 100px"
                          >
                            Acción
                          </th>
                          <th
                            class="whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            style="min-width: 130px"
                          >
                            Campo
                          </th>
                          <th
                            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                          >
                            Descripción
                          </th>
                          <th
                            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                          >
                            Valor anterior
                          </th>
                          <th
                            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                          >
                            Valor nuevo
                          </th>
                        </tr>
                      </thead>

                      <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                        <tr
                          v-for="history in batch.histories"
                          :key="history.id"
                          class="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <!-- Hora -->
                          <td
                            class="whitespace-nowrap px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400"
                          >
                            {{ formatDateTime(history.created_at) }}
                          </td>

                          <!-- Entidad -->
                          <td class="whitespace-nowrap px-3 py-2.5">
                            <span class="font-medium text-slate-700 dark:text-slate-300">
                              {{ formatEntity(history.entity_type) }}
                            </span>
                          </td>

                          <!-- Acción -->
                          <td class="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                            {{ actionLabel(history.action) }}
                          </td>

                          <!-- Campo -->
                          <td
                            class="whitespace-nowrap px-3 py-2.5 font-medium text-slate-700 dark:text-slate-300"
                          >
                            {{ history.field ?? 'Registro' }}
                          </td>

                          <!-- Descripción -->
                          <td class="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                            <div class="max-w-xs truncate">
                              {{ formatValue(history.description) }}
                            </div>
                          </td>

                          <!-- Si es JSON, fusionar y hacer pivote -->
                          <td
                            v-if="isJsonValue(history.old_value) || isJsonValue(history.new_value)"
                            colspan="2"
                            class="px-3 py-2.5"
                          >
                            <div class="overflow-x-auto">
                              <table class="min-w-full text-xs">
                                <thead>
                                  <tr>
                                    <th
                                      class="border-b border-slate-200 px-2 py-1 text-left font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400"
                                    ></th>
                                    <th
                                      v-for="key in getMergedKeys(
                                        history.old_value,
                                        history.new_value,
                                      )"
                                      :key="'header-' + key"
                                      class="border-b border-slate-200 px-2 py-1 text-left font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400"
                                    >
                                      {{ prettify(key) }}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <!-- Fila: Valor anterior -->
                                  <tr>
                                    <td
                                      class="px-2 py-1 font-medium text-red-600 dark:text-red-400"
                                    >
                                      Anterior
                                    </td>
                                    <td
                                      v-for="key in getMergedKeys(
                                        history.old_value,
                                        history.new_value,
                                      )"
                                      :key="'old-' + key"
                                      class="px-2 py-1 text-red-600 dark:text-red-400"
                                    >
                                      {{ formatValue(getValueFromObject(history.old_value, key)) }}
                                    </td>
                                  </tr>
                                  <!-- Fila: Valor nuevo -->
                                  <tr>
                                    <td
                                      class="px-2 py-1 font-medium text-green-600 dark:text-green-400"
                                    >
                                      Nuevo
                                    </td>
                                    <td
                                      v-for="key in getMergedKeys(
                                        history.old_value,
                                        history.new_value,
                                      )"
                                      :key="'new-' + key"
                                      class="px-2 py-1 text-green-600 dark:text-green-400"
                                    >
                                      {{ formatValue(getValueFromObject(history.new_value, key)) }}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>

                          <!-- Si NO es JSON, mostrar en dos columnas separadas -->
                          <template v-else>
                            <td class="px-3 py-2.5 text-red-600 dark:text-red-400">
                              {{ formatValue(history.old_value) }}
                            </td>
                            <td class="px-3 py-2.5 text-green-600 dark:text-green-400">
                              {{ formatValue(history.new_value) }}
                            </td>
                          </template>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
                Cerrar
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useQuotationHistoryStore } from '../stores/quotation-history.store'

const props = defineProps({
  quotation: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

const store = useQuotationHistoryStore()

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  await loadHistory()
})

async function loadHistory() {
  await store.fetchHistory(props.quotation.uuid, {
    entity_type: 'quotation',
  })
}

/*
|--------------------------------------------------------------------------
| Batch Groups
|--------------------------------------------------------------------------
*/

const historyGroups = computed(() => {
  const groups = {}

  for (const history of store.items) {
    if (!groups[history.batch_uuid]) {
      groups[history.batch_uuid] = {
        batch_uuid: history.batch_uuid,
        created_at: history.created_at,
        histories: [],
      }
    }

    groups[history.batch_uuid].histories.push(history)
  }

  return Object.values(groups)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((group) => {
      group.totalChanges = group.histories.length
      group.title = getBatchTitle(group)
      return group
    })
})

/*
|--------------------------------------------------------------------------
| Batch title
|--------------------------------------------------------------------------
*/

function getBatchTitle(batch) {
  const first = batch.histories[0]

  if (!first) {
    return 'Operación'
  }

  switch (first.action) {
    case 'created':
      return 'Creación'
    case 'updated':
      return 'Actualización'
    case 'deleted':
      return 'Eliminación'
    default:
      return 'Operación'
  }
}

/*
|--------------------------------------------------------------------------
| Labels
|--------------------------------------------------------------------------
*/

function actionLabel(action) {
  switch (action) {
    case 'created':
      return 'Creado'
    case 'updated':
      return 'Actualizado'
    case 'deleted':
      return 'Eliminado'
    default:
      return action
  }
}

function actionClass(action) {
  // Retornamos solo 'border' para mantener neutralidad
  return 'border'
}

/*
|--------------------------------------------------------------------------
| Entity
|--------------------------------------------------------------------------
*/

function formatEntity(entity) {
  switch (entity) {
    case 'Quotation':
      return 'Cotización'
    case 'QuotationItinerary':
      return 'Itinerario'
    case 'QuotationItem':
      return 'Servicio'
    case 'QuotationPassenger':
      return 'Pasajero'
    default:
      return entity
  }
}

/*
|--------------------------------------------------------------------------
| Date
|--------------------------------------------------------------------------
*/

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/*
|--------------------------------------------------------------------------
| Objects
|--------------------------------------------------------------------------
*/

function isObject(value) {
  return (
    value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)
  )
}

/*
|--------------------------------------------------------------------------
| Pretty Keys - Corregido sin replaceAll
|--------------------------------------------------------------------------
*/

function prettify(key) {
  if (!key) return ''

  // Reemplazar guiones bajos con espacios
  let result = key.replace(/_/g, ' ')

  // Separar camelCase
  result = result.replace(/([A-Z])/g, ' $1')

  // Capitalizar cada palabra
  result = result.replace(/\b\w/g, (c) => c.toUpperCase())

  return result.trim()
}

/*
|--------------------------------------------------------------------------
| Values
|--------------------------------------------------------------------------
*/

function formatValue(value) {
  if (value === null || value === undefined) {
    return '—'
  }

  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No'
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  if (isObject(value)) {
    return JSON.stringify(value)
  }

  return String(value)
}

/*
|--------------------------------------------------------------------------
| MÉTODOS NUEVOS PARA SUBTABLA JSON
|--------------------------------------------------------------------------
*/

// Obtener todas las keys únicas de ambos objetos (excluyendo 'uuid')
function getMergedKeys(oldObj, newObj) {
  const keys = []
  const keySet = new Set()

  if (oldObj && typeof oldObj === 'object' && !Array.isArray(oldObj)) {
    Object.keys(oldObj).forEach((key) => {
      // Excluir 'uuid'
      if (key !== 'uuid' && !keySet.has(key)) {
        keySet.add(key)
        keys.push(key)
      }
    })
  }

  if (newObj && typeof newObj === 'object' && !Array.isArray(newObj)) {
    Object.keys(newObj).forEach((key) => {
      // Excluir 'uuid'
      if (key !== 'uuid' && !keySet.has(key)) {
        keySet.add(key)
        keys.push(key)
      }
    })
  }

  return keys
}

// Obtener valor de un objeto por key (maneja undefined)
// Omite el campo 'uuid' si existe
function getValueFromObject(obj, key) {
  // Si la key es 'uuid', retornar null para omitirlo
  if (key === 'uuid') {
    return null
  }

  if (obj && typeof obj === 'object' && !Array.isArray(obj) && key in obj) {
    return obj[key]
  }
  return null
}

// Verificar si un valor es JSON (objeto o array)
function isJsonValue(value) {
  return value !== null && typeof value === 'object' && !(value instanceof Date)
}
</script>
