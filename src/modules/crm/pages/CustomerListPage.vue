<template>
  <section class="mx-auto max-w-7xl">
    <!-- Encabezado -->
    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Clientes</h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Administre los clientes del sistema.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="load"
        >
          <RefreshCw class="mr-1.5 h-4 w-4" />
          Cargar clientes
        </button>
        <button
          class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          @click="add"
        >
          <Plus class="mr-1.5 h-4 w-4" />
          Nuevo Cliente
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex items-center justify-center py-12">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"
      ></div>
      <span class="ml-3 text-sm text-slate-500 dark:text-slate-400">Cargando clientes...</span>
    </div>

    <!-- Tabla -->
    <BaseTable
      v-else-if="store.customers.length"
      :items="store.customers"
      :loading="store.loading"
      :columns="7"
    >
      <template #header>
        <tr>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            ID
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Nombre
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Apellido
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Nacionalidad
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Teléfono
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Email
          </th>
          <th
            class="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Acciones
          </th>
        </tr>
      </template>

      <template #body="{ items }">
        <tr
          v-for="customer in items"
          :key="customer.id"
          class="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
        >
          <td class="px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white">
            {{ customer.id }}
          </td>
          <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
            {{ customer.first_name }}
          </td>
          <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
            {{ customer.last_name }}
          </td>
          <td class="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400">
            {{ customer.nationality || '-' }}
          </td>
          <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
            {{ customer.phone || '-' }}
          </td>
          <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
            {{ customer.email || '-' }}
          </td>
          <td class="px-3 py-2.5 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <button
                class="inline-flex items-center rounded-lg border border-blue-300 px-2.5 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                @click="edit(customer.uuid)"
              >
                <Pencil class="mr-1 h-3 w-3" />
                Editar
              </button>
              <button
                class="inline-flex items-center rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                @click="remove(customer.uuid)"
              >
                <Trash2 class="mr-1 h-3 w-3" />
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      </template>
      <template #footer>
        <BasePagination
          :current-page="currentPage"
          :last-page="lastPage"
          :total="store.customers.length"
          :per-page="perPage"
          @change="currentPage = $event"
        />
      </template>
    </BaseTable>

    <!-- Sin datos -->
    <div
      v-else
      class="rounded-lg border border-slate-200 bg-slate-50 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50"
    >
      <p class="text-sm text-slate-500 dark:text-slate-400">No hay clientes registrados.</p>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '../stores/customer.store'
import { BaseTable, BasePagination } from '@/components/ui'
import { Pencil, Trash2 } from 'lucide-vue-next'

const store = useCustomerStore()
const router = useRouter()

const load = () => store.fetchCustomers()

const add = () => router.push('/crm/customers/create')

const edit = (id) => {
  router.push(`/crm/customers/${id}/edit`)
}

const remove = async (id) => {
  if (confirm('¿Seguro que deseas eliminar este cliente?')) {
    await store.deleteCustomer(id)
    await store.fetchCustomers()
  }
}

onMounted(load)
</script>
