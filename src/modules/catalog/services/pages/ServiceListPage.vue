<template>
  <section>
    <!-- Encabezado -->

    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Servicios
        </h2>

        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400"> Catálogo de servicios </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
        @click="create"
      >
        <Plus class="h-4 w-4" />

        Nuevo servicio
      </button>
    </div>

    <!-- Error general -->

    <div
      v-if="store.error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
    >
      {{ store.error }}
    </div>

    <!-- Tabla -->

    <ServiceTable
      :items="store.services"
      :loading="store.loading"
      @edit="edit"
      @delete="remove"
    />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import ServiceTable from '../components/ServiceTable.vue'
import { useServiceStore } from '../stores/service.store'

const router = useRouter()

const store = useServiceStore()

async function load() {
  await store.fetchServices()
}

onMounted(() => {
  load()
})

function create() {
  debugger
  router.push({
    name: 'services.create',
  })
}

function edit(uuid) {
  router.push({
    name: 'services.edit',
    params: {
      uuid,
    },
  })
}

async function remove(uuid) {
  if (!confirm('¿Desea eliminar este servicio?')) {
    return
  }

  await store.deleteService(uuid)

  await load()
}
</script>
