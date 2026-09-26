<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
        @click.self="$emit('close')"
      >
        <div class="flex min-h-full items-center justify-center">
          <div
            class="w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <!-- HEADER -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6"
            >
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                  Crear itinerario desde un destino
                </h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Se copiarán días, textos y servicios aproximados al borrador actual.
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar modal"
                class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                @click="$emit('close')"
              >
                <X class="h-5 w-5" />
              </button>
            </header>

            <!-- BODY -->
            <div class="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
              <!-- BÚSQUEDA -->
              <div class="flex gap-2">
                <div class="relative min-w-0 flex-1">
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500"
                  >
                    <Search class="h-4 w-4" />
                  </span>
                  <input
                    v-model.trim="search"
                    type="search"
                    placeholder="Buscar por código, nombre o descripción"
                    class="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                    @keyup.enter="load(1)"
                  />
                </div>
                <button
                  class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                  @click="load(1)"
                >
                  <Search class="mr-1.5 h-4 w-4" />
                  Buscar
                </button>
              </div>

              <!-- LOADING -->
              <div v-if="loading" class="flex min-h-48 items-center justify-center">
                <div class="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <div
                    class="h-5 w-5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
                  ></div>
                  Cargando plantillas...
                </div>
              </div>

              <!-- LISTA DE DESTINOS -->
              <div v-else class="mt-5 grid gap-4 md:grid-cols-2">
                <article
                  v-for="destination in items"
                  :key="destination.uuid"
                  class="overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-600"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-xs font-semibold text-teal-600 dark:text-teal-400">
                        {{ destination.code }}
                      </p>
                      <h3 class="font-semibold text-slate-900 dark:text-white">
                        {{ destination.name }}
                      </h3>
                    </div>
                    <span
                      class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {{ destination.duration_days }} días
                    </span>
                  </div>

                  <p class="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {{ destination.description || 'Sin descripción.' }}
                  </p>

                  <button
                    type="button"
                    class="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-teal-500 bg-white px-3 py-2 text-sm font-semibold text-teal-700 shadow-sm transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed dark:border-teal-500 dark:bg-slate-900 dark:text-teal-400 dark:hover:bg-teal-950/30"
                    :disabled="applying"
                    @click="select(destination)"
                  >
                    <CheckCircle v-if="!applying" class="mr-1.5 h-4 w-4" />
                    <div
                      v-else
                      class="mr-1.5 h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"
                    ></div>
                    Usar esta plantilla
                  </button>
                </article>
              </div>

              <!-- SIN RESULTADOS -->
              <p
                v-if="!loading && !items.length"
                class="py-10 text-center text-sm text-slate-500 dark:text-slate-400"
              >
                No se encontraron plantillas activas.
              </p>

              <!-- PAGINACIÓN -->
              <div v-if="meta.last_page > 1" class="mt-6 flex items-center justify-center gap-3">
                <button
                  class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  :disabled="meta.current_page <= 1"
                  @click="load(meta.current_page - 1)"
                >
                  <ChevronLeft class="mr-1 h-4 w-4" />
                  Anterior
                </button>
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {{ meta.current_page }} <span class="text-slate-400 dark:text-slate-500">/</span>
                  {{ meta.last_page }}
                </span>
                <button
                  class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  :disabled="meta.current_page >= meta.last_page"
                  @click="load(meta.current_page + 1)"
                >
                  Siguiente
                  <ChevronRight class="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- FOOTER -->
            <footer
              class="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:justify-end sm:px-6"
            >
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                @click="$emit('close')"
              >
                Cancelar
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { X, Search, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { onMounted, reactive, ref } from 'vue'
import TouristDestinationService from '@/modules/destinations/services/tourist-destination.service'

const emit = defineEmits(['close', 'select'])
const search = ref('')
const items = ref([])
const loading = ref(false)
const applying = ref(false)
const meta = reactive({ current_page: 1, last_page: 1 })

async function load(page = 1) {
  loading.value = true
  try {
    const response = await TouristDestinationService.getAll({
      search: search.value || undefined,
      active: 1,
      page,
      per_page: 10,
    })
    items.value = response.data.data ?? []
    Object.assign(meta, response.data.meta ?? { current_page: 1, last_page: 1 })
  } finally {
    loading.value = false
  }
}

async function select(destination) {
  applying.value = true
  try {
    const response = await TouristDestinationService.show(destination.uuid)
    emit('select', response.data.data)
  } finally {
    applying.value = false
  }
}

onMounted(() => load())
</script>
