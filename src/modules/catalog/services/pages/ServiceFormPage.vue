<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>
        {{ isEdit ? 'Editar Servicio' : 'Nuevo Servicio' }}
      </h2>

      <router-link
        :to="{ name: 'services.index' }"
        class="btn btn-secondary"
      >
        Volver
      </router-link>
    </div>

    <form @submit.prevent="save">
      <div class="card">
        <div class="card-header"> Información General </div>

        <div class="card-body">
          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="form-label"> Código </label>

              <input
                v-model="form.code"
                class="form-control"
                type="text"
              />
            </div>

            <div class="col-md-9 mb-3">
              <label class="form-label"> Nombre </label>

              <input
                v-model="form.name"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label"> Proveedor </label>

              <select
                v-model="form.provider_id"
                class="form-select"
                required
              >
                <option value=""> Seleccione... </option>

                <option
                  v-for="provider in providers"
                  :key="provider.id"
                  :value="provider.id"
                >
                  {{ provider.business_name }}
                </option>
              </select>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label"> Categoría </label>

              <select
                v-model="form.service_category_id"
                class="form-select"
                required
              >
                <option value=""> Seleccione... </option>

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

          <div class="mb-3">
            <label class="form-label"> Descripción </label>

            <textarea
              v-model="form.description"
              rows="5"
              class="form-control"
            />
          </div>

          <div class="form-check">
            <input
              v-model="form.active"
              class="form-check-input"
              type="checkbox"
            />

            <label class="form-check-label"> Activo </label>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <button
          class="btn btn-primary"
          type="submit"
        >
          Guardar
        </button>

        <router-link
          class="btn btn-secondary ms-2"
          :to="{ name: 'services.index' }"
        >
          Cancelar
        </router-link>
      </div>
    </form>

    <button
      class="btn btn-danger ms-2"
      type="button"
      @click="quotation(form.uuid)"
    >
      Quotation
    </button>
  </div>
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
      name: 'services.index',
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
