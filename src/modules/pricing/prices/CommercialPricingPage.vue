<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <!-- HEADER -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Temporadas y promociones
      </h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Aplica ajustes opcionales sobre los precios base. Los servicios no incluidos conservan su
        precio normal.
      </p>
    </div>

    <!-- ERROR -->
    <div
      v-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
    >
      {{ error }}
    </div>

    <!-- GRID PRINCIPAL -->
    <section class="grid gap-6 lg:grid-cols-3">
      <!-- ====================================================== -->
      <!-- LISTA DE PRECIOS - PANEL LATERAL -->
      <!-- ====================================================== -->

      <div
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div
          class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700"
        >
          <h2 class="font-semibold text-slate-900 dark:text-white">Listas de precios</h2>
          <button
            class="inline-flex items-center rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            type="button"
            @click="newList"
          >
            <Plus class="mr-1 h-4 w-4" />
            Nueva
          </button>
        </div>

        <div class="p-4 space-y-2">
          <button
            v-for="list in priceLists"
            :key="list.id"
            type="button"
            class="w-full rounded-lg border p-3 text-left text-sm transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            :class="
              selectedList?.id === list.id
                ? 'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-950/30'
                : 'border-slate-200 dark:border-slate-700'
            "
            @click="selectList(list)"
          >
            <span class="block font-medium text-slate-900 dark:text-white">{{ list.name }}</span>
            <span class="text-xs text-slate-500 dark:text-slate-400">
              {{ list.code }}
              ·
              {{ formatShortDate(list.valid_from) }}
              —
              {{ formatShortDate(list.valid_to) }}
            </span>
            <span
              v-if="!list.active"
              class="mt-1 inline-block text-xs text-red-500 dark:text-red-400"
              >Inactiva</span
            >
          </button>
          <p v-if="!priceLists.length" class="text-sm text-slate-500 dark:text-slate-400">
            No existen listas.
          </p>
        </div>
      </div>

      <!-- ====================================================== -->
      <!-- FORMULARIO DE LISTA DE PRECIOS -->
      <!-- ====================================================== -->

      <div
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <form class="p-5" @submit.prevent="saveList">
          <h2 class="mb-4 font-semibold text-slate-900 dark:text-white">
            {{ listForm.id ? 'Editar lista' : 'Nueva lista' }}
          </h2>
          <div class="space-y-4">
            <input
              v-model.trim="listForm.code"
              required
              maxlength="30"
              placeholder="Código"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
            <input
              v-model.trim="listForm.name"
              required
              maxlength="150"
              placeholder="Nombre"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
            <textarea
              v-model.trim="listForm.description"
              required
              rows="2"
              placeholder="Descripción"
              class="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            ></textarea>

            <select
              v-model.number="listForm.currency_id"
              required
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option :value="null">Seleccione moneda</option>
              <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
                {{ currency.code }} - {{ currency.name }}
              </option>
            </select>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Válido desde</label
              >
              <input
                v-model="listForm.valid_from"
                required
                type="date"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Válido hasta</label
              >
              <input
                v-model="listForm.valid_to"
                required
                type="date"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
              />
            </div>

            <input
              v-model.number="listForm.priority"
              min="1"
              type="number"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              placeholder="Prioridad"
            />

            <label
              class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50"
            >
              <input
                v-model="listForm.active"
                type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-600 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800"
              />
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Activa</span>
            </label>

            <div class="flex gap-2">
              <button
                :disabled="saving"
                class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
                type="submit"
              >
                <Save class="mr-1.5 h-4 w-4" />
                {{ saving ? 'Guardando...' : 'Guardar lista' }}
              </button>
              <button
                v-if="listForm.id"
                class="inline-flex items-center justify-center rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                type="button"
                @click="removeList"
              >
                <Trash2 class="mr-1.5 h-4 w-4" />
                Eliminar
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- ====================================================== -->
      <!-- FORMULARIO DE AJUSTE DE SERVICIO -->
      <!-- ====================================================== -->

      <div
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <form class="p-5" @submit.prevent="saveItem">
          <h2 class="mb-4 font-semibold text-slate-900 dark:text-white">Ajuste de servicio</h2>
          <p v-if="!selectedList" class="text-sm text-slate-500 dark:text-slate-400">
            Seleccione primero una lista.
          </p>

          <div v-else class="space-y-4">
            <!-- BUSCADOR DE SERVICIOS -->
            <div class="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Buscar servicio</label
              >
              <input
                v-model.trim="serviceSearch"
                type="search"
                maxlength="100"
                placeholder="Nombre, código o proveedor..."
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                @keyup.enter.prevent="reloadServices"
              />

              <p v-if="loadingServices" class="py-3 text-sm text-slate-500 dark:text-slate-400">
                Cargando servicios...
              </p>

              <div v-else class="mt-2 max-h-52 space-y-1 overflow-y-auto">
                <button
                  v-for="service in services"
                  :key="service.id"
                  type="button"
                  class="block w-full rounded-lg border px-2 py-1.5 text-left text-sm transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  :class="
                    selectedService?.id === service.id
                      ? 'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-950/30'
                      : 'border-slate-200 dark:border-slate-700'
                  "
                  @click="selectService(service)"
                >
                  <span class="font-medium text-slate-900 dark:text-white">{{ service.code }}</span>
                  <span class="text-slate-600 dark:text-slate-400">·</span>
                  <span class="text-slate-700 dark:text-slate-300">{{ service.name }}</span>
                </button>
                <p
                  v-if="!services.length"
                  class="py-2 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No hay servicios disponibles.
                </p>
              </div>

              <!-- PAGINACIÓN DE SERVICIOS -->
              <div v-if="serviceMeta" class="mt-3">
                <div class="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    :disabled="loadingServices || Number(serviceMeta.current_page) <= 1"
                    @click="changeServicesPage(Number(serviceMeta.current_page) - 1)"
                  >
                    <ChevronLeft class="mr-1 h-4 w-4" />
                    Anterior
                  </button>
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {{ serviceMeta.current_page }}
                    <span class="text-slate-400 dark:text-slate-500">/</span>
                    {{ serviceMeta.last_page }}
                  </span>
                  <button
                    type="button"
                    class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    :disabled="
                      loadingServices ||
                      Number(serviceMeta.current_page) >= Number(serviceMeta.last_page)
                    "
                    @click="changeServicesPage(Number(serviceMeta.current_page) + 1)"
                  >
                    Siguiente
                    <ChevronRight class="ml-1 h-4 w-4" />
                  </button>
                </div>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {{ serviceMeta.total ?? 0 }} servicios encontrados
                </p>
              </div>
            </div>

            <!-- VARIANTES -->
            <div
              v-if="selectedService"
              class="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
            >
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Variantes</label
              >
              <p v-if="loadingVariants" class="text-sm text-slate-500 dark:text-slate-400">
                Cargando variantes...
              </p>
              <div v-else class="space-y-1">
                <button
                  v-for="variant in variants"
                  :key="variant.id"
                  type="button"
                  class="block w-full rounded-lg border px-2 py-1.5 text-left text-sm transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  :class="
                    selectedVariant?.id === variant.id
                      ? 'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-950/30'
                      : 'border-slate-200 dark:border-slate-700'
                  "
                  @click="selectVariant(variant)"
                >
                  <span class="font-medium text-slate-900 dark:text-white">{{ variant.code }}</span>
                  <span class="text-slate-600 dark:text-slate-400">·</span>
                  <span class="text-slate-700 dark:text-slate-300">{{ variant.name }}</span>
                </button>
                <p v-if="!variants.length" class="text-sm text-slate-500 dark:text-slate-400">
                  El servicio no tiene variantes activas.
                </p>
              </div>
            </div>

            <!-- PRECIOS BASE -->
            <div
              v-if="selectedVariant"
              class="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
            >
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >Precio base</label
              >
              <p v-if="loadingPrices" class="text-sm text-slate-500 dark:text-slate-400">
                Cargando precios...
              </p>
              <div v-else class="space-y-1">
                <button
                  v-for="price in availablePrices"
                  :key="price.id"
                  type="button"
                  class="block w-full rounded-lg border px-2 py-2 text-left text-sm transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  :class="
                    Number(itemForm.price_id) === Number(price.id)
                      ? 'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-950/30'
                      : 'border-slate-200 dark:border-slate-700'
                  "
                  @click="itemForm.price_id = price.id"
                >
                  <span class="block font-medium text-slate-900 dark:text-white">
                    {{ price.price_type?.name ?? 'Tarifa' }} · {{ rangeLabel(price) }}
                  </span>
                  <span class="text-xs text-slate-500 dark:text-slate-400">
                    Costo {{ money(price.cost) }} · Venta {{ money(price.sale_price) }} ·
                    {{ price.currency?.code ?? '' }}
                  </span>
                </button>
                <p
                  v-if="!availablePrices.length"
                  class="text-sm text-slate-500 dark:text-slate-400"
                >
                  No hay precios disponibles para esta variante y moneda, o ya fueron agregados a la
                  lista.
                </p>
              </div>
            </div>

            <!-- AJUSTES -->
            <select
              v-model="itemForm.adjustment_type"
              required
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="PERCENTAGE">Porcentaje</option>
              <option value="FIXED">Importe fijo</option>
              <option value="OVERRIDE">Sobrescribir</option>
            </select>

            <input
              v-model.number="itemForm.cost_adjustment"
              type="number"
              step="0.01"
              placeholder="Ajuste de costo (opcional)"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />

            <input
              v-model.number="itemForm.sale_adjustment"
              type="number"
              step="0.01"
              placeholder="Ajuste de venta (opcional)"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />

            <!-- PREVIEW -->
            <div
              v-if="selectedBasePrice"
              class="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/50"
            >
              <div class="text-slate-600 dark:text-slate-400">
                Base: costo {{ money(selectedBasePrice.cost) }} · venta
                {{ money(selectedBasePrice.sale_price) }}
              </div>
              <div class="mt-1 font-medium text-teal-600 dark:text-teal-400">
                Resultado: costo {{ money(previewCost) }} · venta {{ money(previewSale) }}
              </div>
            </div>

            <div class="flex gap-2">
              <button
                :disabled="saving"
                class="inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
                type="submit"
              >
                <Plus v-if="!itemForm.id" class="mr-1.5 h-4 w-4" />
                <Pencil v-else class="mr-1.5 h-4 w-4" />
                {{ itemForm.id ? 'Actualizar ajuste' : 'Agregar ajuste' }}
              </button>
              <button
                v-if="itemForm.id"
                class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                type="button"
                @click="resetItemForm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>

    <!-- ====================================================== -->
    <!-- TABLA DE AJUSTES -->
    <!-- ====================================================== -->

    <section
      class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <h2 class="font-semibold text-slate-900 dark:text-white">Ajustes aplicados</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Servicio / variante
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Tipo y rango
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Operación
              </th>
              <th
                class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Costo
              </th>
              <th
                class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Venta
              </th>
              <th
                class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr
              v-for="item in items"
              :key="item.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td class="px-4 py-3 text-slate-700 dark:text-slate-300">
                {{ priceLabel(item.price) }}
              </td>
              <td class="px-4 py-3 text-slate-600 dark:text-slate-400">
                {{ item.price?.price_type?.name }} · {{ rangeLabel(item.price) }}
              </td>
              <td class="px-4 py-3 text-slate-700 dark:text-slate-300">
                {{ operationLabel(item.adjustment_type) }}
              </td>
              <td class="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                {{ item.cost_adjustment ?? '-' }}
              </td>
              <td class="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                {{ item.sale_adjustment ?? '-' }}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    class="inline-flex items-center rounded-lg border border-blue-300 px-2.5 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
                    type="button"
                    @click="editItem(item)"
                  >
                    <Pencil class="mr-1 h-3 w-3" />
                    Editar
                  </button>
                  <button
                    class="inline-flex items-center rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                    type="button"
                    @click="removeItem(item)"
                  >
                    <Trash2 class="mr-1 h-3 w-3" />
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="selectedList && !items.length">
              <td
                colspan="6"
                class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
              >
                La lista todavía no tiene ajustes.
              </td>
            </tr>
            <tr v-if="!selectedList">
              <td
                colspan="6"
                class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
              >
                Seleccione una lista para ver sus ajustes.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Plus, Save, Pencil, Trash2 } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import CurrencyService from '../../catalog/service/currency.service'
