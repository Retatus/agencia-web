<template>

  <div class="container-fluid">

    <div class="d-flex justify-content-between align-items-center mb-4">

      <div>
        <h2 class="mb-0">Servicios</h2>
        <small class="text-muted">
          Catálogo de Servicios
        </small>
      </div>

      <router-link :to="{ name: 'services.create' }" class="btn btn-primary">
        Nuevo Servicio
      </router-link>

    </div>

    <ServiceTable :items="store.services" :loading="store.loading" @edit="edit" @delete="remove" />

  </div>

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

  router.push({
    name: 'services.create'
  })

}

function edit(uuid) {

  router.push({
    name: 'services.edit',
    params: {
      uuid
    }
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