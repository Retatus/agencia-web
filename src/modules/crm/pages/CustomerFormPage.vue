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
    active: true
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

<template>

  <div>

    <h2>
      {{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}
    </h2>

    <form @submit.prevent="save">

      <div>

        <label>Tipo Documento</label>

        <select v-model="form.document_type_id">

          <option value="">Seleccione...</option>

          <option v-for="item in documentTypeStore.items" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>

        </select>

      </div>

      <div>

        <label>Número Documento</label>

        <input type="text" v-model="form.document_number">

      </div>

      <div>

        <label>Nombres</label>

        <input type="text" v-model="form.first_name">

      </div>

      <div>

        <label>Apellidos</label>

        <input type="text" v-model="form.last_name">

      </div>

      <div>

        <label>Fecha Nacimiento</label>

        <input type="date" v-model="form.birth_date">

      </div>

      <div>

        <label>Género</label>

        <select v-model="form.gender">

          <option value="">Seleccione...</option>

          <option value="M">Masculino</option>

          <option value="F">Femenino</option>

        </select>

      </div>

      <div>

        <label>Nacionalidad</label>

        <input type="text" v-model="form.nationality">

      </div>

      <div>

        <label>Email</label>

        <input type="email" v-model="form.email">

      </div>

      <div>

        <label>Teléfono</label>

        <input type="text" v-model="form.phone">

      </div>

      <div>

        <label>Dirección</label>

        <input type="text" v-model="form.address">

      </div>

      <div>

        <label>Ciudad</label>

        <input type="text" v-model="form.city">

      </div>

      <div>

        <label>País</label>

        <input type="text" v-model="form.country">

      </div>

      <div>

        <label>Notas</label>

        <textarea rows="4" v-model="form.notes"></textarea>

      </div>

      <div>

        <label>

          <input type="checkbox" v-model="form.active">

          Activo

        </label>

      </div>

      <hr>

      <button type="submit" :disabled="saving">

        {{ saving ? 'Guardando...' : 'Guardar' }}

      </button>

      <button type="button" @click="router.push('/crm/customers')">
        Cancelar
      </button>

    </form>

  </div>

</template>