import ServiceService from '../../catalog/services/services/service.service'
import PriceListService from '../services/price-list.service'
import PriceListItemService from '../services/price-list-item.service'
import PriceService from '../services/price.service'
import ServiceVariantService from '../services/service-variant.service'

const priceLists = ref([])
const currencies = ref([])
const prices = ref([])
const items = ref([])
const selectedList = ref(null)
const services = ref([])
const serviceMeta = ref(null)
const serviceSearch = ref('')
const selectedService = ref(null)
const variants = ref([])
const selectedVariant = ref(null)
const loadingServices = ref(false)
const loadingVariants = ref(false)
const loadingPrices = ref(false)
const saving = ref(false)
const error = ref(null)
let serviceSearchTimeout = null

const listForm = reactive(emptyList())
const itemForm = reactive(emptyItem())

const availablePrices = computed(() => {
  const used = new Set(
    items.value.filter((item) => item.id !== itemForm.id).map((item) => Number(item.price_id)),
  )
  return prices.value.filter((price) => !used.has(Number(price.id)))
})

const selectedBasePrice = computed(
  () => prices.value.find((price) => Number(price.id) === Number(itemForm.price_id)) ?? null,
)
const previewCost = computed(() =>
  applyAdjustment(selectedBasePrice.value?.cost, itemForm.cost_adjustment),
)
const previewSale = computed(() =>
  applyAdjustment(selectedBasePrice.value?.sale_price, itemForm.sale_adjustment),
)

