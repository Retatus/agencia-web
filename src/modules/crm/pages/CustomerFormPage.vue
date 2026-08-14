<template>
  <section class="mx-auto max-w-5xl">
    <!-- Encabezado -->
    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{
            isEdit
              ? 'Actualice la información del cliente.'
              : 'Registre un nuevo cliente en el sistema.'
          }}
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        @click="router.push('/crm/customers')"
      >
        Volver
      </button>
    </div>

    <form @submit.prevent="save">
      <div
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <!-- Título de la sección -->
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
          <h3 class="font-semibold text-slate-900 dark:text-white"> Información del Cliente </h3>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Los campos marcados con <span class="text-red-500">*</span> son obligatorios.
          </p>
        </div>

        <!-- Campos -->
        <div class="space-y-6 p-5 sm:p-6">
          <!-- Tipo y Número Documento -->
          <div class="grid gap-5 md:grid-cols-12">
            <div class="md:col-span-4">
              <label
                for="customer-document-type"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Tipo Documento
              </label>
              <select
                id="customer-document-type"
                v-model="form.document_type_id"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="">Seleccione...</option>
                <option
                  v-for="item in documentTypeStore.items"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="md:col-span-8">
              <label
                for="customer-document-number"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Número Documento
              </label>
              <input
                id="customer-document-number"
                v-model="form.document_number"
                type="text"
                placeholder="Número de documento"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          <!-- Nombres y Apellidos -->
          <div class="grid gap-5 md:grid-cols-12">
            <div class="md:col-span-6">
              <label
                for="customer-first-name"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Nombres <span class="text-red-500">*</span>
              </label>
              <input
                id="customer-first-name"
                v-model="form.first_name"
                type="text"
                required
                placeholder="Nombres del cliente"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
            <div class="md:col-span-6">
              <label
                for="customer-last-name"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Apellidos <span class="text-red-500">*</span>
              </label>
              <input
                id="customer-last-name"
                v-model="form.last_name"
                type="text"
                required
                placeholder="Apellidos del cliente"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          <!-- Fecha Nacimiento y Género -->
          <div class="grid gap-5 md:grid-cols-12">
            <div class="md:col-span-6">
              <label
                for="customer-birth-date"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Fecha Nacimiento
              </label>
              <input
                id="customer-birth-date"
                v-model="form.birth_date"
                type="date"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:scheme-dark"
              />
            </div>
            <div class="md:col-span-6">
              <label
                for="customer-gender"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Género
              </label>
              <select
                id="customer-gender"
                v-model="form.gender"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="">Seleccione...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>

          <!-- Nacionalidad -->
          <div>
            <label
              for="customer-nationality"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Nacionalidad
            </label>
            <input
              id="customer-nationality"
              v-model="form.nationality"
              type="text"
              placeholder="Nacionalidad del cliente"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

          <!-- Email y Teléfono -->
          <div class="grid gap-5 md:grid-cols-12">
            <div class="md:col-span-6">
              <label
                for="customer-email"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <input
                id="customer-email"
                v-model="form.email"
                type="email"
                placeholder="cliente@ejemplo.com"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
            <div class="md:col-span-6">
              <label
                for="customer-phone"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Teléfono
              </label>
              <input
                id="customer-phone"
                v-model="form.phone"
                type="text"
                placeholder="+34 600 000 000"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          <!-- Dirección, Ciudad y País -->
          <div class="grid gap-5 md:grid-cols-12">
            <div class="md:col-span-4">
              <label
                for="customer-address"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Dirección
              </label>
              <input
                id="customer-address"
                v-model="form.address"
                type="text"
                placeholder="Dirección del cliente"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
            <div class="md:col-span-4">
              <label
                for="customer-city"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Ciudad
              </label>
              <input
                id="customer-city"
                v-model="form.city"
                type="text"
                placeholder="Ciudad"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
            <div class="md:col-span-4">
              <label
                for="customer-country"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                País
              </label>
              <input
                id="customer-country"
                v-model="form.country"
                type="text"
                placeholder="País"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          <!-- Notas -->
          <div>
            <label
              for="customer-notes"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Notas
            </label>
            <textarea
              id="customer-notes"
              v-model="form.notes"
              rows="4"
              placeholder="Notas adicionales sobre el cliente..."
              class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

          <!-- Activo -->
          <label
            class="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
          >
            <input
              v-model="form.active"
              type="checkbox"
              class="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-600 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800"
            />
            <span>
              <span class="block text-sm font-medium text-slate-800 dark:text-slate-200">
                Cliente activo
              </span>
              <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                El cliente estará disponible para ser seleccionado en cotizaciones.
              </span>
            </span>
          </label>
        </div>

        <!-- Acciones -->
        <div
          class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-6"
        >
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            @click="router.push('/crm/customers')"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="saving"
          >
            <Save class="mr-1.5 h-4 w-4" />
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomerService from '../services/customer.service'
import { useDocumentTypeStore } from '@/modules/catalog/stores/documentType.store'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const saving = ref(false)
const errors = ref({})

const documentTypeStore = useDocumentTypeStore()

const isEdit = computed(() => !!route.params.uuid)

function initialState() {
  return {
    document_type_id: '',
    document_number: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    notes: '',
    active: true,
  }
}

const form = reactive(initialState())

async function loadCustomer() {
  loading.value = true
  try {
    const response = await CustomerService.get(route.params.uuid)
    Object.assign(form, response.data.data)
  } finally {
    loading.value = false
  }
}

async function loadDocumentTypes() {
  await documentTypeStore.getDocumentTypes()
}

async function save() {
  saving.value = true
  errors.value = {}

  try {
    if (isEdit.value) {
      await CustomerService.update(route.params.uuid, form)
    } else {
      await CustomerService.create(form)
    }
    router.push('/crm/customers')
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    }
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadDocumentTypes()
  if (isEdit.value) {
    await loadCustomer()
  }
})
</script>
