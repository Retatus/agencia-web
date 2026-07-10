<template>

  <BaseTable :items="items" :loading="loading" :columns="8" empty-text="No existen servicios registrados.">

    <template #header>
      <tr>
        <th>Código</th>
        <th>Nombre</th>
        <th>Proveedor</th>
        <th>Categoría</th>
        <th>Descripción</th>
        <th>Activo</th>
        <th width="150">
          Acciones
        </th>
      </tr>

    </template>

    <template #body="{ items }">
      <tr v-for="service in items" :key="service.uuid">
        <td>
          {{ service.code }}
        </td>
        <td>
          {{ service.name }}
        </td>
        <td>
          {{ service.provider?.business_name }}
        </td>
        <td>
          {{ service.service_category?.name }}
        </td>
        <td>
          {{ service.description }}
        </td>
        <td>
          <span :class="service.active
            ? 'badge bg-success'
            : 'badge bg-danger'">
            {{ service.active ? 'Activo' : 'Inactivo' }}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-warning me-2" @click="$emit('edit', service.uuid)">
            Editar
          </button>
          <button class="btn btn-sm btn-danger" @click="$emit('delete', service.uuid)">
            Eliminar
          </button>
        </td>
      </tr>
    </template>

  </BaseTable>

</template>

<script setup>

import BaseTable from '@/shared/components/BaseTable.vue'

defineProps({

  items: {
    type: Array,
    default: () => []
  },

  loading: {
    type: Boolean,
    default: false
  }

})

defineEmits([
  'edit',
  'delete'
])

</script>