function emptyList() {
  return {
    id: null,
    uuid: null,
    code: '',
    name: '',
    description: '',
    currency_id: null,
    valid_from: '',
    valid_to: '',
    priority: 1,
    active: true,
  }
}

function emptyItem() {
  return {
    id: null,
    price_id: null,
    adjustment_type: 'PERCENTAGE',
    cost_adjustment: '',
    sale_adjustment: '',
    active: true,
  }
}

function assign(target, source) {
  Object.keys(target).forEach((key) => {
    target[key] = source[key] ?? emptyValue(target[key])
  })
}

function emptyValue(value) {
  if (typeof value === 'boolean') return true
  if (typeof value === 'number') return 1
  return null
}

async function loadInitial() {
  try {
    const [listsResponse, currenciesResponse] = await Promise.all([
      PriceListService.getAll({ active: 1, per_page: 100 }),
      CurrencyService.getAll({ active: 1, per_page: 100 }),
      loadServices(),
    ])
    priceLists.value = listsResponse.data.data ?? []
    currencies.value = currenciesResponse.data.data ?? []
  } catch (err) {
    showError(err)
  }
}

async function selectList(list) {
  selectedList.value = list
  assign(listForm, {
    ...emptyList(),
    ...list,
    valid_from: dateValue(list.valid_from),
    valid_to: dateValue(list.valid_to),
  })
  resetItemForm()
  resetPriceSelection()
  await loadItems()
}

