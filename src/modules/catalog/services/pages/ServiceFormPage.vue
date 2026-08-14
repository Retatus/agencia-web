<template>
  <section class="mx-auto max-w-5xl">
    <!-- Encabezado -->

    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {{ isEdit ? 'Editar servicio' : 'Nuevo servicio' }}
        </h2>

        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{
            isEdit
              ? 'Actualiza la información del servicio seleccionado.'
              : 'Registra un nuevo servicio en el catálogo.'
          }}
        </p>
      </div>

      <router-link
        :to="{ name: 'services' }"
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
          <h3 class="font-semibold text-slate-900 dark:text-white"> Información general </h3>

          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Los campos marcados con
            <span class="text-red-500">*</span>
            son obligatorios.
          </p>
        </div>

        <!-- Campos -->

        <div class="space-y-6 p-5 sm:p-6">
          <div class="grid gap-5 md:grid-cols-12">
            <div class="md:col-span-3">
              <label
                for="service-code"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Código
              </label>

              <input
                id="service-code"
                v-model="form.code"
                type="text"
                placeholder="SER0001"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>

            <div class="md:col-span-9">
              <label
                for="service-name"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Nombre
                <span class="text-red-500">*</span>
              </label>

              <input
                id="service-name"
                v-model="form.name"
                type="text"
                required
                placeholder="Nombre del servicio"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label
                for="service-provider"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Proveedor
                <span class="text-red-500">*</span>
              </label>

              <select
                id="service-provider"
                v-model="form.provider_id"
                required
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value=""> Seleccione un proveedor </option>

                <option
                  v-for="provider in providers"
                  :key="provider.id"
                  :value="provider.id"
                >
                  {{ provider.business_name }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="service-category"
                class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Categoría
                <span class="text-red-500">*</span>
              </label>

              <select
                id="service-category"
                v-model="form.service_category_id"
                required
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value=""> Seleccione una categoría </option>

                <option
                  v-for="category in serviceCategoryStore.items"
                  :key="category.uuid"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              for="service-description"
              class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Descripción
            </label>

            <textarea
              id="service-description"
              v-model="form.description"
              rows="5"
              placeholder="Descripción general del servicio..."
              class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

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
                Servicio activo
              </span>

              <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                El servicio estará disponible para utilizarse en cotizaciones.
              </span>
            </span>
          </label>
        </div>

        <!-- Acciones -->

        <div
          class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-6"
        >
          <router-link
            :to="{ name: 'services' }"
            class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </router-link>

          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            {{ isEdit ? 'Actualizar servicio' : 'Guardar servicio' }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useServiceStore } from '../stores/service.store'

import ProviderService from '@/modules/catalog/providers/services/provider.service'
import { useServiceCategoryStore } from '../../stores/serviceCategory.store'

import axios from 'axios'

const route = useRoute()

const router = useRouter()

const providers = ref([])
const serviceCategoryStore = useServiceCategoryStore()

const store = useServiceStore()

const isEdit = computed(() => !!route.params.uuid)

const form = reactive({
  code: '',
  provider_id: '',
  service_category_id: '',
  name: '',
  description: '',
  active: true,
})

onMounted(async () => {
  await Promise.all([loadProviders(), loadServiceCategories()])
  if (isEdit.value) {
    const service = await store.fetchService(route.params.uuid)
    Object.assign(form, service)
  }
})

async function loadProviders() {
  const response = await ProviderService.select({
    active: 1,
  })

  providers.value = response.data.data
}

async function loadServiceCategories() {
  await serviceCategoryStore.getServiceCategories({
    active: 1,
  })
}

async function loadProvidersSelect() {
  await providersSelect.select()
}

async function save() {
  try {
    if (isEdit.value) {
      await store.updateService(route.params.uuid, form)
    } else {
      await store.createService(form)
    }
    router.push({
      name: 'services',
    })
  } catch (error) {
    console.log('error de la peticion ', error)
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
