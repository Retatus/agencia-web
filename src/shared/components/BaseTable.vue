<template>
  <div class="base-table">
    <div class="table-container">
      <table class="table">
        <thead>
          <slot name="header"></slot>
        </thead>
        <tbody v-if="loading">
          <tr>
            <td :colspan="columns" class="text-center empty-row">
              Cargando información...
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="items.length">
          <slot name="body" :items="items" />
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="columns" class="text-center empty-row">
              {{ emptyText }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="$slots.footer" class="table-footer">
      <slot name="footer"></slot>
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
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

:deep(thead) {
  background: #f8f9fa;
}

:deep(th) {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  white-space: nowrap;

}

:deep(td) {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f3f5;
  vertical-align: middle;
  font-size: 14px;
}

:deep(tbody tr) {
  transition: background .15s ease;
}

:deep(tbody tr:hover) {
  background: #f8f9fa;
}

.empty-row {
  padding: 35px;
  color: #6c757d;
}

.table-footer {
  padding: 15px;
  border-top: 1px solid #dee2e6;
  background: #fafafa;
}
</style>