async function loadItems() {
  const response = await PriceListItemService.getAll({
    price_list_id: selectedList.value.id,
    per_page: 100,
  })
  items.value = response.data.data ?? []
}

async function loadPrices() {
  if (!selectedList.value || !selectedVariant.value) {
    prices.value = []
    return
  }

  loadingPrices.value = true
  try {
    const response = await PriceService.getAll({
      service_variant_id: selectedVariant.value.id,
      currency_id: selectedList.value.currency_id,
      active: 1,
      per_page: 100,
    })
    prices.value = response.data.data ?? []
  } finally {
    loadingPrices.value = false
  }
}

async function loadServices(page = 1) {
  loadingServices.value = true
  try {
    const response = await ServiceService.getAll({
      search: serviceSearch.value || undefined,
      active: 1,
      page,
      per_page: 8,
    })
    services.value = response.data.data ?? []
    serviceMeta.value = response.data.meta ?? null
  } catch (err) {
    showError(err)
  } finally {
    loadingServices.value = false
  }
}

function reloadServices() {
  clearTimeout(serviceSearchTimeout)
  resetPriceSelection()
  return loadServices(1)
}

function changeServicesPage(page) {
  const lastPage = Number(serviceMeta.value?.last_page ?? 1)
  if (loadingServices.value || page < 1 || page > lastPage) return
  return loadServices(page)
}

async function selectService(service) {
  selectedService.value = service
  selectedVariant.value = null
  variants.value = []
  prices.value = []
  itemForm.price_id = null

  loadingVariants.value = true
  try {
    const response = await ServiceVariantService.getByService(service.uuid, {
      active: 1,
      per_page: 100,
    })
    variants.value = response.data.data ?? []
  } catch (err) {
    showError(err)
  } finally {
    loadingVariants.value = false
  }
}

async function selectVariant(variant) {
  selectedVariant.value = variant
  itemForm.price_id = null
  await loadPrices()
}

function resetPriceSelection() {
  selectedService.value = null
  selectedVariant.value = null
  variants.value = []
  prices.value = []
  itemForm.price_id = null
}

function newList() {
  selectedList.value = null
  items.value = []
  prices.value = []
  assign(listForm, emptyList())
  resetItemForm()
  resetPriceSelection()
}

