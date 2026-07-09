<template>
  <div class="container">

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Proveedores</h2>

      <router-link :to="{ name: 'providers.create' }" class="btn btn-primary">
        Nuevo Proveedor
      </router-link>
    </div>

    <div v-if="store.loading" class="text-center py-4">
      Cargando...
    </div>

    <BaseTable v-if="store.providers.length" :items="store.providers" :loading="store.loading" :columns="8">
      <template #header>
        <tr>
          <th>Código</th>
          <th>Razón Social</th>
          <th>Nombre Comercial</th>
          <th>Documento</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Activo</th>
          <th>Acciones</th>
        </tr>

      </template>

      <template #body="{ items }">

        <tr v-for="provider in items" :key="provider.uuid">

          <td>{{ provider.code }}</td>

          <td>{{ provider.business_name }}</td>

          <td>{{ provider.commercial_name }}</td>

          <td>
            {{ provider.document_type?.code }}
            -
            {{ provider.document_number }}
          </td>

          <td>{{ provider.email }}</td>

          <td>{{ provider.phone }}</td>

          <td>

            {{ provider.active ? 'Sí' : 'No' }}

          </td>

          <td>

            <router-link class="btn btn-sm btn-warning me-2" :to="{
              name: 'providers.edit',
              params: {
                uuid: provider.uuid
              }
            }">
              Editar
            </router-link>

            <button class="btn btn-sm btn-danger" @click="remove(provider.uuid)">
              Eliminar
            </button>

          </td>

        </tr>

      </template>

    </BaseTable>

    <p v-else>No hay proveedores aun</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProviderStore } from '../stores/provider.store';
import BaseTable from '@/modules/catalog/providers/components/ProviderTable.vue';

const store = useProviderStore();

const load = () => store.fetchProviders();

const remove = async (id) => {
  if (confirm('¿Desea eliminar este proveedor?')) {
    try {
      await store.deleteProvider(id)
    } catch (e) {
      if (e.response.status === 409) {
        alert(e.response.data.message)
        return
      }
    }
    await store.fetchProviders()
  }
}

onMounted(load)
</script>