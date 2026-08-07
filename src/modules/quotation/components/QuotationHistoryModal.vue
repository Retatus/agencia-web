<template>
  <!-- Modal completamente independiente -->
  <div
    class="modal-overlay"
    @click.self="emit('close')"
  >
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div>
          <h5 class="modal-title">Historial de cambios</h5>
          <small class="text-muted">{{ quotation?.code }}</small>
        </div>
        <button
          class="close-btn"
          @click="emit('close')"
          >×</button
        >
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- Loading -->
        <div
          v-if="store.loading"
          class="text-center py-5"
        >
          <div class="spinner"></div>
          <div class="mt-3">Cargando historial...</div>
        </div>

        <!-- Sin registros -->
        <div
          v-else-if="!store.items.length"
          class="text-center py-5"
        >
          <p class="text-muted">No existen cambios registrados.</p>
        </div>

        <!-- Timeline -->
        <div
          v-else
          class="history-timeline"
        >
          <div
            v-for="batch in historyGroups"
            :key="batch.batch_uuid"
            class="history-card"
          >
            <!-- Batch Header -->
            <div class="card-header">
              <div class="header-content">
                <div>
                  <h6 class="card-title">{{ batch.title }}</h6>
                  <small class="text-muted">{{ formatDate(batch.created_at) }}</small>
                </div>
                <span class="badge"> {{ batch.totalChanges }} cambios </span>
              </div>
            </div>

            <!-- Tabla -->
            <div class="table-wrapper">
              <table class="history-table">
                <thead>
                  <tr>
                    <th style="width: 100px">Hora</th>
                    <th style="width: 130px">Entidad</th>
                    <th style="width: 100px">Acción</th>
                    <th style="width: 130px">Campo</th>
                    <th>Descripción</th>
                    <th>Valor anterior</th>
                    <th>Valor nuevo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="history in batch.histories"
                    :key="history.id"
                  >
                    <!-- Hora -->
                    <td class="text-nowrap text-muted small">{{
                      formatDateTime(history.created_at)
                    }}</td>

                    <!-- Entidad -->
                    <td class="text-nowrap">
                      <span class="fw-medium">{{ formatEntity(history.entity_type) }}</span>
                    </td>

                    <!-- Acción -->
                    <td>{{ actionLabel(history.action) }}</td>

                    <!-- Campo -->
                    <td class="text-nowrap fw-medium">{{ history.field ?? 'Registro' }}</td>
                    <td class="value-cell">
                      <div class="simple-value">
                        {{ formatValue(history.description) }}
                      </div>
                    </td>

                    <!-- Si es JSON, fusionar y hacer pivote -->
                    <td
                      v-if="isJsonValue(history.old_value) || isJsonValue(history.new_value)"
                      colspan="2"
                      class="value-cell-json"
                    >
                      <div class="json-pivot-wrapper">
                        <table class="json-pivot-table">
                          <thead>
                            <tr>
                              <th class="pivot-row-header"></th>
                              <th
                                v-for="key in getMergedKeys(history.old_value, history.new_value)"
                                :key="'header-' + key"
                                class="pivot-field-header"
                              >
                                {{ prettify(key) }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <!-- Fila: Valor anterior -->
                            <tr>
                              <td class="pivot-row-label old-label">Anterior</td>
                              <td
                                v-for="key in getMergedKeys(history.old_value, history.new_value)"
                                :key="'old-' + key"
                                class="pivot-cell old-value"
                              >
                                {{ formatValue(getValueFromObject(history.old_value, key)) }}
                              </td>
                            </tr>
                            <!-- Fila: Valor nuevo -->
                            <tr>
                              <td class="pivot-row-label new-label">Nuevo</td>
                              <td
                                v-for="key in getMergedKeys(history.old_value, history.new_value)"
                                :key="'new-' + key"
                                class="pivot-cell new-value"
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
                      <td class="value-cell-simple">
                        <div class="simple-value">
                          {{ formatValue(history.old_value) }}
                        </div>
                      </td>
                      <td class="value-cell-simple">
                        <div class="simple-value">
                          {{ formatValue(history.new_value) }}
                        </div>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button
          class="btn-secondary"
          @click="emit('close')"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
   MODAL OVERLAY - Fondo oscuro
   ============================================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow: auto;
}

