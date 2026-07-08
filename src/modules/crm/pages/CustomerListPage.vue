<template>
  <div>
    <h1>Clientes</h1>
    <button @click="add">Nuevo</button>
    <button @click="load">Cargar clientes</button>
    <table v-if="store.items.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Nacionalidad</th>
          <th>Telefono</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in store.items" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ c.first_name }}</td>
          <td>{{ c.last_name }}</td>
          <td>{{ c.nationality }}</td>
          <td>{{ c.phone }}</td>
          <td>{{ c.email }}</td>
          <td>
            <button @click="edit(c.uuid)">Editar</button>
            <button @click="remove(c.uuid)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay clientes aun</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '../stores/customer.store'

const store = useCustomerStore()
const router = useRouter()

const load = () => store.getCustomers()

const add = () => router.push('/crm/customers/create')

const edit = (id) => {
  router.push(`/crm/customers/${id}/edit`)
}

const remove = async (id) => {
  if (confirm('¿Seguro que deseas eliminar este cliente?')) {
    await store.deleteCustomer(id)
    await store.getCustomers() // recargar lista
  }
}

onMounted(load)
</script>
