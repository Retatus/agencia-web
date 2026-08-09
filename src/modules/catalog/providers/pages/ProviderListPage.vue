<template>
  <section class="mx-auto max-w-7xl">
    <!-- Encabezado -->
    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Proveedores
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Administre los proveedores del sistema.
        </p>
      </div>
      <router-link
        :to="{ name: 'providers.create' }"
        class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      >
        <Plus class="mr-1.5 h-4 w-4" />
        Nuevo Proveedor
      </router-link>
    </div>

    <!-- Loading -->
    <div
      v-if="store.loading"
      class="flex items-center justify-center py-12"
    >
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"
      ></div>
      <span class="ml-3 text-sm text-slate-500 dark:text-slate-400">Cargando proveedores...</span>
    </div>

    <!-- Tabla -->
    <BaseTable
      v-else-if="store.providers.length"
      :items="store.providers"
      :loading="store.loading"
      :columns="8"
    >
      <template #header>
        <tr>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Código
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Razón Social
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Nombre Comercial
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Documento
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Email
          </th>
          <th
            class="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Teléfono
          </th>
          <th
            class="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Activo
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
          v-for="provider in items"
          :key="provider.uuid"
          class="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
        >
          <td class="px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white">
            {{ provider.code }}
          </td>
          <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
            {{ provider.business_name }}
          </td>
          <td class="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400">
            {{ provider.commercial_name || '-' }}
          </td>
          <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
            <span class="font-medium">{{ provider.document_type?.code }}</span>
            <span class="text-slate-400 dark:text-slate-500">-</span>
            {{ provider.document_number }}
          </td>
          <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
            {{ provider.email || '-' }}
          </td>
          <td class="px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300">
            {{ provider.phone || '-' }}
          </td>
          <td class="px-3 py-2.5 text-center">
            <span
              class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
              :class="
                provider.active
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              "
            >
              {{ provider.active ? 'Sí' : 'No' }}
            </span>
          </td>
          <td class="px-3 py-2.5 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <router-link
                :to="{
                  name: 'providers.edit',
                  params: { uuid: provider.uuid },
                }"
                class="inline-flex items-center rounded-lg border border-blue-300 px-2.5 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
              >
                <Pencil class="mr-1 h-3 w-3" />
                Editar
              </router-link>
              <button
                class="inline-flex items-center rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                @click="remove(provider.uuid)"
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
          :total="store.providers.length"
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
      <p class="text-sm text-slate-500 dark:text-slate-400"> No hay proveedores registrados. </p>
    </div>
  </section>
</template>
<script setup>
import { onMounted } from 'vue'
import { useProviderStore } from '../stores/provider.store'
import { BaseBadge, BasePagination, BaseTable } from '@/components/ui'

const store = useProviderStore()
const load = () => store.fetchProviders()
const remove = async (id) => {
  if (confirm('¿Desea eliminar este proveedor?')) {
    try {
      await store.deleteProvider(id)
    } catch (e) {
      if (e.response.status === 409) {
        alert(e.response.data.message)
        return
      }
    }
    await store.fetchProviders()
  }
}
onMounted(load)
</script>
