<template>
  <section class="mx-auto max-w-5xl">
    <!-- Encabezado -->
    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {{ isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{
            isEdit
              ? 'Actualice la información del proveedor.'
              : 'Registre un nuevo proveedor en el sistema.'
          }}
        </p>
      </div>
      <router-link
        :to="{ name: 'providers' }"
        class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Volver
      </router-link>
    </div>

    <form @submit.prevent="save">
      <div
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <!-- Título de la sección -->
        <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
          <h3 class="font-semibold text-slate-900 dark:text-white"> Información del Proveedor </h3>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Los campos marcados con <span class="text-red-500">*</span> son obligatorios.
          </p>
        </div>

        <!-- Campos -->
        <div class="space-y-6 p-5 sm:p-6">
          <!-- Código y Razón Social -->
          <div class="grid gap-5 md:grid-cols-12">
            <div class="md:col-span-3">
              <label
                for="provider-code"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Código
              </label>
              <input
                id="provider-code"
                v-model="form.code"
                type="text"
                placeholder="PROV0001"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
            <div class="md:col-span-9">
              <label
                for="provider-business-name"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Razón Social <span class="text-red-500">*</span>
              </label>
              <input
                id="provider-business-name"
                v-model="form.business_name"
                type="text"
                required
                placeholder="Razón social del proveedor"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          <!-- Nombre Comercial -->
          <div>
            <label
              for="provider-commercial-name"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Nombre Comercial
            </label>
            <input
              id="provider-commercial-name"
              v-model="form.commercial_name"
              type="text"
              placeholder="Nombre comercial del proveedor"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

          <!-- Tipo y Número Documento -->
          <div class="grid gap-5 md:grid-cols-12">
            <div class="md:col-span-4">
              <label
                for="provider-document-type"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Tipo Documento
              </label>
              <select
                id="provider-document-type"
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
                for="provider-document-number"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Número Documento
              </label>
              <input
                id="provider-document-number"
                v-model="form.document_number"
                type="text"
                placeholder="Número de documento"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          <!-- Razón Tributaria -->
          <div>
            <label
              for="provider-tax-name"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Razón Tributaria
            </label>
            <input
              id="provider-tax-name"
              v-model="form.tax_name"
              type="text"
              placeholder="Razón tributaria"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

          <!-- Email, Teléfono y Website -->
          <div class="grid gap-5 sm:grid-cols-3">
            <div>
              <label
                for="provider-email"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <input
                id="provider-email"
                v-model="form.email"
                type="email"
                placeholder="proveedor@ejemplo.com"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
            <div>
              <label
                for="provider-phone"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Teléfono
              </label>
              <input
                id="provider-phone"
                v-model="form.phone"
                type="text"
                placeholder="+34 600 000 000"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
            <div>
              <label
                for="provider-website"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Website
              </label>
              <input
                id="provider-website"
                v-model="form.website"
                type="text"
                placeholder="www.ejemplo.com"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          <!-- Observaciones -->
          <div>
            <label
              for="provider-notes"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Observaciones
            </label>
            <textarea
              id="provider-notes"
              v-model="form.notes"
              rows="4"
              placeholder="Notas adicionales sobre el proveedor..."
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
                Proveedor activo
              </span>
              <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                El proveedor estará disponible para ser seleccionado en servicios.
              </span>
            </span>
          </label>
        </div>

        <!-- Acciones -->
        <div
          class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-6"
        >
          <router-link
            :to="{ name: 'providers' }"
            class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </router-link>

          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            {{ isEdit ? 'Actualizar proveedor' : 'Guardar proveedor' }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProviderStore } from '../stores/provider.store'
import { useDocumentTypeStore } from '@/modules/catalog/stores/documentType.store'
const providerStore = useProviderStore()
const route = useRoute()
const router = useRouter()
const documentTypeStore = useDocumentTypeStore()
const isEdit = computed(() => !!route.params.uuid)
const form = reactive({
  code: '',
  business_name: '',
  commercial_name: '',
  document_type_id: '',
  document_number: '',
  tax_name: '',
  email: '',
  phone: '',
  website: '',
  notes: '',
  active: true,
})
onMounted(async () => {
  await loadDocumentTypes()
  if (isEdit.value) {
    const provider = await providerStore.fetchProvider(route.params.uuid)
    Object.assign(form, provider)
  }
})
async function loadDocumentTypes() {
  await documentTypeStore.getDocumentTypes()
}
async function save() {
  try {
    if (isEdit.value) {
      await providerStore.updateProvider(route.params.uuid, form)
    } else {
      await providerStore.createProvider(form)
    }
    router.push({
      name: 'providers',
    })
  } catch (error) {
    if (error.response?.status === 422) {
      const errors = error.response.data.errors
      const firstError = Object.values(errors)[0][0]
      alert(firstError)
      return
    }
    alert(`Error: ${error?.response?.data?.message || 'Error desconocido'}`)
  }
}
</script>
