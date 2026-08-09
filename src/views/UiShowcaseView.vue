<script setup>
import { computed, reactive, ref } from 'vue'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-vue-next'
import {
  BaseAlert,
  BaseBadge,
  BaseCard,
  BaseModal,
  BasePagination,
  BaseTable,
} from '@/components/ui'
import BaseTabs from '@/components/ui/BaseTabs.vue'

const showModal = ref(false)
const showSuccess = ref(true)
const currentPage = ref(1)
const activeTab = ref('general')
const perPage = 5

const form = reactive({
  code: '',
  name: '',
  email: '',
  phone: '',
  category: '',
  travelDate: '',
  validUntil: '',
  departureAt: '',
  meetingTime: '',
  passengers: 1,
  budget: '',
  priceType: 'group',
  extras: ['guide'],
  document: null,
  description: '',
  active: true,
})

const tabs = [
  { value: 'general', label: 'Información general' },
  { value: 'itinerary', label: 'Itinerario', count: 3 },
  { value: 'passengers', label: 'Pasajeros', count: 8 },
  { value: 'documents', label: 'Documentos', count: 2 },
  { value: 'disabled', label: 'Bloqueada', disabled: true },
]

const allServices = Array.from({ length: 17 }, (_, index) => ({
  id: index + 1,
  code: `SER${String(index + 1).padStart(4, '0')}`,
  name: ['Hotel Casa Andina', 'Traslado aeropuerto', 'City Tour Cusco', 'Almuerzo turístico'][
    index % 4
  ],
  category: ['Hotel', 'Transporte', 'Tour', 'Alimentación'][index % 4],
  price: 45 + index * 8,
  active: index % 5 !== 0,
}))

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return allServices.slice(start, start + perPage)
})

const lastPage = Math.ceil(allServices.length / perPage)

function submitForm() {
  showSuccess.value = true
}
</script>

