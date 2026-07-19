<template>
  <div class="container">
    <h2 class="mb-4">
      {{ isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
    </h2>
    <form @submit.prevent="save">
      <div class="row">
        <div class="col-md-3 mb-3">
          <label class="form-label">Código</label>
          <input v-model="form.code" type="text" class="form-control" />
        </div>
        <div class="col-md-9 mb-3">
          <label class="form-label">Razón Social</label>
          <input v-model="form.business_name" type="text" class="form-control" required />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">
          Nombre Comercial
        </label>
        <input v-model="form.commercial_name" type="text" class="form-control" />
      </div>
      <div class="row">
        <div class="col-md-4 mb-3">
          <label class="form-label">
            Tipo Documento
          </label>
          <select v-model="form.document_type_id" class="form-select">
            <option value="">
              Seleccione...
            </option>
            <option v-for="item in documentTypeStore.items" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="col-md-8 mb-3">
          <label class="form-label">
            Número Documento
          </label>
          <input v-model="form.document_number" type="text" class="form-control" />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">
          Razón Tributaria
        </label>
        <input v-model="form.tax_name" type="text" class="form-control" />
      </div>
      <div class="row">
        <div class="col-md-4 mb-3">
          <label>Email</label>
          <input v-model="form.email" type="email" class="form-control" />
        </div>
        <div class="col-md-4 mb-3">
          <label>Teléfono</label>
          <input v-model="form.phone" type="text" class="form-control" />
        </div>
        <div class="col-md-4 mb-3">
          <label>Website</label>
          <input v-model="form.website" type="text" class="form-control" />
        </div>
      </div>
      <div class="mb-3">
        <label>Observaciones</label>
        <textarea v-model="form.notes" rows="4" class="form-control" />
      </div>
      <div class="form-check mb-4">
        <input v-model="form.active" class="form-check-input" type="checkbox">
        <label class="form-check-label">
          Activo
        </label>
      </div>
      <button class="btn btn-primary" type="submit">
        Guardar
      </button>
      <router-link :to="{ name: 'providers.index' }" class="btn btn-secondary ms-2">
        Cancelar
      </router-link>
    </form>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProviderStore } from '../stores/provider.store';
import { useDocumentTypeStore } from '@/modules/catalog/stores/documentType.store'
const providerStore = useProviderStore();
const route = useRoute();
const router = useRouter();
const documentTypeStore = useDocumentTypeStore();
const isEdit = computed(() => !!route.params.uuid);
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
});
onMounted(async () => {
  await loadDocumentTypes();
  if (isEdit.value) {
    const provider = await providerStore.fetchProvider(route.params.uuid);
    Object.assign(form, provider);
  }
});
async function loadDocumentTypes() {
  await documentTypeStore.getDocumentTypes()
}
async function save() {
  try {
    if (isEdit.value) {
      await providerStore.updateProvider(
        route.params.uuid,
        form
      );
    } else {
      await providerStore.createProvider(form);
    }
    router.push({
      name: 'providers.index'
    });
  }
  catch (error) {
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      const firstError = Object.values(errors)[0][0];
      alert(firstError);
      return;
    }
    alert(`Error: ${error?.response?.data?.message || 'Error desconocido'}`);
  }
}
</script>