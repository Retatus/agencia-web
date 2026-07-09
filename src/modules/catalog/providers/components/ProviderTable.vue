<template>
  <div class="base-table">

    <div class="table-wrapper">

      <table>

        <thead>
          <slot name="header"></slot>
        </thead>

        <tbody v-if="!loading && items.length">
          <slot name="body" :items="items" />
        </tbody>

        <tbody v-else-if="loading">

          <tr>
            <td :colspan="columns" class="empty">
              Cargando...
            </td>
          </tr>

        </tbody>

        <tbody v-else>

          <tr>
            <td :colspan="columns" class="empty">
              {{ emptyText }}
            </td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>
</template>

<script setup>

defineProps({

  items: {
    type: Array,
    default: () => []
  },

  loading: {
    type: Boolean,
    default: false
  },

  columns: {
    type: Number,
    required: true
  },

  emptyText: {
    type: String,
    default: 'No existen registros.'
  }

})

</script>

<style scoped>
.base-table {
  width: 100%;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  background: #f8fafc;
}

thead th {
  padding: 12px 14px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

tbody td {
  padding: 12px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: #374151;
}

tbody tr:hover {
  background: #f8fafc;
}

tbody tr:last-child td {
  border-bottom: none;
}

.empty {
  text-align: center;
  padding: 30px;
  color: #6b7280;
  font-style: italic;
}
</style>