<template>

  <div>

    <h1>Países</h1>

    <RouterLink to="/paises/create">

      Nuevo

    </RouterLink>

    <table>

      <thead>

        <tr>

          <th>ID</th>

          <th>Nombre</th>

          <th>ISO</th>

          <th></th>

        </tr>

      </thead>

      <tbody>

        <tr v-for="pais in paises" :key="pais.id">

          <td>{{ pais.id }}</td>

          <td>{{ pais.nombre }}</td>

          <td>{{ pais.codigo_iso }}</td>

          <td>

            <RouterLink :to="`/paises/${pais.id}/edit`">

              Editar

            </RouterLink>

            <button @click="eliminar(pais.id)">

              Eliminar

            </button>

          </td>

        </tr>

      </tbody>

    </table>

  </div>

</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/api/pais.api"

const paises = ref([])

const cargar = async () => {

  const { data } = await api.getAll()

  paises.value = data

}

const eliminar = async (id) => {

  if (!confirm("¿Eliminar?")) return

  await api.delete(id)

  cargar()

}

onMounted(cargar)

</script>