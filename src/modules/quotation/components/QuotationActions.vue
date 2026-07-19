<template>
  <div class="card shadow-sm mt-4">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <!-- Acciones futuras -->

        <div>
          <button
            type="button"
            class="btn btn-outline-secondary me-2"
            @click="$emit('duplicate')"
            disabled
          >
            <i class="bi bi-files me-1"></i>

            Duplicar
          </button>

          <button
            type="button"
            class="btn btn-outline-secondary me-2"
            @click="$emit('print')"
            disabled
          >
            <i class="bi bi-printer me-1"></i>

            PDF
          </button>

          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="$emit('email')"
            disabled
          >
            <i class="bi bi-envelope me-1"></i>

            Email
          </button>
        </div>

        <!-- Acciones principales -->

        <div>
          <button
            type="button"
            class="btn btn-secondary me-2"
            @click="$emit('cancel')"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
            @click="$emit('save')"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            />

            <i
              v-else
              class="bi bi-check-circle me-1"
            />

            {{ loading ? 'Guardando...' : 'Guardar Cotización' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,

    default: false,
  },
})

defineEmits(['save', 'cancel', 'duplicate', 'print', 'email'])
</script>