async function saveList() {
  saving.value = true
  error.value = null
  try {
    const payload = { ...listForm }
    delete payload.id
    delete payload.uuid
    const response = listForm.id
      ? await PriceListService.update(listForm.uuid, payload)
      : await PriceListService.create(payload)
    await loadInitial()
    await selectList(response.data.data)
  } catch (err) {
    showError(err)
  } finally {
    saving.value = false
  }
}

async function removeList() {
  if (!window.confirm('¿Eliminar la lista y todos sus ajustes?')) return
  await PriceListService.destroy(listForm.uuid)
  newList()
  await loadInitial()
}

async function saveItem() {
  if (!itemForm.price_id) {
    error.value = 'Seleccione un servicio, una variante y un precio base.'
    return
  }

  if (itemForm.cost_adjustment === '' && itemForm.sale_adjustment === '') {
    error.value = 'Ingrese al menos un ajuste de costo o venta.'
    return
  }
  saving.value = true
  error.value = null
  try {
    const payload = {
      price_list_id: selectedList.value.id,
      price_id: Number(itemForm.price_id),
      adjustment_type: itemForm.adjustment_type,
      cost_adjustment: nullableNumber(itemForm.cost_adjustment),
      sale_adjustment: nullableNumber(itemForm.sale_adjustment),
      active: itemForm.active,
    }
    itemForm.id
      ? await PriceListItemService.update(itemForm.id, payload)
      : await PriceListItemService.create(payload)
    resetItemForm()
    await loadItems()
  } catch (err) {
    showError(err)
  } finally {
    saving.value = false
  }
}

async function editItem(item) {
  assign(itemForm, {
    ...emptyItem(),
    ...item,
    cost_adjustment: item.cost_adjustment ?? '',
    sale_adjustment: item.sale_adjustment ?? '',
  })

  const service = item.price?.service_variant?.service
  const variant = item.price?.service_variant

  if (!service?.uuid || !variant?.id) return

  await selectService(service)
  selectedVariant.value =
    variants.value.find((candidate) => Number(candidate.id) === Number(variant.id)) ?? variant
  await loadPrices()
  itemForm.price_id = item.price_id
}

async function removeItem(item) {
  if (!window.confirm('¿Eliminar este ajuste?')) return
  await PriceListItemService.destroy(item.id)
  if (itemForm.id === item.id) resetItemForm()
  await loadItems()
}

function resetItemForm() {
  assign(itemForm, emptyItem())
}

function applyAdjustment(base, adjustment) {
  if (base == null || adjustment === '' || adjustment == null) return Number(base ?? 0)
  const amount = Number(adjustment)
  if (itemForm.adjustment_type === 'PERCENTAGE') return Number(base) * (1 + amount / 100)
  if (itemForm.adjustment_type === 'FIXED') return Number(base) + amount
  return amount
}

function priceLabel(price) {
  if (!price) return '-'
  const service = price.service_variant?.service?.name ?? 'Servicio'
  const variant = price.service_variant?.name ?? 'Variante'
  return `${service} · ${variant} · ${rangeLabel(price)}`
}

function rangeLabel(price) {
  if (!price) return '-'
  if (price.min_quantity == null && price.max_quantity == null) return 'Sin rango'
  return `${price.min_quantity ?? '∞'}–${price.max_quantity ?? '∞'}`
}

function operationLabel(type) {
  return { PERCENTAGE: 'Porcentaje', FIXED: 'Importe fijo', OVERRIDE: 'Sobrescribir' }[type] ?? type
}

function nullableNumber(value) {
  return value === '' || value == null ? null : Number(value)
}

function dateValue(value) {
  return value ? String(value).slice(0, 10) : ''
}

function formatShortDate(value) {
  if (!value) return '-'

  const datePart = String(value).slice(0, 10)
  const [year, month, day] = datePart.split('-')

  if (!year || !month || !day) return datePart

  return `${day}/${month}/${year}`
}

function money(value) {
  return Number(value ?? 0).toFixed(2)
}

function showError(err) {
  const validation = err.response?.data?.errors
  error.value = validation
    ? Object.values(validation).flat().join(' ')
    : (err.response?.data?.message ?? err.message ?? 'No fue posible completar la operación.')
}

onMounted(loadInitial)

watch(serviceSearch, () => {
  clearTimeout(serviceSearchTimeout)
  serviceSearchTimeout = setTimeout(reloadServices, 300)
})

onBeforeUnmount(() => {
  clearTimeout(serviceSearchTimeout)
})
</script>
