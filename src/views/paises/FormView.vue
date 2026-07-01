<template>

  <div>

    <h2>

      {{ editando ? 'Editar País' : 'Nuevo País' }}

    </h2>

    <form @submit.prevent="guardar">

      <div>

        Nombre

        <input v-model="form.nombre">

      </div>

      <div>

        ISO

        <input v-model="form.codigo_iso">

      </div>

      <button>

        Guardar

      </button>

    </form>

  </div>

</template>

<script setup>

import { ref, onMounted, computed } from "vue"

import { useRoute, useRouter } from "vue-router"

import api from "@/api/pais.api"

const route = useRoute()

const router = useRouter()

const form = ref({

  nombre: "",

  codigo_iso: "",

  estado_activo: true

})

const editando = computed(() => route.params.id != null)

onMounted(async () => {

  if (!editando.value) return

  const { data } = await api.get(route.params.id)

  form.value = data

})

const guardar = async () => {

  if (editando.value) {

    await api.update(route.params.id, form.value)

  }

  else {

    await api.create(form.value)

  }

  router.push("/paises")

}

</script>