<template>
  <div class="space-y-8">
    <header class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p class="text-sm font-semibold text-teal-600 dark:text-teal-400">Guía visual</p>
        <h2 class="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
          >Componentes UI</h2
        >
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400"
          >Plantillas reutilizables para mantener una apariencia consistente en todo el ERP.</p
        >
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        @click="showModal = true"
      >
        <Plus class="h-4 w-4" /> Abrir modal
      </button>
    </header>

    <!-- Alertas -->
    <BaseCard
      title="Alertas"
      description="Mensajes de confirmación, información, advertencia y error."
    >
      <div class="grid gap-3 lg:grid-cols-2">
        <BaseAlert
          v-if="showSuccess"
          type="success"
          title="Operación completada"
          dismissible
          @close="showSuccess = false"
          >Los cambios se guardaron correctamente.</BaseAlert
        >
        <BaseAlert
          type="info"
          title="Información"
          >La cotización será válida durante 15 días.</BaseAlert
        >
        <BaseAlert
          type="warning"
          title="Revisión pendiente"
          >Faltan precios en dos servicios del itinerario.</BaseAlert
        >
        <BaseAlert
          type="danger"
          title="No se pudo guardar"
          >Revisa los campos obligatorios e inténtalo otra vez.</BaseAlert
        >
      </div>
    </BaseCard>

    <!-- Botones y badges -->
    <BaseCard
      title="Botones y estados"
      description="Acciones primarias, secundarias, destructivas y etiquetas de estado."
    >
      <div class="space-y-5">
        <div class="flex flex-wrap gap-3">
          <button
            class="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
            >Guardar</button
          >
          <button
            class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >Cancelar</button
          >
          <button
            class="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >Eliminar</button
          >
          <button
            disabled
            class="cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-600"
            >Deshabilitado</button
          >
        </div>
        <div class="flex flex-wrap gap-2">
          <BaseBadge> Borrador </BaseBadge><BaseBadge variant="info"> Enviada </BaseBadge
          ><BaseBadge variant="warning"> Pendiente </BaseBadge
          ><BaseBadge variant="success"> Confirmada </BaseBadge
          ><BaseBadge variant="danger"> Cancelada </BaseBadge>
        </div>
      </div>
    </BaseCard>

    <!-- Formulario -->
    <BaseCard
      title="Formulario completo"
      description="Campos habituales para formularios de mantenimiento, cotizaciones y operaciones."
    >
      <form
        class="space-y-7"
        @submit.prevent="submitForm"
      >
        <!-- Textos y contacto -->
        <fieldset class="space-y-5">
          <legend class="text-sm font-semibold text-slate-900 dark:text-white"
            >Información básica</legend
          >

          <div class="grid gap-5 md:grid-cols-12">
            <div class="md:col-span-3">
              <label
                for="demo-code"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Código</label
              >
              <input
                id="demo-code"
                v-model="form.code"
                placeholder="SER0001"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div class="md:col-span-9">
              <label
                for="demo-name"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Nombre <span class="text-red-500">*</span></label
              >
              <input
                id="demo-name"
                v-model="form.name"
                required
                placeholder="Nombre del servicio"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-3">
            <div>
              <label
                for="demo-email"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Correo electrónico</label
              >
              <input
                id="demo-email"
                v-model="form.email"
                type="email"
                placeholder="cliente@ejemplo.com"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div>
              <label
                for="demo-phone"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Teléfono</label
              >
              <input
                id="demo-phone"
                v-model="form.phone"
                type="tel"
                placeholder="+34 600 000 000"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div>
              <label
                for="demo-category"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Categoría</label
              >
              <select
                id="demo-category"
                v-model="form.category"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="">Seleccione...</option
                ><option>Hotel</option
                ><option>Transporte</option
                ><option>Tour</option
                ><option>Alimentación</option>
              </select>
            </div>
          </div>
        </fieldset>

        <!-- Fechas y cantidades -->
        <fieldset class="space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800">
          <legend class="px-1 text-sm font-semibold text-slate-900 dark:text-white"
            >Fechas y planificación</legend
          >

          <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <label
                for="demo-travel-date"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Fecha de viaje</label
              >
              <input
                id="demo-travel-date"
                v-model="form.travelDate"
                type="date"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
              />
            </div>
            <div>
              <label
                for="demo-valid-until"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Válida hasta</label
              >
              <input
                id="demo-valid-until"
                v-model="form.validUntil"
                type="date"
                :min="form.travelDate"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
              />
            </div>
            <div>
              <label
                for="demo-departure"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Fecha y hora de salida</label
              >
              <input
                id="demo-departure"
                v-model="form.departureAt"
                type="datetime-local"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
              />
            </div>
            <div>
              <label
                for="demo-time"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Hora de encuentro</label
              >
              <input
                id="demo-time"
                v-model="form.meetingTime"
                type="time"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
              />
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label
                for="demo-passengers"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Número de pasajeros</label
              >
              <input
                id="demo-passengers"
                v-model.number="form.passengers"
                type="number"
                min="1"
                max="200"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div>
              <label
                for="demo-budget"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Presupuesto estimado</label
              >
              <div class="flex rounded-lg shadow-sm">
                <span
                  class="inline-flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  >USD</span
                >
                <input
                  id="demo-budget"
                  v-model="form.budget"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  class="min-w-0 flex-1 rounded-r-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>
          </div>
        </fieldset>

        <!-- Radio y checkbox -->
        <fieldset class="space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800">
          <legend class="px-1 text-sm font-semibold text-slate-900 dark:text-white"
            >Opciones de contratación</legend
          >

          <div class="grid gap-6 lg:grid-cols-2">
            <div>
              <p class="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300"
                >Tipo de precio</p
              >
              <div class="grid gap-3 sm:grid-cols-3">
                <label
                  v-for="option in [
                    { value: 'unit', label: 'Unitario' },
                    { value: 'group', label: 'Grupal' },
                    { value: 'room', label: 'Habitación' },
                  ]"
                  :key="option.value"
                  class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition"
                  :class="
                    form.priceType === option.value
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                  "
                >
                  <input
                    v-model="form.priceType"
                    type="radio"
                    name="price-type"
                    :value="option.value"
                    class="h-4 w-4 accent-teal-600"
                  />
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{
                    option.label
                  }}</span>
                </label>
              </div>
            </div>

            <div>
              <p class="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300"
                >Servicios adicionales</p
              >
              <div class="grid gap-3 sm:grid-cols-3">
                <label
                  v-for="extra in [
                    { value: 'guide', label: 'Guía' },
                    { value: 'insurance', label: 'Seguro' },
                    { value: 'transfer', label: 'Traslado' },
                  ]"
                  :key="extra.value"
                  class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <input
                    v-model="form.extras"
                    type="checkbox"
                    :value="extra.value"
                    class="h-4 w-4 rounded accent-teal-600"
                  />
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{
                    extra.label
                  }}</span>
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        <!-- Archivo, descripción y switch -->
        <fieldset class="space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800">
          <legend class="px-1 text-sm font-semibold text-slate-900 dark:text-white"
            >Información adicional</legend
          >

          <div>
            <label
              for="demo-file"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >Documento adjunto</label
            >
            <input
              id="demo-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              class="block w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-500 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:file:bg-slate-800 dark:file:text-slate-300"
              @change="form.document = $event.target.files[0]"
            />
            <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
              >PDF, JPG o PNG. Tamaño máximo definido por tu backend.</p
            >
          </div>

          <div>
            <label
              for="demo-description"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >Descripción</label
            >
            <textarea
              id="demo-description"
              v-model="form.description"
              rows="4"
              placeholder="Observaciones adicionales..."
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <label
            class="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
          >
            <span
              ><span class="block text-sm font-medium text-slate-800 dark:text-slate-200"
                >Registro activo</span
              ><span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400"
                >Disponible para utilizarse en nuevas cotizaciones.</span
              ></span
            >
            <span
              class="relative inline-flex h-6 w-11 shrink-0 rounded-full transition"
              :class="form.active ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'"
              ><input
                v-model="form.active"
                type="checkbox"
                class="peer sr-only" /><span
                class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                :class="form.active ? 'left-5.5' : 'left-0.5'"
            /></span>
          </label>
        </fieldset>

        <div
          class="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end"
        >
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >Cancelar</button
          >
          <button
            type="submit"
            class="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
            >Guardar registro</button
          >
        </div>
      </form>
    </BaseCard>

    <!-- Tabs -->
    <BaseCard
      title="Tabs"
      description="Navegación entre secciones sin abandonar la página actual."
    >
      <BaseTabs
        v-model="activeTab"
        :tabs="tabs"
      >
        <template #general>
          <div
            class="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950/50"
          >
            <h4 class="font-semibold text-slate-900 dark:text-white">Información general</h4>
            <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400"
              >Contenido principal de la cotización: cliente, moneda, lista de precios y fechas.</p
            >
          </div>
        </template>
        <template #itinerary>
          <div class="grid gap-3 md:grid-cols-3"
            ><div
              v-for="day in 3"
              :key="day"
              class="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
              ><p class="text-sm font-semibold text-teal-700 dark:text-teal-300">Día {{ day }}</p
              ><p class="mt-1 text-sm text-slate-500 dark:text-slate-400"
                >Servicios del itinerario.</p
              ></div
            ></div
          >
        </template>
        <template #passengers>
          <BaseAlert
            type="info"
            title="8 pasajeros registrados"
            >Puedes utilizar este tab para listar, agregar o distribuir pasajeros.</BaseAlert
          >
        </template>
        <template #documents>
          <ul
            class="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700"
            ><li class="flex justify-between p-4 text-sm text-slate-700 dark:text-slate-300"
              ><span>Propuesta comercial.pdf</span
              ><BaseBadge variant="success">Listo</BaseBadge></li
            ><li class="flex justify-between p-4 text-sm text-slate-700 dark:text-slate-300"
              ><span>Itinerario.pdf</span><BaseBadge variant="warning">Pendiente</BaseBadge></li
            ></ul
          >
        </template>
      </BaseTabs>
    </BaseCard>

    <!-- Tabla simple -->
    <div>
      <h3 class="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Tabla básica</h3>
      <BaseTable
        :items="allServices.slice(0, 4)"
        :columns="6"
      >
        <template #header
          ><tr
            ><th>Código</th><th>Servicio</th><th>Categoría</th><th class="!text-right">Precio</th
            ><th>Estado</th><th class="!text-right">Acciones</th></tr
          ></template
        >
        <template #body="{ items }">
          <tr
            v-for="service in items"
            :key="service.id"
          >
            <td
              ><span class="font-semibold text-teal-700 dark:text-teal-300">{{
                service.code
              }}</span></td
            ><td
              ><span class="font-medium text-slate-900 dark:text-white">{{
                service.name
              }}</span></td
            ><td>{{ service.category }}</td
            ><td class="!text-right font-medium">$ {{ service.price.toFixed(2) }}</td
            ><td
              ><BaseBadge :variant="service.active ? 'success' : 'danger'">{{
                service.active ? 'Activo' : 'Inactivo'
              }}</BaseBadge></td
            >
            <td
              ><div class="flex justify-end gap-1"
                ><button
                  title="Ver"
                  class="rounded-lg p-2 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950"
                  ><Eye class="h-4 w-4" /></button
                ><button
                  title="Editar"
                  class="rounded-lg p-2 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950"
                  ><Pencil class="h-4 w-4" /></button
                ><button
                  title="Eliminar"
                  class="rounded-lg p-2 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                  ><Trash2 class="h-4 w-4" /></button></div
            ></td>
          </tr>
        </template>
      </BaseTable>
    </div>

    <!-- Tabla paginada -->
    <div>
      <h3 class="mb-3 text-lg font-semibold text-slate-900 dark:text-white"
        >Tabla con paginación</h3
      >
      <BaseTable
        :items="paginatedServices"
        :columns="5"
      >
        <template #header
          ><tr
            ><th>Código</th><th>Servicio</th><th>Categoría</th><th class="!text-right">Precio</th
            ><th>Estado</th></tr
          ></template
        >
        <template #body="{ items }"
          ><tr
            v-for="service in items"
            :key="service.id"
            ><td class="font-semibold text-teal-700 dark:text-teal-300">{{ service.code }}</td
            ><td class="font-medium !text-slate-900 dark:!text-white">{{ service.name }}</td
            ><td>{{ service.category }}</td
            ><td class="!text-right">$ {{ service.price.toFixed(2) }}</td
            ><td
              ><BaseBadge :variant="service.active ? 'success' : 'danger'">{{
                service.active ? 'Activo' : 'Inactivo'
              }}</BaseBadge></td
            ></tr
          ></template
        >
        <template #footer
          ><BasePagination
            :current-page="currentPage"
            :last-page="lastPage"
            :total="allServices.length"
            :per-page="perPage"
            @change="currentPage = $event"
        /></template>
      </BaseTable>
    </div>

    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      title="Confirmar cotización"
      description="Ejemplo de modal reutilizable para el ERP."
    >
      <p class="text-sm leading-6 text-slate-600 dark:text-slate-300"
        >¿Deseas confirmar la cotización COT-00241? Después podrás continuar con el proceso de
        reservas.</p
      >
      <template #footer="{ close }"
        ><button
          type="button"
          class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
          @click="close"
          >Cancelar</button
        ><button
          type="button"
          class="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          @click="close"
          >Confirmar</button
        ></template
      >
    </BaseModal>
  </div>
</template>