/* ============================================================
   MODAL CONTAINER
   ============================================================ */
.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 1400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* ============================================================
   HEADER
   ============================================================ */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.text-muted {
  color: #6c757d;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6c757d;
  padding: 0 8px;
  line-height: 1;
}

.close-btn:hover {
  color: #212529;
}

/* ============================================================
   BODY
   ============================================================ */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

/* ============================================================
   LOADING
   ============================================================ */
.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ============================================================
   HISTORY CARDS
   ============================================================ */
.history-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;
}

.card-header {
  background: #f8f9fa;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.header-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-title {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
}

.badge {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
}

/* ============================================================
   TABLA PRINCIPAL
   ============================================================ */
.table-wrapper {
  overflow-x: auto;
  padding: 0;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.history-table thead {
  background: #f8f9fa;
}

.history-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #6c757d;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}

.history-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f3f5;
  vertical-align: middle;
}

.history-table tbody tr:hover {
  background: #f8f9fa;
}

.text-nowrap {
  white-space: nowrap;
}

.fw-medium {
  font-weight: 500;
}

.small {
  font-size: 0.875rem;
}

/* ============================================================
   BADGE ACCIÓN
   ============================================================ */
.badge-action {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  border: 1px solid #dee2e6;
  font-size: 0.8rem;
  background: transparent;
  color: inherit;
}

/* ============================================================
   VALUE CELL - JSON (colspan 2)
   ============================================================ */
.value-cell-json {
  padding: 8px 16px !important;
}

/* ============================================================
   TABLA PIVOTE PARA JSON
   ============================================================ */
.json-pivot-wrapper {
  overflow-x: auto;
  max-width: 100%;
}

.json-pivot-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 200px;
}

.json-pivot-table thead th {
  padding: 6px 12px;
  text-align: center;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #6c757d;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
  background: #f8f9fa;
  white-space: nowrap;
}

.pivot-field-header {
  min-width: 80px;
  padding: 6px 12px !important;
}

.pivot-row-header {
  min-width: 70px;
  width: 70px;
  background: #f8f9fa;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #6c757d;
  border-bottom: 1px solid #f1f3f5;
}

.pivot-row-label {
  padding: 6px 12px !important;
  text-align: center;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.old-label {
  color: #6c757d;
  background: #fff8f0;
}

.new-label {
  color: #212529;
  background: #f0f8ff;
}

.pivot-cell {
  padding: 6px 12px !important;
  text-align: center;
  word-break: break-word;
  border-bottom: 1px solid #f1f3f5;
}

.old-value {
  background: #fff8f0;
  color: #6c757d;
}

.new-value {
  background: #f0f8ff;
  color: #212529;
  font-weight: 500;
}

/* ============================================================
   VALUE CELL - Simple (dos columnas separadas)
   ============================================================ */
.value-cell-simple {
  max-width: 300px;
  min-width: 150px;
  word-break: break-word;
}

.simple-value {
  padding: 4px 0;
  color: #212529;
}

/* ============================================================
   FOOTER
   ============================================================ */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #e9ecef;
  flex-shrink: 0;
}

.btn-secondary {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 8px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #212529;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e9ecef;
}

/* ============================================================
   SCROLLBAR
   ============================================================ */
.json-pivot-wrapper::-webkit-scrollbar {
  height: 6px;
}

.json-pivot-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.json-pivot-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header {
    padding: 16px;
  }

  .modal-body {
    padding: 16px;
  }

  .history-table td,
  .history-table th {
    padding: 8px 10px;
    font-size: 0.8rem;
  }

  .json-pivot-table thead th,
  .json-pivot-table tbody td {
    font-size: 0.75rem;
    padding: 4px 8px !important;
  }

  .pivot-field-header {
    min-width: 60px;
  }

  .pivot-row-header {
    min-width: 50px;
    width: 50px;
  }
}
</style>

<script setup>
import { onMounted, computed } from 'vue'

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
